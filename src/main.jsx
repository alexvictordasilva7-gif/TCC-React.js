import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DadosProvider } from "./context/DadosContext.jsx";
import { TemaProvider } from "./context/TemaContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/tema.css"; // paleta da barra lateral/Clientes & Pets + modo noturno
import "./index.css";
import App from "./App.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TemaProvider>
      <DadosProvider>
        <App />
      </DadosProvider>
    </TemaProvider>
  </StrictMode>
);
