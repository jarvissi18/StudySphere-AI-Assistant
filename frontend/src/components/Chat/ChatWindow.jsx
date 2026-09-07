import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BrainCircuit,
} from "lucide-react";

import api from "../../services/api";

import WelcomeHero from "./WelcomeHero";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

function ChatWindow({
  uploadedFiles = [],
  fetchFiles,
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const pdfCount = uploadedFiles.length;

  // ============================================================
  // AUTO SCROLL
  // ============================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // ============================================================
  // CLEANUP
  // ============================================================

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ============================================================
  // ASK AI - REAL STREAMING
  // ============================================================

  const askQuestion = async (customQuestion = null) => {
    const finalQuestion =
      typeof customQuestion === "string"
        ? customQuestion.trim()
        : question.trim();

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!finalQuestion || loading) {
      return;
    }

    // ----------------------------------------------------------
    // CLEAR INPUT
    // ----------------------------------------------------------

    setQuestion("");

    // ----------------------------------------------------------
    // ADD USER MESSAGE
    // ----------------------------------------------------------

    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: finalQuestion,
      },
    ]);

    // ----------------------------------------------------------
    // START THINKING
    //
    // Assistant message is created only after the first
    // streaming chunk arrives.
    // ----------------------------------------------------------

    setLoading(true);

    // ----------------------------------------------------------
    // CREATE ABORT CONTROLLER
    // ----------------------------------------------------------

    const controller = new AbortController();

    abortControllerRef.current = controller;

    try {
      // ========================================================
      // API URL
      // ========================================================

      const baseURL =
        api?.defaults?.baseURL ||
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000";

      const token =
        localStorage.getItem("access_token");

      console.log(
        "[AI CHAT] Starting stream..."
      );

      console.log(
        "[AI CHAT] API:",
        `${baseURL}/ask`
      );

      // ========================================================
      // STREAM REQUEST
      // ========================================================

      const response = await fetch(
        `${baseURL}/ask`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            question: finalQuestion,
          }),

          signal: controller.signal,
        }
      );

      // ========================================================
      // HTTP ERROR
      // ========================================================

      if (!response.ok) {
        let errorMessage =
          `Request failed with status ${response.status}.`;

        try {
          const contentType =
            response.headers.get(
              "content-type"
            );

          if (
            contentType?.includes(
              "application/json"
            )
          ) {
            const errorData =
              await response.json();

            errorMessage =
              errorData?.detail ||
              errorData?.message ||
              errorMessage;
          } else {
            const text =
              await response.text();

            if (text?.trim()) {
              errorMessage =
                text.trim();
            }
          }
        } catch {
          // Ignore response parsing errors.
        }

        throw new Error(errorMessage);
      }

      // ========================================================
      // STREAM BODY CHECK
      // ========================================================

      if (!response.body) {
        throw new Error(
          "Streaming is not supported by this browser."
        );
      }

      // ========================================================
      // STREAM READER
      // ========================================================

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder("utf-8");

      let receivedText = "";
      let assistantMessageCreated = false;

      // ========================================================
      // READ STREAM
      // ========================================================

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        // ------------------------------------------------------
        // STREAM FINISHED
        // ------------------------------------------------------

        if (done) {
          break;
        }

        if (!value) {
          continue;
        }

        // ------------------------------------------------------
        // DECODE CHUNK
        // ------------------------------------------------------

        const chunk =
          decoder.decode(
            value,
            {
              stream: true,
            }
          );

        if (!chunk) {
          continue;
        }

        receivedText += chunk;

        // ======================================================
        // FIRST CHUNK
        // ======================================================

        if (!assistantMessageCreated) {
          assistantMessageCreated = true;

          // Hide thinking indicator.
          setLoading(false);

          // Create assistant message with actual content.
          setMessages((previous) => [
            ...previous,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              text: chunk,
            },
          ]);

          console.log(
            "[AI CHAT] First chunk received."
          );

          continue;
        }

        // ======================================================
        // NEXT CHUNKS
        // ======================================================

        setMessages((previous) => {
          if (previous.length === 0) {
            return previous;
          }

          const updated = [
            ...previous,
          ];

          const lastIndex =
            updated.length - 1;

          const lastMessage =
            updated[lastIndex];

          // ----------------------------------------------------
          // SAFETY CHECK
          // ----------------------------------------------------

          if (
            lastMessage.role !==
            "assistant"
          ) {
            return previous;
          }

          // ----------------------------------------------------
          // APPEND STREAMED TEXT
          // ----------------------------------------------------

          updated[lastIndex] = {
            ...lastMessage,
            text:
              `${lastMessage.text || ""}${chunk}`,
          };

          return updated;
        });
      }

      // ========================================================
      // FLUSH DECODER
      // ========================================================

      const remainingText =
        decoder.decode();

      if (remainingText) {
        receivedText += remainingText;

        // ------------------------------------------------------
        // FIRST CONTENT DURING FLUSH
        // ------------------------------------------------------

        if (!assistantMessageCreated) {
          assistantMessageCreated = true;

          setLoading(false);

          setMessages((previous) => [
            ...previous,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              text: remainingText,
            },
          ]);
        } else {
          // ----------------------------------------------------
          // APPEND REMAINING TEXT
          // ----------------------------------------------------

          setMessages((previous) => {
            if (previous.length === 0) {
              return previous;
            }

            const updated = [
              ...previous,
            ];

            const lastIndex =
              updated.length - 1;

            const lastMessage =
              updated[lastIndex];

            if (
              lastMessage.role !==
              "assistant"
            ) {
              return previous;
            }

            updated[lastIndex] = {
              ...lastMessage,
              text:
                `${lastMessage.text || ""}${remainingText}`,
            };

            return updated;
          });
        }
      }

      // ========================================================
      // EMPTY RESPONSE
      // ========================================================

      if (!receivedText.trim()) {
        setMessages((previous) => [
          ...previous,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: "No response generated.",
            isError: true,
          },
        ]);
      }

      console.log(
        "[AI CHAT] Stream completed successfully."
      );
    } catch (error) {
      // ========================================================
      // ABORTED
      // ========================================================

      if (
        error?.name ===
        "AbortError"
      ) {
        console.log(
          "[AI CHAT] Request aborted."
        );

        return;
      }

      // ========================================================
      // ERROR LOG
      // ========================================================

      console.error(
        "[AI CHAT ERROR]",
        error
      );

      // ========================================================
      // STOP THINKING
      // ========================================================

      setLoading(false);

      // ========================================================
      // SHOW ERROR
      // ========================================================

      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text:
            error?.message ||
            "Something went wrong while generating the response.",
          isError: true,
        },
      ]);
    } finally {
      // ========================================================
      // FINISH
      // ========================================================

      setLoading(false);

      abortControllerRef.current =
        null;
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-[#070d1a]
      "
    >
      {/* ======================================================
          CHAT HEADER
      ====================================================== */}

      <header
        className="
          flex
          h-[58px]
          shrink-0
          items-center
          justify-between
          border-b
          border-white/[0.055]
          bg-[#070d1a]
          px-4
          sm:px-6
        "
      >
        {/* LEFT */}

        <div className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-gradient-to-br
              from-pink-500
              to-rose-600
              text-white
              shadow-[0_7px_22px_rgba(236,72,153,0.20)]
            "
          >
            <BrainCircuit
              size={15}
              strokeWidth={2}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1
                className="
                  text-[12px]
                  font-semibold
                  text-white
                "
              >
                AI Chat
              </h1>

              <span
                className="
                  hidden
                  rounded-full
                  border
                  border-pink-400/10
                  bg-pink-500/[0.05]
                  px-1.5
                  py-0.5
                  text-[5px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-pink-300
                  sm:inline-flex
                "
              >
                AI Assistant
              </span>
            </div>

            <p
              className="
                mt-0.5
                text-[7px]
                text-slate-700
              "
            >
              Ask anything about your study materials
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-emerald-400/10
            bg-emerald-400/[0.035]
            px-2.5
            py-1.5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-400
              shadow-[0_0_7px_rgba(52,211,153,0.7)]
            "
          />

          <span
            className="
              text-[6px]
              font-medium
              text-emerald-300
            "
          >
            AI Ready
          </span>
        </div>
      </header>

      {/* ======================================================
          MAIN CHAT AREA
      ====================================================== */}

      <main
        className="
          relative
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          scroll-smooth
          [scrollbar-width:thin]
          [scrollbar-color:rgba(255,255,255,0.10)_transparent]
        "
      >
        {messages.length === 0 ? (
          <WelcomeHero
            pdfCount={pdfCount}
            onAsk={askQuestion}
          />
        ) : (
          <ChatMessages
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />
        )}
      </main>

      {/* ======================================================
          BOTTOM INPUT
      ====================================================== */}

      <div
        className="
          shrink-0
          bg-[#070d1a]
        "
      >
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          loading={loading}
          pdfCount={pdfCount}
        />
      </div>
    </div>
  );
}

export default ChatWindow;