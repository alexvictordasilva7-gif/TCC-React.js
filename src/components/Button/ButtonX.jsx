export default function BotaoFechar({ onClick, texto = "" }) {
  return (
    <button
      type="button" 
      // btn-danger ativa o fundo vermelho nativo do Bootstrap
      className="btn " 
      onClick={onClick}
    >
      {texto}
    </button>
  );
}
