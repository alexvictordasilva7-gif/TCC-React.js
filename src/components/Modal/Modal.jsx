import * as S from "./Modal.Styled";

function Modal({ isOpen, children, largura = 520 }) {
  if (!isOpen) return null;

  return (
    <S.BackModal>
      <S.ModalContent $largura={largura}>{children}</S.ModalContent>
    </S.BackModal>
  );
}

export default Modal;