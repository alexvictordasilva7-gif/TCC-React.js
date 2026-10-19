import Modal from "../../components/Modal/Modal";
import { useDados } from "../../context/DadosContext";
import { especies } from "../../utils/opcoes";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";
import Form from "../../components/Forms/Forms";
import Ttabela from "../../components//TabelaTeste/TabelaT";
import * as S from "./Pets.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Pets = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  // const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [donoId, setDonoId] = useState("");
  const [petEditando, setPetEditando] = useState(null);
  const { clientes, setClientes, pets, setPets } = useDados();
  
  const normalizar = (p) => ({
  ...p,
  donoId: p.tutorIds?.[0] ?? p.tutorId ?? p.tutor?.id ?? p.tutores?.[0]?.id,
});

  useEffect(() => {
  async function carregar() {
    try {
      const resposta = await api.get("/api/pets?size=200");
      console.log(resposta.data); 
      const lista = resposta.data.content ?? resposta.data;
      setPets(lista.map(normalizar));

      // se abriu o Pets antes do Clientes, o select de dono estaria vazio
      if (clientes.length === 0) {
        const t = await api.get("/api/tutores?size=200");
        setClientes(t.data.content ?? t.data);
      }
    } catch (erro) {
      console.error("Erro ao carregar pets:", erro);
    }
  }
  carregar();
}, []);

  function limparCampos() {
    setNome("");
    // setEspecie("");
    setRaca("");
    setDonoId("");
  }

  function abrirNovo() {
    limparCampos();
    setPetEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(pet) {
    setNome(pet.nome);
    // setEspecie(pet.especie);
    setRaca(pet.raca);
    setDonoId(pet.donoId);
    setPetEditando(pet);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setPetEditando(null);
    setOpenModal(false);
  }

  async function salvarPet() {
  if (!nome || !donoId ) return;

  const dadosBack = { nome , raca, tutorIds: [donoId] }; 

  try {
    if (petEditando) {
      const resposta = await api.put(`/api/pets/${petEditando.id}`, dadosBack);
      setPets(
        pets.map((p) =>
          p.id === petEditando.id ? normalizar({ ...p, ...resposta.data }) : p
        )
      );
    } else {
      const resposta = await api.post("/api/pets", dadosBack);
      setPets([...pets, normalizar(resposta.data)]);
    }
    fecharModal();
  } catch (erro) {
    console.log(erro.response?.data);
    alert("Não foi possível salvar o pet.");
  }
}

 async function deletaPet(id) {
  try {
    await api.delete(`/api/pets/${id}`);
    setPets(pets.filter((p) => p.id !== id));
  } catch (erro) {
    console.log(erro.response?.data);
    alert("Não foi possível excluir o pet.");
  }
}

  const camposPets = [
    { chave: "nome", rotulo: "Nome" },
    // { chave: "especie", rotulo: "Espécie" },
    { chave: "raca", rotulo: "Raça" },
    
    {
      chave: "dono",
      rotulo: "Dono",
      render: (pet) =>
  clientes.find((c) => String(c.id) === String(pet.donoId))?.nome,
    },
  ];

  return (
    <div>
      <S.Hpet>
        <div>
          <h1>Pets</h1>
        </div>
        <div>
          <Button
            texto="Novo Pet"
            onClick={abrirNovo}
            className="btn-primary"
          />
        </div>
      </S.Hpet>

      <Ttabela
        campos={camposPets}
        dados={pets}
        aoEditar={abrirEditar}
        aoExcluir={deletaPet}
      />

      <div>
        <Modal largura={420} isOpen={openModal}>
          <Form
            // props do formulario
            hForm={""}
            tForm={"Novo pet"}
          >
            <Input
              onChange={(e) => setNome(e.target.value)}
              valor={nome}
              texto={"Nome do Pet"}
              type="text"
            />
            {/* <Select
              texto="Espécie"
              valor={especie}
              onChange={(e) => setEspecie(e.target.value)}
              opcoes={especies}
              placeholder="Escolha a espécie"
            /> */}
            <Input
              onChange={(e) => setRaca(e.target.value)}
              valor={raca}
              texto={"Raça"}
              type="text"
            />
            <Select
              texto="Dono"
              valor={donoId}
              onChange={(e) => setDonoId(e.target.value)}
              opcoes={clientes.map((c) => ({ valor: c.id, rotulo: c.nome }))}
              placeholder="Escolha o dono"
            />

            <div className="d-flex gap-2 mt-3">
              <Button
                className="btn-outline-secondary flex-fill"
                onClick={fecharModal}
                texto="Cancelar"
              />

              <Button
                className="btn-primary flex-fill"
                onClick={salvarPet}
                texto="Cadastra"
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Pets;
