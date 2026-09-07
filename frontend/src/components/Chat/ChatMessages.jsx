import {
  BrainCircuit,
  Check,
  Copy,
  Loader2,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ============================================================
// CHAT MESSAGES
// ============================================================

function ChatMessages({
  messages = [],
  loading = false,
  messagesEndRef,
}) {
  const [copiedIndex, setCopiedIndex] =
    useState(null);

  // ==========================================================
  // COPY MESSAGE
  // ==========================================================

  const copyMessage = async (
    text,
    index
  ) => {
    try {
      await navigator.clipboard.writeText(
        String(text || "")
      );

      setCopiedIndex(index);

      window.setTimeout(() => {
        setCopiedIndex(null);
      }, 1800);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // ==========================================================
  // MARKDOWN COMPONENTS
  // ==========================================================

  const markdownComponents = {
    // --------------------------------------------------------
    // HEADINGS
    // --------------------------------------------------------

    h1: ({ children }) => (
      <h1
        className="
          mb-3
          mt-1
          text-[17px]
          font-bold
          tracking-[-0.025em]
          text-white
          sm:text-[19px]
        "
      >
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2
        className="
          mb-2.5
          mt-5
          text-[14px]
          font-semibold
          tracking-[-0.015em]
          text-white
          sm:text-[15px]
        "
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3
        className="
          mb-2
          mt-4
          text-[12px]
          font-semibold
          text-slate-200
          sm:text-[13px]
        "
      >
        {children}
      </h3>
    ),

    // --------------------------------------------------------
    // PARAGRAPH
    // --------------------------------------------------------

    p: ({ children }) => (
      <p
        className="
          mb-3
          text-[11px]
          leading-[1.8]
          text-slate-300
          last:mb-0
          sm:text-[12px]
        "
      >
        {children}
      </p>
    ),

    // --------------------------------------------------------
    // BOLD
    // --------------------------------------------------------

    strong: ({ children }) => (
      <strong
        className="
          font-semibold
          text-white
        "
      >
        {children}
      </strong>
    ),

    // --------------------------------------------------------
    // ITALIC
    // --------------------------------------------------------

    em: ({ children }) => (
      <em
        className="
          text-slate-200
        "
      >
        {children}
      </em>
    ),

    // --------------------------------------------------------
    // UNORDERED LIST
    // --------------------------------------------------------

    ul: ({ children }) => (
      <ul
        className="
          mb-4
          ml-4
          list-disc
          space-y-1.5
          pl-3
          text-[11px]
          leading-[1.75]
          text-slate-300
          sm:text-[12px]
        "
      >
        {children}
      </ul>
    ),

    // --------------------------------------------------------
    // ORDERED LIST
    // --------------------------------------------------------

    ol: ({ children }) => (
      <ol
        className="
          mb-4
          ml-4
          list-decimal
          space-y-1.5
          pl-3
          text-[11px]
          leading-[1.75]
          text-slate-300
          sm:text-[12px]
        "
      >
        {children}
      </ol>
    ),

    // --------------------------------------------------------
    // LIST ITEM
    // --------------------------------------------------------

    li: ({ children }) => (
      <li
        className="
          pl-1
          marker:text-violet-400
        "
      >
        {children}
      </li>
    ),

    // --------------------------------------------------------
    // INLINE / BLOCK CODE
    // --------------------------------------------------------

    code: ({
      inline,
      className,
      children,
      ...props
    }) => {
      if (inline) {
        return (
          <code
            className="
              rounded-md
              border
              border-white/[0.07]
              bg-white/[0.055]
              px-1.5
              py-0.5
              font-mono
              text-[10px]
              text-violet-300
              sm:text-[11px]
            "
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code
          className={`
            ${className || ""}
            block
            whitespace-pre
            font-mono
            text-[10px]
            leading-6
            text-slate-300
            sm:text-[11px]
          `}
          {...props}
        >
          {children}
        </code>
      );
    },

    // --------------------------------------------------------
    // CODE BLOCK
    // --------------------------------------------------------

    pre: ({ children }) => (
      <pre
        className="
          my-4
          overflow-x-auto
          rounded-xl
          border
          border-white/[0.07]
          bg-[#070b14]
          p-4
          shadow-inner
          [scrollbar-color:rgba(255,255,255,0.10)_transparent]
          [scrollbar-width:thin]
        "
      >
        {children}
      </pre>
    ),

    // --------------------------------------------------------
    // BLOCKQUOTE
    // --------------------------------------------------------

    blockquote: ({ children }) => (
      <blockquote
        className="
          my-4
          border-l-2
          border-violet-400/40
          bg-violet-500/[0.035]
          px-4
          py-2.5
          text-[11px]
          italic
          leading-6
          text-slate-400
          sm:text-[12px]
        "
      >
        {children}
      </blockquote>
    ),

    // --------------------------------------------------------
    // HORIZONTAL RULE
    // --------------------------------------------------------

    hr: () => (
      <hr
        className="
          my-5
          border-0
          border-t
          border-white/[0.06]
        "
      />
    ),

    // --------------------------------------------------------
    // LINKS
    // --------------------------------------------------------

    a: ({
      href,
      children,
    }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="
          text-violet-300
          underline
          decoration-violet-400/30
          underline-offset-2
          transition
          hover:text-violet-200
        "
      >
        {children}
      </a>
    ),

    // --------------------------------------------------------
    // TABLE
    // --------------------------------------------------------

    table: ({ children }) => (
      <div
        className="
          my-4
          overflow-x-auto
          rounded-xl
          border
          border-white/[0.07]
        "
      >
        <table
          className="
            min-w-full
            border-collapse
            text-left
            text-[10px]
            sm:text-[11px]
          "
        >
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead
        className="
          bg-white/[0.035]
        "
      >
        {children}
      </thead>
    ),

    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),

    tr: ({ children }) => (
      <tr
        className="
          border-b
          border-white/[0.055]
          last:border-b-0
        "
      >
        {children}
      </tr>
    ),

    th: ({ children }) => (
      <th
        className="
          whitespace-nowrap
          px-3
          py-2.5
          font-semibold
          text-slate-200
        "
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td
        className="
          px-3
          py-2.5
          align-top
          leading-5
          text-slate-400
        "
      >
        {children}
      </td>
    ),
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[900px]
        px-4
        py-6
        sm:px-6
        sm:py-8
      "
    >
      <div
        className="
          space-y-7
        "
      >
        {messages.map(
          (message, index) => {
            const isUser =
              message.role === "user";

            const isError =
              Boolean(message.isError);

            return (
              <div
                key={`${message.role}-${index}`}
                className={`
                  group
                  flex
                  gap-3
                  ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >
                {/* =================================================
                    AI AVATAR
                ================================================= */}

                {!isUser && (
                  <div
                    className="
                      relative
                      mt-1
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-lg
                      bg-gradient-to-br
                      from-violet-500
                      to-indigo-600
                      text-white
                      shadow-[0_7px_22px_rgba(124,58,237,0.18)]
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                        bg-white/[0.08]
                      "
                    />

                    <BrainCircuit
                      size={14}
                      strokeWidth={1.9}
                      className="relative"
                    />
                  </div>
                )}

                {/* =================================================
                    MESSAGE CONTENT
                ================================================= */}

                <div
                  className={`
                    min-w-0
                    max-w-[82%]
                    sm:max-w-[76%]

                    ${
                      isUser
                        ? `
                          rounded-2xl
                          rounded-tr-md
                          border
                          border-violet-400/15
                          bg-gradient-to-br
                          from-violet-500/[0.12]
                          to-indigo-500/[0.08]
                          px-4
                          py-3
                        `
                        : `
                          relative
                          rounded-2xl
                          rounded-tl-md
                          border
                          ${
                            isError
                              ? `
                                border-red-400/10
                                bg-red-500/[0.045]
                              `
                              : `
                                border-white/[0.055]
                                bg-[#0b1426]
                              `
                          }
                          px-4
                          py-3.5
                        `
                    }
                  `}
                >
                  {/* =================================================
                      USER MESSAGE
                  ================================================= */}

                  {isUser ? (
                    <p
                      className="
                        whitespace-pre-wrap
                        break-words
                        text-[11px]
                        leading-6
                        text-slate-200
                        sm:text-[12px]
                      "
                    >
                      {message.text}
                    </p>
                  ) : isError ? (
                    /* =================================================
                       ERROR MESSAGE
                    ================================================= */

                    <p
                      className="
                        whitespace-pre-wrap
                        break-words
                        text-[11px]
                        leading-6
                        text-red-300
                        sm:text-[12px]
                      "
                    >
                      {message.text}
                    </p>
                  ) : (
                    /* =================================================
                       AI MARKDOWN MESSAGE
                    ================================================= */

                    <div
                      className="
                        min-w-0
                        break-words
                      "
                    >
                      <ReactMarkdown
                        remarkPlugins={[
                          remarkGfm,
                        ]}
                        components={
                          markdownComponents
                        }
                      >
                        {String(
                          message.text || ""
                        )}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* =================================================
                      COPY BUTTON
                  ================================================= */}

                  {!isUser &&
                    !isError &&
                    String(
                      message.text || ""
                    ).trim() !== "" && (
                      <button
                        type="button"
                        onClick={() =>
                          copyMessage(
                            message.text,
                            index
                          )
                        }
                        title={
                          copiedIndex === index
                            ? "Copied"
                            : "Copy response"
                        }
                        className="
                          mt-3
                          inline-flex
                          h-7
                          items-center
                          gap-1.5
                          rounded-lg
                          border
                          border-white/[0.055]
                          bg-white/[0.025]
                          px-2.5
                          text-[8px]
                          font-medium
                          text-slate-600
                          transition
                          hover:border-white/[0.10]
                          hover:bg-white/[0.045]
                          hover:text-slate-300
                        "
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check
                              size={11}
                            />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy
                              size={11}
                            />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                </div>

                {/* =================================================
                    USER AVATAR
                ================================================= */}

                {isUser && (
                  <div
                    className="
                      mt-1
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/[0.06]
                      bg-white/[0.035]
                      text-slate-500
                    "
                  >
                    <UserRound
                      size={14}
                    />
                  </div>
                )}
              </div>
            );
          }
        )}

        {/* ========================================================
            THINKING INDICATOR
        ======================================================== */}

        {loading && (
          <div
            className="
              flex
              items-start
              gap-3
            "
          >
            <div
              className="
                relative
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-lg
                bg-gradient-to-br
                from-violet-500
                to-indigo-600
                text-white
                shadow-[0_7px_22px_rgba(124,58,237,0.18)]
              "
            >
              <BrainCircuit
                size={14}
                strokeWidth={1.9}
              />
            </div>

            <div
              className="
                flex
                items-center
                gap-2.5
                rounded-2xl
                rounded-tl-md
                border
                border-white/[0.055]
                bg-[#0b1426]
                px-4
                py-3
              "
            >
              <Loader2
                size={13}
                className="
                  animate-spin
                  text-violet-400
                "
              />

              <span
                className="
                  text-[9px]
                  font-medium
                  text-slate-600
                "
              >
                Thinking...
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            SCROLL ANCHOR
        ======================================================== */}

        <div
          ref={messagesEndRef}
          className="h-px"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default ChatMessages;