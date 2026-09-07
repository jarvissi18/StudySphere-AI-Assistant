# ============================================================
# StudySphere AI - Gemini AI Service
# Premium Text-Only Academic AI
# ============================================================

import json
import os
import re
import time

from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

import google.generativeai as genai
from google.api_core.exceptions import (
    ResourceExhausted,
    ServiceUnavailable,
)


# ============================================================
# ENVIRONMENT / MODEL
# ============================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in .env file."
    )


genai.configure(
    api_key=API_KEY
)


MODEL_NAME = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash",
)


model = genai.GenerativeModel(
    MODEL_NAME
)


# ============================================================
# RETRY CONFIGURATION
# ============================================================

try:
    MAX_RETRIES = max(
        0,
        int(
            os.getenv(
                "GEMINI_MAX_RETRIES",
                "2",
            )
        ),
    )
except (TypeError, ValueError):
    MAX_RETRIES = 2


try:
    RETRY_BASE_DELAY = max(
        0.5,
        float(
            os.getenv(
                "GEMINI_RETRY_DELAY",
                "1.5",
            )
        ),
    )
except (TypeError, ValueError):
    RETRY_BASE_DELAY = 1.5


# ============================================================
# STARTUP LOG
# ============================================================

print("=" * 64)
print("StudySphere Gemini Service")
print(f"Model: {MODEL_NAME}")
print("Mode: Premium Academic AI")
print("Streaming: ENABLED")
print("Grounding: RAG ONLY")
print("Output: TEXT ONLY")
print("Diagrams: DISABLED")
print("=" * 64)


# ============================================================
# COMMON TEXT HELPERS
# ============================================================

def clean_text(
    text: Any,
) -> str:
    """
    Normalize Gemini-generated text while preserving Markdown.
    """

    if text is None:
        return ""

    text = str(text)

    text = text.replace(
        "\r\n",
        "\n",
    ).replace(
        "\r",
        "\n",
    )

    text = re.sub(
        r"[ \t]+\n",
        "\n",
        text,
    )

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text,
    )

    return text.strip()


def clean_json(
    text: str,
) -> str:
    """
    Remove accidental Markdown code fences around JSON.
    """

    if not text:
        return ""

    text = str(text).strip()

    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    return text.strip()


def validate_context(
    context: str,
) -> bool:
    """
    Check whether usable RAG context exists.
    """

    if context is None:
        return False

    return bool(
        str(context).strip()
    )


def get_response_text(
    response: Any,
) -> str:
    """
    Safely extract text from a Gemini response.
    """

    try:
        text = getattr(
            response,
            "text",
            "",
        )
    except Exception:
        text = ""

    return clean_text(
        text
    )


# ============================================================
# ERROR / RETRY HELPERS
# ============================================================

def _is_retryable_exception(
    exc: Exception,
) -> bool:
    """
    Identify transient Gemini API failures.
    """

    if isinstance(
        exc,
        (
            ResourceExhausted,
            ServiceUnavailable,
        ),
    ):
        return True

    message = str(
        exc
    ).lower()

    retry_markers = (
        "429",
        "resource_exhausted",
        "rate limit",
        "temporarily unavailable",
        "503",
        "service unavailable",
    )

    return any(
        marker in message
        for marker in retry_markers
    )


def _friendly_generation_error(
    prefix: str,
    exc: Exception,
) -> str:
    """
    Convert technical Gemini errors into user-friendly messages.
    """

    message = str(
        exc
    ).lower()

    if (
        isinstance(
            exc,
            ResourceExhausted,
        )
        or "429" in message
        or "resource_exhausted" in message
        or "rate limit" in message
    ):
        return (
            f"{prefix} is temporarily unavailable because "
            "the Gemini API rate limit or quota was reached. "
            "Please try again shortly."
        )

    if (
        isinstance(
            exc,
            ServiceUnavailable,
        )
        or "503" in message
        or "service unavailable" in message
    ):
        return (
            f"{prefix} is temporarily unavailable. "
            "Please try again in a moment."
        )

    return (
        f"{prefix} could not be generated right now. "
        "Please try again."
    )


