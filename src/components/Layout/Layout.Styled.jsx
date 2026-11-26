import styled from "styled-components";

export const LayoutContainer = styled.div`
    display: flex;
   
`

export const Main = styled.main`
    border-left: 1px solid var(--ps-layout-borda, #fcfcfc);
    flex: 1;
    overflow-x: hidden;   /* impede que qualquer coisa "vaze" pros lados */
    max-width: 100%;
    min-width: 0;         /* importante em containers flex, explico embaixo */
    padding:20px;
    background-color: var(--ps-layout-fundo, #0b6ef030); /* no modo noturno usa a cor do tema */
    
`