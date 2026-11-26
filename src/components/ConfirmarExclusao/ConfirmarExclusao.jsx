import { useEffect, useRef, useState } from "react";
import "./ConfirmarExclusao.css";

/*
  Confirmação de exclusão padrão do sistema, no mesmo visual do aviso de erro (pet-erro), sem ícone.

  Uso em qualquer tela:
    import { confirmarExclusao } from "../../components/ConfirmarExclusao/ConfirmarExclusao.jsx";

    if (!(await confirmarExclusao({ titulo: "Excluir serviço?", mensagem: "..." }))) return;

  O <DialogoConfirmacao /> fica montado uma única vez no App.jsx.
*/

let abrirDialogo = null;

export function confirmarExclusao({
  titulo = "Excluir registro?",
  mensagem = "Esta ação não pode ser desfeita.",
  textoConfirmar = "Excluir",
} = {}) {
  return new Promise((resolve) => {
    if (!abrirDialogo) {
      // segurança: se o diálogo não estiver montado, não exclui nada
      resolve(false);
      return;
    }
    abrirDialogo({ titulo, mensagem, textoConfirmar, resolve });
  });
}

/* Junta as mensagens que o back-end envia em { mensagens: [...] } */
export function mensagemDaApi(erro, padrao) {
  const lista = erro?.response?.data?.mensagens;
  if (Array.isArray(lista) && lista.length) return lista.join(" ");
  if (erro?.response?.data?.message) return erro.response.data.message;
  if (!erro?.response) return "Não foi possível conectar ao servidor.";
  return padrao;
}

export function DialogoConfirmacao() {
  const [pedido, setPedido] = useState(null);
  const [saindo, setSaindo] = useState(false);
  const botaoCancelar = useRef(null);

  useEffect(() => {
    abrirDialogo = (p) => {
      setSaindo(false);
      setPedido(p);
    };
    return () => {
      abrirDialogo = null;
    };
  }, []);

  function responder(valor) {
    if (!pedido) return;
    const { resolve } = pedido;
    setSaindo(true);
    setTimeout(() => {
      setPedido(null);
      resolve(valor);
    }, 160);
  }

  useEffect(() => {
    if (!pedido) return;
    botaoCancelar.current?.focus();
    const tecla = (e) => {
      if (e.key === "Escape") responder(false);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido]);

  if (!pedido) return null;

  return (
    <div
      className={`pet-confirmar-fundo${saindo ? " saindo" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && responder(false)}
    >
      <div
        className="pet-confirmar"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="pet-confirmar-titulo"
        aria-describedby="pet-confirmar-texto"
      >
        <button
          type="button"
          className="pet-confirmar__fechar"
          aria-label="Fechar"
          onClick={() => responder(false)}
        >
          ×
        </button>

        <div className="pet-confirmar__corpo">
          <div>
            <strong id="pet-confirmar-titulo">{pedido.titulo}</strong>
            <p id="pet-confirmar-texto">{pedido.mensagem}</p>
          </div>
        </div>

        <div className="pet-confirmar__acoes">
          <button
            type="button"
            ref={botaoCancelar}
            className="pet-confirmar__botao pet-confirmar__botao--cancelar"
            onClick={() => responder(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="pet-confirmar__botao pet-confirmar__botao--excluir"
            onClick={() => responder(true)}
          >
            {pedido.textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
