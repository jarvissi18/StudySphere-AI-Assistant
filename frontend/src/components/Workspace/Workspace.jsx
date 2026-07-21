import { useState } from "react";

import Tabs from "./Tabs";

import ChatView from "./ChatView";
import QuizView from "./Quiz/QuizView";
import SummaryView from "./SummaryView";
import NotesView from "./NotesView";
import FlashcardsView from "./FlashcardsView";

function Workspace({
  uploadedFiles,
  fetchFiles,
}) {

  const [activeTab, setActiveTab] = useState("chat");

  const renderView = () => {

    switch (activeTab) {

      case "quiz":
        return <QuizView />;

      case "summary":
        return <SummaryView />;

      case "notes":
        return <NotesView />;

      case "flashcards":
        return <FlashcardsView />;

      default:
        return (
          <ChatView
            uploadedFiles={uploadedFiles}
            fetchFiles={fetchFiles}
          />
        );

    }

  };

  return (

    <section
      className="
        flex
        flex-1
        h-full
        min-h-0
        min-w-0
        flex-col
        overflow-hidden
        bg-[#0B1120]
      "
    >

      {/* Tabs */}

      <div className="shrink-0 border-b border-slate-800">

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

      </div>

      {/* Content */}

      <div
        className="
          flex-1
          min-h-0
          min-w-0
          overflow-y-auto
        "
      >

        {renderView()}

      </div>

    </section>

  );

}

export default Workspace;