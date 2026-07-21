import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../services/api";

import ChatHeader from "./ChatHeader";
import WelcomeHero from "./WelcomeHero";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

function ChatWindow({
  uploadedFiles,
  fetchFiles,
}) {

  // =====================================================
  // State
  // =====================================================

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Global PDF Count

  const pdfCount = uploadedFiles.length;

  const messagesEndRef = useRef(null);

  
  
  // =====================================================
  // Auto Scroll
  // =====================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior: "smooth",

      block: "end",

    });

  }, [messages, loading]);

  
  // =====================================================
  // Typewriter Animation
  // =====================================================

  const typeAnswer = useCallback((answer) => {

    let index = 0;

    setMessages((prev) => [

      ...prev,

      {

        role: "assistant",

        text: "",

      },

    ]);

    const interval = setInterval(() => {

      index++;

      setMessages((prev) => {

        const updated = [...prev];

        updated[updated.length - 1] = {

          role: "assistant",

          text: answer.slice(0, index),

        };

        return updated;

      });

      if (index >= answer.length) {

        clearInterval(interval);

      }

    }, 8);

  }, []);

  // =====================================================
  // Ask AI
  // =====================================================

  const askQuestion = async (customQuestion = null) => {

    const finalQuestion = customQuestion || question.trim();

    if (!finalQuestion || loading) return;

    if (!customQuestion) {

      setQuestion("");

    }

    setMessages((prev) => [

      ...prev,

      {

        role: "user",

        text: finalQuestion,

      },

    ]);

    try {

      setLoading(true);

      const { data } = await api.post("/ask", {

        question: finalQuestion,

      });

      if (!data.success) {

        setMessages((prev) => [

          ...prev,

          {

            role: "assistant",

            text: data.message,

            isError: true,

          },

        ]);

        return;

      }

      typeAnswer(data.answer);

     
    } catch (error) {

      console.error(error);

      setMessages((prev) => [

        ...prev,

        {

          role: "assistant",

          text: "⚠️ Something went wrong while generating the response.",

          isError: true,

        },

      ]);

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // Render
  // =====================================================
    return (

    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-slate-950
      "
    >

      {/* ================= Header ================= */}

      <div className="shrink-0">

        <ChatHeader
    pdfCount={pdfCount}
    />

      </div>

      {/* ================= Chat Area ================= */}

      <main
        className="
          flex-1
          min-h-0
          overflow-y-auto
          scroll-smooth
        "
      >

        {messages.length === 0 ? (

          <WelcomeHero />

        ) : (

          <ChatMessages
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />

        )}

      </main>

      {/* ================= Input ================= */}

      <div
        className="
          shrink-0
          border-t
          border-slate-800
          bg-slate-950/90
          backdrop-blur-xl
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