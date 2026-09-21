import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Forms from "../../components/Forms/Forms";
import Input from "../../components/Input/Input";
import Tabela from "../../components/Tabela/Tabela.jsx";
import { useState } from "react";
import * as S from './Pets.Styled.jsx'

function Pets() {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [dono, setDono] = useState("");
  const [pets, setPets] = useState([]);
  return (
    <div>
      <S.Hpets>
        <div>
          <h1>Pets</h1>
          <p>Gerencie os clientes cadastrados</p>
        </div>
        
        <Button
          $cor={"blue"}
          filho={"+ Pets"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'100px'}
          fsize={'18px'}
        />
      </S.Hpets>
      
      <div>
            <img width={"1080px"} src="../../../public/manutencao.jpeg" alt="" />

        <Modal isOpen={openModal}>
          <Forms
            hForm={
              <Button
                //props do botao de sair
                $tcor={"#fff"}
                filho={"X"}
                $cor={"#ff0000"}
                onClick={() => setOpenModal(false)}
              />
              
            }
            tForm={"Novo Pet"}
          >
            <Input
              texto={"Nome"}
              type="text"
            />
            <Input
              texto={"Especie"}
              type="text"
            />
            <Input
              texto={"Raca"}
              type="text"
            />
            <Input
              texto={"Idade"}
              type="text"
            />
            <Input
              texto={"Dono"}
              type="select"
            />

            
          </Forms>
        </Modal>
      </div>
    </div>
  );
}

export default Pets;
