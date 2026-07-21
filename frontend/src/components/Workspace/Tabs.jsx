function Tabs({ activeTab, setActiveTab }) {

  const tabs = [

    { id: "chat", label: "💬 Chat" },
    { id: "quiz", label: "🧠 AI Quiz" },
    { id: "summary", label: "📄 Summary" },
    { id: "notes", label: "📝 Notes" },
    { id: "flashcards", label: "🎴 Flashcards" }

  ];

  return (

    <div className="border-b border-slate-800 bg-[#111827] px-8 py-4">

      <div className="flex gap-4">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl transition-all font-medium ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

    </div>

  );

}

export default Tabs;