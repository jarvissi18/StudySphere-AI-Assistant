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

// ============================================================
// GET CACHED USER
// ============================================================

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(
      USER_STORAGE_KEY
    );

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

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {
  /*
   * Restore cached user immediately.
   *
   * This keeps the dashboard visible during refresh.
   */
  const [user, setUser] = useState(() =>
    getStoredUser()
  );

  /*
   * Authentication verification happens
   * in the background.
   *
   * The UI should NOT wait for /auth/me.
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
      localStorage.removeItem(
        USER_STORAGE_KEY
      );
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
     * No token means the user is logged out.
     */
    if (!token) {
      updateUser(null);
      setLoading(false);
      return null;
    }

    /*
     * IMPORTANT:
     *
     * Do not block the dashboard.
     *
     * Cached user is already available.
     */
    setLoading(false);

    try {
      const response = await getCurrentUser();

      /*
       * Normal backend response:
       *
       * {
       *   success: true,
       *   user: {...}
       * }
       */
      if (response?.success && response?.user) {
        updateUser(response.user);
        return response.user;
      }

      /*
       * Also support direct user response.
       */
      if (response?.user) {
        updateUser(response.user);
        return response.user;
      }

      /*
       * Unexpected response.
       *
       * Do NOT log the user out.
       */
      console.warn(
        "StudySphere: Unexpected /auth/me response."
      );

      return getStoredUser();

    } catch (error) {
      const status =
        error?.response?.status;

      /*
       * ONLY 401 means the JWT is invalid/expired.
       */
      if (
        status === 401 ||
        status === 403
      ) {
        console.warn(
          "StudySphere: Session expired."
        );

        localStorage.removeItem(
          TOKEN_STORAGE_KEY
        );

        updateUser(null);

        return null;
      }

      /*
       * Network error / Render cold start / 5xx:
       *
       * NEVER log the user out.
       *
       * Keep cached session.
       */
      console.warn(
        "StudySphere: Session verification temporarily unavailable.",
        error
      );

      return getStoredUser();

    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  // ============================================================
  // INITIAL SESSION RESTORE
  // ============================================================

  useEffect(() => {
    const token = localStorage.getItem(
      TOKEN_STORAGE_KEY
    );

    /*
     * No token → logged out.
     */
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    /*
     * Verify session in background.
     *
     * IMPORTANT:
     *
     * loadUser is now stable because it does
     * NOT depend on `user`.
     */
    loadUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
