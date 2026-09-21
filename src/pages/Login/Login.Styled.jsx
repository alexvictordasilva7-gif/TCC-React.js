import styled from "styled-components"
import {Link} from "react-router-dom"

export const TelaLogin = styled.div`
    background-color:#e0ba0d;
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
    background-color:purple;
    border:2px solid #bde607;
    border-radius:10px;
    padding:15px;
    h1{
        color: #e68507;;
    }
`

export const Limg = styled.img`
    height:160px;
    width:160px;
    border-radius:10px;
    
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
    color: #fff;
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