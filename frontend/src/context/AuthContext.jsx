import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "../services/api";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "studysphere_user";
const TOKEN_STORAGE_KEY = "access_token";

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.warn(
      "StudySphere: Invalid cached user data.",
      error
    );

    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  /*
   * IMPORTANT:
   * Restore cached user immediately.
   *
   * This prevents the dashboard from disappearing
   * during every browser refresh.
   */
  const [user, setUser] = useState(() =>
    getStoredUser()
  );

  /*
   * Do NOT block the entire application while
   * /auth/me is being checked.
   */
  const [loading, setLoading] = useState(false);

  // ============================================================
  // SAVE USER
  // ============================================================

  const updateUser = useCallback((userData) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(userData)
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  // ============================================================
  // LOAD / VERIFY CURRENT USER
  // ============================================================

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(
      TOKEN_STORAGE_KEY
    );

    /*
     * No token = definitely logged out.
     */
    if (!token) {
      updateUser(null);
      setLoading(false);
      return null;
    }

    /*
     * We already have cached user information.
     *
     * Keep the UI available while verification happens
     * in the background.
     */
    setLoading(false);

    try {
      const response = await getCurrentUser();

      if (response?.success && response?.user) {
        updateUser(response.user);
        return response.user;
      }

      if (response?.user) {
        updateUser(response.user);
        return response.user;
      }

      /*
       * Unexpected response.
       *
       * Do NOT destroy the session just because the response
       * format was unexpected.
       */
      console.warn(
        "StudySphere: Unexpected /auth/me response."
      );

      return user;
    } catch (error) {
      const status = error?.response?.status;

      /*
       * ONLY a 401 means the JWT is actually invalid/expired.
       *
       * In that case we must log the user out.
       */
      if (status === 401) {
        console.warn(
          "StudySphere: Session expired."
        );

        localStorage.removeItem(
          TOKEN_STORAGE_KEY
        );

        localStorage.removeItem(
          USER_STORAGE_KEY
        );

        setUser(null);

        return null;
      }

      /*
       * Network error / Render cold start / 5xx:
       *
       * DO NOT log the user out.
       *
       * The cached session remains available.
       */
      console.warn(
        "StudySphere: Session verification temporarily unavailable.",
        error
      );

      return user;
    } finally {
      setLoading(false);
    }
  }, [updateUser, user]);

  // ============================================================
  // INITIAL SESSION RESTORE
  // ============================================================

  useEffect(() => {
    const token = localStorage.getItem(
      TOKEN_STORAGE_KEY
    );

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    /*
     * Verify in the background.
     *
     * The dashboard does NOT wait for this request.
     */
    loadUser();
  }, [loadUser]);

  // ============================================================
  // CONTEXT
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
