import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { useDados } from "../../context/DadosContext";
import Button from "../../components/Button/Button";
import ButtonX from "../../components/Button/Button";
import { categorias, servicosPet } from "../../utils/opcoes";
import CardServico from "../../components/Cards/CardServico";
import { X } from "lucide-react";
import { alerta } from "../../utils/Alertas";
import Form from "../../components/Forms/Forms";
import * as S from "./Servicos.Styled";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import { useEffect, useState } from "react";
import api from "../../service/api";

// Aviso de erro exibido embaixo dos campos (usado nos Selects, que ainda não têm a prop "erro")
const MsgErro = ({ children }) =>
  children ? (
    <small
      role="alert"
      style={{
        display: "block",
        marginTop: 4,
        color: "#e5534b",
        fontSize: "0.8rem",
        fontWeight: 500,
      }}
    >
      {children}
    </small>
  ) : null;

const Servicos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [valor, setValor] = useState("");
  const [erros, setErros] = useState({});

  const { servicos, setServicos } = useDados();

  // Traduz os dados do backend para o formato usado no frontend
  const normalizar = (s) => ({
    ...s,
    valor: s.preco,
    duracao: s.duracaoMinutos,
    categoria: s.categoria,
    tipo: s.tipoServico,
  });

  // Carrega os serviços do backend
  useEffect(() => {
    async function carregarServicos() {
      try {
        const resposta = await api.get("/api/servicos?size=200");
        const lista = resposta.data.content ?? resposta.data;

        setServicos(lista.map(normalizar));
      } catch (erro) {
        alerta.erro("Erro ao carregar serviços.");
      }
    }

    carregarServicos();
  }, []);

  function limparCampos() {
    setTipo("");
    setCategoria("");
    setDescricao("");
    setDuracao("");
    setValor("");
    setErros({});
  }

  function abrirNovo() {
    limparCampos();
    setServicoEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(servico) {
    setErros({});
    setTipo(servico.tipoServico ?? servico.tipo ?? "");
    setCategoria(servico.categoria ?? "");
    setDescricao(servico.descricao ?? "");
    setDuracao(servico.duracaoMinutos ?? servico.duracao ?? "");
    setValor(servico.preco ?? servico.valor ?? "");
    setServicoEditando(servico);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setServicoEditando(null);
    setOpenModal(false);
  }

  // valida os campos obrigatórios e guarda a mensagem de cada um em "erros"
  function validar() {
    const novosErros = {};

    if (!tipo) novosErros.tipo = "Escolha o tipo de serviço.";
    if (!categoria) novosErros.categoria = "Escolha a categoria.";

    if (duracao === "" || Number(duracao) <= 0) {
      novosErros.duracao = "Informe a duração em minutos.";
    }

    if (valor === "" || Number(valor) < 0) {
      novosErros.valor = "Informe um valor válido.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // remove o erro de um campo assim que a pessoa volta a preenchê-lo
  function limparErro(campo) {
    setErros((prev) => ({ ...prev, [campo]: "" }));
  }

  // Cadastra ou edita um serviço
  const salvarServico = async () => {
    if (!validar()) return;

    const dadosBack = {
      nome: servicosPet.find((s) => s.valor === tipo)?.rotulo ?? tipo,
      tipoServico: tipo,
      categoria: categoria,
      preco: Number(valor),
      duracaoMinutos: Number(duracao),
      descricao,
    };

    console.log("JSON enviado ao backend:", dadosBack);

    try {
      if (servicoEditando) {
        const resposta = await api.put(
          `/api/servicos/${servicoEditando.id}`,
          dadosBack,
        );

        setServicos(
          servicos.map((s) =>
            s.id === servicoEditando.id ? normalizar(resposta.data) : s,
          ),
        );
        alerta.sucesso("Serviço atualizado com sucesso!");
      } else {
        const resposta = await api.post("/api/servicos", dadosBack);

        setServicos([...servicos, normalizar(resposta.data)]);
        alerta.sucesso("Serviço cadastrado com sucesso!");
      }

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar serviço:", erro.response?.data ?? erro);

      alerta.erro(
        erro.response?.data?.mensagens?.join("\n") ??
          "Não foi possível salvar o serviço.",
      );
    }
  };

  // Exclui um serviço
  async function deletarServico(id) {
    try {
      await api.delete(`/api/servicos/${id}`);

      setServicos(servicos.filter((s) => s.id !== id));
      alerta.sucesso("Serviço excluído.");
    } catch (erro) {
      console.error("Erro ao excluir serviço:", erro.response?.data ?? erro);
      alerta.erro("Não foi possível excluir o serviço.");
    }
  }

  return (
    <div>
      <CabecalhoPagina
        sobre="Catálogo"
        icone="stars"
        titulo="Serviços"
        subtitulo={`${servicos.length} ${servicos.length === 1 ? "serviço cadastrado" : "serviços cadastrados"}`}
        acao={
          <Button
            className="btn-primary"
            texto={<><i className="bi bi-plus-lg me-1"></i> Novo Serviço</>}
            onClick={abrirNovo}
          />
        }
      />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {servicos.map((servico) => (
          <div className="col" key={servico.id}>
            <CardServico
              servico={servico}
              aoEditar={abrirEditar}
              aoExcluir={deletarServico}
            />
          </div>
        ))}
      </div>

      <div>
        <Modal largura={760} isOpen={openModal}>
          <Form
            hForm={<ButtonX texto={<X size={16} />} onClick={fecharModal} />}
            tForm={servicoEditando ? "Editar serviço" : "Novo serviço"}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <Select
                  texto="Tipo de serviço *"
                  valor={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value);
                    limparErro("tipo");
                  }}
                  opcoes={servicosPet}
                  placeholder="Ex.: Banho e tosa"
                />
                <MsgErro>{erros.tipo}</MsgErro>
              </div>

              <div className="col-md-6">
                <Select
                  texto="Categoria *"
                  valor={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    limparErro("categoria");
                  }}
                  opcoes={categorias}
                  placeholder="Ex.: Estética"
                />
                <MsgErro>{erros.categoria}</MsgErro>
              </div>

              <div className="col-12">
                <Input
                  onChange={(e) => setDescricao(e.target.value)}
                  valor={descricao}
                  texto="Descrição"
                  type="text"
                  placeholder="Ex.: Banho com shampoo hipoalergênico"
                  obrigatorio={false}
                />
              </div>

              <div className="col-md-6">
                <Input
                  onChange={(e) => {
                    setDuracao(e.target.value);
                    limparErro("duracao");
                  }}
                  valor={duracao}
                  texto="Duração (min) *"
                  type="number"
                  placeholder="Ex.: 60"
                  erro={erros.duracao}
                />
              </div>

              <div className="col-md-6">
                <Input
                  onChange={(e) => {
                    setValor(e.target.value);
                    limparErro("valor");
                  }}
                  valor={valor}
                  texto="Valor (R$) *"
                  type="number"
                  placeholder="Ex.: 80.00"
                  erro={erros.valor}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 mt-2 border-top">
              <Button
                className="btn-outline-secondary px-4"
                onClick={fecharModal}
                texto="Cancelar"
              />
              <Button
                className="btn-primary px-4"
                onClick={salvarServico}
                texto={servicoEditando ? "Salvar alterações" : "Cadastrar serviço"}
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Servicos;