import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import Rotas from "./routes/Rotas.jsx";

function App() {
  return (
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  );
}

export default App;
