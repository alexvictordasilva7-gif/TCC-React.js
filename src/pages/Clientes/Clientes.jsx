import Modal from "../../components/Modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import * as S from "./Clientes.Styled";
import { useState } from "react";

const Clientes = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <h1>Clientes</h1>
      <Button
        $cor={"blue"}
        filho={"+ Cliente"}
        onClick={() => setOpenModal(true)}
      />
      <div>
        <Modal isOpen={openModal}>
          <Form
            // props do formulario
            hForm={
              <Button
                //props do botao de sair
                $tcor={"#fff"}
                filho={"X"}
                $cor={"#ff0000"}
                onClick={() => setOpenModal(false)}
              />
            }
            tForm={"Novo cliente"}
          >
            <Input texto={"Nome Completo"} type="text" />
            <Input texto={"Email"} type="text" />
            <Input texto={"Telefone"} type="text" />
            <Input texto={"Endereço"} type="text" />


            <div>
              <Button filho={"Adicionar"} cor={"#0044c2"} type={"button"} />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Clientes;
