import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function QuizNavigation({
  currentQuestion,
  totalQuestions,
  previousQuestion,
  nextQuestion,
  submitQuiz,
  hasSelectedAnswer,
}) {
  const lastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="sticky bottom-0 z-20 rounded-2xl border border-slate-700 bg-slate-900/90 p-4 backdrop-blur-xl">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Previous */}

        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition-all
            duration-200
            hover:border-violet-500
            hover:bg-slate-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {/* Center */}

        <div className="flex flex-col items-center">

          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Question
          </span>

          <div className="mt-1 flex items-center gap-2 text-xl font-bold">

            <span className="text-white">
              {currentQuestion + 1}
            </span>

            <span className="text-slate-500">/</span>

            <span className="text-violet-400">
              {totalQuestions}
            </span>

          </div>

        </div>

        {/* Next / Submit */}

        {lastQuestion ? (
          <button
            onClick={submitQuiz}
            disabled={!hasSelectedAnswer}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-emerald-500
              to-green-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-green-900/40
            "
          >
            <CheckCircle2 size={18} />
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={!hasSelectedAnswer}
            
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-violet-900/40
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:hover:translate-y-0
            "
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}

      </div>
    </div>
  );
}

export default QuizNavigation;