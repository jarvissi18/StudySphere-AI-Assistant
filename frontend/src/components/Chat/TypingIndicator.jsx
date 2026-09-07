import {
  BrainCircuit,
  Sparkles,
} from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">

      {/* ======================================================
          AI AVATAR
      ====================================================== */}

      <div className="relative hidden shrink-0 sm:block">

        <div className="absolute inset-0 rounded-xl bg-violet-500/20 blur-lg" />

        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500 to-indigo-600">

          <BrainCircuit
            size={17}
            className="text-white"
          />

        </div>

      </div>

      {/* ======================================================
          TYPING CARD
      ====================================================== */}

      <div className="flex-1 rounded-2xl rounded-tl-md border border-white/[0.07] bg-[#0b1426]/90 shadow-[0_12px_35px_rgba(0,0,0,0.16)]">

        {/* Header */}

        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">

            <Sparkles size={13} />

          </div>

          <div>

            <p className="text-[10px] font-semibold text-slate-200">
              StudySphere AI
            </p>

            <p className="mt-0.5 text-[8px] text-slate-700">
              Thinking...
            </p>

          </div>

        </div>

        {/* Body */}

        <div className="px-4 py-5">

          <div className="flex items-center gap-2.5">

            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />

            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />

            <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />

            <span className="ml-1 text-[10px] text-slate-600">
              Searching your study materials...
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default TypingIndicator;