# ============================================================
# CENTRALIZED GEMINI GENERATION
# ============================================================

def generate_content(
    prompt: Any,
    stream: bool = False,
    generation_config: Optional[
        Dict[str, Any]
    ] = None,
):
    """
    Centralized Gemini API call.

    All StudySphere AI features use this function so that:
    - retry handling stays consistent;
    - model configuration stays centralized;
    - Chat, Summary, Notes, Quiz and Flashcards behave consistently.
    """

    kwargs: Dict[str, Any] = {
        "stream": stream,
    }

    if generation_config:
        kwargs[
            "generation_config"
        ] = generation_config

    last_error: Optional[
        Exception
    ] = None

    for attempt in range(
        MAX_RETRIES + 1
    ):
        try:

            return model.generate_content(
                prompt,
                **kwargs,
            )

        except Exception as exc:

            last_error = exc

            if not _is_retryable_exception(
                exc
            ):
                raise

            if attempt >= MAX_RETRIES:
                raise

            delay = (
                RETRY_BASE_DELAY
                * (
                    2 ** attempt
                )
            )

            print(
                "[GEMINI RETRY] "
                f"attempt={attempt + 1}/"
                f"{MAX_RETRIES} "
                f"delay={delay:.1f}s "
                f"reason={type(exc).__name__}"
            )

            time.sleep(
                delay
            )

    if last_error:
        raise last_error

    raise RuntimeError(
        "Gemini request failed unexpectedly."
    )


# ============================================================
# GENERATION CONFIGURATION
# ============================================================

def _generation_config(
    temperature: float = 0.22,
    max_output_tokens: int = 8192,
) -> Dict[str, Any]:
    """
    Conservative generation configuration for academic content.

    Lower temperature prioritizes:
    - source fidelity
    - consistency
    - factual discipline
    - predictable formatting
    """

    return {
        "temperature": temperature,
        "top_p": 0.90,
        "max_output_tokens": max_output_tokens,
    }


# ============================================================
# SHARED SOURCE-GROUNDING RULES
# ============================================================

SOURCE_GROUNDING_RULES = """
SOURCE-GROUNDING RULES

The retrieved study material is the ONLY knowledge source.

You MUST:
- use only information supported by the retrieved material;
- preserve the terminology used in the study material;
- combine relevant information from multiple retrieved passages
  when appropriate;
- reorganize information to make it clearer;
- explain supported concepts in student-friendly language.

You MUST NOT:
- use outside knowledge;
- invent facts;
- invent definitions;
- invent examples;
- invent applications;
- invent advantages or disadvantages;
- invent formulas;
- invent classifications;
- invent steps;
- assume missing information;
- silently fill gaps using general knowledge;
- contradict the uploaded material.

IMPORTANT:

The exact wording of the user's question does NOT need to appear
in the retrieved material.

Search conceptually within the supplied material.

For example, if the user asks:

"Explain supervised learning."

and the retrieved material contains a section discussing:
- supervised learning;
- labeled training data;
- classification;
- regression;

then use that relevant material even if the exact question sentence
does not appear.

Only say that information is unavailable when the supplied material
genuinely does not contain enough information to answer the question.
"""


# ============================================================
# PREMIUM CHAT PROMPT
# ============================================================

