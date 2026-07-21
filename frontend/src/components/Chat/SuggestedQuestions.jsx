import {
  FileText,
  BrainCircuit,
  HelpCircle,
  GraduationCap,
  Layers,
  BookOpen,
} from "lucide-react";

function SuggestedQuestions({ questions, onSelect }) {
  const icons = [
    FileText,
    BrainCircuit,
    HelpCircle,
    GraduationCap,
    Layers,
    BookOpen,
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Quick Prompts
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Click a prompt to instantly start chatting.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question, index) => {
          const Icon = icons[index % icons.length];

          return (
            <button
              key={index}
              onClick={() => onSelect(question)}
              className="
                group
                rounded-2xl
                border
                border-slate-700
                bg-slate-900/70
                p-5
                text-left
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-violet-500
                hover:bg-slate-800
                hover:shadow-xl
                hover:shadow-violet-900/20
              "
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                <Icon className="h-6 w-6 text-violet-400 transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="text-base font-semibold text-white">
                {question}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Click to ask StudySphere AI this question.
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SuggestedQuestions;