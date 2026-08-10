import { useState } from "react";
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import * as S from "./App.Styled.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Rotas from "./routes/Rotas.jsx";

function App() {
  return (
    
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>

   
  );
}

export default App;