def build_answer_prompt(
    question: str,
    context: str,
) -> str:
    """
    Build a professional university-level RAG answer prompt.
    """

    return f"""
You are StudySphere AI — a professional university study assistant.

Your job is to answer the user's question using the retrieved
content from their uploaded study material.

{SOURCE_GROUNDING_RULES}

============================================================
ANSWER OBJECTIVE
============================================================

Give the student the most useful answer that can be supported by
the retrieved study material.

The answer should feel like it was written by an excellent
university professor.

Prioritize:

- correctness
- clarity
- relevance
- logical organization
- academic usefulness
- easy revision
- appropriate depth

Do not make an answer artificially long.

Do not make a broad academic question artificially short.

============================================================
WHEN INFORMATION IS NOT AVAILABLE
============================================================

If the retrieved study material genuinely does not contain enough
information to answer the question, respond with:

> **Not found in the uploaded material**

Then provide ONE short sentence explaining that the retrieved
material does not contain enough information about the requested
topic.

Do not invent an answer.

Do not use general knowledge to complete the answer.

============================================================
QUESTION TYPE → RESPONSE STRUCTURE
============================================================

If the user asks "What is..." or "Define...":

# Topic

Give the definition supported by the material.

Then provide a short explanation if supported.

------------------------------------------------------------

If the user asks "Explain...":

# Topic

## Explanation

Explain the concept clearly.

Use additional sections only when supported.

------------------------------------------------------------

If the user asks "Describe...":

# Topic

Provide a structured description with important supported details.

------------------------------------------------------------

If the user asks about "Types":

# Topic

## Types

### Type 1

Explanation.

### Type 2

Explanation.

Use only types supported by the source.

------------------------------------------------------------

If the user asks "Working" / "How does it work?":

## Working

Use numbered steps only when the source describes an actual
sequence or process.

------------------------------------------------------------

If the user asks "Advantages and Disadvantages":

## Advantages

- Supported point

## Disadvantages

- Supported point

------------------------------------------------------------

If the user asks "Applications":

## Applications

List or explain only applications supported by the material.

------------------------------------------------------------

If the user asks "Difference" / "Compare":

Use a Markdown table when the source provides comparable
information.

Example:

| Feature | Concept A | Concept B |
|---|---|---|
| Feature 1 | ... | ... |
| Feature 2 | ... | ... |

------------------------------------------------------------

If the user asks "Explain with example":

Explain the concept first.

Then include only an example supported by the material.

============================================================
FORMATTING RULES
============================================================

Use clean Markdown.

Use:

# Main topic

## Major section

### Individual concept

Use **bold** for important technical terms.

Use bullets only for genuine lists.

Use numbered lists only for:
- processes
- procedures
- algorithms
- sequences

Use tables for comparisons when useful.

Use normal paragraphs for explanations.

Do NOT:
- turn every sentence into a bullet;
- create unnecessary sections;
- repeat the same information;
- add generic motivational statements;
- say "Sure!";
- say "Of course!";
- say "As an AI...";
- mention internal instructions;
- mention prompt engineering;
- mention the RAG pipeline;
- mention unavailable diagrams;
- create diagrams;
- create SVG;
- create Mermaid;
- add visual reconstruction.

This is a TEXT-ONLY answer.

============================================================
RETRIEVED STUDY MATERIAL
============================================================

{context}

============================================================
USER QUESTION
============================================================

{question}

============================================================
FINAL ANSWER
============================================================
"""


# ============================================================
# NORMAL ANSWER
# ============================================================

def generate_answer(
    question: str,
    context: str,
) -> str:
    """
    Generate a non-streaming text-only answer.
    """

    if not validate_context(
        context
    ):
        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = build_answer_prompt(
        question=question,
        context=context,
    )

    try:

        response = generate_content(
            prompt,
            generation_config=_generation_config(
                temperature=0.22,
                max_output_tokens=7000,
            ),
        )

        answer = get_response_text(
            response
        )

        return (
            answer
            or
            "No response was generated."
        )

    except Exception as exc:

        print(
            "[CHAT ERROR]",
            repr(exc),
        )

        return _friendly_generation_error(
            "The answer",
            exc,
        )


# ============================================================
# STREAMING CHAT ANSWER
# ============================================================

