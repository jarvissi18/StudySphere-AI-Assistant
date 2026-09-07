import {
  BrainCircuit,
  User,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageBubble({
  message,
}) {
  const [copied, setCopied] = useState(false);

  const isAI =
    message.role === "assistant";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(
        message.text || ""
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // ============================================================
  // USER MESSAGE
  // ============================================================

  if (!isAI) {
    return (
      <div className="flex justify-end">

        <div className="flex max-w-[86%] items-end gap-2.5 sm:max-w-[75%]">

          {/* User message */}

          <div className="rounded-2xl rounded-br-md border border-blue-400/15 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-4 py-3 shadow-[0_10px_30px_rgba(37,99,235,0.16)]">

            <div className="mb-1 flex items-center gap-1.5">

              <User
                size={10}
                className="text-blue-100"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-blue-100/80">
                You
              </span>

            </div>

            <p className="whitespace-pre-wrap text-[12px] leading-6 text-white">
              {message.text}
            </p>

          </div>

          {/* Avatar */}

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">

            <User size={14} />

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // AI MESSAGE
  // ============================================================

  return (
    <div className="flex w-full items-start gap-3">

      {/* AI avatar */}

      <div className="relative hidden shrink-0 sm:block">

        <div className="absolute inset-0 rounded-xl bg-violet-500/20 blur-lg" />

        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_8px_25px_rgba(124,58,237,0.20)]">

          <BrainCircuit
            size={17}
            className="text-white"
          />

        </div>

      </div>

      {/* Message body */}

      <div
        className={`
          min-w-0
          flex-1
          overflow-hidden
          rounded-2xl
          rounded-tl-md
          border
          ${
            message.isError
              ? "border-red-400/15 bg-red-500/[0.035]"
              : "border-white/[0.07] bg-[#0b1426]/90"
          }
          shadow-[0_12px_35px_rgba(0,0,0,0.16)]
        `}
      >

        {/* ======================================================
            MESSAGE HEADER
        ====================================================== */}

        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">

          <div className="flex items-center gap-2">

            <span
              className={`
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                ${
                  message.isError
                    ? "bg-red-500/10 text-red-400"
                    : "bg-violet-500/10 text-violet-300"
                }
              `}
            >

              {message.isError ? (
                <AlertCircle size={14} />
              ) : (
                <Sparkles size={14} />
              )}

            </span>

            <div>

              <p className="text-[10px] font-semibold text-slate-200">

                {message.isError
                  ? "System message"
                  : "StudySphere AI"}

              </p>

              <p className="mt-0.5 text-[8px] text-slate-700">

                {message.isError
                  ? "Request could not be completed"
                  : "Generated from your study context"}

              </p>

            </div>

          </div>

          {/* Copy */}

          {!message.isError && (
            <button
              type="button"
              onClick={copyMessage}
              title="Copy response"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                border
                border-white/[0.06]
                bg-white/[0.02]
                text-slate-600
                transition-all
                duration-200
                hover:border-violet-400/15
                hover:bg-violet-500/[0.05]
                hover:text-slate-300
              "
            >

              {copied ? (
                <Check
                  size={13}
                  className="text-emerald-400"
                />
              ) : (
                <Copy size={13} />
              )}

            </button>
          )}

        </div>

        {/* ======================================================
            MARKDOWN CONTENT
        ====================================================== */}

        <div
          className={`
            prose
            prose-invert
            max-w-none
            px-4
            py-4
            text-[12px]
            leading-6

            prose-headings:mb-3
            prose-headings:mt-5
            prose-headings:font-semibold
            prose-headings:text-white

            prose-p:my-2
            prose-p:text-slate-300

            prose-strong:text-white

            prose-li:my-1
            prose-li:text-slate-300

            prose-ul:my-2
            prose-ol:my-2

            prose-blockquote:border-violet-400
            prose-blockquote:bg-violet-500/[0.04]
            prose-blockquote:text-slate-400

            prose-a:text-cyan-400
            prose-a:no-underline
            hover:prose-a:underline

            prose-code:rounded
            prose-code:bg-violet-500/[0.07]
            prose-code:px-1
            prose-code:py-0.5
            prose-code:text-violet-300

            prose-pre:overflow-x-auto
            prose-pre:rounded-xl
            prose-pre:border
            prose-pre:border-white/[0.06]
            prose-pre:bg-[#060b16]
            prose-pre:p-4

            prose-th:border-white/[0.08]
            prose-th:text-white

            prose-td:border-white/[0.06]
            prose-td:text-slate-300

            ${
              message.isError
                ? "text-red-300"
                : ""
            }
          `}
        >

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {message.text || ""}
          </ReactMarkdown>

        </div>

      </div>

    </div>
  );
}

export default MessageBubble;