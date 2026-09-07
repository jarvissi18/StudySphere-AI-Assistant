import { CheckCircle2 } from "lucide-react";

function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions = 0,
}) {
  // ============================================================
  // PROGRESS
  // Progress represents ANSWERED questions,
  // not the currently viewed question.
  // ============================================================

  const safeTotal = Math.max(totalQuestions || 0, 1);

  const progress = Math.round(
    (answeredQuestions / safeTotal) * 100
  );

  return (
    <div className="border-b border-white/[0.06] bg-slate-900/40 px-6 py-5 backdrop-blur-md">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          <div className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-violet-600/15
          ">
            <CheckCircle2 className="h-5 w-5 text-violet-400" />
          </div>

          <div>

            <h2 className="
              text-xl
              font-semibold
              text-white
            ">
              Question {currentQuestion + 1}
            </h2>

            <p className="
              text-sm
              text-slate-400
            ">
              {currentQuestion + 1} of {totalQuestions} Questions
            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="text-left md:text-right">

          <div className="
            text-xs
            uppercase
            tracking-[0.18em]
            text-slate-500
          ">
            Progress
          </div>

          <div className="
            mt-1
            text-2xl
            font-bold
            text-violet-400
          ">
            {progress}%
          </div>

        </div>

      </div>

      {/* ======================================================
          PROGRESS BAR
      ====================================================== */}

      <div className="mt-5">

        <div className="
          mb-2
          flex
          items-center
          justify-between
          text-xs
          text-slate-400
        ">

          <span>
            Quiz Progress
          </span>

          <span>
            {answeredQuestions} / {totalQuestions} Answered
          </span>

        </div>

        <div className="
          h-2
          overflow-hidden
          rounded-full
          bg-slate-800
        ">

          <div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-violet-600
              via-fuchsia-500
              to-indigo-500
              transition-all
              duration-500
              ease-out
            "
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