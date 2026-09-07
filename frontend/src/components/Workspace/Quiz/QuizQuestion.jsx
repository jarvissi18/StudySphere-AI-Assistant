import {
  Check,
  Circle,
  Target,
} from "lucide-react";

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

  // ============================================================
  // SAFETY
  // ============================================================

  if (!question) {
    return null;
  }

  // ============================================================
  // ANSWERED QUESTIONS
  //
  // Progress is based on how many questions the user
  // has actually answered.
  // ============================================================

  const answeredQuestions =
    Object.keys(selectedAnswers || {}).length;

  const hasSelectedAnswer =
    selectedAnswers?.[currentQuestion] !== undefined;

  return (
    <div className="
      overflow-hidden
      rounded-3xl
      border
      border-white/[0.07]
      bg-[#0b1426]/95
      shadow-[0_20px_60px_rgba(0,0,0,0.20)]
    ">

      {/* ======================================================
          PROGRESS
      ====================================================== */}

      <div className="
        border-b
        border-white/[0.06]
      ">

        <QuizProgress
          currentQuestion={currentQuestion}
          totalQuestions={quiz.length}
          answeredQuestions={answeredQuestions}
        />

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="
        px-5
        py-6
        lg:px-7
        lg:py-7
      ">

        <div className="
          mx-auto
          max-w-[860px]
        ">

          {/* ==================================================
              QUESTION HEADER
          ================================================== */}

          <div className="mb-6">

            <div className="
              mb-3
              flex
              items-center
              justify-between
            ">

              {/* LEFT */}

              <div className="
                flex
                items-center
                gap-2
              ">

                <span className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-pink-500/10
                  text-pink-300
                ">
                  <Target size={14} />
                </span>

                <span className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-pink-400
                ">
                  Question {currentQuestion + 1}
                </span>

              </div>

              {/* RIGHT */}

              <span className="
                text-[9px]
                text-slate-600
              ">
                {currentQuestion + 1} of {quiz.length}
              </span>

            </div>

            {/* QUESTION */}

            <h1 className="
              max-w-3xl
              text-[20px]
              font-semibold
              leading-8
              tracking-[-0.02em]
              text-white
              sm:text-[22px]
            ">
              {question.question}
            </h1>

            <p className="
              mt-2
              text-[10px]
              text-slate-500
            ">
              Select the best answer.
            </p>

          </div>

          {/* ==================================================
              OPTIONS
          ================================================== */}

          <div className="space-y-2.5">

            {Array.isArray(question.options) &&
              question.options.map(
                (option, index) => {

                  const selected =
                    selectedAnswers?.[
                      currentQuestion
                    ] === option;

                  return (
                    <button
                      key={`${currentQuestion}-${index}`}
                      type="button"
                      onClick={() =>
                        selectAnswer(option)
                      }
                      className={`
                        group
                        w-full
                        rounded-2xl
                        border
                        p-3.5
                        text-left
                        transition-all
                        duration-200
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-violet-500/40

                        ${
                          selected
                            ? `
                              border-violet-400/25
                              bg-gradient-to-r
                              from-violet-500/[0.13]
                              to-indigo-500/[0.07]
                              shadow-[0_10px_30px_rgba(124,58,237,0.10)]
                            `
                            : `
                              border-white/[0.06]
                              bg-white/[0.018]
                              hover:border-violet-400/15
                              hover:bg-white/[0.035]
                            `
                        }
                      `}
                    >

                      <div className="
                        flex
                        items-center
                        gap-3
                      ">

                        {/* ==================================================
                            LETTER
                        ================================================== */}

                        <span
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-[11px]
                            font-semibold
                            transition-all

                            ${
                              selected
                                ? `
                                  bg-violet-500
                                  text-white
                                  shadow-[0_6px_18px_rgba(124,58,237,0.25)]
                                `
                                : `
                                  bg-white/[0.04]
                                  text-slate-500
                                  group-hover:bg-violet-500/10
                                  group-hover:text-violet-300
                                `
                            }
                          `}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        {/* ==================================================
                            OPTION TEXT
                        ================================================== */}

                        <span
                          className={`
                            flex-1
                            text-[12px]
                            leading-6

                            ${
                              selected
                                ? "text-white"
                                : "text-slate-300"
                            }
                          `}
                        >
                          {option}
                        </span>

                        {/* ==================================================
                            SELECTED INDICATOR
                        ================================================== */}

                        {selected ? (

                          <span className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-violet-500/15
                            text-violet-300
                          ">
                            <Check size={13} />
                          </span>

                        ) : (

                          <Circle
                            size={14}
                            className="
                              shrink-0
                              text-slate-700
                            "
                          />

                        )}

                      </div>

                    </button>
                  );
                }
              )}

          </div>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          <div className="
            mt-6
            border-t
            border-white/[0.06]
            pt-5
          ">

            <QuizNavigation
              currentQuestion={currentQuestion}
              totalQuestions={quiz.length}
              previousQuestion={previousQuestion}
              nextQuestion={nextQuestion}
              submitQuiz={submitQuiz}
              hasSelectedAnswer={hasSelectedAnswer}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default QuizQuestion;