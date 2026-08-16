import * as S from "./Header.Styled.jsx";

function Header() {
  return (
    <S.MainHeaderWrapper>
      <S.LogoContainer>
        <S.Icon />
        <h1>Pet Shop</h1>
      </S.LogoContainer>

      <S.HeaderContainer>
        <S.UserInfoContainer>
          <S.UserInfo>Bem-vindo </S.UserInfo>
          <S.UserInfo>Usuário</S.UserInfo>
        </S.UserInfoContainer>
        <S.InfoBox/>
      </S.HeaderContainer>
    </S.MainHeaderWrapper>
  );
}

export default Header;
