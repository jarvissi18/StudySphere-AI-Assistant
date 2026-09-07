import {
  MessageSquare,
  Brain,
  FileText,
  StickyNote,
  Layers3,
} from "lucide-react";

function Tabs({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      id: "chat",
      label: "AI Chat",
      icon: MessageSquare,
      color: "violet",
    },
    {
      id: "quiz",
      label: "AI Quiz",
      icon: Brain,
      color: "pink",
    },
    {
      id: "summary",
      label: "Summary",
      icon: FileText,
      color: "blue",
    },
    {
      id: "notes",
      label: "Notes",
      icon: StickyNote,
      color: "amber",
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: Layers3,
      color: "emerald",
    },
  ];

  const activeClasses = {
    violet:
      "border-violet-400/15 bg-violet-500/10 text-violet-300",
    pink:
      "border-pink-400/15 bg-pink-500/10 text-pink-300",
    blue:
      "border-blue-400/15 bg-blue-500/10 text-blue-300",
    amber:
      "border-amber-400/15 bg-amber-500/10 text-amber-300",
    emerald:
      "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="border-b border-white/[0.06] bg-[#091020]/80 px-4 py-3 backdrop-blur-xl">

      <div className="flex gap-2 overflow-x-auto">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`
                flex
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                px-3.5
                py-2
                text-[11px]
                font-medium
                transition-all
                duration-200

                ${
                  active
                    ? activeClasses[tab.color]
                    : "border-transparent bg-white/[0.018] text-slate-500 hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-slate-300"
                }
              `}
            >

              <Icon
                size={15}
                strokeWidth={1.9}
              />

              {tab.label}

            </button>
          );
        })}

      </div>

    </div>
  );
}

export default Tabs;