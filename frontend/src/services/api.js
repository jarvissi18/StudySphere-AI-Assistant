import axios from "axios";

// =====================================================
// API Base URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL || "https://studysphere-ai-assistant-production.up.railway.app";


// =====================================================
// Axios Instance
// =====================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

// =====================================================
// Automatically Attach JWT Token
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// Authentication APIs
// =====================================================

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// =====================================================
// Quiz API
// =====================================================

export const generateQuiz = async (payload) => {
  const response = await api.post("/generate-quiz", payload);
  return response.data;
};

// =====================================================
// Summary API
// =====================================================

export const generateSummary = async (payload = { topic: "" }) => {
  const response = await api.post("/generate-summary", payload);
  return response.data;
};

export const generateNotes = async (payload = { topic: "" }) => {
  const response = await api.post("/generate-notes", payload);
  return response.data;
};

export const generateFlashcards = async (payload = { topic: "" }) => {
  const response = await api.post("/generate-flashcards", payload);
  return response.data;
};

// =====================================================
// Default Export
// =====================================================

export default api;