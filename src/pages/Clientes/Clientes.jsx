import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useDados } from "../../context/DadosContext";
import { X } from "lucide-react";
import Form from "../../components/Forms/Forms";
import Ttabela from "../../components/TabelaTeste/TabelaT";
import * as S from "./Clientes.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Clientes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [clienteEditado, setClienteEditado] = useState(null);
  const { clientes, setClientes, pets, setPets } = useDados();

  useEffect(() => {
  async function carregarClientes() {
    try {
      const resposta = await api.get("/api/tutores?size=200");
      const lista = resposta.data.content ?? resposta.data;

      // mantém o email e o endereço que já estavam no front
      setClientes((atuais) =>
        lista.map((t) => {
          const local = atuais.find((c) => String(c.id) === String(t.id));
          return { ...t, email: local?.email, endereco: local?.endereco };
        })
      );
    } catch (erro) {
      console.error("Erro ao carregar clientes:", erro);
    }
  }
  carregarClientes();
}, []);

  //deleta cliente e se tiver um pet associado ao cliente deleta os 2
  async function deletarCliente(id) {
  try {
    await api.delete(`/api/tutores/${id}`);
    setClientes(clientes.filter((c) => c.id !== id));
    setPets(pets.filter((p) => String(p.donoId) !== String(id)));
  } catch (erro) {
    console.log(erro.response?.data);
    alert("Não foi possível excluir. Verifique se ele tem pets cadastrados.");
  }
}

  // função criada para adiciona clientes, e essa função e ativado pelo botão adicionar
  function limparCampos() {
    setNome("");
    setEmail("");
    setEndereco("");
    setTelefone("");
  }

  function abrirNovo() {
    limparCampos();
    setClienteEditado(null);
    setOpenModal(true);
  }

  function abrirEditar(clientes) {
    setNome(clientes.nome);
    setEmail(clientes.email);
    setEndereco(clientes.endereco);
    setTelefone(clientes.telefone);
    setClienteEditado(clientes);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setClienteEditado(null);
    setOpenModal(false);
  }

  async function salvarClient() {
  if (!nome) return;

  const dadosBack = { nome, telefone }; // CONFIRMAR os nomes dos campos
  const soFront = { email, endereco };  // não existem no back

  try {
    if (clienteEditado) {
      // EDITAR
      const resposta = await api.put(`/api/tutores/${clienteEditado.id}`, dadosBack);
      setClientes(
        clientes.map((c) =>
          c.id === clienteEditado.id ? { ...c, ...resposta.data, ...soFront } : c
        )
      );
    } else {
      // CADASTRAR
      const resposta = await api.post("/api/tutores", dadosBack);
      setClientes([...clientes, { ...resposta.data, ...soFront }]);
    }
    fecharModal();
  } catch (erro) {
    console.log(erro.response?.data);
    alert("Não foi possível salvar o cliente.");
  }
}

  //campos fixos da tabela
  const camposClientes = [
    { chave: "nome", rotulo: "Nome" },
    { chave: "email", rotulo: "Email" },
    { chave: "endereco", rotulo: "Endereço" },
    { chave: "telefone", rotulo: "Telefone" },
    {
      chave: "pets",
      rotulo: "Pets",
      render: (cliente) => pets.filter((p) => p.donoId === cliente.id).length,
    },
  ];

  return (
    <div>
      <S.Hcliente>
        <div>
          <h1>Clientes</h1>
        </div>

        <div>
          <Button
            className="btn-primary"
            texto="Novo Cliente"
            onClick={abrirNovo}
          />
        </div>
      </S.Hcliente>

      <Ttabela
        campos={camposClientes}
        dados={clientes}
        aoExcluir={deletarCliente}
        aoEditar={abrirEditar}
      />

      <div>
        <Modal largura="420" isOpen={openModal}>
          <Form
            // props do formulario
            hForm={""}
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

            <div className="d-flex gap-2 mt-3">
              <Button
                className="btn-outline-secondary flex-fill"
                onClick={() => setOpenModal(false)}
                texto="Cancelar"
              />

              <Button
                className="btn-primary flex-fill"
                onClick={salvarClient}
                texto="Cadastra"
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Clientes;
