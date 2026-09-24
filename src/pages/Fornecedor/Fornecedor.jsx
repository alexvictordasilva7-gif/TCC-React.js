import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Form from "../../components/Forms/Forms";
import Tabela from "../../components/Tabela/Tabela";
import * as S from "./Fornecedor.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Fornecedor = () => {
  const [openModal, setOpenModal] = useState(false);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nomeContato, setNomeContato] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [status, setStatus] = useState("Ativo");
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const resposta = await api.get('/api/fornecedores');
        setFornecedores(resposta.data.content);
      } catch (erro) {
        console.error("Erro ao carregar fornecedores:", erro);
      }
    }
    carregarFornecedores();
  }, []);


  async function deletarFornecedor(id) {
     console.log("id recebido:", id);
  try {
    await api.delete(`/api/fornecedores/${id}`);
    setFornecedores(fornecedores.filter((fornecedor) => fornecedor.id !== id));
  } catch (erro) {
    console.error("Erro ao deletar fornecedor:", erro);
    alert("Não foi possível deletar o fornecedor. Tente novamente.");
  }
}


  // função criada para adicionar fornecedores, e essa função e ativada pelo botão cadastrar
  async function addFornecedor() {
    const novoFornecedor = { razaoSocial, cnpj, categoria, nomeContato, telefone, email, endereco, status };

    try {
    const resposta = await api.post('/api/fornecedores', novoFornecedor);
    setFornecedores([...fornecedores, resposta.data]);

    setRazaoSocial("");
    setCnpj("");
    setCategoria("");
    setNomeContato("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setStatus("Ativo");
    setOpenModal(false);
  } catch (erro) {
    console.error("Erro ao cadastrar fornecedor:", erro);
    alert("Não foi possível cadastrar o fornecedor. Tente novamente.");
  }
    }


  const totalFornecedores = fornecedores.length;
  const ativos = fornecedores.filter((f) => f.status === "Ativo").length;
  const inativos = fornecedores.filter((f) => f.status === "Inativo").length;

  const fornecedoresFiltrados = fornecedores
    .filter((f) => (filtro === "Todos" ? true : f.status === filtro))
    .filter((f) => {
      const texto = busca.toLowerCase();
      return (
        f.razaoSocial?.toLowerCase().includes(texto) ||
        f.nomeContato?.toLowerCase().includes(texto) ||
        f.categoria?.toLowerCase().includes(texto)
      );
    });


  return (
    <div>
      <S.Hfornecedor>
        <div>
          <h1>Fornecedores</h1>
          <p>{totalFornecedores} fornecedores cadastrados</p>
        </div>

        <Button
          $cor={"blue"}
          filho={"+ Novo Fornecedor"}
          onClick={() => setOpenModal(true)}
          atamanho={'50px'}
          ltamanho={'170px'}
          fsize={'18px'}
        />
      </S.Hfornecedor>

      <S.StatsRow>
        <S.StatCard>
          <S.StatIconWrap $bg="#e0edff" $cor="#2563eb">
            <S.IconFornecedorTotal />
          </S.StatIconWrap>
          <div>
            <strong>{totalFornecedores}</strong>
            <span>Total</span>
          </div>
        </S.StatCard>

        <S.StatCard>
          <S.StatIconWrap $bg="#dcfce7" $cor="#16a34a">
            <S.IconAtivo />
          </S.StatIconWrap>
          <div>
            <strong>{ativos}</strong>
            <span>Ativos</span>
          </div>
        </S.StatCard>

        <S.StatCard>
          <S.StatIconWrap $bg="#f1f1f1" $cor="#6b7280">
            <S.IconInativo />
          </S.StatIconWrap>
          <div>
            <strong>{inativos}</strong>
            <span>Inativos</span>
          </div>
        </S.StatCard>
      </S.StatsRow>

      <S.FiltrosRow>
        <S.BuscaWrapper>
          <S.IconBusca />
          <input
            placeholder="Buscar fornecedor, contato, categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </S.BuscaWrapper>

        <S.Tabs>
          <S.Tab $ativo={filtro === "Todos"} onClick={() => setFiltro("Todos")}>
            Todos
          </S.Tab>
          <S.Tab $ativo={filtro === "Ativo"} onClick={() => setFiltro("Ativo")}>
            Ativos ({ativos})
          </S.Tab>
          <S.Tab $ativo={filtro === "Inativo"} onClick={() => setFiltro("Inativo")}>
            Inativos ({inativos})
          </S.Tab>
        </S.Tabs>
      </S.FiltrosRow>

      <S.TabelaWrapper>
        <Tabela
          colunas={["Fornecedor", "Categoria", "Contato", "CNPJ", "Status", "Acões"]}
          dados={fornecedoresFiltrados}
          renderLinha={(fornecedor, index) => (
            <>
              <S.Celula key={`Nome-${index}`}>
                <S.NomeFornecedor>
                  <strong>{fornecedor.razaoSocial}</strong>
                  <small>{fornecedor.email}</small>
                </S.NomeFornecedor>
              </S.Celula>
              <S.Celula key={`Categoria-${index}`}>
                <S.Categoria>{fornecedor.categoria}</S.Categoria>
              </S.Celula>
              <S.Celula key={`Contato-${index}`}>
                <S.Contato>
                  <span>{fornecedor.nomeContato}</span>
                  <span>{fornecedor.telefone}</span>
                </S.Contato>
              </S.Celula>
              <S.Celula key={`Cnpj-${index}`}>{fornecedor.cnpj}</S.Celula>
              <S.Celula key={`Status-${index}`}>
                <S.StatusWrapper>
                  <S.Bolinha $ativo={fornecedor.status === "Ativo"} />
                  {fornecedor.status}
                </S.StatusWrapper>
              </S.Celula>
              <S.Celula key={`Acões-${index}`}>
                <div>
                  <Button $cor={"transparent"} filho={<S.Edi />} />
                  <Button onClick={()=> deletarFornecedor(fornecedor.id)} $cor={"transparent"} filho={<S.Del />} />
                </div>
              </S.Celula>
            </>
          )}
        />
      </S.TabelaWrapper>

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
            tForm={"Novo Fornecedor"}
          >
            <Input
              onChange={(e) => setRazaoSocial(e.target.value)}
              valor={razaoSocial}
              texto={"Razão Social / Nome"}
              type="text"
            />

            <S.LinhaForm>
              <Input
                onChange={(e) => setCnpj(e.target.value)}
                valor={cnpj}
                texto={"CNPJ"}
                type="text"
              />
              <Input
                onChange={(e) => setCategoria(e.target.value)}
                valor={categoria}
                texto={"Categoria"}
                type="text"
              />
            </S.LinhaForm>

            <Input
              onChange={(e) => setNomeContato(e.target.value)}
              valor={nomeContato}
              texto={"Nome do Contato"}
              type="text"
            />

            <S.LinhaForm>
              <Input
                onChange={(e) => setTelefone(e.target.value)}
                valor={telefone}
                texto={"Telefone"}
                type="text"
              />
              <Input
                onChange={(e) => setEmail(e.target.value)}
                valor={email}
                texto={"Email"}
                type="text"
              />
            </S.LinhaForm>

            <Input
              onChange={(e) => setEndereco(e.target.value)}
              valor={endereco}
              texto={"Endereço"}
              type="text"
            />

            <label>Status</label>
            <S.RadioGroup>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Ativo"
                  checked={status === "Ativo"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Ativo
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="Inativo"
                  checked={status === "Inativo"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Inativo
              </label>
            </S.RadioGroup>

            <div>
              <Button
                onClick={() => setOpenModal(false)}
                filho={"Cancelar"}
                $cor={"transparent"}
                type={"button"}
              />
              <Button
                onClick={addFornecedor}
                filho={"Cadastrar"}
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

export default Fornecedor;