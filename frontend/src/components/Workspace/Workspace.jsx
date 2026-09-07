import DashboardHome from "./DashboardHome";
import ChatView from "./ChatView";
import QuizView from "./Quiz/QuizView";
import SummaryView from "./SummaryView";
import NotesView from "./NotesView";
import FlashcardsView from "./FlashcardsView";
import ProfileView from "../ProfileView";

function Workspace({
  uploadedFiles = [],
  fetchFiles,
  activeTab,
  setActiveTab,
}) {
  const renderView = () => {
    switch (activeTab) {
      case "chat":
        return (
          <ChatView
            uploadedFiles={uploadedFiles}
            fetchFiles={fetchFiles}
          />
        );

      case "quiz":
        return <QuizView />;

      case "summary":
        return <SummaryView />;

      case "notes":
        return <NotesView />;

      case "flashcards":
        return <FlashcardsView />;

      case "profile":
        return (
          <ProfileView
            onNavigate={setActiveTab}
          />
        );

      case "home":
      default:
        return (
          <DashboardHome
            uploadedFiles={uploadedFiles}
            fetchFiles={fetchFiles}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  const scrollableView =
    activeTab === "home" ||
    activeTab === "profile";

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        min-w-0
        w-full
        flex-1
        flex-col
        overflow-hidden
        bg-[#070d1a]
      "
    >
      <div
        className={`
          h-full
          min-h-0
          min-w-0
          w-full
          flex-1

          ${
            scrollableView
              ? `
                overflow-x-hidden
                overflow-y-auto
                overscroll-contain
              `
              : `
                overflow-hidden
              `
          }
        `}
      >
        {renderView()}
      </div>
    </section>
  );
}

export default Workspace;
