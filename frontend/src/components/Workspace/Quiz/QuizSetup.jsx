import {
  Sparkles,
  Target,
  FileQuestion,
  Zap,
  ChevronDown,
  Check,
} from "lucide-react";

function QuizSetup({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  questions,
  setQuestions,
  loading,
  handleGenerateQuiz,
}) {
  // ============================================================
  // DIFFICULTY OPTIONS
  // ============================================================

  const difficultyOptions = [
    {
      label: "Easy",
      description: "Fundamentals",
      number: "01",
      activeClass:
        "border-emerald-400/25 bg-emerald-500/[0.07]",
      iconClass:
        "bg-emerald-500/10 text-emerald-300",
      textClass: "text-emerald-300",
    },
    {
      label: "Medium",
      description: "Balanced",
      number: "02",
      activeClass:
        "border-violet-400/25 bg-violet-500/[0.08]",
      iconClass:
        "bg-violet-500/10 text-violet-300",
      textClass: "text-violet-300",
    },
    {
      label: "Hard",
      description: "Advanced",
      number: "03",
      activeClass:
        "border-rose-400/25 bg-rose-500/[0.07]",
      iconClass:
        "bg-rose-500/10 text-rose-300",
      textClass: "text-rose-300",
    },
  ];

  // ============================================================
  // QUESTION OPTIONS
  // ============================================================

  const questionOptions = [5, 10, 15, 20, 25];

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="w-full">

      {/* ======================================================
          QUIZ HEADER
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.07]
          bg-gradient-to-br
          from-[#11182d]
          via-[#0d1629]
          to-[#09111f]
          px-5
          py-4
          shadow-[0_16px_45px_rgba(0,0,0,0.18)]
          sm:px-6
          sm:py-5
        "
      >

        {/* Ambient glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-20
            h-40
            w-40
            rounded-full
            bg-violet-500/[0.09]
            blur-[70px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            left-1/3
            h-28
            w-28
            rounded-full
            bg-pink-500/[0.045]
            blur-[60px]
          "
        />

        <div className="relative flex items-center gap-3">

          {/* Icon */}

          <div
            className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-pink-500
              to-rose-600
              text-white
              shadow-[0_8px_28px_rgba(236,72,153,0.25)]
            "
          >
            <Sparkles size={18} />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-xl
                bg-pink-400/20
                blur-xl
              "
            />
          </div>

          {/* Title */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h1
                className="
                  text-[19px]
                  font-bold
                  tracking-[-0.035em]
                  text-white
                  sm:text-[21px]
                "
              >
                AI Quiz
              </h1>

              <span
                className="
                  rounded-full
                  border
                  border-pink-400/15
                  bg-pink-500/[0.06]
                  px-2
                  py-0.5
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-pink-300
                "
              >
                AI Assessment
              </span>

            </div>

            <p
              className="
                mt-1
                text-[8px]
                leading-4
                text-slate-600
                sm:text-[9px]
              "
            >
              Create personalized quizzes from your study material with AI.
            </p>

          </div>

          {/* Status */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-emerald-400/10
              bg-emerald-400/[0.045]
              px-2.5
              py-1.5
              sm:flex
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.65)]
              "
            />

            <span
              className="
                text-[7px]
                font-medium
                text-emerald-300
              "
            >
              AI Ready
            </span>

          </div>

        </div>

      </section>

      {/* ======================================================
          CONFIGURATION
      ====================================================== */}

      <section
        className="
          mt-3
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.07]
          bg-[#0b1426]
          shadow-[0_16px_45px_rgba(0,0,0,0.14)]
        "
      >

        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-white/[0.06]
            px-5
            py-3.5
            sm:px-6
          "
        >

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-violet-500/[0.09]
              text-violet-300
            "
          >
            <Sparkles size={14} />
          </div>

          <div>

            <p
              className="
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-violet-400/70
              "
            >
              Create your quiz
            </p>

            <h2
              className="
                mt-0.5
                text-[12px]
                font-semibold
                text-white
              "
            >
              Configure your assessment
            </h2>

          </div>

        </div>

        {/* ====================================================
            FORM CONTENT
        ==================================================== */}

        <div className="px-5 py-4 sm:px-6">

          {/* ==================================================
              TOPIC
          ================================================== */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FileQuestion
                  size={13}
                  className="text-violet-400"
                />

                <label
                  htmlFor="quiz-topic"
                  className="
                    text-[9px]
                    font-semibold
                    text-slate-300
                  "
                >
                  Quiz topic
                </label>

              </div>

              <span
                className="
                  text-[6px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-slate-700
                "
              >
                Optional
              </span>

            </div>

            <div className="relative">

              <FileQuestion
                size={14}
                className="
                  pointer-events-none
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-700
                "
              />

              <input
                id="quiz-topic"
                type="text"
                value={topic}
                onChange={(event) =>
                  setTopic(event.target.value)
                }
                placeholder="Enter topic or subject..."
                className="
                  h-[42px]
                  w-full
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-[#08111f]
                  pl-10
                  pr-4
                  text-[10px]
                  text-white
                  outline-none
                  transition-all
                  placeholder:text-slate-700
                  hover:border-white/[0.11]
                  focus:border-violet-500/40
                  focus:bg-[#0a1424]
                  focus:ring-4
                  focus:ring-violet-500/[0.045]
                "
              />

            </div>

            <p
              className="
                mt-1.5
                text-[7px]
                text-slate-700
              "
            >
              Examples: Database Management Systems, Operating Systems,
              Machine Learning...
            </p>

          </div>

          {/* ==================================================
              OPTIONS GRID
          ================================================== */}

          <div
            className="
              mt-5
              grid
              gap-5
              lg:grid-cols-[1.45fr_1fr]
            "
          >

            {/* =================================================
                DIFFICULTY
            ================================================= */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >

                <Target
                  size={13}
                  className="text-violet-400"
                />

                <h3
                  className="
                    text-[9px]
                    font-semibold
                    text-slate-300
                  "
                >
                  Difficulty level
                </h3>

              </div>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                "
              >

                {difficultyOptions.map(
                  (option) => {
                    const active =
                      difficulty ===
                      option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          setDifficulty(
                            option.label
                          )
                        }
                        className={`
                          relative
                          min-h-[72px]
                          rounded-xl
                          border
                          px-2
                          py-2.5
                          text-center
                          transition-all
                          duration-200

                          ${
                            active
                              ? option.activeClass
                              : `
                                border-white/[0.055]
                                bg-white/[0.018]
                                hover:border-white/[0.10]
                                hover:bg-white/[0.03]
                              `
                          }
                        `}
                      >

                        {/* Check */}

                        {active && (
                          <span
                            className="
                              absolute
                              right-2
                              top-2
                              flex
                              h-4
                              w-4
                              items-center
                              justify-center
                              rounded-full
                              bg-violet-500
                              text-white
                            "
                          >
                            <Check size={9} />
                          </span>
                        )}

                        <div
                          className={`
                            mx-auto
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-md
                            text-[6px]
                            font-semibold

                            ${
                              active
                                ? option.iconClass
                                : `
                                  bg-white/[0.025]
                                  text-slate-700
                                `
                            }
                          `}
                        >
                          {option.number}
                        </div>

                        <p
                          className={`
                            mt-2
                            text-[9px]
                            font-semibold

                            ${
                              active
                                ? option.textClass
                                : "text-slate-400"
                            }
                          `}
                        >
                          {option.label}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[6px]
                            text-slate-700
                          "
                        >
                          {option.description}
                        </p>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* =================================================
                QUESTION COUNT
            ================================================= */}

            <div>

              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >

                <FileQuestion
                  size={13}
                  className="text-violet-400"
                />

                <h3
                  className="
                    text-[9px]
                    font-semibold
                    text-slate-300
                  "
                >
                  Number of questions
                </h3>

              </div>

              <div
                className="
                  grid
                  grid-cols-5
                  gap-1.5
                "
              >

                {questionOptions.map(
                  (count) => {
                    const active =
                      questions === count;

                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          setQuestions(count)
                        }
                        className={`
                          relative
                          flex
                          h-[72px]
                          items-center
                          justify-center
                          rounded-xl
                          border
                          text-[11px]
                          font-medium
                          transition-all
                          duration-200

                          ${
                            active
                              ? `
                                border-violet-400/20
                                bg-violet-500/[0.09]
                                text-violet-200
                                shadow-[0_8px_22px_rgba(124,58,237,0.08)]
                              `
                              : `
                                border-white/[0.055]
                                bg-white/[0.018]
                                text-slate-600
                                hover:border-white/[0.10]
                                hover:bg-white/[0.03]
                                hover:text-slate-300
                              `
                          }
                        `}
                      >

                        {count}

                        {active && (
                          <span
                            className="
                              absolute
                              right-2
                              top-2
                              h-1.5
                              w-1.5
                              rounded-full
                              bg-violet-400
                            "
                          />
                        )}

                      </button>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* ==================================================
              STUDY MATERIAL
          ================================================== */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-4
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.018]
              px-3.5
              py-3
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-pink-500/[0.08]
                  text-pink-300
                "
              >
                <Sparkles size={13} />
              </div>

              <div className="min-w-0">

                <p
                  className="
                    text-[8px]
                    font-semibold
                    text-slate-300
                  "
                >
                  Use uploaded study material
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-[6px]
                    text-slate-700
                  "
                >
                  AI will generate questions from your PDFs.
                </p>

              </div>

            </div>

            {/* Visual status */}

            <div
              className="
                flex
                h-6
                w-10
                shrink-0
                items-center
                rounded-full
                bg-gradient-to-r
                from-violet-500
                to-fuchsia-500
                p-0.5
                shadow-[0_4px_14px_rgba(168,85,247,0.20)]
              "
            >
              <div
                className="
                  ml-auto
                  h-5
                  w-5
                  rounded-full
                  bg-white
                  shadow-sm
                "
              />
            </div>

          </div>

          {/* ==================================================
              GENERATE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={handleGenerateQuiz}
            disabled={loading}
            className="
              group
              relative
              mt-4
              flex
              h-[44px]
              w-full
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-violet-400/20
              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-pink-500
              text-[11px]
              font-semibold
              text-white
              shadow-[0_10px_30px_rgba(124,58,237,0.20)]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:shadow-[0_14px_35px_rgba(124,58,237,0.28)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {/* Shine */}

            <span
              className="
                pointer-events-none
                absolute
                inset-y-0
                -left-1/2
                w-1/3
                rotate-12
                bg-white/[0.12]
                blur-md
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            <span
              className="
                relative
                flex
                items-center
                gap-2
              "
            >

              {loading ? (
                <>
                  <span
                    className="
                      h-3.5
                      w-3.5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />

                  Generating quiz...
                </>
              ) : (
                <>
                  <Zap size={14} />
                  Generate Quiz
                </>
              )}

            </span>

          </button>

          {/* FOOTNOTE */}

          <div
            className="
              mt-2
              flex
              items-center
              justify-center
              gap-1.5
            "
          >

            <Sparkles
              size={8}
              className="text-violet-400/40"
            />

            <span
              className="
                text-[6px]
                text-slate-800
              "
            >
              AI will analyze your study context and create a personalized quiz.
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default QuizSetup;