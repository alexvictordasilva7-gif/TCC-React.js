import * as S from "./Estoque.Styled";
import { useState } from "react";
import { useDados } from "../../context/DadosContext";
import { categoriasProduto } from "../../utils/opcoes";
import CardResumo from "../../components/Cards/CardResumo.jsx";
import AlertaAviso from "../../components/AlertaAviso/AlertaAviso.jsx";
import Button from "../../components/Button/Button.jsx";
import Select from "../../components/Select/Select.jsx";
import Form from "../../components/Forms/Forms.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Tabela from "../../components/TabelaTeste/TabelaT.jsx";

const moeda = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function hojeISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function Estoque() {
  const { produtos, setProdutos, fornecedores } = useDados();

  const [openModal, setOpenModal] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [qtdMinima, setQtdMinima] = useState("");
  const [preco, setPreco] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");

  // ---------- alertas ----------
  const estoqueBaixo = (p) => Number(p.quantidade) <= Number(p.qtdMinima);
  const produtosBaixos = produtos.filter(estoqueBaixo);
  const valorTotal = produtos.reduce(
    (soma, p) => soma + Number(p.quantidade) * Number(p.preco),
    0,
  );

  function limparCampos() {
    setNome("");
    setCategoria("");
    setQuantidade("");
    setQtdMinima("");
    setPreco("");
    setFornecedorId("");
  }

  function abrirNovo() {
    limparCampos();
    setProdutoEditando(null);
    setOpenModal(true);
  }

  function abrirEditar(produto) {
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setQuantidade(produto.quantidade);
    setQtdMinima(produto.qtdMinima);
    setPreco(produto.preco);
    setFornecedorId(produto.fornecedorId);
    setProdutoEditando(produto);
    setOpenModal(true);
  }

  function fecharModal() {
    limparCampos();
    setProdutoEditando(null);
    setOpenModal(false);
  }

  function salvarProduto() {
    if (
      !nome ||
      !categoria ||
      !fornecedorId ||
      quantidade === "" ||
      preco === ""
    )
      return;

    const dados = {
      nome,
      categoria,
      quantidade: Number(quantidade),
      qtdMinima: Number(qtdMinima),
      preco: Number(preco),
      fornecedorId,
      atualizado: hojeISO(),
    };

    if (produtoEditando) {
      setProdutos(
        produtos.map((p) =>
          p.id === produtoEditando.id ? { ...p, ...dados } : p,
        ),
      );
    } else {
      setProdutos([...produtos, { id: crypto.randomUUID(), ...dados }]);
    }
    fecharModal();
  }

  function deletarProduto(id) {
    setProdutos(produtos.filter((p) => p.id !== id));
  }

  // ---------- colunas ----------
  const camposProdutos = [
    {
      chave: "nome",
      rotulo: "Produto",
      render: (p) => (
        <span className="fw-semibold">
          {p.nome}
          {estoqueBaixo(p) && (
            <i className="bi bi-exclamation-triangle text-warning ms-3"></i>
          )}
        </span>
      ),
    },
    {
      chave: "categoria",
      rotulo: "Categoria",
      render: (p) => (
        <span className="badge bg-primary-subtle text-primary">
          {p.categoria}
        </span>
      ),
    },
    {
      chave: "fornecedor",
      rotulo: "Fornecedor",
      render: (p) => fornecedores.find((f) => f.id === p.fornecedorId)?.nome,
    },
    {
      chave: "quantidade",
      rotulo: "Quantidade",
      render: (p) => `${p.quantidade} / ${p.qtdMinima} min.`,
    },
    { chave: "preco", rotulo: "Preço unit.", render: (p) => moeda(p.preco) },
    {
      chave: "total",
      rotulo: "Total",
      render: (p) => (
        <span className="fw-semibold text-success">
          {moeda(p.quantidade * p.preco)}
        </span>
      ),
    },
    {
      chave: "atualizado",
      rotulo: "Última atualização",
      render: (p) =>
        new Date(p.atualizado + "T00:00:00").toLocaleDateString("pt-BR"),
    },
  ];

  return (
    <div>
      <S.Hestoque>
        <div>
          <h2>Estoque</h2>
          <p className="text-secondary">Gerencie os produtos do seu estoque</p>
        </div>
        <div>
          <Button
            className="btn-primary"
            texto="Novo Produto"
            onClick={abrirNovo}
          />
        </div>
      </S.Hestoque>

      {/* cards de resumo */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <CardResumo
            titulo="Total de Produtos"
            valor={produtos.length}
            icone="box-seam"
            cor="primary"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Estoque Baixo"
            valor={produtosBaixos.length}
            corValor="#f97316"
            icone="exclamation-triangle"
            corIcone="#f97316"
            fundoIcone="#ffedd5"
          />
        </div>
        <div className="col-md-4">
          <CardResumo
            titulo="Valor Total"
            valor={moeda(valorTotal)}
            corValor="#198754"
            icone="currency-dollar"
            corIcone="#198754"
            fundoIcone="#dcfce7"
          />
        </div>
      </div>


      {/* alerta: só aparece se houver produto com estoque baixo */}
      <AlertaAviso
        titulo="Produtos com estoque baixo"
        itens={produtosBaixos.map((p) => p.nome)}
      />

      <Tabela
        campos={camposProdutos}
        dados={produtos}
        aoEditar={abrirEditar}
        aoExcluir={deletarProduto}
        classeLinha={(p) => (estoqueBaixo(p) ? "table-warning" : "")}
      />

      <Modal largura={420} isOpen={openModal}>
        <Form
          hForm=""
          tForm={produtoEditando ? "Editar produto" : "Novo produto"}
        >
          <Input
            onChange={(e) => setNome(e.target.value)}
            valor={nome}
            texto="Nome do Produto"
            type="text"
          />
          <Select
            texto="Categoria"
            valor={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            opcoes={categoriasProduto}
            placeholder="Escolha a categoria"
          />

          
            <div className="">
              <Input
                onChange={(e) => setQuantidade(e.target.value)}
                valor={quantidade}
                texto="Quantidade"
                type="number"
              />
            </div>
            <div className="">
              <Input
                onChange={(e) => setQtdMinima(e.target.value)}
                valor={qtdMinima}
                texto="Qtd. Mínima"
                type="number"
              />
            </div>
          

          <Input
            onChange={(e) => setPreco(e.target.value)}
            valor={preco}
            texto="Preço Unitário (R$)"
            type="number"
          />
          <Select
            texto="Fornecedor"
            valor={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            opcoes={fornecedores.map((f) => ({ valor: f.id, rotulo: f.nome }))}
            placeholder="Escolha o fornecedor"
          />

          <div className="d-flex gap-2 mt-3">
            <Button
              className="btn-outline-secondary flex-fill"
              onClick={fecharModal}
              texto="Cancelar"
            />
            <Button
              className="btn-primary flex-fill"
              onClick={salvarProduto}
              texto={produtoEditando ? "Salvar" : "Cadastrar"}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Estoque;
