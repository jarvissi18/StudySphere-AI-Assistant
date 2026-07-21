import { useState } from "react";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
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

    if (formData.password !== formData.confirmPassword) {
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
    <div className="min-h-screen bg-[#0B1120] flex justify-center items-center px-5">

      <div className="w-full max-w-md rounded-2xl bg-slate-900/80 border border-slate-700 shadow-2xl backdrop-blur-xl p-8">

        <div className="text-center mb-8">

          <div className="inline-flex p-4 rounded-full bg-blue-600 mb-4">
            <GraduationCap size={34} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            StudySphere
          </h1>

          <p className="text-slate-400 mt-2">
            Create your account
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500 text-red-300 p-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-500/20 border border-green-500 text-green-300 p-3">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="relative">

            <User className="absolute left-3 top-3 text-slate-400" size={18} />

            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              required
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 py-3 pl-10 pr-3 text-white"
            />

          </div>

          <div className="relative">

            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 py-3 pl-10 pr-3 text-white"
            />

          </div>

          <div className="relative">

            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 py-3 pl-10 pr-12 text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <div className="relative">

            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 py-3 pl-10 pr-12 text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-3 text-slate-400"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-3 font-semibold text-white"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-center text-slate-400">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-400"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;