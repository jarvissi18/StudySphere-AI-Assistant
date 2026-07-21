import {
  BrainCircuit,
  FileText,
  Sparkles,
  Zap,
} from "lucide-react";

function WelcomeHero() {
  const features = [
    {
      icon: FileText,
      title: "Chat with PDFs",
      description: "Ask questions from your uploaded study materials.",
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      icon: BrainCircuit,
      title: "AI Answers",
      description: "Powered by Gemini + RAG for accurate contextual responses.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Zap,
      title: "Smart Learning",
      description: "Generate summaries, notes, flashcards and quizzes instantly.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 shadow-xl">

        {/* Hero */}

        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30">
            <BrainCircuit className="h-10 w-10 text-white" />
          </div>

          <div className="flex-1">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm font-medium text-violet-300">
              <Sparkles className="h-4 w-4" />
              AI Workspace
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              Ready to study?
            </h1>

            <p className="mt-4 max-w-3xl text-slate-400 leading-7">
              Upload your study materials and chat naturally with AI.
              Create summaries, notes, flashcards and quizzes within
              seconds using Retrieval-Augmented Generation.
            </p>

          </div>

        </div>

        {/* Features */}

        <div className="grid gap-4 border-t border-slate-800 p-6 md:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/60
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-violet-500
                  hover:shadow-lg
                  hover:shadow-violet-900/20
                "
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>

                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default WelcomeHero;