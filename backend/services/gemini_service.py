import os
import json
import re

from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

# ==========================================================
# Load Environment Variables
# ==========================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file.")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# ==========================================================
# Clean JSON Response
# ==========================================================

def clean_json(text: str) -> str:
    """
    Removes markdown code blocks from Gemini response.
    """

    text = text.strip()

    text = re.sub(r"^```json", "", text)
    text = re.sub(r"^```", "", text)
    text = re.sub(r"```$", "", text)

    return text.strip()


# ==========================================================
# Common Context Validation
# ==========================================================

def validate_context(context: str) -> bool:
    """
    Returns True if usable study material exists.
    """

    if context is None:
        return False

    if not context.strip():
        return False

    return True


# ==========================================================
# Generate AI Answer
# ==========================================================

def generate_answer(question: str, context: str) -> str:
    """
    Generates answer using uploaded PDF context.
    """

    if not validate_context(context):

        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = f"""
You are StudySphere AI.

You are an intelligent AI Study Assistant.

Your job is to answer ONLY using the provided study material.

Strict Rules:

1. Never use outside knowledge.

2. Never guess.

3. If the answer is missing from the study material, reply exactly:

I couldn't find the answer in the uploaded documents.

4. Keep the answer easy to understand.

5. Use headings whenever appropriate.

6. Use bullet points whenever appropriate.

7. If steps exist,
show them as numbered lists.

8. Do not mention AI limitations.

--------------------------------------------------

Study Material

{context}

--------------------------------------------------

Question

{question}
"""

    try:

        response = model.generate_content(prompt)

        if hasattr(response, "text"):

            answer = response.text.strip()

            if answer == "":
                return "No response generated."

            return answer

        return "No response generated."

    except ResourceExhausted:

        return (
            "Gemini API quota exceeded. "
            "Please try again later."
        )

    except Exception as e:

        print("Gemini Error:", e)

        return (
            "Something went wrong while generating the answer."
        )
        
        # ==========================================================
# Generate Quiz
# ==========================================================

def generate_quiz_from_context(
    context: str,
    difficulty: str,
    num_questions: int,
):
    """
    Generates MCQ quiz from uploaded study material.
    """

    if not validate_context(context):
        return []

    prompt = f"""
You are StudySphere AI.

You are an expert university professor.

Your task is to generate EXACTLY {num_questions} high-quality
multiple-choice questions.

Difficulty Level:
{difficulty}

Strict Rules:

1. Use ONLY the provided study material.

2. Never use outside knowledge.

3. Never invent information.

4. Every question must have EXACTLY four options.

5. Only ONE option must be correct.

6. Randomize the correct option position.

7. Include a short explanation.

8. Questions should test understanding,
not simple memorization whenever possible.

9. Avoid duplicate questions.

10. Return ONLY valid JSON.

Required JSON Format:

[
    {{
        "question": "Question",

        "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],

        "answer": "Correct Option",

        "explanation": "Why this answer is correct.",

        "difficulty": "{difficulty}"
    }}
]

--------------------------------------------------

Study Material

{context}
"""

    try:

        response = model.generate_content(prompt)

        if not hasattr(response, "text"):
            return []

        text = clean_json(response.text)

        quiz = json.loads(text)

        if not isinstance(quiz, list):
            return []

        cleaned_quiz = []

        for item in quiz:

            if not isinstance(item, dict):
                continue

            question = item.get("question", "").strip()

            options = item.get("options", [])

            answer = item.get("answer", "").strip()

            explanation = item.get(
                "explanation",
                ""
            ).strip()

            if (
                question
                and isinstance(options, list)
                and len(options) == 4
                and answer in options
            ):

                cleaned_quiz.append({
                    "question": question,
                    "options": options,
                    "answer": answer,
                    "explanation": explanation,
                    "difficulty": difficulty
                })

        return cleaned_quiz

    except ResourceExhausted:

        print("Gemini quota exceeded.")

        return []

    except json.JSONDecodeError:

        print("Invalid JSON received from Gemini.")

        return []

    except Exception as e:

        print("Quiz Generation Error:", e)

        return []
    
    # ==========================================================
