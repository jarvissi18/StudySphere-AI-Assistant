import { useEffect, useMemo, useRef, useState } from "react";

import {
  BrainCircuit,
  Home,
  MessageSquare,
  Brain,
  FileText,
  StickyNote,
  Layers3,
  ChevronRight,
  ChevronDown,
  Loader2,
  UserRound,
  LogOut,
  X,
} from "lucide-react";

import { getCurrentUser } from "../../services/api";

function Sidebar({
  activeTab = "home",
  onNavigate,
  onLogout,
}) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // ============================================================
  // LOAD CURRENT LOGGED-IN USER
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        setUserLoading(true);

        const response = await getCurrentUser();

        if (cancelled) return;

        const currentUser =
          response?.user ||
          response?.data ||
          response ||
          null;

        setUser(currentUser);
      } catch (error) {
        console.error("[SIDEBAR] Failed to load current user:", error);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setUserLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // CLOSE PROFILE MENU
  // ============================================================

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ============================================================
  // USER INFORMATION
  // ============================================================

  const displayName = useMemo(() => {
    if (!user) return "User";

    return (
      user.full_name ||
      user.fullName ||
      user.name ||
      user.username ||
      user.display_name ||
      user.email?.split("@")[0] ||
      "User"
    );
  }, [user]);

  const displayEmail = user?.email || "";

  const initials = useMemo(() => {
    const name = displayName.trim();

    if (!name) return "U";

    const parts = name
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`
        .toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }, [displayName]);

  // ============================================================
  // NAVIGATION ITEM
  // ============================================================

  const NavItem = ({
    icon: Icon,
    label,
    tab,
  }) => {
    const active = activeTab === tab;

    return (
      <button
        type="button"
        onClick={() => onNavigate?.(tab)}
        className={`
          group
          relative
          flex
          h-[42px]
          w-full
          items-center
          gap-3
          rounded-xl
          border
          px-3
          text-left
          transition-all
          duration-200

          ${
            active
              ? `
                border-violet-400/[0.12]
                bg-gradient-to-r
                from-violet-500/[0.12]
                via-violet-500/[0.055]
                to-transparent
                text-white
              `
              : `
                border-transparent
                text-slate-500
                hover:bg-white/[0.025]
                hover:text-slate-200
              `
          }
        `}
      >
        {active && (
          <span
            className="
              absolute
              left-0
              top-1/2
              h-5
              w-[2px]
              -translate-y-1/2
              rounded-r-full
              bg-gradient-to-b
              from-violet-400
              to-indigo-500
            "
          />
        )}

        <span
          className={`
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            transition-all

            ${
              active
                ? `
                  bg-violet-500/[0.12]
                  text-violet-300
                `
                : `
                  bg-white/[0.018]
                  text-slate-700
                  group-hover:bg-white/[0.035]
                  group-hover:text-slate-300
                `
            }
          `}
        >
          <Icon size={16} strokeWidth={1.8} />
        </span>

        <span
          className="
            min-w-0
            flex-1
            truncate
            text-[11px]
            font-medium
          "
        >
          {label}
        </span>

        <ChevronRight
          size={12}
          className={`
            shrink-0
            transition-all

            ${
              active
                ? "text-violet-400/60"
                : "text-slate-800 group-hover:translate-x-0.5 group-hover:text-slate-600"
            }
          `}
        />
      </button>
    );
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    setProfileOpen(false);

    if (typeof onLogout === "function") {
      onLogout();
      return;
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("current_user");

    window.location.href = "/";
  };

  return (
    <aside
      className="
        flex
        h-full
        w-full
        min-h-0
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-white/[0.07]
        bg-[#060c17]
      "
    >
      {/* ========================================================
          BRAND
      ======================================================== */}

      <header
        className="
          flex
          h-[82px]
          shrink-0
          items-center
          border-b
          border-white/[0.06]
          px-4
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="
                absolute
                inset-0
                rounded-xl
                bg-violet-500/20
                blur-xl
              "
            />

            <div
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-500
                to-indigo-600
                shadow-[0_8px_24px_rgba(124,58,237,0.22)]
              "
            >
              <BrainCircuit
                size={20}
                strokeWidth={1.9}
                className="text-white"
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="
                  truncate
                  text-[14px]
                  font-bold
                  tracking-[-0.025em]
                  text-white
                "
              >
                StudySphere AI
              </h1>

              <span
                className="
                  shrink-0
                  rounded-md
                  border
                  border-violet-400/15
                  bg-violet-500/[0.06]
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-violet-300
                "
              >
                AI
              </span>
            </div>

            <p className="mt-1 truncate text-[8px] text-slate-700">
              Intelligent study companion
            </p>
          </div>
        </div>
      </header>

      {/* ========================================================
          NAVIGATION
      ======================================================== */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-5
          [scrollbar-color:rgba(255,255,255,0.10)_transparent]
          [scrollbar-width:thin]
        "
      >
        <div>
          <SectionLabel>Workspace</SectionLabel>

          <NavItem
            icon={Home}
            label="Home"
            tab="home"
          />
        </div>

        <div className="mt-6">
          <SectionLabel>AI Tools</SectionLabel>

          <div className="space-y-1">
            <NavItem
              icon={MessageSquare}
              label="AI Chat"
              tab="chat"
            />

            <NavItem
              icon={Brain}
              label="AI Quiz"
              tab="quiz"
            />

            <NavItem
              icon={FileText}
              label="Summary"
              tab="summary"
            />

            <NavItem
              icon={StickyNote}
              label="Notes"
              tab="notes"
            />

            <NavItem
              icon={Layers3}
              label="Flashcards"
              tab="flashcards"
            />
          </div>
        </div>
      </nav>

      {/* ========================================================
          USER PROFILE
      ======================================================== */}

      <footer
        ref={profileRef}
        className="
          relative
          shrink-0
          border-t
          border-white/[0.06]
          bg-[#060c17]
          p-3
        "
      >
        {profileOpen && (
          <div
            className="
              absolute
              bottom-[calc(100%+8px)]
              left-3
              right-3
              z-[100]
              overflow-hidden
              rounded-[18px]
              border
              border-[#243650]
              bg-[#0a1423]
              shadow-[0_24px_70px_rgba(0,0,0,0.48)]
              ring-1
              ring-black/20
            "
          >
            {/* PROFILE HEADER */}

            <div
              className="
                relative
                overflow-hidden
                border-b
                border-white/[0.06]
                px-4
                py-3.5
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-16
                  h-32
                  w-32
                  rounded-full
                  bg-violet-500/[0.10]
                  blur-[45px]
                "
              />

              <div className="relative flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-indigo-600
                    text-[11px]
                    font-bold
                    text-white
                    shadow-[0_7px_20px_rgba(124,58,237,0.22)]
                  "
                >
                  {userLoading ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-white">
                    {userLoading
                      ? "Loading..."
                      : displayName}
                  </p>

                  <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-violet-400/70">
                    Account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-700
                    transition
                    hover:bg-white/[0.05]
                    hover:text-slate-300
                  "
                  aria-label="Close profile menu"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* PROFILE ACTIONS */}

            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate?.("profile");
                }}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  hover:bg-white/[0.035]
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-violet-500/[0.09]
                    text-violet-300
                    transition
                    group-hover:bg-violet-500/[0.14]
                  "
                >
                  <UserRound size={14} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold text-slate-200 group-hover:text-white">
                    View Profile
                  </span>

                  <span className="mt-0.5 block truncate text-[8px] text-slate-700">
                    View your complete profile
                  </span>
                </span>

                <ChevronRight
                  size={12}
                  className="shrink-0 text-slate-800 transition group-hover:translate-x-0.5 group-hover:text-slate-500"
                />
              </button>
            </div>

            {/* LOGOUT */}

            <div className="border-t border-white/[0.06] p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-left
                  transition-all
                  hover:bg-red-500/[0.06]
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-500/[0.07]
                    text-red-400
                    transition
                    group-hover:bg-red-500/[0.11]
                  "
                >
                  <LogOut size={14} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold text-red-400">
                    Log out
                  </span>

                  <span className="mt-0.5 block text-[8px] text-red-400/35">
                    Sign out of this account
                  </span>
                </span>

                <ChevronRight
                  size={12}
                  className="text-red-400/40 transition group-hover:translate-x-0.5 group-hover:text-red-400"
                />
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TRIGGER */}

        <button
          type="button"
          onClick={() =>
            setProfileOpen((previous) => !previous)
          }
          aria-expanded={profileOpen}
          className={`
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            border
            px-3
            py-2.5
            text-left
            transition-all
            duration-200

            ${
              profileOpen
                ? "border-violet-400/[0.18] bg-violet-500/[0.06]"
                : "border-white/[0.055] bg-white/[0.018] hover:border-violet-400/[0.14] hover:bg-white/[0.035]"
            }
          `}
        >
          <div className="relative shrink-0">
            {userLoading ? (
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white/[0.05]
                  text-slate-500
                "
              >
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              </div>
            ) : (
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-violet-500
                  to-indigo-600
                  text-[11px]
                  font-bold
                  text-white
                  shadow-[0_6px_18px_rgba(124,58,237,0.20)]
                "
              >
                {initials}
              </div>
            )}

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-[#060c17]
                bg-emerald-400
              "
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold text-white">
              {userLoading
                ? "Loading profile..."
                : displayName}
            </p>
          </div>

          <ChevronDown
            size={13}
            className={`
              shrink-0
              transition-transform
              duration-200
              ${
                profileOpen
                  ? "rotate-180 text-violet-400"
                  : "text-slate-700 group-hover:text-slate-400"
              }
            `}
          />
        </button>
      </footer>
    </aside>
  );
}

// ============================================================
// SECTION LABEL
// ============================================================

function SectionLabel({ children }) {
  return (
    <p
      className="
        px-3
        pb-2
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.2em]
        text-slate-800
      "
    >
      {children}
    </p>
  );
}

export default Sidebar;
