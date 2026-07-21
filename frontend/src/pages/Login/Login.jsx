import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, GraduationCap } from "lucide-react";
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

      // Save JWT Token
      localStorage.setItem(
        "access_token",
        response.access_token
      );

      // Load current user into Auth Context
      await loadUser();

      // Redirect to Home
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
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-5">

      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-8">

          <div className="bg-blue-600 p-4 rounded-full mb-4">
            <GraduationCap size={34} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            StudySphere
          </h1>

          <p className="text-slate-400 mt-2">
            Login to continue
          </p>

        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-3 mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-3 text-white focus:outline-none focus:border-blue-500"
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-blue-500"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-slate-400 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;