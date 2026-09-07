import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  ListChecks,
  Eye,
  RotateCcw,
  Award,
  Sparkles,
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
  const accuracy = calculateAccuracy(
    score,
    quiz.length
  );

  const badge =
    getPerformanceBadge(accuracy);

  return (
    <div className="mx-auto max-w-[900px] space-y-4">

      {/* ======================================================
          HERO
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#11182d] via-[#0b1426] to-[#09101e] shadow-[0_20px_65px_rgba(0,0,0,0.22)]">

        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/[0.10] blur-[100px]" />

        <div className="relative px-6 py-7 text-center">

          <div className="relative mx-auto mb-4 h-16 w-16">

            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/15 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_12px_35px_rgba(124,58,237,0.25)]">

              <Trophy
                size={27}
                className="text-yellow-300"
              />

            </div>

          </div>

          <div className="flex items-center justify-center gap-2">

            <Sparkles
              size={12}
              className="text-violet-400"
            />

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
              AI Assessment Complete
            </span>

          </div>

          <h1 className="mt-2 text-[25px] font-bold tracking-[-0.03em] text-white">
            Quiz completed
          </h1>

          <p className="mt-1.5 text-[10px] text-slate-600">
            Here's a summary of your performance.
          </p>

          {/* Score */}

          <div className="mt-6 flex justify-center">

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 shadow-[0_0_45px_rgba(124,58,237,0.22)]">

              <div className="absolute inset-[6px] rounded-full bg-[#0c1426]" />

              <div className="relative z-10 text-center">

                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                  Score
                </p>

                <p className="mt-1 text-4xl font-bold text-white">
                  {score}
                </p>

                <p className="text-[11px] text-slate-500">
                  / {quiz.length}
                </p>

              </div>

            </div>

          </div>

          {/* Accuracy */}

          <div className="mx-auto mt-5 max-w-md">

            <div className="mb-2 flex items-center justify-between">

              <span className="text-[9px] text-slate-600">
                Accuracy
              </span>

              <span className="text-[10px] font-semibold text-white">
                {accuracy}%
              </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-700"
                style={{
                  width: `${accuracy}%`,
                }}
              />

            </div>

          </div>

          {/* Badge */}

          <div className="mt-5">

            <div
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${badge.gradient} px-3.5 py-1.5 shadow-lg`}
            >

              <Award size={14} />

              <span className="text-[10px] font-semibold text-white">
                {badge.title}
              </span>

            </div>

            <p className="mx-auto mt-2 max-w-lg text-[10px] leading-5 text-slate-500">
              {badge.description}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">

        <StatCard
          icon={<CheckCircle2 size={15} />}
          title="Correct"
          value={score}
          color="emerald"
        />

        <StatCard
          icon={<XCircle size={15} />}
          title="Wrong"
          value={quiz.length - score}
          color="rose"
        />

        <StatCard
          icon={<ListChecks size={15} />}
          title="Questions"
          value={quiz.length}
          color="violet"
        />

        <StatCard
          icon={<Target size={15} />}
          title="Accuracy"
          value={`${accuracy}%`}
          color="blue"
        />

      </div>

      {/* ======================================================
          PERFORMANCE
      ====================================================== */}

      <div
        className={`rounded-2xl bg-gradient-to-r ${badge.gradient} p-[1px]`}
      >

        <div className="rounded-2xl bg-[#0b1426]/95 px-5 py-4">

          <div className="flex items-start gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
              <Award size={15} />
            </div>

            <div>

              <p className="text-[10px] font-semibold text-white">
                {badge.title}
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-500">
                {badge.description}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="grid gap-2.5 sm:grid-cols-2">

        <button
          type="button"
          onClick={() =>
            setReviewMode(true)
          }
          className="
            group
            flex
            h-[45px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-violet-400/20
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            text-[11px]
            font-semibold
            text-white
            shadow-[0_10px_28px_rgba(124,58,237,0.18)]
            transition
            hover:-translate-y-[1px]
            hover:shadow-[0_14px_35px_rgba(124,58,237,0.25)]
          "
        >

          <Eye size={15} />

          Review Answers

        </button>

        <button
          type="button"
          onClick={resetQuiz}
          className="
            flex
            h-[45px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            text-[11px]
            font-semibold
            text-slate-300
            transition
            hover:border-white/[0.12]
            hover:bg-white/[0.05]
            hover:text-white
          "
        >

          <RotateCcw size={15} />

          Generate New Quiz

        </button>

      </div>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  const colors = {
    emerald:
      "bg-emerald-500/10 text-emerald-300",
    rose:
      "bg-rose-500/10 text-rose-300",
    violet:
      "bg-violet-500/10 text-violet-300",
    blue:
      "bg-blue-500/10 text-blue-300",
  };

  const valueColors = {
    emerald: "text-emerald-300",
    rose: "text-rose-300",
    violet: "text-violet-300",
    blue: "text-blue-300",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0b1426]/90 p-4">

      <div
        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-[9px] text-slate-700">
        {title}
      </p>

      <p
        className={`mt-1.5 text-2xl font-bold ${valueColors[color]}`}
      >
        {value}
      </p>

    </div>
  );
}

export default QuizResult;