import styled from "styled-components"
import {Link} from "react-router-dom"

export const TelaLogin = styled.div`
    background: linear-gradient(135deg, #2B7CFF 0%, #7B2EFF 75%);
    width:100vw;
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`

export const Clogin = styled.div`
    display:flex;
    gap:10px;
    flex-direction:column;
    background-color:#fff;
    border:none;
    border-radius:10px;
    padding:30px;
    h1{
        color: #000000;
    }
    p{
        color:#414040;
    }
    
`

export const Limg = styled.img`
    height:120px;
    width:120px;
    border-radius:100px;
    background-color:azure;
    
`

export const ContImg = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100%;
`


export const InputLogin = styled.div`
    display:flex;
    flex-direction:column;
    gap:10px;
`

export const Infolink = styled.div`
    display:flex;
    flex-direction:column;

`

export const LinkLogin = styled(Link)`
    text-decoration:none;
    color: #000000;
    font-size: 16px;
    &:hover{
        text-decoration:underline;
    }
`

export const LoginSelect = styled.select`
    height:30px;
    outline:none;
    
`

export const LoginFooter = styled.div`
    display:flex;
    justify-content:space-between;
`

export const Hdiv = styled.div`
    display: flex;
    flex-direction:column;
    align-items:center;
    gap:20px;
`

export const Ddiv = styled.div`
    display:flex;
    height:40px;
    align-items:center;
    p{
        color:#fff;
    }
`

export const Cdiv = styled.div`
    display: flex;
    flex-direction:column;
    align-items:center;
    
`