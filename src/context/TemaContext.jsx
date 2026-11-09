import { createContext, useContext, useEffect, useState } from "react";

// Guarda a escolha do usuário entre "claro" e "escuro".
// O tema é aplicado com data-bs-theme na tag <html>, que o Bootstrap
// e o nosso src/styles/tema.css entendem.

const CHAVE = "petshop:tema";
const TemaContext = createContext(null);

function temaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === "claro" || salvo === "escuro") return salvo;
  } catch {
    // localStorage bloqueado: segue para a preferência do sistema
  }
  return "claro"; // começa no claro; o botão de lua troca
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", tema === "escuro" ? "dark" : "light");
    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      // sem problema: o tema só não fica salvo
    }
  }, [tema]);

  const alternarTema = () => setTema((atual) => (atual === "escuro" ? "claro" : "escuro"));

  return (
    <TemaContext.Provider value={{ tema, escuro: tema === "escuro", alternarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export const useTema = () => useContext(TemaContext);
