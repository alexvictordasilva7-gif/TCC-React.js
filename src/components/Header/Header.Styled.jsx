import styled from "styled-components";
import { LuPawPrint } from "react-icons/lu";

export const MainHeaderWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px; 
`;

export const LogoContainer = styled.div`
  display: flex;
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #929292; 
  color: #000000; 
  h1 {
    font-size: 24px; 
    margin: 0;
  }
  justify-content: center;
  align-items: center;
  
`;

export const HeaderContainer = styled.header`
  background-color: #fff;
  color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #929292;
  flex: 1;     
  height: 100%;  
  justify-content: flex-end;
`;

export const Icon = styled(LuPawPrint)`
  color: #0352fa;
  font-size: 32px; 
  margin-right: 10px;
`;



export const InfoBox = styled.button`

  background-color: #0352fa;
  color: white;
  border: none;
  border-radius: 100px;
  padding: 20px 20px;
  cursor: pointer;
  font-size: 16px;
`;

export const UserInfo = styled.p`
    margin: 0;
    color: #000000;
    font-size: 16px;
    
`
export const UserInfoContainer = styled.div`

  margin-right: 10px;`
