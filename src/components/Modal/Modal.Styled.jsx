import styled from "styled-components";

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
  background-color: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $largura }) => $largura}px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
`;