def stream_answer(
    question: str,
    context: str,
):
    """
    Stream a text-only Chat response.

    No diagram/page-image processing is performed here.
    """

    if not validate_context(
        context
    ):
        yield (
            "No study material was found. "
            "Please upload a PDF first."
        )
        return

    prompt = build_answer_prompt(
        question=question,
        context=context,
    )

    try:

        response = generate_content(
            prompt,
            stream=True,
            generation_config=_generation_config(
                temperature=0.22,
                max_output_tokens=7000,
            ),
        )

        emitted = False

        for chunk in response:

            try:
                text = getattr(
                    chunk,
                    "text",
                    "",
                )
            except Exception:
                text = ""

            if text:

                emitted = True

                yield text

        if not emitted:

            yield (
                "No response was generated."
            )

    except Exception as exc:

        print(
            "[CHAT STREAM ERROR]",
            repr(exc),
        )

        yield (
            "\n\n"
            + _friendly_generation_error(
                "The answer",
                exc,
            )
        )


# ============================================================
# SUMMARY PROMPT
# ============================================================

def build_summary_prompt(
    context: str,
) -> str:
    """
    Build a professional academic summary prompt.
    """

    return f"""
You are StudySphere AI's professional academic summarization engine.

Create a high-quality university revision summary using ONLY the
retrieved study material.

{SOURCE_GROUNDING_RULES}

============================================================
SUMMARY OBJECTIVE
============================================================

The summary should help a university student:

- understand the topic;
- revise quickly;
- remember important concepts;
- prepare for examinations;
- identify important terminology;
- understand relationships between concepts.

Do not mechanically shorten every paragraph.

Instead, identify the important academic information and organize it
into a useful revision document.

============================================================
SUMMARY STRUCTURE
============================================================

Use this structure FLEXIBLY.

Only include sections supported by the material.

# Topic Title

## Overview

Give a concise but meaningful overview.

## Key Takeaways

Include the most important supported points.

## Core Concepts

Use ### subheadings for important individual concepts.

Explain each concept using short paragraphs.

## Important Definitions

Use ### subheadings for important terms.

## Types / Classification

Include only when supported.

## Working / Process

Use numbered steps only when an actual process is described.

## Characteristics

Include only when supported.

## Advantages

Include only when supported.

## Disadvantages

Include only when supported.

## Applications

Include only when supported.

## Examples

Include only source-supported examples.

## Comparison

Use a Markdown table when a comparison is supported.

## Exam Focus

Extract important:
- terminology
- distinctions
- steps
- characteristics
- facts
- concepts

that are useful for examination preparation.

## Quick Revision

Finish with a concise revision section containing the most
important source-supported ideas.

Do NOT create empty sections.

Do NOT repeat the same information in multiple sections.

============================================================
STYLE
============================================================

The summary should be:

- professional
- concise
- academically useful
- easy to scan
- logically organized

Use paragraphs for explanations.

Use bullets only for genuine lists.

Use numbered lists only for actual processes.

Use tables for meaningful comparisons.

Use **bold** selectively.

Do not create diagrams.

Do not create SVG.

Do not create Mermaid.

Do not create visual elements.

This is a TEXT-ONLY summary.

============================================================
STUDY MATERIAL
============================================================

{context}

============================================================
FINAL OUTPUT
============================================================

Return ONLY clean Markdown.
"""


# ============================================================
# GENERATE SUMMARY
# ============================================================

def generate_summary_from_context(
    context: str,
) -> str:
    """
    Generate a professional text-only summary.
    """

    if not validate_context(
        context
    ):
        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = build_summary_prompt(
        context
    )

    try:

        response = generate_content(
            prompt,
            generation_config=_generation_config(
                temperature=0.18,
                max_output_tokens=9000,
            ),
        )

        summary = get_response_text(
            response
        )

        return (
            summary
            or
            "Summary could not be generated."
        )

    except Exception as exc:

        print(
            "[SUMMARY ERROR]",
            repr(exc),
        )

        return _friendly_generation_error(
            "The summary",
            exc,
        )


# ============================================================
# NOTES PROMPT
# ============================================================

