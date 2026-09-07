import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Workspace from "../../components/Workspace/Workspace";

import api from "../../services/api";

function Home() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============================================================
  // FETCH FILES
  // ============================================================

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");

      if (response?.data?.success) {
        setUploadedFiles(response.data.files || []);
      }
    } catch (error) {
      console.error("Unable to fetch files:", error);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchFiles();
  }, []);

  // ============================================================
  // GLOBAL NAVIGATION
  // ============================================================

  useEffect(() => {
    const handleNavigation = (event) => {
      const target = event?.detail;

      const validTabs = [
        "home",
        "chat",
        "quiz",
        "summary",
        "notes",
        "flashcards",
        "documents",
      ];

      if (!validTabs.includes(target)) {
        return;
      }

      setActiveTab(target);
      setSidebarOpen(false);
    };

    window.addEventListener(
      "studysphere:navigate",
      handleNavigation
    );

    return () => {
      window.removeEventListener(
        "studysphere:navigate",
        handleNavigation
      );
    };
  }, []);

  // ============================================================
  // GLOBAL SEARCH
  // ============================================================

  useEffect(() => {
    const handleSearch = (event) => {
      const query = event?.detail;

      if (!query) return;

      setActiveTab("chat");
      setSidebarOpen(false);

      window.dispatchEvent(
        new CustomEvent("studysphere:search-query", {
          detail: query,
        })
      );
    };

    window.addEventListener(
      "studysphere:search",
      handleSearch
    );

    return () => {
      window.removeEventListener(
        "studysphere:search",
        handleSearch
      );
    };
  }, []);

  // ============================================================
  // RESPONSIVE SIDEBAR
  // ============================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ============================================================
  // BODY LOCK WHEN MOBILE SIDEBAR OPEN
  // ============================================================

  useEffect(() => {
    document.body.style.overflow = sidebarOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#050b17] text-white">

      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="
          absolute
          -left-40
          -top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-violet-600/[0.045]
          blur-[140px]
        " />

        <div className="
          absolute
          -bottom-52
          -right-52
          h-[550px]
          w-[550px]
          rounded-full
          bg-indigo-500/[0.035]
          blur-[150px]
        " />

      </div>

      <div className="relative z-10 flex h-full min-h-0">

        {/* ======================================================
            MOBILE OVERLAY
        ====================================================== */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="
              fixed
              inset-0
              z-[60]
              bg-black/65
              backdrop-blur-[2px]
              lg:hidden
            "
          />
        )}

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`
            fixed
            inset-y-0
            left-0
            z-[70]
            w-[286px]
            shrink-0
            transition-transform
            duration-300
            ease-out

            lg:relative
            lg:z-auto
            lg:translate-x-0

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          {/* Mobile close */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="
              absolute
              right-3
              top-3
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.08]
              bg-[#0a1120]
              text-slate-500
              transition
              hover:text-white
              lg:hidden
            "
          >
            <X size={15} />
          </button>

          <Sidebar
            uploadedFiles={uploadedFiles}
            fetchFiles={fetchFiles}
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />

        </aside>

        {/* ======================================================
            MAIN APPLICATION
        ====================================================== */}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">

          {/* ====================================================
              MOBILE HEADER ONLY
          ==================================================== */}

          <div className="
            relative
            flex
            h-14
            shrink-0
            items-center
            border-b
            border-white/[0.06]
            bg-[#070d1a]/95
            px-4
            lg:hidden
          ">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                text-slate-400
                transition
                hover:border-violet-400/20
                hover:text-white
              "
            >
              <Menu size={17} />
            </button>

            <div className="ml-3">

              <p className="text-[11px] font-semibold text-white">
                StudySphere AI
              </p>

              <p className="text-[7px] text-slate-600">
                Intelligent study workspace
              </p>

            </div>

          </div>

          {/* ====================================================
              WORKSPACE
          ==================================================== */}

          <main className="min-h-0 min-w-0 flex-1 overflow-hidden">

            <Workspace
              uploadedFiles={uploadedFiles}
              fetchFiles={fetchFiles}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

          </main>

        </div>

      </div>
    </div>
  );
}

export default Home;