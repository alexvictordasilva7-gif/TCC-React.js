import styled, { keyframes } from "styled-components";

/* ===== Visual padrão (Serviços, Estoque, Agendamentos, Fornecedor) ===== */
export const BackModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background-color: var(--ps-modal-fundo, #fff); /* no modo noturno usa a cor do tema */
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $largura }) => $largura}px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
`;

/* ===== Visual "tema" (Clientes & Pets) ===== */
const aparecer = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to   { opacity: 1; transform: none; }
`;

export const BackModalTema = styled(BackModal)`
  background-color: var(--ps-fundo-modal);
  backdrop-filter: blur(2px);
  padding: 24px;
`;

export const ModalContentTema = styled(ModalContent)`
  background-color: var(--ps-superficie);
  color: var(--ps-texto);
  padding: 28px 32px;
  max-height: 92vh;
  border-radius: 24px;
  border: 1px solid var(--ps-borda);
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.35);
  animation: ${aparecer} 0.18s ease-out;
`;
