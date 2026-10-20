import { createContext, useContext, useState } from "react";

const DadosContext = createContext();

export function DadosProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([
  ]);
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
        
      }}
    >
      {children}
    </DadosContext.Provider>
  );
}

export const useDados = () => useContext(DadosContext);
