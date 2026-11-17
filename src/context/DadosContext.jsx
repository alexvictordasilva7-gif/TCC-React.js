import { createContext, useContext, useEffect, useState } from "react";

// histórico de vendas guardado no navegador até o back ter POST /api/vendas
const CHAVE_VENDAS = "petshop:vendas";
function lerVendas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_VENDAS)) ?? [];
  } catch {
    return [];
  }
}

const DadosContext = createContext();

export function DadosProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([
  ]);
  const [vendas, setVendas] = useState(lerVendas);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_VENDAS, JSON.stringify(vendas));
    } catch {
      // sem problema: só não guarda o histórico
    }
  }, [vendas]);
  return (
    <DadosContext.Provider
      value={{
        clientes,
        setClientes,
        pets,
        setPets,
        servicos,
        setServicos,
        agendamentos,
        setAgendamentos,
        produtos,
        setProdutos,
        fornecedores,
        setFornecedores,
        vendas,
        setVendas,
        
      }}
    >
      {children}
    </DadosContext.Provider>
  );
}

export const useDados = () => useContext(DadosContext);
