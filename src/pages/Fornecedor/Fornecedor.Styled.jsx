import styled from "styled-components";
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

export const Hfornecedor = styled.div`
   display:flex;
   justify-content:space-between;
   align-items:flex-start;
   margin-bottom:20px;
`

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`

export const StatCard = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);

  strong {
    font-size: 22px;
    display: block;
  }
  span {
    color: #888;
    font-size: 13px;
  }
`

export const StatIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bg || "#eef2ff"};
  color: ${props => props.$cor || "#4f46e5"};
  font-size: 18px;
`

export const FiltrosRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

export const BuscaWrapper = styled.div`
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 8px 12px;

  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 14px;
  }
`

export const IconBusca = styled(FiSearch)`
  color: #999;
`

export const Tabs = styled.div`
  display: flex;
  gap: 6px;
  background: #eee;
  border-radius: 8px;
  padding: 4px;
`

export const Tab = styled.button`
  border: none;
  background: ${props => (props.$ativo ? "#fff" : "transparent")};
  box-shadow: ${props => (props.$ativo ? "0 1px 3px rgba(0,0,0,0.15)" : "none")};
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #333;
`

export const TabelaWrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`

export const Celula = styled.span`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 14px;

  ${props => props.$cabecalho && `
    color: #888;
    text-transform: uppercase;
    font-size: 12px;
  `}
`;

export const NomeFornecedor = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 14px;
  }
  small {
    color: #888;
    font-size: 12px;
  }
`

export const Contato = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 13px;
  }
`

export const Categoria = styled.span`
  background: #e0edff;
  color: #1d4ed8;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
`

export const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
`

export const Bolinha = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.$ativo ? "#22c55e" : "#9ca3af")};
`

export const Del = styled(BiTrash)`
  color:red;
  font-size:16px;
  cursor: pointer;
`

export const Edi = styled(FaRegEdit)`
  color:blue;
  font-size:16px;
  cursor: pointer;
`

export const IconFornecedorTotal = styled(FaTruck)``
export const IconAtivo = styled(MdCheckCircle)``
export const IconInativo = styled(MdCancel)``

export const LinhaForm = styled.div`
  display: flex;
  gap: 12px;

  > div {
    flex: 1;
  }
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin: 6px 0 10px 0;

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    cursor: pointer;
  }
`