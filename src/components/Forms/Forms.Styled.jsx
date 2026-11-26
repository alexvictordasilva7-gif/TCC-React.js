import styled from "styled-components"

export const Formulario = styled.form`
    width: auto;
    height: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`
export const FilhoForm = styled.div`
    display:flex;
    flex-direction:column;
    gap:20px;
`
export const HeaderForm = styled.div`
    display: flex;
    justify-content: space-between;
    height: 40px;
    width: 100%;
    align-items:center;
`

/* ===== Visual "tema" (Clientes & Pets) ===== */
export const FormularioTema = styled.form`
  width: auto;
  height: auto;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FilhoFormTema = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const HeaderFormTema = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--ps-borda);

  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 800;
    color: var(--ps-texto);
  }
`;
