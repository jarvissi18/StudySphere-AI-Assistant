import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();

  // Wait until authentication check completes
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500"></div>

          <p className="text-slate-300 text-lg">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // No logged-in user → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User authenticated
  return children;
}

export default ProtectedRoute;