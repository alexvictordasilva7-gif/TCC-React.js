import styled from "styled-components";

export const LayoutContainer = styled.div`
    display: flex;
   
`

export const Main = styled.main`
    border-left: 1px solid #bbbbbb;
    flex: 1;
    overflow-x: hidden;   /* impede que qualquer coisa "vaze" pros lados */
    max-width: 100%;
    min-width: 0;         /* importante em containers flex, explico embaixo */
    padding:20px;
    background-color:#ecebeb;
    
`