import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  ListChecks,
  Eye,
  RotateCcw,
  Award,
} from "lucide-react";

import {
  calculateAccuracy,
  getPerformanceBadge,
} from "./quizUtils";

function QuizResult({
  score,
  quiz,
  setReviewMode,
  resetQuiz,
}) {
  const accuracy = calculateAccuracy(score, quiz.length);
  const badge = getPerformanceBadge(accuracy);

  return (
<div className="mx-auto max-w-3xl space-y-4">
      {/* ==========================================
          HERO CARD
      ========================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#172033] shadow-xl">

        {/* Header */}

        <div className="border-b border-slate-700 bg-gradient-to-r from-violet-900/30 via-indigo-900/20 to-slate-900 px-6 py-5 text-center">

          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/20 shadow-lg shadow-violet-900/30">
            <Trophy className="h-7 w-7 text-yellow-400" />

          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Quiz Completed
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Here's a summary of your quiz performance.
          </p>

        </div>

        {/* ==========================================
            SCORE CIRCLE
        ========================================== */}

<div className="flex justify-center py-3">
          <div className="relative flex h-26 w-26 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_35px_rgba(124,58,237,0.35)]">

            <div className="absolute inset-1.5 rounded-full bg-[#172033]" />

            <div className="relative z-10 text-center">

              <p className="text-[9px] uppercase tracking-[0.25em] text-slate-400">
                Score
              </p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                {score}
              </h2>

              <p className="text-sm text-slate-300">
                / {quiz.length}
              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
            ACCURACY
        ========================================== */}

        <div className="mx-auto max-w-lg px-6">

          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">

            <span>Accuracy</span>

            <span>{accuracy}%</span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 transition-all duration-700"
              style={{
                width: `${accuracy}%`,
              }}
            />

          </div>

        </div>

        {/* ==========================================
            PERFORMANCE BADGE
        ========================================== */}

        <div className="px-6 pt-4 pb-5 text-center">

          <div
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${badge.gradient} px-4 py-1.5 shadow-lg`}
          >

            <Award size={18} />

            <span className="text-sm font-semibold text-white">
              {badge.title}
            </span>

          </div>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            {badge.description}
          </p>

        </div>

                {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="grid gap-2 p-2 grid-cols-2 lg:grid-cols-4">

          {/* Correct */}

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-2.5 transition-all duration-300 hover:border-green-500">
            <CheckCircle2 className="mb-3 h-6 w-6 text-green-400" />

            <p className="text-sm text-slate-400">
              Correct
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-400">
              {score}
            </h2>
          </div>

          {/* Wrong */}

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 transition-all duration-300 hover:border-red-500">
            <XCircle className="mb-3 h-6 w-6 text-red-400" />

            <p className="text-sm text-slate-400">
              Wrong
            </p>

            <h2 className="mt-2 text-xl font-bold text-red-400">
              {quiz.length - score}
            </h2>
          </div>

          {/* Total */}

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 transition-all duration-300 hover:border-violet-500">
            <ListChecks className="mb-3 h-6 w-6 text-violet-400" />

            <p className="text-sm text-slate-400">
              Total Questions
            </p>

            <h2 className="mt-2 text-3xl font-bold text-violet-400">
              {quiz.length}
            </h2>
          </div>

          {/* Accuracy */}

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 transition-all duration-300 hover:border-blue-500">
            <Target className="mb-3 h-6 w-6 text-blue-400" />

            <p className="text-sm text-slate-400">
              Accuracy
            </p>

            <h2 className="mt-2 text-2xl font-bold text-blue-400">
              {accuracy}%
            </h2>
          </div>

        </div>

      </div>

      {/* ==========================================
          PERFORMANCE SUMMARY
      ========================================== */}

      <div
        className={`rounded-3xl bg-gradient-to-r ${badge.gradient} p-4 text-center shadow-xl`}
      >
        <h2 className="text-xl font-bold text-white">
          {badge.title}
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90">
          {badge.description}
        </p>
      </div>

      {/* ==========================================
          ACTION BUTTONS
      ========================================== */}

      <div className="grid gap-2 md:grid-cols-2">

        <button
          onClick={() => setReviewMode(true)}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            py-3
            text-base
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-violet-900/40
          "
        >
          <Eye size={20} />

          Review Answers
        </button>

        <button
          onClick={resetQuiz}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            py-3.5
            text-base
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-slate-700
          "
        >
          <RotateCcw size={20} />

          Generate New Quiz
        </button>

      </div>

    </div>
  );
}

export default QuizResult;