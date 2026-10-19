import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DadosProvider } from "./context/DadosContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import App from "./App.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DadosProvider>
      <App />
    </DadosProvider>
  </StrictMode>
);