def build_notes_prompt(
    context: str,
) -> str:
    """
    Build a professional university study-notes prompt.
    """

    return f"""
You are StudySphere AI's professional university note-generation
engine.

Create polished, detailed and revision-friendly study notes using
ONLY the retrieved study material.

{SOURCE_GROUNDING_RULES}

============================================================
NOTE OBJECTIVE
============================================================

These notes should feel like professionally prepared university
study material.

They should help the student:

- understand concepts;
- revise efficiently;
- prepare for examinations;
- remember definitions;
- understand processes;
- compare related concepts;
- identify important technical terminology.

============================================================
CONTENT FORMAT
============================================================

Do NOT convert everything into bullets.

Use the information type to determine the format.

------------------------------------------------------------
NORMAL EXPLANATIONS
------------------------------------------------------------

Use short paragraphs.

------------------------------------------------------------
DEFINITIONS
------------------------------------------------------------

Use:

## Definitions

### Term

Definition.

Do not create a bullet list of definitions.

------------------------------------------------------------
IMPORTANT CONCEPTS
------------------------------------------------------------

Use:

## Important Concepts

### Concept

Explain the concept clearly in one or more paragraphs.

------------------------------------------------------------
KEY TAKEAWAYS
------------------------------------------------------------

Use a small bullet list for genuinely important points.

------------------------------------------------------------
CHARACTERISTICS / FEATURES
------------------------------------------------------------

Use bullets when there are multiple distinct characteristics.

------------------------------------------------------------
TYPES / CLASSIFICATION
------------------------------------------------------------

Use ### subheadings for individual types.

Explain each type clearly.

------------------------------------------------------------
WORKING / PROCESS
------------------------------------------------------------

Use numbered steps only when the material describes an actual
sequence, algorithm, procedure or process.

------------------------------------------------------------
ADVANTAGES
------------------------------------------------------------

Use bullets when multiple advantages are explicitly supported.

------------------------------------------------------------
DISADVANTAGES
------------------------------------------------------------

Use bullets when multiple disadvantages are explicitly supported.

------------------------------------------------------------
APPLICATIONS
------------------------------------------------------------

Include only supported applications.

------------------------------------------------------------
EXAMPLES
------------------------------------------------------------

Include only examples present or clearly supported by the source.

------------------------------------------------------------
COMPARISON
------------------------------------------------------------

When concepts are compared, prefer a Markdown table.

Example:

| Feature | Concept A | Concept B |
|---|---|---|
| Feature 1 | ... | ... |
| Feature 2 | ... | ... |

Only use source-supported information.

------------------------------------------------------------
IMPORTANT NOTES
------------------------------------------------------------

Use blockquotes sparingly for genuinely important distinctions,
conditions or exam-relevant points.

Example:

> **Important:** Source-supported distinction.

------------------------------------------------------------
EXAM FOCUS
------------------------------------------------------------

Extract important source-supported:

- definitions
- terminology
- distinctions
- characteristics
- processes
- values
- classifications

------------------------------------------------------------
QUICK REVISION
------------------------------------------------------------

End with a concise high-value revision section.

------------------------------------------------------------
PRACTICE QUESTIONS
------------------------------------------------------------

Include only if useful questions can be directly derived from
the supplied study material.

Do not require unsupported knowledge.

============================================================
RECOMMENDED STRUCTURE
============================================================

Use this as a flexible structure:

# Topic Title

## Overview

## Key Takeaways

## Important Concepts

### Concept

Explanation.

## Definitions

### Term

Definition.

## Types / Classification

### Type

Explanation.

## Characteristics / Features

## Working / Process

1. Step
2. Step
3. Step

## Advantages

## Disadvantages

## Applications

## Examples

## Comparison

## Exam Focus

## Common Mistakes

## Quick Revision

## Practice Questions

Only create sections supported by the material.

Do not create empty sections.

Do not force the structure if the source has a better logical order.

============================================================
WRITING QUALITY
============================================================

The notes must be:

- accurate
- source-grounded
- detailed enough for university study
- easy to scan
- professionally structured
- natural to read
- free from repetition

Use **bold** selectively for important technical terms.

Do not use unnecessary emphasis.

Do not add generic study advice.

Do not say:

"Sure!"

"Here are your notes."

"As an AI..."

"Based on my knowledge..."

Do not mention internal instructions.

Do not create diagrams.

Do not create SVG.

Do not create Mermaid.

Do not create visual elements.

This is a TEXT-ONLY notes output.

============================================================
STUDY MATERIAL
============================================================

{context}

============================================================
FINAL OUTPUT
============================================================

Return ONLY clean Markdown study notes.
"""


