import {
  BrainCircuit,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();

  // ============================================================
  // AUTH CHECK LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#060b16] text-white">

        {/* ======================================================
            AMBIENT BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.10] blur-[110px]" />

          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,11,22,0.35)_65%,rgba(6,11,22,0.85)_100%)]" />

        </div>

        {/* ======================================================
            LOADER
        ====================================================== */}

        <div className="relative z-10 flex w-full max-w-[320px] flex-col items-center px-6 text-center">

          {/* Logo */}

          <div className="relative">

            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_12px_35px_rgba(124,58,237,0.22)]">

              <BrainCircuit
                size={25}
                className="text-white"
              />

            </div>

          </div>

          {/* Brand */}

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-violet-400">
            StudySphere AI
          </p>

          <h1 className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-white">
            Preparing your workspace
          </h1>

          <p className="mt-2 text-[10px] leading-5 text-slate-600">
            Verifying your secure session and loading your
            learning environment.
          </p>

          {/* Progress indicator */}

          <div className="mt-6 w-full">

            <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">

              <div className="h-full w-1/2 animate-[loadingBar_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

            </div>

          </div>

          {/* Status */}

          <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-700">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]" />

            <span>
              Checking authentication
            </span>

          </div>

          {/* Security */}

          <div className="mt-5 flex items-center gap-1.5 text-[8px] text-slate-800">

            <ShieldCheck
              size={10}
              className="text-emerald-500/60"
            />

            Secure session

            <span className="text-slate-900">
              •
            </span>

            <Sparkles
              size={9}
              className="text-violet-500/60"
            />

            AI workspace

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // NOT AUTHENTICATED
  // ============================================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ============================================================
  // AUTHENTICATED
  // ============================================================

  return children;
}

export default ProtectedRoute;