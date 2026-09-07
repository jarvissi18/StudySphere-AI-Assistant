import { useMemo, useState } from "react";

import {
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  GraduationCap,
  Layers3,
  Lightbulb,
  Loader2,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { generateFlashcards } from "../../services/api";

function FlashcardsView() {
  const [flashcards, setFlashcards] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const card = flashcards[currentCard] || null;

  const progress = useMemo(() => {
    if (!flashcards.length) return 0;
    return ((currentCard + 1) / flashcards.length) * 100;
  }, [currentCard, flashcards.length]);

  const answeredPosition = currentCard + 1;

  const handleGenerateFlashcards = async () => {
    try {
      setLoading(true);
      setError("");
      setCopied(false);

      const response = await generateFlashcards({
        topic: "",
      });

      if (!response?.success) {
        setFlashcards([]);
        setSources([]);
        setError(
          response?.message ||
            "Unable to generate flashcards."
        );
        return;
      }

      const generatedCards = Array.isArray(response.flashcards)
        ? response.flashcards.filter(
            (item) =>
              item &&
              typeof item.question === "string" &&
              typeof item.answer === "string"
          )
        : [];

      setFlashcards(generatedCards);
      setSources(
        Array.isArray(response.sources)
          ? response.sources
          : []
      );
      setCurrentCard(0);
      setFlipped(false);
    } catch (err) {
      console.error("[FLASHCARDS GENERATION ERROR]", err);

      setFlashcards([]);
      setSources([]);
      setError(
        "Unable to generate flashcards. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (!flashcards.length) return;

    if (currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setFlipped(false);
      setCopied(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setFlipped(false);
      setCopied(false);
    }
  };

  const shuffleCards = () => {
    if (!flashcards.length) return;

    const shuffled = [...flashcards];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(
        Math.random() * (index + 1)
      );

      [shuffled[index], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[index],
      ];
    }

    setFlashcards(shuffled);
    setCurrentCard(0);
    setFlipped(false);
    setCopied(false);
  };

  const copyCard = async () => {
    if (!card) return;

    try {
      await navigator.clipboard.writeText(
        `Question:\n${card.question}\n\nAnswer:\n${card.answer}`
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch (err) {
      console.error("[FLASHCARD COPY ERROR]", err);
    }
  };

  const exportTXT = () => {
    if (!flashcards.length) return;

    const text = flashcards
      .map(
        (item, index) =>
          `FLASHCARD ${index + 1}\n\nQUESTION\n${item.question}\n\nANSWER\n${item.answer}\n`
      )
      .join("\n----------------------------------------\n\n");

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "StudySphere_Flashcards.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (event) => {
    if (!card) return;

    if (event.key === "ArrowRight") {
      nextCard();
    }

    if (event.key === "ArrowLeft") {
      previousCard();
    }

    if (event.key === " " || event.key === "Enter") {
      const tag = event.target?.tagName?.toLowerCase();

      if (
        tag !== "button" &&
        tag !== "input" &&
        tag !== "textarea"
      ) {
        event.preventDefault();
        setFlipped((prev) => !prev);
      }
    }
  };

  return (
    <div
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="h-full min-h-0 overflow-y-auto bg-[#050b15] text-white outline-none"
    >
      <div className="mx-auto w-full max-w-[1380px] px-4 py-4 sm:px-5 lg:px-6 xl:px-7">
        {/* HEADER */}
        <header className="relative overflow-hidden rounded-[24px] border border-[#1b2b41] bg-[#091321] shadow-[0_22px_70px_rgba(0,0,0,0.24)]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-500/[0.08] blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-600/[0.045] blur-[100px]" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between xl:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/15 to-blue-500/[0.06] text-cyan-300 shadow-[0_12px_30px_rgba(6,182,212,0.08)]">
                <Brain size={25} strokeWidth={1.8} />

                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-white ring-2 ring-[#091321]">
                  <Sparkles size={8} />
                </span>
              </div>

              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Active Recall
                  </span>

                  <StatusBadge
                    loading={loading}
                    cards={flashcards.length}
                    error={error}
                  />
                </div>

                <h1 className="text-[27px] font-bold tracking-[-0.045em] text-white sm:text-[30px]">
                  AI Flashcards
                </h1>

                <p className="mt-1.5 max-w-[650px] text-[13px] leading-6 text-slate-400">
                  Turn your uploaded study material into focused
                  question-and-answer cards designed for active
                  recall and faster revision.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PrimaryButton
                loading={loading}
                label={
                  loading
                    ? "Generating..."
                    : flashcards.length
                    ? "Generate Again"
                    : "Generate Flashcards"
                }
                onClick={handleGenerateFlashcards}
              />

              <ActionButton
                icon={
                  copied ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )
                }
                label={copied ? "Copied" : "Copy"}
                onClick={copyCard}
                disabled={!card}
                success={copied}
              />

              <ActionButton
                icon={<Download size={14} />}
                label="Export"
                onClick={exportTXT}
                disabled={!flashcards.length}
              />

              {flashcards.length > 0 && (
                <ActionButton
                  icon={<RefreshCw size={14} />}
                  label="Regenerate"
                  onClick={handleGenerateFlashcards}
                  disabled={loading}
                  accent
                />
              )}
            </div>
          </div>
        </header>

        {/* METRICS */}
        {flashcards.length > 0 && !loading && (
          <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-[18px] border border-[#1b2b41] bg-[#091321] sm:grid-cols-4">
            <MetricCard
              icon={<Layers3 size={15} />}
              value={flashcards.length}
              label="Cards"
            />

            <MetricCard
              icon={<Target size={15} />}
              value={`${answeredPosition}/${flashcards.length}`}
              label="Current"
            />

            <MetricCard
              icon={<CheckCircle2 size={15} />}
              value={`${Math.round(progress)}%`}
              label="Progress"
            />

            <MetricCard
              icon={<FileText size={15} />}
              value={sources.length}
              label="Sources"
              last
            />
          </div>
        )}

        {/* MAIN WORKSPACE */}
        <section className="mt-3 overflow-hidden rounded-[24px] border border-[#1b2b41] bg-[#091321] shadow-[0_22px_65px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#1b2b41] px-4 py-3.5 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/[0.08] text-cyan-300">
                <Brain size={15} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                  Interactive Revision
                </p>

                <p className="truncate text-xs font-semibold text-slate-300">
                  {loading
                    ? "Building your flashcard deck"
                    : flashcards.length
                    ? "Study one concept at a time"
                    : "Your flashcard deck"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {card && (
                <span className="hidden rounded-full border border-cyan-400/10 bg-cyan-500/[0.05] px-2.5 py-1 text-[9px] font-semibold text-cyan-300 sm:inline-flex">
                  Card {currentCard + 1} of {flashcards.length}
                </span>
              )}

              {card && (
                <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-500/[0.04] px-2.5 py-1 text-[9px] font-semibold text-emerald-300 md:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Study Mode
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            {loading && <FlashcardsSkeleton />}

            {!loading && error && (
              <StateCard
                error
                title="Unable to generate flashcards"
                description={error}
                actionLabel="Try Again"
                onAction={handleGenerateFlashcards}
                actionIcon={<RefreshCw size={14} />}
              />
            )}

            {!loading &&
              !error &&
              !flashcards.length && (
                <StateCard
                  icon={<Brain size={26} />}
                  title="Your flashcard deck is ready to build"
                  description="Generate a deck from your uploaded study material. Each card will focus on an important concept, definition, fact, process or exam-relevant point."
                  actionLabel="Generate Flashcards"
                  onAction={handleGenerateFlashcards}
                  actionIcon={<Sparkles size={14} />}
                />
              )}

            {!loading && card && (
              <div className="space-y-5">
                {/* CARD */}
                <button
                  type="button"
                  aria-label={
                    flipped
                      ? "Show question"
                      : "Show answer"
                  }
                  onClick={() =>
                    setFlipped((prev) => !prev)
                  }
                  className="flashcard-shell group relative block min-h-[390px] w-full overflow-hidden rounded-[24px] border border-[#20334d] bg-[#0b1728] text-left shadow-[0_24px_70px_rgba(0,0,0,0.25)] transition duration-300 hover:border-cyan-400/20 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10 sm:min-h-[430px]"
                >
                  <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/[0.065] blur-[95px]" />
                  <div className="pointer-events-none absolute -bottom-28 -left-20 h-60 w-60 rounded-full bg-blue-600/[0.045] blur-[90px]" />

                  <div className="relative flex min-h-[390px] flex-col sm:min-h-[430px]">
                    <div className="flex items-center justify-between border-b border-white/[0.055] px-5 py-4 sm:px-7">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            flipped
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-cyan-500/10 text-cyan-300"
                          }`}
                        >
                          {flipped ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <Brain size={15} />
                          )}
                        </span>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                            {flipped ? "Answer" : "Question"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500">
                            {flipped
                              ? "Reveal the explanation"
                              : "Test your memory first"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] font-semibold text-slate-600">
                        {String(currentCard + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:px-12 sm:py-12">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] ${
                          flipped
                            ? "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-300"
                            : "border-cyan-400/15 bg-cyan-500/[0.06] text-cyan-300"
                        }`}
                      >
                        {flipped
                          ? "Answer"
                          : "Question"}
                      </span>

                      <div className="mx-auto mt-7 max-w-4xl">
                        <p
                          className={`whitespace-pre-wrap text-[19px] font-semibold leading-[1.7] tracking-[-0.015em] sm:text-[24px] ${
                            flipped
                              ? "text-slate-100"
                              : "text-white"
                          }`}
                        >
                          {flipped
                            ? card.answer
                            : card.question}
                        </p>
                      </div>

                      <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/[0.045] bg-white/[0.018] px-3 py-1.5 text-[9px] font-medium text-slate-600">
                        <RotateCcw size={11} />
                        Click card to flip
                      </div>
                    </div>

                    <div className="border-t border-white/[0.045] px-5 py-3.5 sm:px-7">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[9px] text-slate-700">
                          Active recall
                        </span>

                        <span className="text-[9px] font-medium text-slate-600">
                          Space / Enter to flip
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* CONTROLS */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <ControlButton
                    icon={<ChevronLeft size={15} />}
                    label="Previous"
                    onClick={previousCard}
                    disabled={currentCard === 0}
                  />

                  <ControlButton
                    icon={<Shuffle size={14} />}
                    label="Shuffle"
                    onClick={shuffleCards}
                    accent
                  />

                  <ControlButton
                    icon={
                      flipped ? (
                        <Brain size={14} />
                      ) : (
                        <Check size={14} />
                      )
                    }
                    label={
                      flipped
                        ? "Show Question"
                        : "Show Answer"
                    }
                    onClick={() =>
                      setFlipped((prev) => !prev)
                    }
                  />

                  <ControlButton
                    icon={<ChevronRight size={15} />}
                    label="Next"
                    onClick={nextCard}
                    disabled={
                      currentCard ===
                      flashcards.length - 1
                    }
                  />
                </div>

                {/* PROGRESS */}
                <div className="rounded-[18px] border border-white/[0.055] bg-white/[0.012] px-4 py-3.5 sm:px-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
                        Deck Progress
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-700">
                        Card {currentCard + 1} of{" "}
                        {flashcards.length}
                      </p>
                    </div>

                    <span className="text-[10px] font-semibold text-cyan-300">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex gap-1">
                    {flashcards
                      .slice(0, Math.min(flashcards.length, 30))
                      .map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Go to card ${
                            index + 1
                          }`}
                          onClick={() => {
                            setCurrentCard(index);
                            setFlipped(false);
                            setCopied(false);
                          }}
                          className={`h-1.5 flex-1 rounded-full transition ${
                            index === currentCard
                              ? "bg-cyan-400"
                              : index < currentCard
                              ? "bg-cyan-500/35"
                              : "bg-white/[0.05]"
                          }`}
                        />
                      ))}
                  </div>
                </div>

                {/* CARD INSIGHT */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[18px] border border-cyan-400/10 bg-cyan-500/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                        <Lightbulb size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          Active Recall Tip
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
                          Try answering the question completely
                          before revealing the answer. This makes
                          the card more useful for memory practice.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-white/[0.055] bg-white/[0.012] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        <Target size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200">
                          Current Card
                        </p>

                        <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-slate-600">
                          {card.question}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SOURCES */}
                {sources.length > 0 && (
                  <SourcePanel sources={sources} />
                )}
              </div>
            )}
          </div>
        </section>

        {/* BENEFITS */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <BenefitCard
            icon={<RotateCcw size={17} />}
            title="Active Recall"
            description="Recall the answer before revealing it instead of passively rereading."
            tone="cyan"
          />

          <BenefitCard
            icon={<Layers3 size={17} />}
            title="Concept Focused"
            description="Each card isolates one useful idea so revision stays focused."
            tone="blue"
          />

          <BenefitCard
            icon={<GraduationCap size={17} />}
            title="Exam Revision"
            description="Use the deck for quick revision of definitions, concepts and important facts."
            tone="emerald"
          />
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}

function PrimaryButton({
  loading,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(8,145,178,0.20)] transition-all hover:-translate-y-px hover:shadow-[0_14px_34px_rgba(8,145,178,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2
          size={15}
          className="animate-spin"
        />
      ) : (
        <Sparkles size={15} />
      )}

      {label}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  accent = false,
  success = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-10 items-center justify-center gap-1.5
        rounded-xl border px-3.5 text-xs font-medium transition-all
        disabled:cursor-not-allowed disabled:opacity-30
        ${
          success
            ? "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300"
            : accent
            ? "border-cyan-400/20 bg-cyan-500/[0.06] text-cyan-300 hover:bg-cyan-500/[0.10]"
            : "border-[#263650] bg-[#0b1728] text-slate-400 hover:border-cyan-400/20 hover:bg-[#0e1a2e] hover:text-white"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function ControlButton({
  icon,
  label,
  onClick,
  disabled = false,
  accent = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-10 items-center justify-center gap-2
        rounded-xl border px-4 text-xs font-medium transition-all
        disabled:cursor-not-allowed disabled:opacity-25
        ${
          accent
            ? "border-cyan-400/15 bg-cyan-500/[0.07] text-cyan-300 hover:border-cyan-400/25 hover:bg-cyan-500/[0.11]"
            : "border-[#263650] bg-[#0b1728] text-slate-500 hover:border-[#334967] hover:bg-[#0e1a2e] hover:text-slate-200"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricCard({
  icon,
  value,
  label,
  last = false,
}) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3.5 sm:px-5
        ${
          !last
            ? "border-b border-[#1b2b41] sm:border-b-0 sm:border-r"
            : ""
        }
      `}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/[0.08] text-cyan-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[15px] font-semibold tracking-[-0.015em] text-white">
          {value}
        </p>

        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  loading,
  cards,
  error,
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-cyan-500/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-cyan-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
        Generating
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/15 bg-red-500/[0.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Error
      </span>
    );
  }

  if (cards > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-500/[0.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-emerald-300">
        <CheckCircle2 size={11} />
        Ready
      </span>
    );
  }

  return null;
}

function SourcePanel({ sources }) {
  return (
    <section className="rounded-[18px] border border-white/[0.055] bg-white/[0.012] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/[0.08] text-cyan-300">
            <FileText size={16} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">
              Source Material
            </p>

            <p className="mt-0.5 text-[10px] text-slate-600">
              Documents used to create this flashcard deck.
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium text-slate-500">
          {sources.length}{" "}
          {sources.length === 1 ? "file" : "files"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {sources.map((file, index) => (
          <div
            key={`${file}-${index}`}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.055] bg-[#07111e] px-3.5 py-3 transition hover:border-cyan-400/15"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/[0.07] text-cyan-300">
              <FileText size={15} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-slate-300">
                {file}
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-slate-700">
                PDF Source
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StateCard({
  icon,
  title,
  description,
  error = false,
  actionLabel,
  onAction,
  actionIcon,
}) {
  return (
    <div
      className={`
        rounded-[20px] border px-6 py-16 text-center sm:py-20
        ${
          error
            ? "border-red-400/15 bg-red-500/[0.025]"
            : "border-dashed border-white/[0.08] bg-white/[0.012]"
        }
      `}
    >
      <div
        className={`
          mx-auto flex h-14 w-14 items-center justify-center rounded-2xl
          ${
            error
              ? "bg-red-500/10 text-red-400"
              : "bg-cyan-500/10 text-cyan-300"
          }
        `}
      >
        {error ? (
          <X size={24} />
        ) : (
          icon || <Brain size={24} />
        )}
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-[560px] text-[12px] leading-6 text-slate-600">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`
            mt-6 inline-flex items-center gap-2 rounded-xl
            px-4 py-2.5 text-xs font-semibold transition
            ${
              error
                ? "border border-red-400/15 bg-red-500/[0.06] text-red-300 hover:bg-red-500/[0.10]"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_10px_30px_rgba(8,145,178,0.18)] hover:-translate-y-px"
            }
          `}
        >
          {actionIcon}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function FlashcardsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[390px] rounded-[24px] border border-white/[0.045] bg-white/[0.025] sm:min-h-[430px]" />

      <div className="mt-5 flex justify-center gap-2.5">
        <div className="h-10 w-24 rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-24 rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-24 rounded-xl bg-white/[0.04]" />
      </div>

      <div className="mt-5 h-20 rounded-[18px] bg-white/[0.025]" />
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
  tone,
}) {
  const tones = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    blue: "bg-blue-500/10 text-blue-300",
    emerald: "bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="rounded-[18px] border border-[#1b2b41] bg-[#091321] p-4 transition duration-200 hover:border-[#2a3e59] hover:bg-[#0b1627]">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1.5 text-[11px] leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default FlashcardsView;
