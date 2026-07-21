import { CheckCircle2 } from "lucide-react";

function QuizProgress({
  currentQuestion,
  totalQuestions,
}) {
  const progress = Math.round(
    ((currentQuestion + 1) / totalQuestions) * 100
  );

  return (
    <div className="border-b border-slate-700 bg-slate-900/50 px-6 py-4 backdrop-blur-md">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Left */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/15">

            <CheckCircle2 className="h-5 w-5 text-violet-400" />

          </div>

          <div>

            <h2 className="text-xl font-semibold text-white">
              Question {currentQuestion + 1}
            </h2>

            <p className="text-sm text-slate-400">
              {currentQuestion + 1} of {totalQuestions} Questions
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="text-left md:text-right">

          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Progress
          </div>

          <div className="mt-1 text-2xl font-bold text-violet-400">
            {progress}%
          </div>

        </div>

      </div>

      {/* Progress Bar */}

      <div className="mt-4">

        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">

          <span>Quiz Progress</span>

          <span>{progress}% Complete</span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default QuizProgress;