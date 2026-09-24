import styled from "styled-components";
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";

export const Hservico = styled.div`
   display:flex;
   justify-content:space-between;
   align-items:center;
   margin-bottom:20px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    margin: 0;
    font-size: 16px;
  }
`

export const IconsRow = styled.div`
  display: flex;
  gap: 8px;
`

export const Edi = styled(FaRegEdit)`
  color:blue;
  font-size:16px;
  cursor: pointer;
`

export const Del = styled(BiTrash)`
  color:red;
  font-size:16px;
  cursor: pointer;
`

export const Badge = styled.span`
  align-self: flex-start;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
`

export const Descricao = styled.p`
  margin: 4px 0 8px 0;
  color: #555;
  font-size: 14px;
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`

export const Duracao = styled.span`
  color: #888;
  font-size: 13px;
`

export const Valor = styled.span`
  color: #16a34a;
  font-weight: bold;
  font-size: 15px;
`