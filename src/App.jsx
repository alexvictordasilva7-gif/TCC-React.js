import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Rotas from "./routes/Rotas.jsx";
import { useTema } from "./context/TemaContext.jsx";
import "./App.css";

function App() {
  const { escuro } = useTema();

  return (
    <BrowserRouter>
      <ToastContainer
        newestOnTop
        closeOnClick
        pauseOnHover
        theme={escuro ? "dark" : "light"}
      />
      <Rotas />
    </BrowserRouter>
  );
}

export default App;
