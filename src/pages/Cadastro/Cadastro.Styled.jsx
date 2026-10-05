import styled from "styled-components";
import {Link} from 'react-router-dom';
import { LuPawPrint } from "react-icons/lu";

export const TelaCadastro = styled.div`
    background: linear-gradient(135deg, #2B7CFF 0%, #7B2EFF 75%);
    width:100vw;
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`
export const Pata = styled(LuPawPrint)`
    width:40px;
    height:40px;

`

export const Ccadastro = styled.div`
    display:flex;
    gap:10px;
    flex-direction:column;
    background-color:#fff;
    border:none;
    border-radius:10px;
    padding:30px;
`

export const LinkCadastro = styled(Link)`
    text-decoration:none;
    color: #000000;
    font-size: 16px;
    &:hover{
        text-decoration:underline;
    }
`

export const CadFooter = styled.div`
    display:flex;
    justify-content:end;
`

export const InputCadas = styled.div`
    display:flex;
    flex-direction:column;
    gap:10px;
`

export const Hdiv = styled.div`
    display: flex;
    flex-direction:column;
    align-items:center;
    gap:20px;
`

export const Cdiv = styled.div`
    display: flex;
    gap:10px;
    align-items:center;
    
`