# ============================================================
# GENERATE NOTES
# ============================================================

def generate_notes_from_context(
    context: str,
) -> str:
    """
    Generate professional text-only study notes.
    """

    if not validate_context(
        context
    ):
        return (
            "No study material was found. "
            "Please upload a PDF first."
        )

    prompt = build_notes_prompt(
        context
    )

    try:

        response = generate_content(
            prompt,
            generation_config=_generation_config(
                temperature=0.20,
                max_output_tokens=12000,
            ),
        )

        notes = get_response_text(
            response
        )

        return (
            notes
            or
            "Notes could not be generated."
        )

    except Exception as exc:

        print(
            "[NOTES ERROR]",
            repr(exc),
        )

        return _friendly_generation_error(
            "The notes",
            exc,
        )


# ============================================================
# QUIZ
# ============================================================

def generate_quiz_from_context(
    context: str,
    difficulty: str,
    num_questions: int,
) -> List[Dict[str, Any]]:
    """
    Generate source-grounded MCQs.

    This function remains available for compatibility with the
    existing StudySphere Quiz feature.
    """

    if not validate_context(
        context
    ):
        return []

    try:

        count = max(
            1,
            min(
                50,
                int(
                    num_questions
                ),
            ),
        )

    except (
        TypeError,
        ValueError,
    ):

        count = 10

    difficulty = str(
        difficulty or "medium"
    ).strip().lower()

    allowed_difficulties = {
        "easy",
        "medium",
        "hard",
    }

    if difficulty not in allowed_difficulties:
        difficulty = "medium"

    prompt = f"""
You are StudySphere AI, an expert university professor and
assessment designer.

Generate EXACTLY {count} high-quality multiple-choice questions
using ONLY the supplied study material.

Difficulty:
{difficulty}

============================================================
SOURCE RULES
============================================================

1. Use only the supplied study material.
2. Never use outside knowledge.
3. Never invent facts.
4. Never ask something that cannot be answered from the source.
5. Every question must have exactly four options.
6. Every option must be distinct.
7. Exactly one option must be correct.
8. Randomize the correct option position.
9. Give a concise source-supported explanation.
10. Avoid duplicate questions.
11. Prefer conceptual understanding over simple word matching.
12. Return ONLY valid JSON.

============================================================
QUALITY
============================================================

Questions should test useful university-level understanding.

Prefer:
- definitions
- concept understanding
- distinctions
- characteristics
- working/process
- supported applications
- relationships between concepts

Avoid:
- trick questions
- ambiguous questions
- unsupported facts
- questions based only on tiny wording details

============================================================
OUTPUT FORMAT
============================================================

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

============================================================
STUDY MATERIAL
============================================================

{context}
"""

    try:

        response = generate_content(
            prompt,
            generation_config={
                "temperature": 0.30,
                "top_p": 0.90,
                "max_output_tokens": 10000,
                "response_mime_type": "application/json",
            },
        )

        text = clean_json(
            get_response_text(
                response
            )
        )

        if not text:
            return []

        quiz = json.loads(
            text
        )

        if not isinstance(
            quiz,
            list,
        ):
            return []

        cleaned_quiz = []

        for item in quiz:

            if not isinstance(
                item,
                dict,
            ):
                continue

            question = str(
                item.get(
                    "question",
                    "",
                )
            ).strip()

            raw_options = item.get(
                "options",
                [],
            )

            answer = str(
                item.get(
                    "answer",
                    "",
                )
            ).strip()

            explanation = str(
                item.get(
                    "explanation",
                    "",
                )
            ).strip()

            if not isinstance(
                raw_options,
                list,
            ):
                continue

            options = [
                str(option).strip()
                for option in raw_options
                if str(option).strip()
            ]

            if len(options) != 4:
                continue

            if len(set(options)) != 4:
                continue

            if not question:
                continue

            if answer not in options:
                continue

            cleaned_quiz.append(
                {
                    "question": question,
                    "options": options,
                    "answer": answer,
                    "explanation": explanation,
                    "difficulty": difficulty,
                }
            )

        return cleaned_quiz[
            :count
        ]

    except json.JSONDecodeError:

        print(
            "[QUIZ] Invalid JSON received."
        )

        return []

    except Exception as exc:

        print(
            "[QUIZ ERROR]",
            repr(exc),
        )

        return []


