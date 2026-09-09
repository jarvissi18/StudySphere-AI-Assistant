import { useState } from "react";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  Brain,
  FileText,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LogIn,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
  forgotPassword,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";


function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ============================================================
  // FORGOT PASSWORD STATE
  // ============================================================

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [forgotLoading, setForgotLoading] =
    useState(false);

  const [forgotError, setForgotError] =
    useState("");

  const [forgotSuccess, setForgotSuccess] =
    useState(false);


  // ============================================================
  // HANDLE LOGIN INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };


  // ============================================================
  // LOGIN SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      if (!response?.access_token) {
        throw new Error(
          "Authentication token was not returned."
        );
      }

      localStorage.setItem(
  "access_token",
  response.access_token
);

if (response.user) {
  setUser(response.user);
}

navigate("/");

    } catch (err) {
      console.error(
        "Login Error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Unable to sign in. Please check your credentials and try again.";

      setError(message);

      localStorage.removeItem(
        "access_token"
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // OPEN FORGOT PASSWORD
  // ============================================================

  const openForgotPassword = () => {
    setForgotEmail(
      formData.email.trim()
    );

    setForgotError("");
    setForgotSuccess(false);

    setShowForgotPassword(true);
  };


  // ============================================================
  // CLOSE FORGOT PASSWORD
  // ============================================================

  const closeForgotPassword = () => {
    if (forgotLoading) return;

    setShowForgotPassword(false);

    setForgotEmail("");
    setForgotError("");
    setForgotSuccess(false);
  };


  // ============================================================
  // SEND RESET LINK
  // ============================================================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (forgotLoading) return;

    setForgotError("");

    const email = forgotEmail
      .trim()
      .toLowerCase();

    if (!email) {
      setForgotError(
        "Please enter your email address."
      );
      return;
    }

    setForgotLoading(true);

    try {
      await forgotPassword(email);

      setForgotSuccess(true);

    } catch (err) {
      console.error(
        "Forgot Password Error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to send the reset link. Please try again.";

      setForgotError(message);

    } finally {
      setForgotLoading(false);
    }
  };


  // ============================================================
  // LOGIN PAGE
  // ============================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ========================================================
          AMBIENT BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.35)_70%,rgba(5,8,22,0.8)_100%)]" />

      </div>


      {/* ========================================================
          MAIN LAYOUT
      ======================================================== */}

      <main className="relative z-10 flex min-h-screen w-full">


        {/* ======================================================
            LEFT BRAND PANEL
        ====================================================== */}

        <section className="hidden min-h-screen w-1/2 items-center px-12 xl:flex xl:px-16 2xl:px-24">

          <div className="mx-auto w-full max-w-[650px]">

            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-xl">

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15">
                <Sparkles size={14} />
              </span>

              AI-Powered Learning Platform

            </div>


            {/* Heading */}

            <h1 className="text-[clamp(3rem,5vw,4.5rem)] font-black leading-[0.98] tracking-[-0.04em]">

              Learn smarter.

              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
                Study better.
              </span>

            </h1>


            {/* Description */}

            <p className="mt-7 max-w-xl text-[17px] leading-8 text-slate-400">

              StudySphere transforms your study material into an
              intelligent learning workspace powered by AI.

            </p>


            {/* Feature Cards */}

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">

              <FeatureCard
                icon={<Brain size={20} />}
                iconClass="text-blue-400"
                iconBg="bg-blue-500/10"
                title="AI Chat"
                description="Ask questions from your PDFs."
              />

              <FeatureCard
                icon={<FileText size={20} />}
                iconClass="text-cyan-400"
                iconBg="bg-cyan-500/10"
                title="Smart Notes"
                description="Generate revision-ready notes."
              />

              <FeatureCard
                icon={<ShieldCheck size={20} />}
                iconClass="text-emerald-400"
                iconBg="bg-emerald-500/10"
                title="Secure Access"
                description="Protected authentication."
              />

              <FeatureCard
                icon={<ArrowRight size={20} />}
                iconClass="text-violet-400"
                iconBg="bg-violet-500/10"
                title="AI Quizzes"
                description="Practice with generated quizzes."
              />

            </div>


            {/* Trust Line */}

            <div className="mt-9 flex items-center gap-3 text-sm text-slate-500">

              <div className="flex -space-x-2">

                <span className="h-7 w-7 rounded-full border-2 border-[#050816] bg-blue-500/70" />

                <span className="h-7 w-7 rounded-full border-2 border-[#050816] bg-cyan-500/70" />

                <span className="h-7 w-7 rounded-full border-2 border-[#050816] bg-violet-500/70" />

              </div>

              <span>
                One workspace for your entire study workflow.
              </span>

            </div>

          </div>

        </section>


        {/* ======================================================
            RIGHT LOGIN AREA
        ====================================================== */}

        <section className="flex min-h-screen w-full items-center justify-center px-5 py-8 sm:px-8 xl:w-1/2 xl:px-12">

          <div className="w-full max-w-[500px]">


            {/* ==================================================
                LOGIN CARD
            ================================================== */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">

              {/* Card Glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]" />

              <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-500/[0.07] blur-[80px]" />


              <div className="relative">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="mb-7 flex justify-center">

                  <div className="relative">

                    <div className="absolute inset-0 rounded-2xl bg-blue-500/30 blur-xl" />

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600 to-cyan-500 shadow-xl shadow-blue-500/20">

                      <GraduationCap
                        size={32}
                        strokeWidth={2.2}
                      />

                    </div>

                  </div>

                </div>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="text-center">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                    StudySphere
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
                    Welcome back
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Sign in to continue your AI-powered learning journey.
                  </p>

                </div>


                {/* =================================================
                    LOGIN ERROR
                ================================================= */}

                {error && (

                  <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3.5 text-sm text-red-300"
                  >

                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-xs font-bold">
                      !
                    </span>

                    <p className="leading-5">
                      {error}
                    </p>

                  </div>

                )}


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >

                  {/* Email */}

                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>

                    <div className="group relative">

                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="h-13 w-full rounded-2xl border border-white/[0.08] bg-slate-950/60 pl-11 pr-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>

                  </div>


                  {/* Password */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-300"
                      >
                        Password
                      </label>


                      {/* FORGOT PASSWORD */}

                      <button
                        type="button"
                        onClick={openForgotPassword}
                        disabled={loading}
                        className="text-xs font-medium text-blue-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Forgot password?
                      </button>

                    </div>


                    <div className="group relative">

                      <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="h-13 w-full rounded-2xl border border-white/[0.08] bg-slate-950/60 pl-11 pr-12 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />


                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        disabled={loading}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
                      >

                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* Remember */}

                  <div className="flex items-center">

                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-400">

                      <input
                        type="checkbox"
                        disabled={loading}
                        className="h-4 w-4 rounded border-white/10 bg-slate-900 text-blue-600 accent-blue-600 focus:ring-blue-500/20"
                      />

                      Remember me

                    </label>

                  </div>


                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />

                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />

                        Sign in
                      </>
                    )}

                  </button>

                </form>


                {/* DIVIDER */}

                <div className="my-7 flex items-center gap-4">

                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Secure access
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />

                </div>


                {/* REGISTER */}

                <p className="text-center text-sm text-slate-500">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="font-semibold text-blue-400 transition hover:text-cyan-300"
                  >
                    Create account
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ========================================================
          FORGOT PASSWORD MODAL
      ======================================================== */}

      {showForgotPassword && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02040d]/75 px-4 py-6 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeForgotPassword();
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            className="relative w-full max-w-[430px] overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#0b1020] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
          >

            {/* Modal Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-500/15 blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[90px]" />


            <div className="relative p-6 sm:p-7">

              {/* Close */}

              <button
                type="button"
                onClick={closeForgotPassword}
                disabled={forgotLoading}
                aria-label="Close"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-slate-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>


              {!forgotSuccess ? (

                <>
                  {/* Icon */}

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-400">

                    <Mail size={22} />

                  </div>


                  {/* Header */}

                  <div className="pr-10">

                    <h3
                      id="forgot-password-title"
                      className="text-2xl font-bold tracking-tight text-white"
                    >
                      Reset your password
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Enter your registered email and we'll send you a secure password reset link.
                    </p>

                  </div>


                  {/* Error */}

                  {forgotError && (

                    <div
                      role="alert"
                      className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3.5 py-3 text-sm text-red-300"
                    >

                      <AlertCircle
                        size={17}
                        className="mt-0.5 shrink-0"
                      />

                      <span>
                        {forgotError}
                      </span>

                    </div>

                  )}


                  {/* Form */}

                  <form
                    onSubmit={handleForgotPassword}
                    className="mt-6"
                  >

                    <label
                      htmlFor="forgot-email"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Email address
                    </label>


                    <div className="group relative">

                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(
                            e.target.value
                          );

                          if (forgotError) {
                            setForgotError("");
                          }
                        }}
                        disabled={forgotLoading}
                        autoFocus
                        required
                        className="h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.14] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                    </div>


                    {/* Send */}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {forgotLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />

                          Sending reset link...
                        </>
                      ) : (
                        <>
                          <Send size={17} />

                          Send reset link
                        </>
                      )}

                    </button>


                    <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
                      For your security, we'll show the same confirmation whether or not an account exists for this email.
                    </p>

                  </form>

                </>

              ) : (

                /* =================================================
                   SUCCESS STATE
                ================================================= */

                <div className="py-5 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-500/10 text-emerald-400">

                    <CheckCircle2 size={28} />

                  </div>


                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-white">
                    Check your email
                  </h3>


                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">

                    If an account exists for{" "}

                    <span className="font-medium text-slate-200">
                      {forgotEmail}
                    </span>

                    , we've sent a password reset link.

                  </p>


                  <div className="mt-5 rounded-xl border border-blue-400/10 bg-blue-500/[0.06] px-4 py-3 text-xs leading-5 text-slate-500">

                    The reset link expires in 30 minutes.

                  </div>


                  <button
                    type="button"
                    onClick={closeForgotPassword}
                    className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
                  >
                    Back to sign in
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon,
  iconClass,
  iconBg,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.1] hover:bg-white/[0.045]">

      <div className="flex items-start gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}


export default Login;
