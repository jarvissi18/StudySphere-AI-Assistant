import { BrainCircuit } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-4 px-6 py-2">
      {/* Avatar */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-900/30">
        <BrainCircuit className="h-7 w-7 text-white" />
      </div>

      {/* Card */}
      <div className="flex-1 overflow-hidden rounded-[28px] border border-slate-700 bg-[#1E293B] shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            StudySphere AI
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Thinking...
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 animate-bounce rounded-full bg-violet-400" />

            <span
              className="h-3 w-3 animate-bounce rounded-full bg-violet-400"
              style={{ animationDelay: "150ms" }}
            />

            <span
              className="h-3 w-3 animate-bounce rounded-full bg-violet-400"
              style={{ animationDelay: "300ms" }}
            />

            <span className="ml-3 text-slate-300">
              Searching your PDFs...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;