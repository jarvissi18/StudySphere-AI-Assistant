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
  return (
    <>
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="rounded-3xl border border-slate-700 bg-[#172033] p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl shadow-lg">
            🧠
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              AI Quiz Generator
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Generate intelligent quizzes from your uploaded study material.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          QUIZ SETUP
      ========================================= */}

      <div className="mt-5 rounded-3xl border border-slate-700 bg-[#172033] p-6 shadow-xl">

        {/* Topic */}

        <div>
          <label className="mb-2 block text-base font-semibold text-white">
            Quiz Topic (Optional)
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Cloud Computing, DBMS, AI..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              px-4
              py-3.5
              text-white
              outline-none
              transition-all
              duration-300
              placeholder:text-slate-500
              focus:border-violet-500
              focus:ring-2
              focus:ring-violet-500/20
            "
          />

          <p className="mt-2 text-xs text-slate-400">
            Leave empty to generate questions from all uploaded PDFs.
          </p>
        </div>

        {/* Difficulty + Questions */}

        <div className="mt-7 grid gap-6 md:grid-cols-2">

          {/* Difficulty */}

          <div>
            <h2 className="mb-3 text-base font-semibold text-white">
              Difficulty
            </h2>

            <div className="grid grid-cols-3 gap-3">

              {["Easy", "Medium", "Hard"].map((level) => (

                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    rounded-xl
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      difficulty === level
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg"
                        : "border border-slate-700 bg-slate-800 text-slate-300 hover:border-violet-500 hover:bg-slate-700"
                    }
                  `}
                >
                  {level}
                </button>

              ))}
            </div>
          </div>

          {/* Questions */}

          <div>
            <h2 className="mb-3 text-base font-semibold text-white">
              Number of Questions
            </h2>

            <select
              value={questions}
              onChange={(e) => setQuestions(Number(e.target.value))}
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3.5
                text-white
                outline-none
                transition-all
                duration-300
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20
              "
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        {/* Generate */}

        <button
          onClick={handleGenerateQuiz}
          disabled={loading}
          className="
            mt-7
            flex
            w-full
            items-center
            justify-center
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
            hover:from-violet-700
            hover:to-indigo-700
            hover:shadow-violet-900/40
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading ? "Generating Quiz..." : "🚀 Generate Quiz"}
        </button>
      </div>
    </>
  );
}

export default QuizSetup;