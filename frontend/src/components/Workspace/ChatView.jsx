import ChatWindow from "../Chat/ChatWindow";

function ChatView({
  uploadedFiles,
  fetchFiles,
}) {

  return (

    <div className="min-h-full bg-[#0B1120]">

      <ChatWindow
        uploadedFiles={uploadedFiles}
        fetchFiles={fetchFiles}
      />

    </div>

  );

}

export default ChatView;