import { toast } from "react-toastify";

const base = {
  position: "top-center",
  autoClose: 3500,
  className: "pet-toast",
  progressClassName: "pet-toast-progress",
};

export const alerta = {
  sucesso: (msg) =>
    toast(msg, { ...base, icon: "🐶", className: "pet-toast pet-sucesso" }),
  erro: (msg) =>
    toast(msg, { ...base, icon: "🐾", className: "pet-toast pet-erro" }),
  aviso: (msg) =>
    toast(msg, { ...base, icon: "🐱", className: "pet-toast pet-aviso" }),
  info: (msg) =>
    toast(msg, { ...base, icon: "🦴", className: "pet-toast pet-info" }),
};