import styled from "styled-components";

export const Campo = styled.input`
    width:100%;
    height:40px;
    font-size: ${props => props.size || '16px'};
    border:1px solid #b4b4b4 ;
    border-radius:10px;
    box-sizing: border-box;
    padding: 0px 10px 0px 10px;
    outline:none;
    
`

/* ===== Visual "tema" (Clientes & Pets) ===== */
export const CampoTema = styled.input`
  width: 100%;
  height: 44px;
  font-size: ${(props) => props.$size || "15px"};
  border: 1.5px solid var(--ps-borda);
  border-radius: 12px;
  box-sizing: border-box;
  padding: 0 14px;
  outline: none;
  background: var(--ps-superficie-2);
  color: var(--ps-texto);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: var(--ps-texto-suave);
    opacity: 0.75;
  }

  &:focus {
    border-color: var(--ps-primaria);
    box-shadow: 0 0 0 3px var(--bs-focus-ring-color);
    background: var(--ps-superficie);
  }

  /* deixa o ícone do calendário/relógio visível no modo noturno */
  [data-bs-theme="dark"] &::-webkit-calendar-picker-indicator {
    filter: invert(0.85);
  }
`;
