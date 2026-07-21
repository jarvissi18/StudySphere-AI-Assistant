import { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  Sparkles,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const initial =
    user?.full_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur-xl">

      <div className="flex h-[72px] items-center justify-between px-7">

        {/* ======================================
            Left
        ======================================= */}

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30">

            <MessageSquareText className="h-6 w-6 text-white" />

          </div>

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-xl font-bold text-white">
                AI Workspace
              </h1>

              <span className="rounded-full bg-violet-600/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                LIVE
              </span>

            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">

              <Sparkles className="h-4 w-4 text-yellow-400" />

              <span>
                Chat with your uploaded study materials
              </span>

            </div>

          </div>

        </div>

        {/* ======================================
            User
        ======================================= */}

        <div
          className="relative"
          ref={menuRef}
        >

          <button
            onClick={() =>
              setShowMenu(!showMenu)
            }
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-700
              bg-slate-900/80
              px-4
              py-2
              transition-all
              duration-300
              hover:border-violet-500
              hover:bg-slate-800
            "
          >

            {/* Avatar */}

            <div className="relative">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white">

                {initial}

              </div>

              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-green-500"></span>

            </div>

            {/* User */}

            <div className="text-left">

              <p className="text-sm font-semibold text-white">

                {user?.full_name || "User"}

              </p>

              <p className="text-xs text-slate-400">

                {user?.email}

              </p>

            </div>

            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                showMenu
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* Dropdown */}

          <div
            className={`
              absolute
              right-0
              mt-3
              w-64
              overflow-hidden
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              shadow-2xl
              transition-all
              duration-300
              ${
                showMenu
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }
            `}
          >

            <div className="border-b border-slate-700 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white">

                  {initial}

                </div>

                <div>

                  <h3 className="font-semibold text-white">

                    {user?.full_name}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {user?.email}

                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="
                flex
                w-full
                items-center
                gap-3
                px-5
                py-4
                text-red-400
                transition
                hover:bg-slate-800
              "
            >

              <LogOut size={20} />

              Logout

            </button>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;