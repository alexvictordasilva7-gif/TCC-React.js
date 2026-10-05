import * as S from "./Estoque.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api.js"; 
import Button from "../../components/Button/Button.jsx";
import Tabela from "../../components/Tabela/Tabela.jsx";

function Estoque() {
  const [openModal, setOpenModal] = useState(false);

  
  const [produtos, setProdutos] = useState([]);

  
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await api.get("/api/estoque");
        setProdutos(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      }
    }
    carregarProdutos();
  }, []);

  async function deletarProduto(id) {
    try {
      await api.delete(`/api/estoque/${id}`);
      setProdutos(produtos.filter((p) => p.id !== id));
    } catch (erro) {
      console.error("Erro ao deletar produto:", erro);
      alert("Não foi possível deletar o produto. Tente novamente.");
    }
  }

  async function addProduto() {
    const novoProduto = {
      produto: nome,
      categoria,
      fornecedor,
      quantidade: Number(quantidade),
      preco: Number(preco),
    };

    try {
      const resposta = await api.post("/api/estoque", novoProduto);
      setProdutos([...produtos, resposta.data]);

      setNome("");
      setCategoria("");
      setFornecedor("");
      setQuantidade("");
      setPreco("");
      setOpenModal(false);
    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);
      alert("Não foi possível cadastrar o produto. Tente novamente.");
    }
  }

  return (
    <div>
      <S.Hestoque>
       <div>
          <h1>Estoque</h1>
          <p>Gerencie os serviços cadastrados</p>
        </div>
        <div>
          <Button
            $cor={"blue"}
            filho={"+ Novo produto"}
            onClick={() => setOpenModal(true)}
            atamanho={"100%"}
            ltamanho={"160px"}
            fsize={"18px"}
          />
        </div>
      </S.Hestoque>

      <Tabela
         colunas={[
          "Produto",
          "Categoria",
          "Fornecedor",
          "Quantidade",
          "Preço UNIT",
          "Total",
          "Ultima Atualização",
          "Acões",
        ]}
        dados={produtos}
        renderLinha={(item) => (
          <>
            <S.Celula>{item.produto}</S.Celula>
            <S.Celula>{item.categoria}</S.Celula>
            <S.Celula>{item.fornecedor}</S.Celula>
            <S.Celula>{item.quantidade}</S.Celula>
            <S.Celula>{item.preco}</S.Celula>
            <S.Celula>{item.quantidade * item.preco}</S.Celula>
            <S.Celula>{item.ultimaAtt}</S.Celula>
            <S.Celula>
              <div>
                <Button $cor={"transparent"} filho={<S.Edi />} />
                <Button
                  onClick={() => deletarProduto(item.id)}
                  $cor={"transparent"}
                  filho={<S.Del />}
                />
              </div>
            </S.Celula>
          </>
        )}
      />
    </div>
  );
}

export default Estoque;