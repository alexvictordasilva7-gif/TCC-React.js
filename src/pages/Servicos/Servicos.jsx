
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { useDados } from "../../context/DadosContext";
import Button from "../../components/Button/Button";
import ButtonX from "../../components/Button/Button";
import { categorias, servicosPet } from "../../utils/opcoes";
import CardServico from "../../components/Cards/CardServico";
import { X } from "lucide-react";
import Form from "../../components/Forms/Forms";
import * as S from "./Servicos.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Servicos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [valor, setValor] = useState("");

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
        console.error("Erro ao carregar serviços:", erro);
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
  }

  function abrirNovo() {
    limparCampos();
    setServicoEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(servico) {
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

  // Cadastra ou edita um serviço
  const salvarServico = async () => {
    if (!tipo || valor === "" || duracao === "" || !categoria) {
      alert("Preencha o tipo, a categoria, a duração e o valor.");
      return;
    }

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
          dadosBack
        );

        setServicos(
          servicos.map((s) =>
            s.id === servicoEditando.id
              ? normalizar(resposta.data)
              : s
          )
        );
      } else {
        const resposta = await api.post("/api/servicos", dadosBack);

        setServicos([
          ...servicos,
          normalizar(resposta.data),
        ]);
      }

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar serviço:", erro.response?.data ?? erro);

      alert(
        erro.response?.data?.mensagens?.join("\n") ??
          "Não foi possível salvar o serviço."
      );
    }
  };

  // Exclui um serviço
  async function deletarServico(id) {
    try {
      await api.delete(`/api/servicos/${id}`);

      setServicos(servicos.filter((s) => s.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir serviço:", erro.response?.data ?? erro);
      alert("Não foi possível excluir o serviço.");
    }
  }

  return (
    <div className="max-h-90vh">
      <S.Hservico>
        <div>
          <h1>Serviços</h1>
        </div>

        <div>
          <Button
            className="btn-primary"
            texto="Novo Serviço"
            onClick={abrirNovo}
          />
        </div>
      </S.Hservico>

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
        <Modal largura={420} isOpen={openModal}>
          <Form
            hForm={
              <ButtonX
                texto={<X size={16} />}
                onClick={fecharModal}
              />
            }
            tForm={servicoEditando ? "Editar serviço" : "Novo serviço"}
          >
            <Select
              texto="Tipo de serviço"
              valor={tipo}
              onChange={(e) => setTipo(e.target.value)}
              opcoes={servicosPet}
              placeholder="Escolha o serviço"
            />

            <Select
  texto="Categoria"
  valor={categoria}
  onChange={(e) => setCategoria(e.target.value)}
  opcoes={categorias}
  placeholder="Escolha a categoria"
/>

            <Input
              onChange={(e) => setDescricao(e.target.value)}
              valor={descricao}
              texto="Descrição"
              type="text"
            />

            <Input
              onChange={(e) => setDuracao(e.target.value)}
              valor={duracao}
              texto="Duração (min)"
              type="number"
            />

            <Input
              onChange={(e) => setValor(e.target.value)}
              valor={valor}
              texto="Valor (R$)"
              type="number"
            />

            <div className="d-flex gap-2 mt-3">
              <Button
                className="btn-outline-secondary flex-fill"
                onClick={fecharModal}
                texto="Cancelar"
              />

              <Button
                className="btn-primary flex-fill"
                onClick={salvarServico}
                texto={servicoEditando ? "Salvar" : "Cadastrar"}
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Servicos;
