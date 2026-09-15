import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import Forms from "../../components/Forms/Forms";
import Input from "../../components/Input/Input";
import { useState } from "react";

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
      <div>
        <h1>Pets</h1>
        <Button
          $cor={"blue"}
          filho={"+ Pets"}
          onClick={() => setOpenModal(true)}
        />
      </div>

      <div>
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
