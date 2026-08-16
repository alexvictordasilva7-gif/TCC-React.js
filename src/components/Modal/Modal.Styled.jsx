import styled from "styled-components";

export const BackModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  /* width: 100%;
  height: 100%; */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: auto;
  
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  gap: 15px;
`;

