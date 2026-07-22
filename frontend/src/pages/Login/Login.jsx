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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      await loadUser();

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Login failed."
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

      <div className="relative z-10 flex min-h-screen">

        {/* Grid */}

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

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

        {/* LOGIN CARD */}

<div className="flex w-full lg:w-[45%] items-center justify-center px-8">
          <div className="w-full max-w-[560px] rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(37,99,235,0.15)] backdrop-blur-2xl">

            <div className="mb-8 flex flex-col items-center">

              <div className="mb-5 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 shadow-lg shadow-blue-500/30">

                <GraduationCap
                  size={38}
                  className="text-white"
                />

              </div>

              <h2 className="text-4xl font-bold text-white">

                Welcome Back

              </h2>

              <p className="mt-3 text-center text-slate-400">

                Login to continue your AI-powered learning
                journey.

              </p>

            </div>

                        {error && (
              <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
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

              {/* Options */}

              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-400">

                  <input
                    type="checkbox"
                    className="rounded border-slate-700 bg-slate-800 text-blue-500"
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  className="text-blue-400 transition hover:text-blue-300"
                >
                  Forgot Password?
                </button>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Login"
                )}
              </button>

            </form>

            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-700" />

              <span className="text-xs uppercase tracking-widest text-slate-500">
                Secure Login
              </span>

              <div className="h-px flex-1 bg-slate-700" />

            </div>

            <p className="text-center text-slate-400">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-400 transition hover:text-cyan-300"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;