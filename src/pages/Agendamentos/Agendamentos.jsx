import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import Tabela from "../../components/Tabela/Tabela";
import * as S from "./Agendamentos.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Agendamentos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [pet, setPet] = useState("");
  const [tutor, setTutor] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [servico, setServico] = useState("");
  const [valor, setValor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const resposta = await api.get('/api/agendamentos');
        setAgendamentos(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar agendamentos:", erro);
      }
    }
    carregarAgendamentos();
  }, []);


  async function deletarAgendamento(id) {
     console.log("id recebido:", id);
  try {
    await api.delete(`/api/agendamentos/${id}`);
    setAgendamentos(agendamentos.filter((agendamento) => agendamento.id !== id));
  } catch (erro) {
    console.error("Erro ao deletar agendamento:", erro);
    alert("Não foi possível deletar o agendamento. Tente novamente.");
  }
}


  // função criada para adicionar agendamentos, e essa função e ativada pelo botão adicionar
  async function addAgendamento() {
    const novoAgendamento = { pet, tutor, data, horario, servico, valor, observacoes };

    try {
    const resposta = await api.post('/api/agendamentos', novoAgendamento);
    setAgendamentos([...agendamentos, resposta.data]);

    setPet("");
    setTutor("");
    setData("");
    setHorario("");
    setServico("");
    setValor("");
    setObservacoes("");
    setOpenModal(false);
  } catch (erro) {
    console.error("Erro ao cadastrar agendamento:", erro);
    alert("Não foi possível cadastrar o agendamento. Tente novamente.");
  }
    }



  return (
    <div>
      <S.Hagendamentos>
        <div>
          <h1>Agendamentos</h1>
          <p>Gerencie os agendamentos cadastrados</p>
        </div>

        <Button
          $cor={"blue"}
          filho={"+ Agendamento"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'150px'}
          fsize={'18px'}
        />
      </S.Hagendamentos>

      <Tabela
        colunas={["Pet", "Tutor", "Data", "Horário", "Serviço", "Valor", "Observações", "Acões"]}
        dados={agendamentos}
        renderLinha={(agendamento, index) => (
          <>
            <S.Celula key={`Pet-${index}`}>{agendamento.pet}</S.Celula>
            <S.Celula key={`Tutor-${index}`}>{agendamento.tutor}</S.Celula>
            <S.Celula key={`Data-${index}`}>{agendamento.data}</S.Celula>
            <S.Celula key={`Horario-${index}`}>{agendamento.horario}</S.Celula>
            <S.Celula key={`Servico-${index}`}>{agendamento.servico}</S.Celula>
            <S.Celula key={`Valor-${index}`}>{agendamento.valor ? `R$ ${agendamento.valor}` : "-"}</S.Celula>
            <S.Celula key={`Observacoes-${index}`}>{agendamento.observacoes || "-"}</S.Celula>
            <S.Celula key={`Acões-${index}`}>
              <div>
                <Button $cor={"transparent"} filho={<S.Edi />} />
                <Button onClick={()=> deletarAgendamento(agendamento.id)} $cor={"transparent"} filho={<S.Del />} />
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
            tForm={"Novo agendamento"}
          >
            <Input
              onChange={(e) => setPet(e.target.value)}
              valor={pet}
              texto={"Pet"}
              type="text"
            />
            <Input
              onChange={(e) => setTutor(e.target.value)}
              valor={tutor}
              texto={"Tutor"}
              type="text"
            />
            <Input
              onChange={(e) => setData(e.target.value)}
              valor={data}
              texto={"Data"}
              type="date"
            />
            <Input
              onChange={(e) => setHorario(e.target.value)}
              valor={horario}
              texto={"Horário"}
              type="time"
            />
            <Input
              onChange={(e) => setServico(e.target.value)}
              valor={servico}
              texto={"Serviço"}
              type="text"
            />
            <Input
              onChange={(e) => setValor(e.target.value)}
              valor={valor}
              texto={"Valor (R$)"}
              type="number"
            />

            <div>
              <label>Observações (opcional)</label>
              <textarea
                onChange={(e) => setObservacoes(e.target.value)}
                value={observacoes}
                placeholder="Alergias, preferências..."
                rows={3}
                style={{ width: "100%", resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div>
              <Button
                onClick={addAgendamento}
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

export default Agendamentos;