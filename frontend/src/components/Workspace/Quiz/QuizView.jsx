import { useState } from "react";

import {
  Brain,
  Sparkles,
} from "lucide-react";

import QuizSetup from "./QuizSetup";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import QuizReview from "./QuizReview";

import { generateQuiz } from "../../../services/api";

function QuizView() {
  // ============================================================
  // SETUP STATE
  // ============================================================

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState(10);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // QUIZ STATE
  // ============================================================

  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [score, setScore] = useState(0);

  // ============================================================
  // GENERATE QUIZ
  // ============================================================

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);

      const response = await generateQuiz({
        topic,
        difficulty,
        questions,
      });

      if (response?.success) {
        setQuiz(response.quiz || []);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setReviewMode(false);
        setScore(0);
      } else {
        window.alert(
          "Unable to generate the quiz."
        );
      }
    } catch (error) {
      console.error(
        "Quiz generation error:",
        error
      );

      window.alert(
        "Failed to generate quiz."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SELECT ANSWER
  // ============================================================

  const selectAnswer = (option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((previous) => ({
      ...previous,
      [currentQuestion]: option,
    }));
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const nextQuestion = () => {
    if (
      currentQuestion <
      quiz.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  // ============================================================
  // PREVIOUS QUESTION
  // ============================================================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  // ============================================================
  // SUBMIT QUIZ
  // ============================================================

  const submitQuiz = () => {
    let total = 0;

    quiz.forEach((question, index) => {
      if (
        selectedAnswers[index] ===
        question.answer
      ) {
        total += 1;
      }
    });

    setScore(total);
    setQuizSubmitted(true);
  };

  // ============================================================
  // RESET QUIZ
  // ============================================================

  const resetQuiz = () => {
    setQuiz([]);
    setTopic("");
    setDifficulty("Medium");
    setQuestions(10);

    setCurrentQuestion(0);
    setSelectedAnswers({});

    setQuizSubmitted(false);
    setReviewMode(false);
    setScore(0);
  };

  // ============================================================
  // ACTIVE QUIZ
  // ============================================================

  if (
    quiz.length > 0 &&
    !quizSubmitted
  ) {
    return (
      <div className="
        h-full
        min-h-0
        overflow-y-auto
        bg-[#070d1a]
      ">
        <div className="
          mx-auto
          w-full
          max-w-[1180px]
          px-4
          py-5
          sm:px-6
          lg:px-8
        ">

          {/* QUIZ HEADER */}

          <div className="
            mb-4
            flex
            items-center
            justify-between
            gap-4
          ">

            <div className="
              flex
              min-w-0
              items-center
              gap-3
            ">

              <div className="
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-pink-500
                to-rose-600
                text-white
                shadow-[0_8px_24px_rgba(236,72,153,0.2)]
              ">
                <Brain size={18} />
              </div>

              <div className="min-w-0">

                <p className="
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-pink-400
                ">
                  AI Assessment
                </p>

                <h2 className="
                  mt-0.5
                  text-[14px]
                  font-semibold
                  text-white
                ">
                  Knowledge Check
                </h2>

              </div>

            </div>

            <div className="
              shrink-0
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              px-3
              py-2
              text-[8px]
              text-slate-400
            ">
              Question {currentQuestion + 1} /{" "}
              {quiz.length}
            </div>

          </div>

          {/* QUESTION */}

          <div className="
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#0b1426]
          ">
            <QuizQuestion
              quiz={quiz}
              currentQuestion={currentQuestion}
              selectedAnswers={selectedAnswers}
              selectAnswer={selectAnswer}
              previousQuestion={previousQuestion}
              nextQuestion={nextQuestion}
              submitQuiz={submitQuiz}
            />
          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ RESULT
  // ============================================================

  if (
    quizSubmitted &&
    !reviewMode
  ) {
    return (
      <div className="
        h-full
        min-h-0
        overflow-y-auto
        bg-[#070d1a]
      ">
        <div className="
          mx-auto
          w-full
          max-w-[1080px]
          px-4
          py-5
          sm:px-6
          lg:px-8
        ">

          <QuizResult
            score={score}
            quiz={quiz}
            setReviewMode={setReviewMode}
            resetQuiz={resetQuiz}
          />

        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ REVIEW
  // ============================================================

  if (reviewMode) {
    return (
      <div className="
        h-full
        min-h-0
        overflow-y-auto
        bg-[#070d1a]
      ">
        <div className="
          mx-auto
          w-full
          max-w-[1080px]
          px-4
          py-5
          sm:px-6
          lg:px-8
        ">

          <QuizReview
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            setReviewMode={setReviewMode}
            resetQuiz={resetQuiz}
          />

        </div>
      </div>
    );
  }

  // ============================================================
  // QUIZ SETUP
  // ============================================================

  return (
    <div className="
      h-full
      min-h-0
      overflow-y-auto
      bg-[#070d1a]
    ">
      <div className="
        mx-auto
        w-full
        max-w-[1280px]
        px-4
        py-5
        sm:px-6
        lg:px-8
      ">

        <QuizSetup
          topic={topic}
          setTopic={setTopic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          questions={questions}
          setQuestions={setQuestions}
          loading={loading}
          handleGenerateQuiz={handleGenerateQuiz}
        />

      </div>
    </div>
  );
}

export default QuizView;