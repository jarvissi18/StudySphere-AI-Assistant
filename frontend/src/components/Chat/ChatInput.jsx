import { ArrowUp } from "lucide-react";

function ChatInput({
  question,
  setQuestion,
  askQuestion,
  loading,
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-3 pb-4">

      <div
        className="
          rounded-3xl
          border
          border-slate-700
          bg-[#1E293B]
          shadow-[0_15px_40px_rgba(0,0,0,0.30)]
          transition-all
          duration-300
          focus-within:border-violet-500
          hover:border-slate-500
        "
      >

        <div className="flex items-end gap-3 p-3">

          {/* Textarea */}

          <textarea
            rows={1}
            value={question}
            disabled={loading}
            placeholder="Ask anything about your uploaded PDFs..."
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askQuestion();
              }
            }}
            className="
              flex-1
              resize-none
              bg-transparent
              text-white
              placeholder:text-slate-500
              outline-none
              text-[15px]
              leading-6
              min-h-[44px]
              max-h-40
              py-2
            "
          />

          {/* Send Button */}

          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              text-white
              shadow-lg
              transition
              duration-300
              hover:scale-105
              hover:shadow-violet-900/40
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <ArrowUp size={18} />
          </button>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

        <p>
          Press{" "}
          <span className="font-medium text-slate-300">
            Enter
          </span>{" "}
          to send •{" "}
          <span className="font-medium text-slate-300">
            Shift + Enter
          </span>{" "}
          for a new line
        </p>

        <p>
          AI responses may contain mistakes.
        </p>

      </div>

    </div>
  );
}

export default ChatInput;