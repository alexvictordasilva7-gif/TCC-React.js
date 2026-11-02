import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Rotas from "./routes/Rotas.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer newestOnTop closeOnClick pauseOnHover theme="light" />
      <Rotas />
    </BrowserRouter>
  );
}

export default App;
