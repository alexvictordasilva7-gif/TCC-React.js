import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import * as S from "./Servicos.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Servicos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [valor, setValor] = useState("");
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    async function carregarServicos() {
      try {
        const resposta = await api.get('/api/servicos');
        setServicos(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar serviços:", erro);
      }
    }
    carregarServicos();
  }, []);


  async function deletarServico(id) {
     console.log("id recebido:", id);
  try {
    await api.delete(`/api/servicos/${id}`);
    setServicos(servicos.filter((servico) => servico.id !== id));
  } catch (erro) {
    console.error("Erro ao deletar serviço:", erro);
    alert("Não foi possível deletar o serviço. Tente novamente.");
  }
}


  // função criada para adicionar serviços, e essa função e ativada pelo botão adicionar
  async function addServico() {
    const novoServico = { nome, categoria, descricao, duracao, valor };

    try {
    const resposta = await api.post('/api/servicos', novoServico);
    setServicos([...servicos, resposta.data]);

    setNome("");
    setCategoria("");
    setDescricao("");
    setDuracao("");
    setValor("");
    setOpenModal(false);
  } catch (erro) {
    console.error("Erro ao cadastrar serviço:", erro);
    alert("Não foi possível cadastrar o serviço. Tente novamente.");
  }
    }



  return (
    <div>
      <S.Hservico>
        <div>
          <h1>Serviços</h1>
          <p>Gerencie os serviços cadastrados</p>
        </div>

        <Button
          $cor={"blue"}
          filho={"+ Novo Serviço"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'160px'}
          fsize={'18px'}
        />
      </S.Hservico>

      <S.Grid>
        {servicos.map((servico, index) => (
          <S.Card key={servico.id ?? index}>
            <S.CardHeader>
              <h3>{servico.nome}</h3>
              <S.IconsRow>
                <S.Edi />
                <S.Del onClick={() => deletarServico(servico.id)} />
              </S.IconsRow>
            </S.CardHeader>

            <S.Badge>{servico.categoria}</S.Badge>

            <S.Descricao>{servico.descricao}</S.Descricao>

            <S.Footer>
              <S.Duracao>{servico.duracao} min</S.Duracao>
              <S.Valor>R$ {Number(servico.valor).toFixed(2)}</S.Valor>
            </S.Footer>
          </S.Card>
        ))}
      </S.Grid>

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
            tForm={"Novo serviço"}
          >
            <Input
              onChange={(e) => setNome(e.target.value)}
              valor={nome}
              texto={"Nome do Serviço"}
              type="text"
            />
            <Input
              onChange={(e) => setCategoria(e.target.value)}
              valor={categoria}
              texto={"Categoria"}
              type="text"
            />
            <Input
              onChange={(e) => setDescricao(e.target.value)}
              valor={descricao}
              texto={"Descrição"}
              type="text"
            />
            <Input
              onChange={(e) => setDuracao(e.target.value)}
              valor={duracao}
              texto={"Duração (min)"}
              type="number"
            />
            <Input
              onChange={(e) => setValor(e.target.value)}
              valor={valor}
              texto={"Valor (R$)"}
              type="number"
            />

            <div>
              <Button
                onClick={addServico}
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

export default Servicos;