import { useEffect } from "react";
import * as S from "./Modal.Styled";

// tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
// aoFechar (opcional): fecha com a tecla Esc e clicando fora do modal
function Modal({ isOpen, children, largura = 520, tema = false, aoFechar }) {
  useEffect(() => {
    if (!isOpen || !aoFechar) return;
    const teclado = (e) => e.key === "Escape" && aoFechar();
    window.addEventListener("keydown", teclado);
    return () => window.removeEventListener("keydown", teclado);
  }, [isOpen, aoFechar]);

  if (!isOpen) return null;

  const Fundo = tema ? S.BackModalTema : S.BackModal;
  const Conteudo = tema ? S.ModalContentTema : S.ModalContent;

  return (
    <Fundo
      onMouseDown={(e) => {
        if (aoFechar && e.target === e.currentTarget) aoFechar();
      }}
    >
      <Conteudo $largura={largura} role="dialog" aria-modal="true">
        {children}
      </Conteudo>
    </Fundo>
  );
}

export default Modal;
