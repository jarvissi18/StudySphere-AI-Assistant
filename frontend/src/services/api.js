import axios from "axios";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 180000,
});


// ============================================================
// REQUEST INTERCEPTOR
// JWT + SMART CONTENT TYPE
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token");

    // --------------------------------------------------------
    // Attach JWT
    // --------------------------------------------------------

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // --------------------------------------------------------
    // IMPORTANT:
    // Let Axios/browser automatically create the correct
    // multipart boundary when sending FormData.
    // --------------------------------------------------------

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      // JSON requests
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] =
          "application/json";
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (!error.response) {
      console.error(
        "Network error: Backend is not reachable.",
        error
      );
    }

    // --------------------------------------------------------
    // Helpful API error logging during development
    // --------------------------------------------------------

    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    }

    return Promise.reject(error);
  }
);


// ============================================================
// AUTHENTICATION
// ============================================================

export const registerUser = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};


export const loginUser = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};


export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

export const forgotPassword = async (email) => {
  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
};


// ============================================================
// RESET PASSWORD
// ============================================================

export const resetPassword = async (data) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};


// ============================================================
// QUIZ
// ============================================================

export const generateQuiz = async (payload) => {
  const response = await api.post(
    "/generate-quiz",
    payload
  );

  return response.data;
};


// ============================================================
// SUMMARY
// ============================================================

export const generateSummary = async (
  payload = { topic: "" }
) => {
  const response = await api.post(
    "/generate-summary",
    payload
  );

  return response.data;
};


// ============================================================
// NOTES
// ============================================================

export const generateNotes = async (
  payload = { topic: "" }
) => {
  const response = await api.post(
    "/generate-notes",
    payload
  );

  return response.data;
};


// ============================================================
// FLASHCARDS
// ============================================================

export const generateFlashcards = async (
  payload = { topic: "" }
) => {
  const response = await api.post(
    "/generate-flashcards",
    payload
  );

  return response.data;
};


// ============================================================
// PDF UPLOAD
// ============================================================

export const uploadPDF = async (file) => {
  if (!file) {
    throw new Error(
      "No PDF file selected."
    );
  }

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await api.post(
    "/upload",
    formData
  );

  return response.data;
};


// ============================================================
// GET UPLOADED FILES
// ============================================================

export const getUploadedFiles = async () => {
  const response = await api.get(
    "/files"
  );

  return response.data;
};


// ============================================================
// DELETE PDF
// ============================================================

export const deleteUploadedFile = async (
  filename
) => {
  if (!filename) {
    throw new Error(
      "Filename is required."
    );
  }

  const response = await api.delete(
    `/delete-file/${encodeURIComponent(
      filename
    )}`
  );

  return response.data;
};


// ============================================================
// ASK AI
// ============================================================

export const askQuestion = async (
  question
) => {
  if (!question?.trim()) {
    throw new Error(
      "Question cannot be empty."
    );
  }

  const response = await api.post(
    "/ask",
    {
      question: question.trim(),
    }
  );

  return response.data;
};


// ============================================================
// DEBUG INFO
// ============================================================

console.log(
  "StudySphere API:",
  API_URL
);

console.log(
  "API Timeout:",
  api.defaults.timeout
);


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;