# Generate Summary
# ==========================================================

def generate_summary_from_context(context: str) -> str:
    """
    Generates a structured study summary from uploaded PDFs.
    """

    if not validate_context(context):

        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = f"""
You are StudySphere AI, an expert academic assistant.

Your task is to generate a premium-quality study summary using ONLY the provided study material.

STRICT RULES:

1. Use ONLY the uploaded study material.
2. Never use outside knowledge.
3. Never hallucinate information.
4. Return the output in clean Markdown.
5. Use proper headings (#, ##, ###).
6. Keep explanations concise and easy to understand.
7. Highlight important keywords using **bold**.
8. Use bullet points wherever appropriate.
9. If a section cannot be generated from the uploaded material, simply skip it.

Generate the summary in the following structure:

# Topic Title

## Overview
A short introduction (3–6 lines).

## Key Takeaways
- 5–10 important points

## Important Concepts
Explain the major concepts clearly.

## Definitions
- **Term** — Definition

## Advantages
- Point 1
- Point 2

## Disadvantages
- Point 1
- Point 2

## Applications
Explain real-world uses mentioned in the document.

## Examples
Include examples only if present in the uploaded material.

## Interview Questions
Generate 5 interview questions based ONLY on the uploaded material.

## Common Mistakes
Mention common misconceptions or mistakes if discussed in the document.

## Quick Revision
Create a concise revision sheet using bullet points.

## Practice Questions
Generate 5 short practice questions using ONLY the uploaded material.

Study Material:

{context}
"""
    try:

        response = model.generate_content(prompt)

        if hasattr(response, "text"):

            summary = response.text.strip()

            if summary == "":
                return "Summary could not be generated."

            return summary

        return "Summary could not be generated."

    except ResourceExhausted:

        return (
            "Gemini API quota exceeded. "
            "Please try again later."
        )

    except Exception as e:

        print("Summary Generation Error:", e)

        return (
            "Something went wrong while generating the summary."
        )
        
def generate_notes_from_context(context: str) -> str:
    """
    Generates structured study notes from uploaded PDFs.
    """

    if not validate_context(context):
        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = f"""
You are StudySphere AI.

Create structured study notes using ONLY the provided study material.

Rules:

1. Never use outside knowledge.
2. Use Markdown.
3. Create proper headings.
4. Use bullet points.
5. Explain concepts clearly.
6. Highlight important keywords using **bold**.
7. Include examples only if they exist in the study material.
8. End with a "Quick Revision" section.

Study Material:

{context}
"""

    try:

        response = model.generate_content(prompt)

        if hasattr(response, "text"):
            return response.text.strip()

        return "Notes could not be generated."

    except ResourceExhausted:
        return "Gemini API quota exceeded."

    except Exception as e:
        print("Notes Error:", e)
        return "Something went wrong while generating notes."
    
def generate_flashcards_from_context(context: str) -> list:
    """
    Generates flashcards from uploaded study material.
    Returns a list of question-answer pairs.
    """

    if not validate_context(context):
        return []

    prompt = f"""
You are StudySphere AI.

Create flashcards using ONLY the provided study material.

Rules:

1. Never use outside knowledge.
2. Generate 15-25 flashcards.
3. Each flashcard must contain:
   - question
   - answer
4. Keep answers concise (1-4 lines).
5. Return ONLY valid JSON.

Format:

[
  {{
    "question": "What is Machine Learning?",
    "answer": "Machine Learning is..."
  }},
  {{
    "question": "...",
    "answer": "..."
  }}
]

Study Material:

{context}
"""

    try:

        response = model.generate_content(prompt)

        import json

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        elif text.startswith("```"):
            text = text.replace("```", "").strip()

        return json.loads(text)

    except Exception as e:
        print("Flashcard Error:", e)
        return []