import {
  BrainCircuit,
  User,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);

  const isAI = message.role === "assistant";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex w-full animate-in fade-in duration-300 ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI ? (
        <div className="flex w-full gap-4">
          {/* Avatar */}

          <div className="sticky top-2 hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30 sm:flex">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>

          {/* Message */}

          <div className="group w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">

              <div>

                <h3 className="text-sm font-semibold text-white">
                  AI Assistant
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Generated from your uploaded documents
                </p>

              </div>

              <button
                onClick={copyMessage}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-800
                  transition-all
                  duration-200
                  hover:border-violet-500
                  hover:bg-slate-700
                "
                title="Copy"
              >
                {copied ? (
                  <Check
                    size={16}
                    className="text-green-400"
                  />
                ) : (
                  <Copy
                    size={16}
                    className="text-slate-300"
                  />
                )}
              </button>

            </div>

            {/* Markdown */}

            <div
              className="
                prose
                prose-invert
                prose-headings:text-white
                prose-p:text-slate-300
                prose-strong:text-white
                prose-code:text-violet-300
                prose-pre:bg-slate-950
                prose-pre:border
                prose-pre:border-slate-700
                prose-pre:rounded-xl
                prose-blockquote:border-violet-500
                prose-blockquote:text-slate-300
                prose-a:text-cyan-400
                prose-li:text-slate-300
                prose-th:text-white
                prose-td:text-slate-300
                max-w-none
                px-6
                py-5
              "
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex max-w-3xl items-end gap-3">

          {/* User Bubble */}

          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-6 py-4 shadow-lg">

            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
              You
            </p>

            <p className="whitespace-pre-wrap leading-7 text-white">
              {message.text}
            </p>

          </div>

          {/* Avatar */}

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
            <User className="h-5 w-5 text-white" />
          </div>

        </div>
      )}
    </div>
  );
}

export default MessageBubble;