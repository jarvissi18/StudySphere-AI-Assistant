import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}) {

  return (

    <div
      className="
        mx-auto
        flex
        w-full
        max-w-5xl
        flex-col
        gap-6
        px-6
        py-8
        animate-in
        fade-in
        duration-300
      "
    >

      {/* ================= Empty ================= */}

      {!loading && messages.length === 0 && (

        <div className="flex flex-1 items-center justify-center py-20">

          <div className="text-center">

            <div className="mb-4 text-6xl">
              🤖
            </div>

            <h2 className="text-2xl font-bold text-white">
              Start a Conversation
            </h2>

            <p className="mt-3 text-slate-400">
              Ask anything from your uploaded study material.
            </p>

          </div>

        </div>

      )}

      {/* ================= Messages ================= */}

      {messages.map((message, index) => (

        <div
          key={message.id ?? `${message.role}-${index}`}
          className="
            animate-in
            fade-in
            slide-in-from-bottom-2
            duration-300
          "
        >

          <MessageBubble
            message={message}
          />

        </div>

      ))}

      {/* ================= Typing ================= */}

      {loading && (

        <div
          className="
            animate-in
            fade-in
            slide-in-from-bottom-2
            duration-300
          "
        >

          <TypingIndicator />

        </div>

      )}

      {/* ================= Scroll Target ================= */}

      <div
        ref={messagesEndRef}
        className="h-4"
      />

    </div>

  );

}

export default ChatMessages;