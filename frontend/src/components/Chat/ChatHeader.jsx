import {
  BrainCircuit,
  FileText,
  Sparkles,
  Circle,
} from "lucide-react";

function ChatHeader({
  pdfCount,
}) {


  const aiReady = pdfCount > 0;

  return (

    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">

      <div className="mx-auto flex h-16 items-center justify-between px-6">

        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 shadow-lg">

            <BrainCircuit className="h-6 w-6 text-white"/>

          </div>

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-lg font-semibold text-white">
                AI Assistant
              </h2>

              <Sparkles
                size={15}
                className="text-yellow-400"
              />

            </div>

            <div className="mt-1 flex items-center gap-2">

              <Circle
                size={8}
                fill={aiReady ? "#22c55e" : "#ef4444"}
                className={
                  aiReady
                    ? "text-green-500"
                    : "text-red-500"
                }
              />

              <p className="text-xs text-slate-400">

                {aiReady
                  ? "AI Ready • Ask anything from your PDFs"
                  : "Upload a PDF to start chatting"}

              </p>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center gap-3">

          {/* PDF Count */}

          <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 lg:flex">

            <div className="rounded-lg bg-violet-500/10 p-2">

              <FileText
                size={17}
                className="text-violet-400"
              />

            </div>

            <div>

              <p className="text-[11px] uppercase tracking-wide text-slate-500">

                Documents

              </p>

              <p className="text-sm font-semibold text-white">

                {pdfCount} PDF{pdfCount !== 1 ? "s" : ""}

              </p>

            </div>

          </div>

          

        </div>

      </div>

    </header>

  );

}

export default ChatHeader;