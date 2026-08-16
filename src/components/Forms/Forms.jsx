import * as S from "./Forms.Styled.jsx";

function Forms({ children, hForm, tForm }) {
  return (
    <S.Formulario>
      <S.HeaderForm>
        <h2>{tForm}</h2>
        {hForm}
      </S.HeaderForm>
      <S.FilhoForm>{children}</S.FilhoForm>
    </S.Formulario>
  );
}

export default Forms;
