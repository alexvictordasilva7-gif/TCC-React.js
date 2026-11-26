import styled from "styled-components";

// Cabeçalho padrão das páginas:
// <CabecalhoPagina sobre="Módulo" titulo="Estoque" subtitulo="..." acao={<Button .../>} />

const Caixa = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`;

const Textos = styled.div`
  min-width: 0;

  .sobre {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }

  h1 {
    margin: 6px 0 0;
    font-size: clamp(28px, 3.6vw, 38px);
    font-weight: 900;
    letter-spacing: -0.03em;
    line-height: 1.05;
    color: var(--ps-texto);
  }

  p {
    margin: 6px 0 0;
    font-size: 15px;
    color: var(--ps-texto-suave);
  }
`;

export default function CabecalhoPagina({ sobre, icone, titulo, subtitulo, acao }) {
  return (
    <Caixa className="ps-tema">
      <Textos>
        {sobre && (
          <span className="sobre">
            {icone && <i className={`bi bi-${icone}`} aria-hidden="true"></i>}
            {sobre}
          </span>
        )}
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </Textos>
      {acao && <div>{acao}</div>}
    </Caixa>
  );
}
