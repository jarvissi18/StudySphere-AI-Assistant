import { useState } from "react";
import {
  Brain,
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  Layers3,
  GraduationCap,
  Loader2,
  RefreshCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { generateFlashcards } from "../../services/api";

function FlashcardsView() {

  const [flashcards, setFlashcards] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // ==========================================
  // Generate Flashcards
  // ==========================================

  const handleGenerateFlashcards = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await generateFlashcards({
        topic: "",
      });

      if (!response.success) {

        setFlashcards([]);
        setSources([]);

        setError(response.message);

        return;
      }

      setFlashcards(response.flashcards || []);
      setSources(response.sources || []);

      setCurrentCard(0);
      setFlipped(false);

    } catch (err) {

      console.error(err);

      setError(
        "Unable to generate flashcards. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // Navigation
  // ==========================================

  const nextCard = () => {

    if (currentCard < flashcards.length - 1) {

      setCurrentCard(currentCard + 1);
      setFlipped(false);

    }

  };

  const previousCard = () => {

    if (currentCard > 0) {

      setCurrentCard(currentCard - 1);
      setFlipped(false);

    }

  };

  // ==========================================
  // Shuffle
  // ==========================================

  const shuffleCards = () => {

    if (flashcards.length === 0) return;

    const shuffled = [...flashcards].sort(
      () => Math.random() - 0.5
    );

    setFlashcards(shuffled);

    setCurrentCard(0);
    setFlipped(false);

  };

  // ==========================================
  // Copy Current Card
  // ==========================================

  const copyCard = async () => {

    if (!flashcards.length) return;

    const card = flashcards[currentCard];

    await navigator.clipboard.writeText(
      `Q: ${card.question}\n\nA: ${card.answer}`
    );

    alert("Flashcard copied successfully.");

  };

  // ==========================================
  // Export TXT
  // ==========================================

  const exportTXT = () => {

    if (!flashcards.length) return;

    const text = flashcards
      .map(
        (card, index) =>
          `${index + 1}.\nQ: ${card.question}\nA: ${card.answer}\n`
      )
      .join("\n");

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "StudySphere_Flashcards.txt";

    a.click();

    URL.revokeObjectURL(url);

  };

  return (

    <div className="flex-1 overflow-y-auto bg-[#0B1120] px-6 py-8 text-white">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}

        <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="rounded-2xl bg-cyan-500/10 p-4">

                <Brain className="h-8 w-8 text-cyan-400" />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-3xl font-bold tracking-tight">

                    AI Flashcards

                  </h1>

                  <Sparkles className="h-5 w-5 text-yellow-400" />

                </div>

                <p className="mt-2 max-w-2xl text-slate-400">

                  Instantly convert your uploaded PDFs into
                  interactive AI-powered flashcards for
                  revision and active recall.

                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={handleGenerateFlashcards}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 font-medium transition hover:bg-cyan-500 disabled:opacity-60"
              >

                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Sparkles size={18} />
                )}

                {loading
                  ? "Generating..."
                  : "Generate Flashcards"}

              </button>

              <button
                onClick={copyCard}
                disabled={!flashcards.length}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <Copy size={18} />

                Copy

              </button>

              <button
                onClick={exportTXT}
                disabled={!flashcards.length}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 transition hover:bg-slate-700 disabled:opacity-50"
              >

                <Download size={18} />

                Export

              </button>

              {flashcards.length > 0 && (

                <button
                  onClick={handleGenerateFlashcards}
                  className="flex items-center gap-2 rounded-xl border border-cyan-500 px-4 py-2 text-cyan-300 transition hover:bg-cyan-500/10"
                >

                  <RefreshCw size={18} />

                  Regenerate

                </button>

              )}

            </div>

          </div>

        </div>

                {/* Flashcards */}

        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-xl backdrop-blur-md">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Generated Flashcards
            </h2>

            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">

              {loading
                ? "Generating..."
                : flashcards.length
                ? `${currentCard + 1} / ${flashcards.length}`
                : "Ready"}

            </span>

          </div>

          {/* Loading */}

          {loading && (

            <div className="animate-pulse space-y-4">

              <div className="h-72 rounded-3xl bg-slate-800"></div>

              <div className="h-4 w-1/2 rounded bg-slate-700"></div>

              <div className="h-4 w-2/3 rounded bg-slate-700"></div>

            </div>

          )}

          {/* Error */}

          {!loading && error && (

            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">

              <h3 className="text-xl font-semibold text-red-400">
                Unable to Generate Flashcards
              </h3>

              <p className="mt-3 text-slate-300">

                {error}

              </p>

            </div>

          )}

          {/* Empty */}

          {!loading &&
            !flashcards.length &&
            !error && (

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-8 py-16 text-center">

              <Brain className="mx-auto mb-5 h-16 w-16 text-slate-500" />

              <h3 className="text-2xl font-semibold">
                No Flashcards Available
              </h3>

              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">

                Upload one or more PDFs and click

                <span className="font-semibold text-cyan-400">

                  {" "}Generate Flashcards

                </span>

                .

                StudySphere AI will automatically create
                interactive question-and-answer flashcards
                for quick revision.

              </p>

            </div>

          )}

          {/* Flashcard */}

          {!loading &&
            flashcards.length > 0 && (

            <div className="space-y-8">

              <div
                onClick={() => setFlipped(!flipped)}
                className="cursor-pointer select-none"
              >

                <div
                  className={`min-h-[340px] rounded-3xl border transition-all duration-500 ${
                    flipped
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-700 bg-slate-950/60"
                  }`}
                >

                  <div className="flex h-full min-h-[340px] flex-col items-center justify-center px-10 py-12 text-center">

                    <div className="mb-6 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">

                      {flipped
                        ? "Answer"
                        : "Question"}

                    </div>

                    <h3 className="text-2xl font-bold leading-relaxed">

                      {flipped
                        ? flashcards[currentCard].answer
                        : flashcards[currentCard].question}

                    </h3>

                    <p className="mt-10 text-sm text-slate-400">

                      Click anywhere on the card to

                      <span className="font-semibold text-cyan-400">

                        {" "}
                        flip

                      </span>

                    </p>

                  </div>

                </div>

              </div>

                            {/* Controls */}

              <div className="flex flex-wrap items-center justify-center gap-4">

                <button
                  onClick={previousCard}
                  disabled={currentCard === 0}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <button
                  onClick={shuffleCards}
                  className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2 font-medium transition hover:bg-cyan-500"
                >
                  <Shuffle size={18} />
                  Shuffle
                </button>

                <button
                  onClick={nextCard}
                  disabled={currentCard === flashcards.length - 1}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </button>

              </div>

              {/* Progress */}

              <div>

                <div className="mb-2 flex justify-between text-sm text-slate-400">

                  <span>
                    Progress
                  </span>

                  <span>
                    {currentCard + 1} / {flashcards.length}
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                    style={{
                      width: `${((currentCard + 1) / flashcards.length) * 100}%`,
                    }}
                  />

                </div>

              </div>

              {/* Source PDFs */}

              {sources.length > 0 && (

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

                  <h3 className="mb-4 text-lg font-semibold">
                    Source PDFs
                  </h3>

                  <div className="flex flex-wrap gap-3">

                    {sources.map((file, index) => (

                      <span
                        key={index}
                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                      >
                        📄 {file}
                      </span>

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

        {/* Benefits */}

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500">

            <RotateCcw className="mb-4 h-8 w-8 text-cyan-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Active Recall
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Improve long-term memory by answering questions
              instead of simply rereading your notes.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500">

            <Layers3 className="mb-4 h-8 w-8 text-blue-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Smart Organization
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              AI converts important concepts into structured
              question-and-answer flashcards automatically.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500">

            <GraduationCap className="mb-4 h-8 w-8 text-emerald-400" />

            <h3 className="mb-2 text-lg font-semibold">
              Exam Revision
            </h3>

            <p className="text-sm leading-6 text-slate-400">
              Perfect for quick revision before quizzes,
              interviews, assignments and semester exams.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default FlashcardsView;