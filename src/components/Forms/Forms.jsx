import * as S from "./Forms.Styled.jsx";

// tema: usa o visual do Clientes & Pets (sem ele, fica o visual padrão)
function Forms({ children, hForm, tForm, tema = false }) {
  const Formulario = tema ? S.FormularioTema : S.Formulario;
  const Header = tema ? S.HeaderFormTema : S.HeaderForm;
  const Filho = tema ? S.FilhoFormTema : S.FilhoForm;

  return (
    // onSubmit evita recarregar a página se alguém apertar Enter num campo
    <Formulario onSubmit={(e) => e.preventDefault()}>
      <Header>
        <h2>{tForm}</h2>
        {hForm}
      </Header>
      <Filho>{children}</Filho>
    </Formulario>
  );
}

export default Forms;
