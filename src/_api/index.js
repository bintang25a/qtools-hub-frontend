import axios from "axios";

const API = axios.create({
  baseURL: "https://measures-architects-placing-slides.trycloudflare.com/api",
  // "https://putting-sofa-closes-phenomenon.trycloudflare.com/api",
  // "http://127.0.0.1:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["ngrok-skip-browser-warning"] = "true";
    config.headers["bypass-tunnel-reminder"] = "true";

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
