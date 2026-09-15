import styled from "styled-components";

export const TabelaCaixa = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$colunas}, max-content);
  justify-content: space-between;
  align-items: center;
  background: #fff;
  
`;

export const Celula = styled.span`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;

  ${(props) =>
    props.$cabecalho &&
    `
    color: #888;
    text-transform: uppercase;
  `}

  overflow-wrap: break-word;
  min-width: 0;
  box-shadow: 100px;
`;
