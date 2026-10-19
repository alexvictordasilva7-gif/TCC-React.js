import { createContext, useContext, useState } from "react";

const DadosContext = createContext();

export function DadosProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [pets, setPets] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([
    // provisório, só para testar até fazer a página de Fornecedores
    { id: "f1", nome: "PetFood Ltda" },
    { id: "f2", nome: "CleanPet" },
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
