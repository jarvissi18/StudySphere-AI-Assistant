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
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816]">

      {/* Background Blur */}

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[160px]" />

      <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />

      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Main Layout */}

      <div className="relative z-10 flex min-h-screen">

                 {/* LEFT PANEL */}

        <div className="hidden lg:flex w-[50%] flex-col justify-center px-20">

          <div className="max-w-xl">

            <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">

              <Sparkles size={18} />

              AI Powered Learning Platform

            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-white">

              StudySphere

              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">

                  AI Study Assistant

              </span>

            </h1>

            <p className="mt-8 text-lg leading-5 text-slate-300">

              Upload your study material once.

              Chat with AI, generate summaries,
              smart notes, flashcards,
              and practice quizzes—all in one place.

            </p>

            <div className="mt-14 grid gap-6">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-600/20 p-3">

                  <Brain className="text-blue-400" />

                </div>

                <div>

                  <h3 className="font-semibold text-white">

                    AI Chat

                  </h3>

                  <p className="text-slate-400">

                    Ask anything from uploaded PDFs.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-cyan-500/20 p-3">

                  <FileText className="text-cyan-400" />

                </div>

                <div>

                  <h3 className="font-semibold text-white">

                    Smart Notes

                  </h3>

                  <p className="text-slate-400">

                    Generate revision-ready notes instantly.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-emerald-500/20 p-3">

                  <ShieldCheck className="text-emerald-400" />

                </div>

                <div>

                  <h3 className="font-semibold text-white">

                    Secure Authentication

                  </h3>

                  <p className="text-slate-400">

                    JWT protected user sessions.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-violet-600/20 p-3">

                <ArrowRight className="text-violet-400" size={24} />

                </div>

                <div>

                  <h3 className="font-semibold text-white">

                    AI Quiz Generator

                  </h3>

                  <p className="text-slate-400">

                    Create practice quizzes from your notes.

                  </p>

                </div>

              </div>


            </div>

          </div>

        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className="flex w-full lg:w-[45%] items-center justify-center px-8">

          <div className="w-full max-w-[560px] rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl shadow-[0_0_50px_rgba(37,99,235,.15)]">            <div className="flex flex-col items-center">

              <div className="mb-5 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 shadow-xl shadow-blue-600/30">

                <GraduationCap
                  size={30}
                  className="text-white"
                />

              </div>

<h2 className="text-4xl font-bold text-white">
                Create Account

              </h2>

<p className="mt-3 text-center text-base leading-7 text-slate-400">
                Create your StudySphere account and start your
                AI-powered learning journey.

              </p>

                          </div>

            {/* Error Message */}

            {error && (
              <div className="mt-8 mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur">
                {error}
              </div>
            )}

            {/* Success Message */}

            {success && (
              <div className="mt-8 mb-6 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300 backdrop-blur">
                {success}
              </div>
            )}

            {/* Register Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Full Name */}

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

              </div>

              {/* Email */}

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

              </div>

                            {/* Password */}

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* Password Strength */}

              {formData.password && (
                <div className="space-y-2">

                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">

                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        formData.password.length < 6
                          ? "w-1/4 bg-red-500"
                          : formData.password.length < 8
                          ? "w-2/4 bg-yellow-500"
                          : formData.password.length < 12
                          ? "w-3/4 bg-blue-500"
                          : "w-full bg-green-500"
                      }`}
                    />

                  </div>

                  <p
                    className={`text-sm ${
                      formData.password.length < 6
                        ? "text-red-400"
                        : formData.password.length < 8
                        ? "text-yellow-400"
                        : formData.password.length < 12
                        ? "text-blue-400"
                        : "text-green-400"
                    }`}
                  >
                    {formData.password.length < 6
                      ? "Weak Password"
                      : formData.password.length < 8
                      ? "Fair Password"
                      : formData.password.length < 12
                      ? "Strong Password"
                      : "Very Strong Password"}
                  </p>

                </div>
              )}

              {/* Confirm Password */}

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/60 py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

              {/* Password Match */}

              {formData.confirmPassword && (
                <p
                  className={`text-sm ${
                    formData.password ===
                    formData.confirmPassword
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formData.password ===
                  formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

              {/* Register Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </button>

                            {/* Divider */}

              <div className="relative my-5">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[#050816] px-4 text-sm text-slate-500">
                    Already have an account?
                  </span>
                </div>

              </div>

              {/* Login Link */}

              <Link
                to="/login"
                className="group flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 font-semibold text-slate-300 transition-all duration-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-white"
              >
                Sign In

                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />

              </Link>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Register;