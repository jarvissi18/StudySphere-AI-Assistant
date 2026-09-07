import ChatWindow from "../Chat/ChatWindow";

function ChatView({
  uploadedFiles,
  fetchFiles,
}) {
  return (
    <div
      className="
        h-full
        min-h-0
        w-full
        overflow-hidden
        bg-[#070d1a]
      "
    >
      <ChatWindow
        uploadedFiles={uploadedFiles}
        fetchFiles={fetchFiles}
      />
    </div>
  );
}

export default ChatView;