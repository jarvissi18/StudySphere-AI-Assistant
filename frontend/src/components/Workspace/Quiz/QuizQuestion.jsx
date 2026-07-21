import QuizProgress from "./QuizProgress";
import QuizNavigation from "./QuizNavigation";

function QuizQuestion({
  quiz,
  currentQuestion,
  selectedAnswers,
  selectAnswer,
  previousQuestion,
  nextQuestion,
  submitQuiz,
}) {
  const question = quiz[currentQuestion];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#172033] shadow-xl">

      {/* Progress */}
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={quiz.length}
      />

      {/* Content */}
      <div className="px-5 py-6 lg:px-6">

        {/* Center Container */}
        <div className="mx-auto max-w-3xl">

          {/* Question */}

          <div className="mb-6">

            <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
              Question {currentQuestion + 1}
            </span>

            <h1 className="mt-3 text-xl font-semibold leading-8 text-white lg:text-2xl">
              {question.question}
            </h1>

          </div>

          {/* Options */}

          <div className="space-y-2.5">

            {question.options.map((option, index) => {
              const selected =
                selectedAnswers[currentQuestion] === option;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`
                    group
                    w-full
                    rounded-xl
                    border
                    p-3.5
                    text-left
                    transition-all
                    duration-200
                    hover:border-violet-500
                    hover:shadow-md
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-500/30

                    ${
                      selected
                        ? "border-violet-500 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30"
                        : "border-slate-700 bg-slate-800 hover:bg-slate-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">

                    {/* Letter */}

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-sm
                        font-bold
                        transition-all

                        ${
                          selected
                            ? "bg-white text-violet-600"
                            : "bg-slate-700 text-white group-hover:bg-violet-600"
                        }
                      `}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Option */}

                    <div className="flex-1">
                      <p className="text-[15px] leading-6 text-white">
                        {option}
                      </p>
                    </div>

                    {/* Selected */}

                    {selected && (
                      <span className="rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold text-white">
                        Selected
                      </span>
                    )}

                  </div>
                </button>
              );
            })}

          </div>

          {/* Navigation */}

          <div className="mt-5 border-t border-slate-700 pt-5">

            <QuizNavigation
            currentQuestion={currentQuestion}
            totalQuestions={quiz.length}
            previousQuestion={previousQuestion}
            nextQuestion={nextQuestion}
            submitQuiz={submitQuiz}
            hasSelectedAnswer={
              selectedAnswers[currentQuestion] !== undefined
            }
          />

          </div>

        </div>

      </div>
    </div>
  );
}

export default QuizQuestion;