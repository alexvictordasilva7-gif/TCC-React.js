// Rodapé padrão dos modais: botões alinhados à direita, com uma linha em cima.
// <ModalRodape aoCancelar={fechar} aoConfirmar={salvar} textoConfirmar="Salvar" carregando={salvando} />
import Button from "../Button/Button";

export default function ModalRodape({
  aoCancelar,
  aoConfirmar,
  textoConfirmar = "Salvar",
  textoCancelar = "Cancelar",
  carregando = false,
  extra,
}) {
  return (
    <div
      className="d-flex flex-wrap align-items-center gap-3 pt-4 mt-2"
      style={{ borderTop: "1px solid var(--ps-borda)" }}
    >
      {extra && <div className="me-auto">{extra}</div>}
      <div className="d-flex gap-2 ms-auto">
        <Button
          className="btn-outline-secondary px-4"
          onClick={aoCancelar}
          texto={textoCancelar}
          disabled={carregando}
          style={{ minWidth: 130, height: 46 }}
        />
        <Button
          className="btn-primary px-4"
          onClick={aoConfirmar}
          texto={textoConfirmar}
          disabled={carregando}
          style={{ minWidth: 180, height: 46 }}
        />
      </div>
    </div>
  );
}
