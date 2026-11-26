import styled from "styled-components";

// Mesmo padrão visual da tela Clientes & Pets (cards de 20px, borda e sombra do tema)

export const Numeros = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
