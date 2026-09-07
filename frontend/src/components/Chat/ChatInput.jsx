import {
  ArrowUp,
  Paperclip,
  Loader2,
} from "lucide-react";

function ChatInput({
  question,
  setQuestion,
  askQuestion,
  loading,
}) {
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading && question.trim()) {
        askQuestion();
      }
    }
  };

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[900px]
        px-4
        pb-4
        pt-2
        sm:px-6
      "
    >

      {/* =====================================================
          INPUT BAR
      ===================================================== */}

      <div
        className="
          relative
          flex
          min-h-[48px]
          items-center
          gap-2
          overflow-hidden
          rounded-xl
          border
          border-white/[0.07]
          bg-[#101a2d]
          px-3
          shadow-[0_10px_35px_rgba(0,0,0,0.18)]
          transition-all
          duration-200
          focus-within:border-violet-400/15
          focus-within:bg-[#111c31]
          focus-within:shadow-[0_12px_40px_rgba(124,58,237,0.06)]
        "
      >

        {/* ==================================================
            ATTACHMENT
        ================================================== */}

        <button
          type="button"
          disabled={loading}
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-700
            transition
            hover:bg-white/[0.035]
            hover:text-slate-400
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
          aria-label="Attach document"
        >
          <Paperclip size={13} />
        </button>

        {/* ==================================================
            TEXTAREA
        ================================================== */}

        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1}
          placeholder="Type your question here..."
          className="
            max-h-[100px]
            min-h-[30px]
            flex-1
            resize-none
            overflow-y-auto
            bg-transparent
            py-1.5
            text-[9px]
            leading-5
            text-slate-300
            outline-none
            placeholder:text-slate-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        {/* ==================================================
            SEND
        ================================================== */}

        <button
          type="button"
          onClick={() => askQuestion()}
          disabled={
            loading ||
            !question.trim()
          }
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-violet-500
            to-indigo-600
            text-white
            shadow-[0_6px_18px_rgba(124,58,237,0.22)]
            transition-all
            duration-200
            hover:scale-[1.05]
            hover:shadow-[0_8px_22px_rgba(124,58,237,0.30)]
            active:scale-[0.95]
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
          aria-label="Send message"
        >

          {loading ? (
            <Loader2
              size={13}
              className="animate-spin"
            />
          ) : (
            <ArrowUp size={14} />
          )}

        </button>

      </div>

      {/* =====================================================
          SMALL FOOTER
      ===================================================== */}

      <p
        className="
          mt-1.5
          text-center
          text-[6px]
          text-slate-800
        "
      >
        AI responses may contain mistakes.
      </p>

    </div>
  );
}

export default ChatInput;