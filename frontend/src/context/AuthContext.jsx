import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD CURRENT USER
  // ============================================================

  const loadUser = useCallback(async () => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    // No token
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response =
        await getCurrentUser();

      if (response?.success && response?.user) {
        setUser(response.user);
      } else if (response?.user) {
        setUser(response.user);
      } else {
        throw new Error(
          "Invalid user response."
        );
      }
    } catch (error) {
      console.error(
        "Authentication Error:",
        error
      );

      localStorage.removeItem(
        "access_token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL AUTH CHECK
  // ============================================================

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ============================================================
  // CONTEXT
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// AUTH HOOK
// ============================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}