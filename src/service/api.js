import axios from "axios";
import { sair } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

//"https://pet-shop-tcc-etec.onrender.com"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});


api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const ehAuth = (erro.config?.url ?? "").includes("/api/auth/");
    if (erro.response?.status === 401 && !ehAuth) {
      sair();
      window.location.href = "/Login";
    }
    return Promise.reject(erro);
  },
);

export default api;
