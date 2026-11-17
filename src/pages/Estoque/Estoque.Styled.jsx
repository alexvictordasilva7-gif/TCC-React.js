import styled from "styled-components";
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";

export const Hestoque = styled.div`
   display:flex;
   justify-content:space-between;
   align-items:center;
   margin-bottom:20px;
`


export const Celula = styled.span`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;

  ${props => props.$cabecalho && `
    color: #888;
    text-transform: uppercase;
  `}

 
`;

export const Del = styled(BiTrash)`
color:red;
size:16px;
` 

export const Edi = styled(FaRegEdit)`
color:blue;
size:16px;
` 


/* ===== Modal de produto (mesmo visual do Clientes & Pets) ===== */
export const Secao = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;

  & + & {
    padding-top: 18px;
    border-top: 1px solid var(--ps-borda);
  }
`;

export const TituloSecao = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;

  legend {
    float: none;
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }
  p {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--ps-texto-suave);
  }
`;

export const SelectTema = styled.select`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border: 1.5px solid ${({ $erro }) => ($erro ? "#e5534b" : "var(--ps-borda)")};
  border-radius: 12px;
  outline: none;
  background-color: var(--ps-superficie-2);
  color: var(--ps-texto);

  &:focus {
    border-color: var(--ps-primaria);
    box-shadow: 0 0 0 3px var(--bs-focus-ring-color);
    background-color: var(--ps-superficie);
  }
`;

export const Dica = styled.small`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--ps-texto-suave);
`;

export const Margem = styled.div`
  height: 100%;
  min-height: 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 14px;
  background: ${({ $negativa }) =>
    $negativa ? "rgba(229, 83, 75, 0.1)" : "var(--ps-primaria-clara)"};

  span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
  }
  strong {
    font-size: 22px;
    color: ${({ $negativa }) => ($negativa ? "#e5534b" : "var(--ps-primaria)")};
  }
  small {
    font-size: 12px;
    color: var(--ps-texto-suave);
  }
`;

/* ===== Consumo interno ===== */
export const Consumo = styled.section`
  overflow: hidden;

  .topo {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    padding: 20px 24px;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #6c757d;
  }

  .total {
    text-align: right;

    span {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #6c757d;
    }
    strong {
      font-size: 22px;
      color: #6a5cf5;
    }
  }

  th {
    padding: 12px 24px;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #6c757d;
    white-space: nowrap;
  }

  td {
    padding: 12px 24px;
    text-align: center;
    font-size: 0.875rem;
  }

  .custo {
    color: #6a5cf5;
  }

  .vazio {
    padding: 0 24px 24px;
  }
`;

export const ResumoUso = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--ps-primaria-clara);

  strong {
    display: block;
    font-size: 16px;
    color: var(--ps-texto);
  }

  span {
    font-size: 13px;
    color: var(--ps-texto-suave);
  }
`;
