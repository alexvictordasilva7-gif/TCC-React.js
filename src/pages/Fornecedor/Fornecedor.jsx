import { useEffect, useState } from "react";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto } from "../../utils/opcoes";
import api from "../../service/api";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import Tabela from "../../components/TabelaTeste/TabelaT";
import CardResumo from "../../components/Cards/CardResumo";
import BarraFiltro from "../../components/Filtro/BarraFiltro";
import * as S from "./Fornecedor.Styled";

// 14 números -> 00.000.000/0000-00
const formatarCnpj = (c) =>
  String(c ?? "").replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );

// por enquanto a categoria usa a lista do produto (só na tela)
const rotuloCategoria = (valor) =>
  categoriasProduto.find((c) => c.valor === valor)?.rotulo ?? valor;

// o "contato" da tela é o nomeFantasia do back
const doBack = (f) => ({ ...f, nomeContato: f.nomeFantasia });

const Fornecedor = () => {
  const { fornecedores, setFornecedores, produtos } = useDados();

  const [openModal, setOpenModal] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  // carrega os fornecedores do back ao abrir a página
  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const resposta = await api.get("/api/fornecedores?size=200");
        const lista = resposta.data.content ?? resposta.data;

        // mantém o que só existe no front (categoria e status)
        setFornecedores((atuais) =>
          lista.map((f) => {
            const local = atuais.find((x) => String(x.id) === String(f.id));
            return {
              ...doBack(f),
              categoria: f.categoria ?? local?.categoria,
              status: local?.status ?? "Ativo",
            };
          }),
        );
      } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
      }
    }
    carregarFornecedores();
  }, []);

  // ---------- modal ----------
  function limparCampos() {
    setRazaoSocial("");
    setCnpj("");
    setCategoria("");
    setNomeContato("");
    setTelefone("");
    setEmail("");
    setStatus("Ativo");
  }

  function abrirNovo() {
    limparCampos();
    setFornecedorEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(f) {
    setRazaoSocial(f.razaoSocial ?? "");
    setCnpj(f.cnpj ?? "");
    setCategoria(f.categoria ?? "");
    setNomeContato(f.nomeContato ?? "");
    setTelefone(f.telefone ?? "");
    setEmail(f.email ?? "");
    setStatus(f.status ?? "Ativo");
    setFornecedorEditando(f);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setFornecedorEditando(null);
    setOpenModal(false);
  }

  // ---------- salvar e excluir ----------
  async function salvarFornecedor() {
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    if (!razaoSocial || !categoria) return;
    if (cnpjLimpo.length !== 14) {
      alert("O CNPJ deve ter 14 números.");
      return;
    }

    const dadosBack = {
      razaoSocial,
      cnpj: cnpjLimpo,
      nomeFantasia: nomeContato || null,
      categoria, 
      telefone: telefone || null,
      email: email || null,
    };

    // o que só existe no front
    const soFront = { categoria, status };

    try {
      if (fornecedorEditando) {
        const resposta = await api.put(
          `/api/fornecedores/${fornecedorEditando.id}`,
          dadosBack,
        );
        setFornecedores(
          fornecedores.map((f) =>
            f.id === fornecedorEditando.id
              ? { ...f, ...doBack(resposta.data), ...soFront }
              : f,
          ),
        );
      } else {
        const resposta = await api.post("/api/fornecedores", dadosBack);
        setFornecedores([
          ...fornecedores,
          { ...doBack(resposta.data), ...soFront },
        ]);
      }
      fecharModal();
    } catch (erro) {
      console.log(erro.response?.data);
      alert(
        erro.response?.data?.mensagens?.join("\n") ??
          "Não foi possível salvar o fornecedor.",
      );
    }
  }

  async function deletarFornecedor(id) {
    if (produtos.some((p) => String(p.fornecedorId) === String(id))) {
      alert(
        "Este fornecedor tem produtos no estoque. Exclua ou troque o fornecedor deles primeiro.",
      );
      return;
    }
    try {
      await api.delete(`/api/fornecedores/${id}`);
      setFornecedores(fornecedores.filter((f) => f.id !== id));
    } catch (erro) {
      console.log(erro.response?.data);
      alert(
        "Não foi possível excluir o fornecedor. Verifique se ele tem produtos cadastrados.",
      );
    }
  }

  // ---------- filtros ----------
  const contar = (s) => fornecedores.filter((f) => f.status === s).length;

  const filtros = [
    { chave: "Todos", rotulo: "Todos", quantidade: fornecedores.length },
    { chave: "Ativo", rotulo: "Ativos", quantidade: contar("Ativo") },
    { chave: "Inativo", rotulo: "Inativos", quantidade: contar("Inativo") },
  ];

  const visiveis = fornecedores.filter((f) => {
    const passaFiltro = filtroAtivo === "Todos" || f.status === filtroAtivo;
    const texto = busca.toLowerCase();
    const passaBusca = [
      f.razaoSocial,
      f.nomeContato,
      rotuloCategoria(f.categoria),
    ].some((campo) => (campo ?? "").toLowerCase().includes(texto));
    return passaFiltro && passaBusca;
  });

  // ---------- colunas ----------
  const camposFornecedores = [
    {
      chave: "razaoSocial",
      rotulo: "Fornecedor",
      render: (f) => (
        <div>
          <div className="fw-semibold">{f.razaoSocial}</div>
          <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
            {f.email}
          </div>
        </div>
      ),
    },
    {
      chave: "categoria",
      rotulo: "Categoria",
      render: (f) =>
        f.categoria && (
          <span className="badge bg-primary-subtle text-primary">
            {rotuloCategoria(f.categoria)}
          </span>
        ),
    },
    {
      chave: "contato",
      rotulo: "Contato",
      render: (f) => (
        <div>
          <div>{f.nomeContato}</div>
          <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
            {f.telefone}
          </div>
        </div>
      ),
    },
    { chave: "cnpj", rotulo: "CNPJ", render: (f) => formatarCnpj(f.cnpj) },
    {
      chave: "status",
      rotulo: "Status",
      render: (f) => (
        <span className="d-inline-flex align-items-center gap-2">
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: 8,
              height: 8,
              backgroundColor: f.status === "Ativo" ? "#16a34a" : "#9ca3af",
            }}
          />
          {f.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <S.Hfornecedor>
        <div>
          <h2>Fornecedores</h2>
          <p className="text-secondary">
            {fornecedores.length} fornecedores cadastrados
          </p>
        </div>
        <div>
          <Button
            className="btn-primary"
            texto="Novo Fornecedor"
            onClick={abrirNovo}
          />
        </div>
      </S.Hfornecedor>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <CardResumo
            titulo="Total"
            valor={fornecedores.length}
            icone="building"
            corIcone="#2563eb"
            fundoIcone="#e0edff"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Ativos"
            valor={contar("Ativo")}
            icone="building"
            corIcone="#16a34a"
            fundoIcone="#dcfce7"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Inativos"
            valor={contar("Inativo")}
            icone="building"
            corIcone="#6b7280"
            fundoIcone="#f1f1f1"
          />
        </div>
      </div>

      <BarraFiltro
        busca={busca}
        aoBuscar={setBusca}
        placeholder="Buscar fornecedor, contato, categoria..."
        filtros={filtros}
        filtroAtivo={filtroAtivo}
        aoMudarFiltro={setFiltroAtivo}
      />

      <Tabela
        campos={camposFornecedores}
        dados={visiveis}
        aoEditar={abrirEditar}
        aoExcluir={deletarFornecedor}
      />

      <Modal largura={500} isOpen={openModal}>
        <Form
          hForm=""
          tForm={fornecedorEditando ? "Editar fornecedor" : "Novo fornecedor"}
        >
          <Input
            onChange={(e) => setRazaoSocial(e.target.value)}
            valor={razaoSocial}
            texto="Razão Social / Nome"
            type="text"
          />

          <div className="row">
            <div className="col-6">
              <Input
                onChange={(e) => setCnpj(e.target.value)}
                valor={cnpj}
                texto="CNPJ"
                type="text"
              />
            </div>
            <div className="col-6">
              <Select
                texto="Categoria"
                valor={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                opcoes={categoriasProduto}
                placeholder="Escolha a categoria"
              />
            </div>
          </div>

          <Input
            onChange={(e) => setNomeContato(e.target.value)}
            valor={nomeContato}
            texto="Nome do Contato"
            type="text"
          />

          <div className="row">
            <div className="col-6">
              <Input
                onChange={(e) => setTelefone(e.target.value)}
                valor={telefone}
                texto="Telefone"
                type="text"
              />
            </div>
            <div className="col-6">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                valor={email}
                texto="Email"
                type="text"
              />
            </div>
          </div>

          <label className="form-label mt-3">Status</label>
          <div className="mb-3">
            {["Ativo", "Inativo"].map((opcao) => (
              <div className="form-check form-check-inline" key={opcao}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="status"
                  id={`status-${opcao}`}
                  value={opcao}
                  checked={status === opcao}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <label className="form-check-label" htmlFor={`status-${opcao}`}>
                  {opcao}
                </label>
              </div>
            ))}
          </div>

          <div className="d-flex gap-2 mt-3">
            <Button
              className="btn-outline-secondary flex-fill"
              onClick={fecharModal}
              texto="Cancelar"
            />
            <Button
              className="btn-primary flex-fill"
              onClick={salvarFornecedor}
              texto={fornecedorEditando ? "Salvar" : "Cadastrar"}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Fornecedor;
