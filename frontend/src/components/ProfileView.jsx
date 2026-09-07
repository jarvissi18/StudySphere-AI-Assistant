import { useEffect, useMemo, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  LogIn,
} from "lucide-react";

import { getCurrentUser } from "../services/api";

function ProfileView({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD PROFILE + DOCUMENT COUNT
  // ============================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Load authenticated user
      const userResponse = await getCurrentUser();

      const currentUser =
        userResponse?.user ||
        userResponse?.data ||
        userResponse ||
        null;

      if (!currentUser) {
        throw new Error("User profile could not be loaded.");
      }

      setUser(currentUser);

      // Load this user's uploaded documents.
      // The backend /files endpoint is protected by the
      // authenticated user token, so only the current user's
      // documents are returned.
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Authentication session not found.");
      }

      const apiBaseUrl =
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:8000";

      const filesResponse = await fetch(
        `${apiBaseUrl}/files`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!filesResponse.ok) {
        throw new Error("Unable to load document information.");
      }

      const filesData = await filesResponse.json();

      const documents = Array.isArray(filesData?.files)
        ? filesData.files
        : [];

      setTotalDocuments(
        Number.isFinite(filesData?.total)
          ? filesData.total
          : documents.length
      );
    } catch (err) {
      console.error("[PROFILE] Failed to load profile:", err);
      setUser(null);
      setTotalDocuments(0);
      setError(
        err?.message ||
          "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================================================
  // USER DISPLAY DATA
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

  const displayEmail = user?.email || "Not available";

  const initials = useMemo(() => {
    const parts = displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`
        .toUpperCase();
    }

    return displayName.slice(0, 2).toUpperCase() || "U";
  }, [displayName]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-[#050a12] text-white">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.08] text-violet-300">
            <Loader2
              size={24}
              className="animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-semibold">
            Loading profile
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Getting your account information...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-[#050a12] px-5 text-white">
        <div className="w-full max-w-md rounded-3xl border border-[#1b2a40] bg-[#091321] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/[0.08] text-red-400">
            <AlertCircle size={24} />
          </div>

          <h1 className="mt-5 text-lg font-semibold">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // PROFILE
  // ============================================================

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-[#050a12] text-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-6 sm:px-7 lg:px-9 lg:py-8">

        {/* ======================================================
            TOP BAR
        ====================================================== */}

        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#091321] px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/[0.04] hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to workspace
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
              Account Active
            </span>
          </div>
        </div>

        {/* ======================================================
            PROFILE HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-[#1c2b42] bg-[#091321] shadow-[0_25px_80px_rgba(0,0,0,0.24)]">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-600/[0.11] blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-indigo-600/[0.07] blur-[100px]" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-center">

              {/* Avatar */}
              <div className="relative mx-auto shrink-0 md:mx-0">
                <div className="absolute inset-0 rounded-[30px] bg-violet-500/20 blur-2xl" />

                <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 text-3xl font-bold text-white shadow-[0_20px_45px_rgba(124,58,237,0.28)]">
                  {initials}
                </div>

                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-[#091321] bg-emerald-400" />
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1 text-center md:text-left">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/15 bg-violet-500/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-300">
                    <Sparkles size={11} />
                    StudySphere Account
                  </span>
                </div>

                <h1 className="break-words text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500 md:justify-start">
                  <Mail
                    size={15}
                    className="shrink-0 text-slate-600"
                  />

                  <span className="break-all">
                    {displayEmail}
                  </span>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                  Your personal StudySphere account and AI-powered
                  study workspace are connected to this profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            PERSONAL INFORMATION
        ====================================================== */}

        <section className="mt-5 overflow-hidden rounded-[26px] border border-[#1b2a40] bg-[#091321]">
          <div className="border-b border-[#1b2a40] px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/[0.08] text-violet-300">
                <UserRound size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-600">
                  Information associated with your authenticated account.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2">
            <Detail
              icon={<UserRound size={17} />}
              label="Full Name"
              value={displayName}
            />

            <Detail
              icon={<Mail size={17} />}
              label="Email Address"
              value={displayEmail}
            />

            <Detail
              icon={<ShieldCheck size={17} />}
              label="Account Status"
              value="Authenticated"
              success
            />

            <Detail
              icon={<FileText size={17} />}
              label="Total Documents"
              value={`${totalDocuments} ${
                totalDocuments === 1
                  ? "Document"
                  : "Documents"
              }`}
            />
          </div>
        </section>

        
        <div className="h-8" />
      </div>
    </div>
  );
}

// ============================================================
// DETAIL CARD
// ============================================================

function Detail({
  icon,
  label,
  value,
  success = false,
}) {
  return (
    <div className="border-b border-[#1b2a40] px-6 py-5 sm:px-8">
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            success
              ? "bg-emerald-500/[0.07] text-emerald-300"
              : "bg-violet-500/[0.07] text-violet-300"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
            {label}
          </p>

          <p className="mt-1.5 break-words text-sm font-medium text-slate-300">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
