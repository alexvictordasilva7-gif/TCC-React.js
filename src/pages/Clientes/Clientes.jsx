import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import Tabela from "../../components/Tabela/Tabela";
import * as S from "./Clientes.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Clientes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const resposta = await api.get('/api/tutores');
        setClientes(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
      }
    }
    carregarClientes();
  }, []);


  async function deletarCliente(id) {
     console.log("id recebido:", id);
  try {
    await api.delete(`/api/tutores/${id}`);
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  } catch (erro) {
    console.error("Erro ao deletar cliente:", erro);
    alert("Não foi possível deletar o cliente. Tente novamente.");
  }
}


  // função criada para adiciona clientes, e essa função e ativado pelo botão adicionar
  async function addCliente() {
    const novoCliente = { nome, email, telefone, endereco };

    try {
    const resposta = await api.post('/api/tutores', novoCliente);
    setClientes([...clientes, resposta.data]);

    setNome("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setOpenModal(false);
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro);
    alert("Não foi possível cadastrar o cliente. Tente novamente.");
  }
    }

    

  return (
    <div>
      <S.Hcliente>
        <div>
          <h1>Clientes</h1>
          <p>Gerencie os clientes cadastrados</p>
        </div>

        <Button
          $cor={"blue"}
          filho={"+ Cliente"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'100px'}
          fsize={'18px'}
        />
      </S.Hcliente>

      <Tabela
        colunas={["Nome", "Email", "Telefone", "Endereço", "pets", "Acões"]}
        dados={clientes}
        renderLinha={(cliente, index) => (
          <>
            <S.Celula key={`Nome-${index}`}>{cliente.nome}</S.Celula>
            <S.Celula key={`Email-${index}`}>{cliente.email}</S.Celula>
            <S.Celula key={`Telefone-${index}`}>{cliente.telefone}</S.Celula>
            <S.Celula key={`Endereco-${index}`}>{cliente.endereco}</S.Celula>
            <S.Celula key={`Pets-${index}`}>-</S.Celula>
            <S.Celula key={`Acões-${index}`}>
              <div>
                <Button $cor={"transparent"} filho={<S.Edi />} />
                <Button onClick={()=> deletarCliente(cliente.id)} $cor={"transparent"} filho={<S.Del />} />
              </div>
            </S.Celula>
          </>
        )}
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
            <Input
              onChange={(e) => setNome(e.target.value)}
              valor={nome}
              texto={"Nome Completo"}
              type="text"
            />
            <Input
              onChange={(e) => setEmail(e.target.value)}
              valor={email}
              texto={"Email"}
              type="text"
            />
            <Input
              onChange={(e) => setTelefone(e.target.value)}
              valor={telefone}
              texto={"Telefone"}
              type="text"
            />
            <Input
              onChange={(e) => setEndereco(e.target.value)}
              valor={endereco}
              texto={"Endereço"}
              type="text"
            />

            <div>
              <Button
                onClick={addCliente}
                filho={"Adicionar"}
                cor={"#0044c2"}
                type={"button"}
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Clientes;
