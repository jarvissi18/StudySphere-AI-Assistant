import {
  FileText,
  BrainCircuit,
  HelpCircle,
  GraduationCap,
  Layers,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

function SuggestedQuestions({
  questions = [],
  onSelect,
}) {
  const icons = [
    FileText,
    BrainCircuit,
    HelpCircle,
    GraduationCap,
    Layers,
    BookOpen,
  ];

  if (!questions.length) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 pb-7 lg:px-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-3.5 flex items-end justify-between">

        <div>

          <div className="flex items-center gap-2">

            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
              <SparklesIcon />
            </span>

            <h2 className="text-[12px] font-semibold text-white">
              Quick prompts
            </h2>

          </div>

          <p className="mt-1 text-[9px] text-slate-700">
            Start a conversation with one click.
          </p>

        </div>

      </div>

      {/* ======================================================
          PROMPTS
      ====================================================== */}

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">

        {questions.map((question, index) => {

          const Icon =
            icons[index % icons.length];

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(question)}
              className="
                group
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#0b1426]
                p-3.5
                text-left
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:border-violet-400/15
                hover:bg-white/[0.035]
                hover:shadow-[0_12px_35px_rgba(124,58,237,0.08)]
              "
            >

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 transition-transform duration-300 group-hover:scale-105">

                  <Icon size={16} />

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-medium leading-5 text-slate-300 transition-colors group-hover:text-white">
                    {question}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-[8px] text-slate-700 transition-colors group-hover:text-violet-400">

                    Ask StudySphere AI

                    <ArrowUpRight
                      size={10}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />

                  </div>

                </div>

              </div>

            </button>
          );
        })}

      </div>

    </div>
  );
}

// ============================================================
// SMALL SPARKLE ICON
// ============================================================

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3z" />
      <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z" />
    </svg>
  );
}

export default SuggestedQuestions;