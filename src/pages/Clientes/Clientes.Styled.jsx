import styled from "styled-components"
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";


export const Bcontainer = styled.div`
    display: flex;
    justify-content: end;
`
export const GapText = styled.div`
   margin: 20px;
   display: flex;
   flex-direction:column;
`

export const Hcliente = styled.div`
   display:flex;
   justify-content:space-between;
   margin-bottom:20px;
`
export const Celula = styled.span`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;

  ${props => props.$cabecalho && `
    color: #888;
    text-transform: uppercase;
  `}

 
`;

export const Del = styled(BiTrash)`
color:red;
size:16px;
` 

export const Edi = styled(FaRegEdit)`
color:blue;
size:16px;
` 

