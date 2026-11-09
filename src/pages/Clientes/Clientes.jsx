import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useDados } from "../../context/DadosContext";
import Form from "../../components/Forms/Forms";
import Ttabela from "../../components/TabelaTeste/TabelaT";
import * as S from "./Clientes.Styled";
import { alerta } from "../../utils/Alertas";
import { useEffect, useState } from "react";
import api from "../../service/api";

// Aqui padronizamos para pet.donoId, igual ao que a página de Pets faz.
const normalizar = (p) => ({
  ...p,
  donoId: p.tutorIds?.[0] ?? p.tutorId ?? p.tutor?.id ?? p.tutores?.[0]?.id,
});

const Clientes = () => {
  const [openModal, setOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erros, setErros] = useState({});
  const [clienteEditado, setClienteEditado] = useState(null);
  const { clientes, setClientes, pets, setPets } = useDados();

  // Carrega clientes e pets ao abrir a página, sem depender de outra tela.
  // allSettled: se uma das buscas falhar, a outra continua funcionando.
  useEffect(() => {
    async function carregar() {
      const [resClientes, resPets] = await Promise.allSettled([
        api.get("/api/tutores?size=200"),
        api.get("/api/pets?size=200"),
      ]);

      if (resClientes.status === "fulfilled") {
        const dados = resClientes.value.data;
        setClientes(dados.content ?? dados);
      } else {
        console.log(resClientes.reason?.response?.data);
        alerta.erro("Não foi possível carregar os clientes.");
      }

      if (resPets.status === "fulfilled") {
        const dados = resPets.value.data;
        setPets((dados.content ?? dados).map(normalizar));
      } else {
        console.log(resPets.reason?.response?.data);
        alerta.erro("Não foi possível carregar os pets.");
      }
    }

    carregar();
  }, []);

  // valida os campos obrigatórios e guarda a mensagem de cada um em "erros"
  function validar() {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do cliente.";

    if (!telefone.trim()) {
      novosErros.telefone = "Digite um telefone válido (11 dígitos).";
    } else if (!/^\d{10,11}$/.test(telefone.replace(/\D/g, ""))) {
      novosErros.telefone = "Digite um telefone válido (11 dígitos).";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // remove o erro de um campo assim que a pessoa volta a digitar nele
  function limparErro(campo) {
    setErros((prev) => ({ ...prev, [campo]: "" }));
  }

  async function salvarClient() {
    if (!validar()) return;

    const dadosBack = { nome, email, telefone, endereco };

    try {
      if (clienteEditado) {
        const resposta = await api.put(
          `/api/tutores/${clienteEditado.id}`,
          dadosBack,
        );
        setClientes(
          clientes.map((c) => (c.id === clienteEditado.id ? resposta.data : c)),
        );
        alerta.sucesso("Cliente atualizado com sucesso!");
      } else {
        const resposta = await api.post("/api/tutores", dadosBack);
        setClientes([...clientes, resposta.data]);
        alerta.sucesso("Cliente salvo com sucesso!");
      }
      fecharModal();
    } catch (erro) {
      console.log(erro.response?.data);
      alerta.erro(
        erro.response?.data?.mensagens?.join("\n") ??
          "Não foi possível salvar o cliente.",
      );
    }
  }

  // deleta o cliente e também os pets associados a ele
  async function deletarCliente(id) {
    try {
      await api.delete(`/api/tutores/${id}`);
      setClientes(clientes.filter((c) => c.id !== id));
      setPets(pets.filter((p) => String(p.donoId) !== String(id)));
      alerta.sucesso("Cliente excluído.");
    } catch (erro) {
      console.log(erro.response?.data);
      alerta.erro("Não foi possível excluir.");
    }
  }

  function limparCampos() {
    setNome("");
    setEmail("");
    setEndereco("");
    setTelefone("");
    setErros({});
  }

  function abrirNovo() {
    limparCampos();
    setClienteEditado(null);
    setOpenModal(true);
  }

  function abrirEditar(cliente) {
    setErros({});
    setNome(cliente.nome);
    setEmail(cliente.email);
    setEndereco(cliente.endereco);
    setTelefone(cliente.telefone);
    setClienteEditado(cliente);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setClienteEditado(null);
    setOpenModal(false);
  }

  // campos fixos da tabela
  const camposClientes = [
    { chave: "nome", rotulo: "Nome" },
    { chave: "email", rotulo: "Email" },
    { chave: "endereco", rotulo: "Endereço" },
    { chave: "telefone", rotulo: "Telefone" },
    {
      chave: "pets",
      rotulo: "Pets",
      render: (cliente) =>
        pets.filter((p) => String(p.donoId) === String(cliente.id)).length,
    },
  ];

  return (
    <div>
      <S.Hcliente>
        <div>
          <h2>Clientes</h2>
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
          <Form hForm={""} tForm={clienteEditado ? "Editar cliente" : "Novo cliente"}>
            <Input
              onChange={(e) => {
                setNome(e.target.value);
                limparErro("nome");
              }}
              valor={nome}
              texto={"Nome Completo *"}
              type="text"
              erro={erros.nome}
              placeholder="ex: João da Silva"

            />
            <Input
              onChange={(e) => {
                setEmail(e.target.value);
                limparErro("email");
              }}
              valor={email}
              texto={"Email"}
              type="text"
              obrigatorio={false}
              placeholder="exemplo@seuemail.com.br"
            />
            <Input
              onChange={(e) => 
                {setTelefone(e.target.value);
                limparErro("Telefone")
                }
              }
              valor={telefone}
              texto={"Telefone *"}
              type="text"
              erro={erros.telefone}
              placeholder="ex: (00) 00000-0000"

            />
            <Input
              onChange={(e) => setEndereco(e.target.value)}
              valor={endereco}
              texto={"Endereço"}
              type="text"
              obrigatorio={false}
              placeholder="ex: Rua, número, bairro, cidade, estado"
            />

            <div className="d-flex gap-2 mt-3">
              <Button
                className="btn-outline-secondary flex-fill"
                onClick={fecharModal}
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