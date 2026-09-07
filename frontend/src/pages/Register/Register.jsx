import { useState } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Brain,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers3,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // INPUT HANDLER
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const fullName = formData.full_name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (fullName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        full_name: fullName,
        email,
        password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration Error:", err);

      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Unable to create your account. Please try again.";

      const message = Array.isArray(detail)
        ? detail
            .map((item) => item?.msg || "Invalid input")
            .join(", ")
        : detail;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // PASSWORD STRENGTH
  // ============================================================

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "w-0",
        bar: "bg-transparent",
        text: "text-transparent",
      };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length < 8) {
      return {
        label: "Weak",
        width: "w-1/4",
        bar: "bg-red-400",
        text: "text-red-400",
      };
    }

    if (hasUppercase && hasNumber && hasSpecial) {
      return {
        label: "Strong",
        width: "w-full",
        bar: "bg-emerald-400",
        text: "text-emerald-400",
      };
    }

    if (hasUppercase && hasNumber) {
      return {
        label: "Good",
        width: "w-3/4",
        bar: "bg-blue-400",
        text: "text-blue-400",
      };
    }

    return {
      label: "Fair",
      width: "w-2/4",
      bar: "bg-amber-400",
      text: "text-amber-400",
    };
  };

  const passwordStrength = getPasswordStrength();

  // ============================================================
  // FEATURES
  // ============================================================

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Ask questions and understand your study material faster.",
      iconClass: "bg-blue-500/10 text-blue-400",
    },
    {
      icon: FileText,
      title: "Smart Study Tools",
      description:
        "Generate summaries, notes, quizzes and flashcards.",
      iconClass: "bg-cyan-500/10 text-cyan-400",
    },
    {
      icon: Layers3,
      title: "One Learning Workspace",
      description:
        "Keep your study resources organized in one place.",
      iconClass: "bg-violet-500/10 text-violet-400",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">

      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-52 -top-52 h-[520px] w-[520px] rounded-full bg-blue-600/[0.14] blur-[150px]" />

        <div className="absolute -bottom-52 -right-44 h-[540px] w-[540px] rounded-full bg-cyan-500/[0.09] blur-[160px]" />

        <div className="absolute left-[42%] top-[48%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.045] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(6,8,22,0.25)_65%,rgba(6,8,22,0.72)_100%)]" />

      </div>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="relative z-30 flex h-[68px] items-center justify-between px-6 sm:px-9 lg:px-12">

        <Link
          to="/"
          className="group flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/[0.08] transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/[0.14]">

            <GraduationCap
              size={20}
              strokeWidth={2}
              className="text-blue-400 transition-transform duration-300 group-hover:scale-110"
            />

          </div>

          <div className="leading-none">

            <div className="text-[15px] font-bold tracking-tight text-white">
              StudySphere
            </div>

            <div className="mt-1.5 text-[8px] font-medium uppercase tracking-[0.25em] text-slate-600">
              AI Learning
            </div>

          </div>

        </Link>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-500">

          <ShieldCheck
            size={12}
            className="text-emerald-400"
          />

          <span className="hidden sm:inline">
            Secure & private
          </span>

          <span className="sm:hidden">
            Secure
          </span>

        </div>

      </header>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <section className="relative z-10 px-6 pb-8 sm:px-9 lg:h-[calc(100vh-68px)] lg:px-12 lg:pb-0">

        <div className="mx-auto grid max-w-[1380px] grid-cols-1 items-center gap-8 lg:h-full lg:grid-cols-[minmax(0,1fr)_470px] xl:grid-cols-[minmax(0,1fr)_485px] xl:gap-14">

          {/* ====================================================
              LEFT SIDE
          ==================================================== */}

          <div className="hidden lg:flex lg:items-center">

            <div className="w-full max-w-[650px]">

              {/* Badge */}

              <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-400/20 bg-blue-500/[0.07] px-4 py-2 text-[11px] font-medium text-blue-300">

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10">
                  <Sparkles size={12} />
                </span>

                Built for smarter studying

              </div>

              {/* Heading */}

              <h1 className="mt-6 text-[48px] font-black leading-[0.98] tracking-[-0.045em] text-white xl:text-[54px]">

                Learn smarter.

                <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                  Study with AI.
                </span>

              </h1>

              {/* Description */}

              <p className="mt-6 max-w-[610px] text-[15px] leading-7 text-slate-400 xl:text-[16px]">
                StudySphere turns your study material into an
                intelligent learning workspace where you can ask,
                understand, revise and practice.
              </p>

              {/* Feature Cards */}

              <div className="mt-8 max-w-[620px] space-y-2.5">

                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="group flex min-h-[64px] items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 transition-all duration-300 hover:-translate-y-[1px] hover:border-white/[0.12] hover:bg-white/[0.045]"
                    >

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0">

                        <h3 className="text-[13px] font-semibold text-white">
                          {feature.title}
                        </h3>

                        <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                          {feature.description}
                        </p>

                      </div>

                      <ArrowRight
                        size={15}
                        className="ml-auto shrink-0 text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-400"
                      />

                    </div>
                  );
                })}

              </div>

              {/* Trust */}

              <div className="mt-6 flex items-center gap-7 border-t border-white/[0.06] pt-5">

                <TrustItem
                  icon={<Zap size={12} />}
                  iconClass="text-blue-400"
                  text="AI-powered"
                />

                <TrustItem
                  icon={<ShieldCheck size={12} />}
                  iconClass="text-emerald-400"
                  text="Secure sessions"
                />

                <TrustItem
                  icon={<Layers3 size={12} />}
                  iconClass="text-violet-400"
                  text="RAG-based"
                />

              </div>

            </div>

          </div>

          {/* ====================================================
              RIGHT SIDE
          ==================================================== */}

          <div className="flex w-full items-center justify-center py-3 lg:py-0">

            <div className="relative w-full max-w-[485px]">

              {/* Glow */}

              <div className="pointer-events-none absolute -inset-3 rounded-[30px] bg-gradient-to-r from-blue-500/[0.08] via-cyan-400/[0.04] to-violet-500/[0.08] blur-2xl" />

              {/* ==================================================
                  CARD
              ================================================== */}

              <div className="relative rounded-[24px] border border-white/[0.10] bg-[#0b1020]/95 px-6 py-5 shadow-[0_25px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:px-7">

                {/* Header */}

                <div className="mb-4">

                  <div className="flex items-center justify-between">

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">

                      <GraduationCap
                        size={18}
                        className="text-blue-400"
                      />

                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                      Ready to learn

                    </div>

                  </div>

                  <h2 className="mt-3 text-[22px] font-bold tracking-[-0.03em] text-white">
                    Create your account
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    Start building a smarter study workflow with StudySphere.
                  </p>

                </div>

                {/* Error */}

                {error && (
                  <div
                    role="alert"
                    className="mb-3 flex min-h-[34px] items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3.5 text-[10px] text-red-300"
                  >

                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />

                    <span>
                      {error}
                    </span>

                  </div>
                )}

                {/* Success */}

                {success && (
                  <div
                    role="status"
                    className="mb-3 flex min-h-[34px] items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 text-[10px] text-emerald-300"
                  >

                    <CheckCircle2 size={13} />

                    <span>
                      {success}
                    </span>

                  </div>
                )}

                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-2.5"
                >

                  {/* Full Name */}

                  <FormField
                    label="Full name"
                    htmlFor="full_name"
                  >
                    <div className="group relative">

                      <User
                        size={16}
                        strokeWidth={1.8}
                        className="
                          pointer-events-none
                          absolute
                          left-3.5
                          top-1/2
                          z-10
                          -translate-y-1/2
                          text-slate-600
                          transition-colors
                          duration-200
                          group-focus-within:text-blue-400
                        "
                      />

                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="
                          block
                          h-[42px]
                          w-full
                          rounded-xl
                          border
                          border-white/[0.09]
                          bg-white/[0.035]
                          pl-10
                          pr-4
                          text-[12px]
                          font-medium
                          leading-none
                          text-white
                          outline-none
                          transition-all
                          duration-200
                          placeholder:text-slate-600
                          hover:border-white/[0.14]
                          focus:border-blue-500/60
                          focus:bg-white/[0.05]
                          focus:ring-4
                          focus:ring-blue-500/[0.07]
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      />

                    </div>
                  </FormField>
                  {/* Email */}

                  <FormField
                    label="Email address"
                    htmlFor="email"
                  >

                    <div className="group relative">

                      <Mail
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="h-[42px] w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-4 text-[12px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                      />

                    </div>

                  </FormField>

                  {/* Password */}

                  <div>

                    <div className="mb-1 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-[12px] font-medium text-slate-400"
                      >
                        Password
                      </label>

                      {formData.password && (
                        <span
                          className={`text-[9px] font-medium ${passwordStrength.text}`}
                        >
                          {passwordStrength.label}
                        </span>
                      )}

                    </div>

                    <div className="group relative">

                      <Lock
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength={8}
                        className="h-[42px] w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-11 text-[12px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <PasswordToggle
                        visible={showPassword}
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        disabled={loading}
                      />

                    </div>

                    {formData.password && (
                      <div className="mt-1">

                        <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.06]">

                          <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.bar}`}
                          />

                        </div>

                      </div>
                    )}

                  </div>

                  {/* Confirm Password */}

                  <div>

                    <label
                      htmlFor="confirmPassword"
                      className="mb-1 block text-[12px] font-medium text-slate-400"
                    >
                      Confirm password
                    </label>

                    <div className="group relative">

                      <Lock
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                      />

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="h-[42px] w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-11 text-[12px] text-white outline-none transition-all placeholder:text-slate-700 hover:border-white/[0.14] focus:border-blue-500/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <PasswordToggle
                        visible={showConfirmPassword}
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        disabled={loading}
                      />

                    </div>

                    {formData.confirmPassword && (
                      <div className="mt-1 flex items-center gap-1.5">

                        <CheckCircle2
                          size={10}
                          className={
                            formData.password ===
                            formData.confirmPassword
                              ? "text-emerald-400"
                              : "text-slate-700"
                          }
                        />

                        <span
                          className={`text-[12px] ${
                            formData.password ===
                            formData.confirmPassword
                              ? "text-emerald-400"
                              : "text-slate-600"
                          }`}
                        >
                          {formData.password ===
                          formData.confirmPassword
                            ? "Passwords match"
                            : "Passwords must match"}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-1 flex h-[43px] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-[11px] font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-blue-500/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

                    {loading ? (
                      <span className="relative flex items-center gap-2">

                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating account...

                      </span>
                    ) : (
                      <span className="relative flex items-center gap-2">

                        Create account

                        <ArrowRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />

                      </span>
                    )}

                  </button>

                </form>

                {/* Divider */}

                <div className="my-3 flex items-center gap-3">

                  <div className="h-px flex-1 bg-white/[0.06]" />

                  <span className="text-[12px] font-medium uppercase tracking-[0.20em] text-slate-700">
                    Already a member?
                  </span>

                  <div className="h-px flex-1 bg-white/[0.06]" />

                </div>

                {/* Login */}

                <Link
                  to="/login"
                  className="group flex h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.02] text-[10px] font-semibold text-slate-400 transition-all duration-300 hover:border-blue-400/25 hover:bg-blue-500/[0.05] hover:text-white"
                >

                  Sign in to StudySphere

                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />

                </Link>

                {/* Security */}

                <div className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-slate-700">

                  <ShieldCheck size={9} />

                  Your account information is securely protected.

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function FormField({
  label,
  htmlFor,
  children,
}) {
  return (
    <div>

      <label
        htmlFor={htmlFor}
        className="mb-1 block text-[10px] font-medium text-slate-400"
      >
        {label}
      </label>

      {children}

    </div>
  );
}

// ============================================================
// PASSWORD TOGGLE
// ============================================================

function PasswordToggle({
  visible,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        visible
          ? "Hide password"
          : "Show password"
      }
      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
    >

      {visible ? (
        <EyeOff size={15} />
      ) : (
        <Eye size={15} />
      )}

    </button>
  );
}

// ============================================================
// TRUST ITEM
// ============================================================

function TrustItem({
  icon,
  iconClass,
  text,
}) {
  return (
    <div className="flex items-center gap-2 text-[10px] text-slate-600">

      <span className={iconClass}>
        {icon}
      </span>

      {text}

    </div>
  );
}

export default Register;