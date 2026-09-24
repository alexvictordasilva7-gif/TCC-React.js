import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import Tabela from "../../components/Tabela/Tabela";
import * as S from "./Pets.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Pets = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [tutor, setTutor] = useState("");
  const [pets, setPets] = useState([]);

  useEffect(() => {
    async function carregarPets() {
      try {
        const resposta = await api.get('/api/pets');
        setPets(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar pets:", erro);
      }
    }
    carregarPets();
  }, []);


  async function deletarPet(id) {
     console.log("id recebido:", id);
  try {
    await api.delete(`/api/pets/${id}`);
    setPets(pets.filter((pet) => pet.id !== id));
  } catch (erro) {
    console.error("Erro ao deletar pet:", erro);
    alert("Não foi possível deletar o pet. Tente novamente.");
  }
}


  // função criada para adicionar pets, e essa função e ativada pelo botão adicionar
  async function addPet() {
    const novoPet = { nome, especie, raca, idade, tutor };

    try {
    const resposta = await api.post('/api/pets', novoPet);
    setPets([...pets, resposta.data]);

    setNome("");
    setEspecie("");
    setRaca("");
    setIdade("");
    setTutor("");
    setOpenModal(false);
  } catch (erro) {
    console.error("Erro ao cadastrar pet:", erro);
    alert("Não foi possível cadastrar o pet. Tente novamente.");
  }
    }



  return (
    <div>
      <S.Hpet>
        <div>
          <h1>Pets</h1>
          <p>Gerencie os pets cadastrados</p>
        </div>

        <Button
          $cor={"blue"}
          filho={"+ Pet"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'100px'}
          fsize={'18px'}
        />
      </S.Hpet>

      <Tabela
        colunas={["Nome", "Espécie", "Raça", "Idade", "Tutor", "Acões"]}
        dados={pets}
        renderLinha={(pet, index) => (
          <>
            <S.Celula key={`Nome-${index}`}>{pet.nome}</S.Celula>
            <S.Celula key={`Especie-${index}`}>{pet.especie}</S.Celula>
            <S.Celula key={`Raca-${index}`}>{pet.raca}</S.Celula>
            <S.Celula key={`Idade-${index}`}>{pet.idade}</S.Celula>
            <S.Celula key={`Tutor-${index}`}>{pet.tutor}</S.Celula>
            <S.Celula key={`Acões-${index}`}>
              <div>
                <Button $cor={"transparent"} filho={<S.Edi />} />
                <Button onClick={()=> deletarPet(pet.id)} $cor={"transparent"} filho={<S.Del />} />
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
            tForm={"Novo pet"}
          >
            <Input
              onChange={(e) => setNome(e.target.value)}
              valor={nome}
              texto={"Nome do Pet"}
              type="text"
            />
            <Input
              onChange={(e) => setEspecie(e.target.value)}
              valor={especie}
              texto={"Espécie"}
              type="text"
            />
            <Input
              onChange={(e) => setRaca(e.target.value)}
              valor={raca}
              texto={"Raça"}
              type="text"
            />
            <Input
              onChange={(e) => setIdade(e.target.value)}
              valor={idade}
              texto={"Idade"}
              type="text"
            />
            <Input
              onChange={(e) => setTutor(e.target.value)}
              valor={tutor}
              texto={"Tutor"}
              type="text"
            />

            <div>
              <Button
                onClick={addPet}
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

export default Pets;