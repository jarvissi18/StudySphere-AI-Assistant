function QuizReview({
  quiz,
  selectedAnswers,
  setReviewMode,
  resetQuiz,
}) {
  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="rounded-3xl border border-slate-700 bg-[#172033] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Answer Review
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Review each question with the correct answer and explanation.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl shadow-lg">
            📖
          </div>
        </div>
      </div>

      {/* =====================================
          QUESTIONS
      ===================================== */}

      {quiz.map((q, index) => {
        const selected = selectedAnswers[index];

        return (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-slate-700 bg-[#172033] shadow-lg"
          >
            {/* Question Header */}

            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                Question {index + 1}
              </h2>

              {selected === q.answer ? (
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                  ✓ Correct
                </span>
              ) : (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                  ✗ Wrong
                </span>
              )}
            </div>

            {/* Body */}

            <div className="p-6">
              {/* Question */}

              <h3 className="text-xl font-semibold leading-8 text-white">
                {q.question}
              </h3>

              {/* Options */}

              <div className="mt-6 space-y-3">
                {q.options.map((option, i) => {
                  let classes =
                    "border-slate-700 bg-slate-800";

                  if (option === q.answer) {
                    classes =
                      "border-green-500 bg-green-500/15";
                  }

                  if (
                    option === selected &&
                    option !== q.answer
                  ) {
                    classes =
                      "border-red-500 bg-red-500/15";
                  }

                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border p-4 transition-all ${classes}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-700
                            text-sm
                            font-bold
                            text-white
                          "
                        >
                          {String.fromCharCode(65 + i)}
                        </div>

                        <div className="flex-1">
                          <p className="text-base text-white">
                            {option}
                          </p>
                        </div>

                        {option === q.answer && (
                          <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
                            Correct
                          </span>
                        )}

                        {option === selected &&
                          option !== q.answer && (
                            <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white">
                              Your Answer
                            </span>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}

              {q.explanation && (
                <div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
                  <h3 className="text-base font-semibold text-blue-400">
                    📘 Explanation
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {q.explanation}
                  </p>
                </div>
              )}

              {/* Source */}

              {q.source && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <span>📄</span>

                  <span className="font-medium">
                    Source:
                  </span>

                  <span className="text-white">
                    {q.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* =====================================
          BUTTONS
      ===================================== */}

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => setReviewMode(false)}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            py-3.5
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
          ← Back to Result
        </button>

        <button
          onClick={resetQuiz}
          className="
            rounded-2xl
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
          🔄 Generate New Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizReview;