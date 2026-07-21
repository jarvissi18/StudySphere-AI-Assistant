import { useState } from "react";

import QuizSetup from "./QuizSetup";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import QuizReview from "./QuizReview";

import { generateQuiz } from "../../../services/api";

function QuizView() {
  // ==========================================
  // STATES
  // ==========================================

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState(10);

  const [loading, setLoading] = useState(false);

  const [quiz, setQuiz] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [reviewMode, setReviewMode] = useState(false);

  const [score, setScore] = useState(0);

  // ==========================================
  // GENERATE QUIZ
  // ==========================================

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);

      const response = await generateQuiz({
        topic,
        difficulty,
        questions,
      });

      if (response.success) {
        setQuiz(response.quiz);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setReviewMode(false);
        setScore(0);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT ANSWER
  // ==========================================

  const selectAnswer = (option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const submitQuiz = () => {
    let total = 0;

    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        total++;
      }
    });

    setScore(total);
    setQuizSubmitted(true);
  };

  // ==========================================
  // RESET
  // ==========================================

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex-1 overflow-y-auto bg-[#0B1120]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {quiz.length === 0 && (
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
        )}

        {quiz.length > 0 && !quizSubmitted && (
          <QuizQuestion
            quiz={quiz}
            currentQuestion={currentQuestion}
            selectedAnswers={selectedAnswers}
            selectAnswer={selectAnswer}
            previousQuestion={previousQuestion}
            nextQuestion={nextQuestion}
            submitQuiz={submitQuiz}
          />
        )}

        {quizSubmitted && !reviewMode && (
          <QuizResult
            score={score}
            quiz={quiz}
            setReviewMode={setReviewMode}
            resetQuiz={resetQuiz}
          />
        )}

        {reviewMode && (
          <QuizReview
            quiz={quiz}
            selectedAnswers={selectedAnswers}
            setReviewMode={setReviewMode}
            resetQuiz={resetQuiz}
          />
        )}
      </div>
    </div>
  );
}

export default QuizView;