# ============================================================
# FLASHCARDS
# ============================================================

def generate_flashcards_from_context(
    context: str,
) -> List[Dict[str, str]]:
    """
    Generate source-grounded study flashcards.
    """

    if not validate_context(
        context
    ):
        return []

    prompt = f"""
You are StudySphere AI, a professional university study assistant.

Create useful study flashcards using ONLY the supplied study material.

============================================================
SOURCE RULES
============================================================

1. Never use outside knowledge.
2. Use only information directly supported by the study material.
3. Generate 15-25 cards when enough material exists.
4. If the material is small, generate fewer high-quality cards.
5. Each card must contain a question and answer.
6. Answers should be concise but complete.
7. Focus on:
   - definitions
   - concepts
   - distinctions
   - characteristics
   - processes
   - important supported facts
8. Avoid duplicates.
9. Do not create unsupported questions.
10. Return ONLY valid JSON.

============================================================
QUALITY
============================================================

Questions should be useful for university revision.

Avoid questions that are:
- repetitive;
- trivial;
- ambiguous;
- unsupported by the source.

============================================================
OUTPUT FORMAT
============================================================

[
  {{
    "question": "Question",
    "answer": "Answer"
  }}
]

============================================================
STUDY MATERIAL
============================================================

{context}
"""

    try:

        response = generate_content(
            prompt,
            generation_config={
                "temperature": 0.25,
                "top_p": 0.90,
                "max_output_tokens": 7000,
                "response_mime_type": "application/json",
            },
        )

        text = clean_json(
            get_response_text(
                response
            )
        )

        if not text:
            return []

        cards = json.loads(
            text
        )

        if not isinstance(
            cards,
            list,
        ):
            return []

        cleaned_cards = []

        for card in cards:

            if not isinstance(
                card,
                dict,
            ):
                continue

            question = str(
                card.get(
                    "question",
                    "",
                )
            ).strip()

            answer = str(
                card.get(
                    "answer",
                    "",
                )
            ).strip()

            if not question or not answer:
                continue

            cleaned_cards.append(
                {
                    "question": question,
                    "answer": answer,
                }
            )

        return cleaned_cards[
            :25
        ]

    except json.JSONDecodeError:

        print(
            "[FLASHCARD] Invalid JSON received."
        )

        return []

    except Exception as exc:

        print(
            "[FLASHCARD ERROR]",
            repr(exc),
        )

        return []


# ============================================================
# SERVICE INFORMATION
# ============================================================

def get_gemini_service_info() -> Dict[str, Any]:
    """
    Return non-sensitive Gemini service configuration.
    """

    return {
        "model": MODEL_NAME,
        "streaming": True,
        "grounding": "RAG_ONLY",
        "output_mode": "TEXT_ONLY",
        "diagrams": False,
        "max_retries": MAX_RETRIES,
    }


# ============================================================
# MODULE READY
# ============================================================

print(
    "[StudySphere Gemini] Text-only AI service ready."
)