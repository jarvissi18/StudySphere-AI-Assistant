import { useState } from "react";

import {
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  resetPassword,
} from "../../services/api";


function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");


  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!token) {

      setError(
        "This password reset link is invalid."
      );

      return;
    }


    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters long."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {

      await resetPassword({

        token,

        password,

        confirm_password:
          confirmPassword,

      });


      setSuccess(true);


    } catch (err) {

      console.error(
        "Reset password error:",
        err
      );


      setError(
        err?.response?.data?.detail ||
        "Unable to reset your password. The link may have expired."
      );


    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-5 text-white">


      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

      </div>


      {/* ======================================================
          CARD
      ====================================================== */}

      <div className="relative z-10 w-full max-w-[420px]">


        <div className="rounded-[24px] border border-white/[0.08] bg-[#0b1020]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-7">


          {/* Logo */}

          <div className="flex justify-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">

              <GraduationCap
                size={25}
              />

            </div>

          </div>


          {!success ? (

            <>


              {/* Header */}

              <div className="mt-5 text-center">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
                  StudySphere
                </p>

                <h1 className="mt-2 text-[28px] font-bold">
                  Create new password
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose a strong password for your account.
                </p>

              </div>


              {/* Error */}

              {error && (

                <div className="mt-5 flex gap-2.5 rounded-xl border border-red-400/15 bg-red-500/[0.07] p-3 text-xs text-red-300">

                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {error}
                  </span>

                </div>

              )}


              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
              >


                {/* Password */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    New password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Minimum 8 characters"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 pl-10 pr-11 text-sm text-white outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
                    >

                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}

                    </button>

                  </div>

                </div>


                {/* Confirm */}

                <div>

                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    Confirm password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Repeat your password"
                      disabled={loading}
                      required
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 pl-10 pr-11 text-sm text-white outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white"
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}

                    </button>

                  </div>

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60"
                >

                  {loading ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating password...
                    </>

                  ) : (

                    <>
                      Reset password
                      <ArrowRight
                        size={16}
                      />
                    </>

                  )}

                </button>

              </form>

            </>

          ) : (

            <div className="pt-6 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">

                <CheckCircle2
                  size={30}
                />

              </div>


              <h1 className="mt-5 text-2xl font-bold">
                Password updated
              </h1>


              <p className="mt-3 text-sm leading-6 text-slate-500">
                Your password has been changed
                successfully. You can now sign in
                with your new password.
              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold shadow-lg shadow-blue-500/20"
              >
                Continue to sign in
                <ArrowRight size={16} />
              </button>

            </div>

          )}

        </div>


        <p className="mt-4 text-center text-[10px] text-slate-700">
          StudySphere · AI Study Assistant
        </p>

      </div>

    </div>
  );
}


export default ResetPassword;