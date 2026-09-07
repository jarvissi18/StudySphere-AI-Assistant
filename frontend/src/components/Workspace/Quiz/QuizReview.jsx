import {
  CheckCircle2,
  XCircle,
  BookOpen,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

function QuizReview({
  quiz,
  selectedAnswers,
  setReviewMode,
  resetQuiz,
}) {
  return (
    <div className="space-y-4">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#11182c] via-[#0b1426] to-[#09101e] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.20)]">

        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-500/[0.08] blur-[80px]" />

        <div className="relative flex items-center justify-between gap-4">

          <div className="flex items-start gap-3.5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">

              <BookOpen size={20} />

            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
                Quiz Review
              </p>

              <h1 className="mt-1 text-[23px] font-bold tracking-[-0.03em] text-white">
                Review your answers
              </h1>

              <p className="mt-1.5 max-w-xl text-[10px] leading-5 text-slate-600">
                Review each question, compare your answer with
                the correct answer, and understand the explanation.
              </p>

            </div>

          </div>

          <div className="hidden rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-center sm:block">

            <p className="text-[8px] uppercase tracking-[0.14em] text-slate-700">
              Questions
            </p>

            <p className="mt-0.5 text-sm font-semibold text-white">
              {quiz.length}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          QUESTIONS
      ====================================================== */}

      {quiz.map((q, index) => {
        const selected =
          selectedAnswers[index];

        const correct =
          selected === q.answer;

        return (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b1426]/90 shadow-[0_14px_45px_rgba(0,0,0,0.16)]"
          >

            {/* Header */}

            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">

              <div className="flex items-center gap-2.5">

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035] text-[9px] font-semibold text-slate-500">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div>

                  <p className="text-[10px] font-semibold text-slate-300">
                    Question {index + 1}
                  </p>

                  <p className="mt-0.5 text-[8px] text-slate-700">
                    Answer review
                  </p>

                </div>

              </div>

              <span
                className={`
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-2.5
                  py-1
                  text-[8px]
                  font-semibold
                  ${
                    correct
                      ? "border border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300"
                      : "border border-rose-400/15 bg-rose-500/[0.07] text-rose-300"
                  }
                `}
              >

                {correct ? (
                  <CheckCircle2 size={11} />
                ) : (
                  <XCircle size={11} />
                )}

                {correct
                  ? "Correct"
                  : "Incorrect"}

              </span>

            </div>

            {/* ==================================================
                BODY
            ================================================== */}

            <div className="p-5 lg:p-6">

              <h2 className="max-w-4xl text-[16px] font-semibold leading-7 text-white">
                {q.question}
              </h2>

              {/* Options */}

              <div className="mt-5 space-y-2.5">

                {q.options.map(
                  (option, optionIndex) => {

                    const isCorrect =
                      option ===
                      q.answer;

                    const isSelected =
                      option ===
                      selected;

                    let style =
                      "border-white/[0.06] bg-white/[0.018]";

                    if (isCorrect) {
                      style =
                        "border-emerald-400/20 bg-emerald-500/[0.06]";
                    }

                    if (
                      isSelected &&
                      !isCorrect
                    ) {
                      style =
                        "border-rose-400/20 bg-rose-500/[0.06]";
                    }

                    return (
                      <div
                        key={optionIndex}
                        className={`rounded-2xl border p-3.5 ${style}`}
                      >

                        <div className="flex items-center gap-3">

                          <span
                            className={`
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              text-[10px]
                              font-semibold
                              ${
                                isCorrect
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : isSelected &&
                                    !isCorrect
                                  ? "bg-rose-500/10 text-rose-300"
                                  : "bg-white/[0.035] text-slate-500"
                              }
                            `}
                          >
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <p className="flex-1 text-[11px] leading-5 text-slate-300">
                            {option}
                          </p>

                          {isCorrect && (
                            <span className="hidden rounded-lg bg-emerald-500/10 px-2 py-1 text-[8px] font-semibold text-emerald-300 sm:block">
                              Correct answer
                            </span>
                          )}

                          {isSelected &&
                            !isCorrect && (
                              <span className="hidden rounded-lg bg-rose-500/10 px-2 py-1 text-[8px] font-semibold text-rose-300 sm:block">
                                Your answer
                              </span>
                            )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

              {/* ==================================================
                  EXPLANATION
              ================================================== */}

              {q.explanation && (
                <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-500/[0.035] p-4">

                  <div className="flex items-center gap-2">

                    <BookOpen
                      size={13}
                      className="text-blue-400"
                    />

                    <p className="text-[10px] font-semibold text-blue-300">
                      Explanation
                    </p>

                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-500">
                    {q.explanation}
                  </p>

                </div>
              )}

              {/* ==================================================
                  SOURCE
              ================================================== */}

              {q.source && (
                <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-700">

                  <span>📄</span>

                  <span>
                    Source:
                  </span>

                  <span className="text-slate-500">
                    {q.source}
                  </span>

                </div>
              )}

            </div>

          </div>
        );
      })}

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div className="grid gap-2.5 sm:grid-cols-2">

        <button
          type="button"
          onClick={() =>
            setReviewMode(false)
          }
          className="
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
          "
        >

          <ArrowLeft size={15} />

          Back to Result

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

export default QuizReview;