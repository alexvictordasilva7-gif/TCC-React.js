import Modal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input.jsx";
import { useDados } from "../../context/DadosContext";
import Select from "../../components/Select/Select.jsx";
import Checkbox from "../../components/CheckBox/CheckBox.jsx";
import Button from "../../components/Button/Button";
import ButtonX from "../../components/Button/ButtonX.jsx";
import Tabela from "../../components/TabelaTeste/TabelaT.jsx";
import BarraFiltro from "../../components/Filtro/BarraFiltro.jsx";
import { X } from "lucide-react";
import Form from "../../components/Forms/Forms";
import * as S from "./Agendamentos.Styled";
import { useEffect, useState } from "react";
import api from "../../service/api";

const Agendamentos = () => {
  const [openModal, setOpenModal] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const { clientes, pets, servicos, agendamentos, setAgendamentos } =
    useDados();

  const [petId, setPetId] = useState("");
  const [servicosIds, setServicosIds] = useState([]);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  // Converte a resposta do Java para o formato usado na tela
  function formatarAgendamento(a) {
    return {
      id: a.id,
      pet: a.pet,
      servico: a.servico,
      valor:
  servicos.find((s) => s.nome === a.servico)?.valor ??
  servicos.find((s) => s.nome === a.servico)?.preco ??
  a.valor ??
  null,
      data: a.dataHora?.slice(0, 10),
      horario: a.dataHora?.slice(11, 16),
      
      status: String(a.status ?? "AGENDADO").toUpperCase(),
    };
  }

  // Busca os agendamentos no backend
  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const resposta = await api.get("/api/agendamentos?size=200");

        console.log("Resposta dos agendamentos:", resposta.data);

        const lista = resposta.data.content ?? resposta.data;

        setAgendamentos(lista.map(formatarAgendamento));
      } catch (erro) {
        console.error("Status HTTP:", erro.response?.status);
        console.error("Resposta do backend:", erro.response?.data);
        console.error("URL requisitada:", erro.config?.url);
      }
    }

    carregarAgendamentos();
  }, [setAgendamentos]);

  const contar = (status) =>
    agendamentos.filter((a) => a.status === status).length;

  const filtros = [
    { chave: "todos", rotulo: "Todos", quantidade: agendamentos.length },
    { chave: "AGENDADO", rotulo: "Agendado", quantidade: contar("AGENDADO") },
    {
      chave: "CONCLUIDO",
      rotulo: "Concluído",
      quantidade: contar("CONCLUIDO"),
    },
    {
      chave: "CANCELADO",
      rotulo: "Cancelado",
      quantidade: contar("CANCELADO"),
    },
  ];

  function iniciarEdicao(a) {
    const petEncontrado = pets.find(
      (p) => p.nome === a.pet || p.id === a.petId,
    );

    const servicoEncontrado = servicos.find(
      (s) => s.nome === a.servico || s.id === a.servicoId,
    );

    if (!petEncontrado || !servicoEncontrado) {
      alert("Não foi possível localizar o pet ou o serviço deste agendamento.");
      return;
    }

    let dataFormatada = "";
    let horarioFormatado = "";

    if (Array.isArray(a.dataHora)) {
      const [ano, mes, dia, hora = 0, minuto = 0] = a.dataHora;

      dataFormatada = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      horarioFormatado = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
    } else if (a.dataHora) {
      const valor = a.dataHora;

      const partes = valor.match(/^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})/);

      if (partes) {
        dataFormatada = `${partes[3]}-${partes[2]}-${partes[1]}`;
        horarioFormatado = `${partes[4]}:${partes[5]}`;
      } else {
        const dataHoraISO = valor.match(
          /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/,
        );

        if (dataHoraISO) {
          dataFormatada = `${dataHoraISO[1]}-${dataHoraISO[2]}-${dataHoraISO[3]}`;
          horarioFormatado = `${dataHoraISO[4]}:${dataHoraISO[5]}`;
        }
      }
    }

    setEditandoId(a.id);
    setPetId(String(petEncontrado.id));
    setServicosIds([servicoEncontrado.id]);
    setData(dataFormatada);
    setHorario(horarioFormatado);
    
    setOpenModal(true);
  }

  async function addAgendamento() {
    if (!petId || servicosIds.length === 0 || !data || !horario) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const [ano, mes, dia] = data.split("-");

    const dados = {
      dataHora: `${dia}-${mes}-${ano} ${horario}:00`,
      
      petID: Number(petId),
      servicoID: Number(servicosIds[0]),
    };

    try {
      const resposta = await api.post("/api/agendamentos", dados);

      setAgendamentos((atuais) => [
        ...atuais,
        formatarAgendamento(resposta.data),
      ]);

      setPetId("");
      setServicosIds([]);
      setData("");
      setHorario("");
      setOpenModal(false);
    } catch (erro) {
      console.error("Erro ao cadastrar agendamento:", erro);

      alert(
        erro.response?.data?.message ??
          "Não foi possível cadastrar o agendamento.",
      );
    }
  }

  async function excluirAgendamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este agendamento?",
    );

    if (!confirmar) return;

    try {
      await api.delete(`/api/agendamentos/${id}`);

      setAgendamentos((atuais) => atuais.filter((a) => a.id !== id));

      alert("Agendamento excluído com sucesso!");
    } catch (erro) {
      console.error(
        "Erro ao excluir agendamento:",
        erro.response?.data ?? erro,
      );

      alert("Não foi possível excluir o agendamento.");
    }
  }

  async function editarAgendamento() {
    if (!editandoId || !petId || !servicosIds.length || !data || !horario) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const [ano, mes, dia] = data.split("-");

    const dados = {
      dataHora: `${dia}-${mes}-${ano} ${horario}:00`,
      
      petID: Number(petId),
      servicoID: Number(servicosIds[0]),
    };

    try {
      const resposta = await api.put(`/api/agendamentos/${editandoId}`, dados);

      setAgendamentos((atuais) =>
        atuais.map((a) =>
          a.id === editandoId
            ? {
                ...a,
                ...formatarAgendamento(resposta.data),
                petId: Number(petId),
                servicoId: Number(servicosIds[0]),
                data,
                horario,
                
                pet: pets.find((p) => p.id === Number(petId))?.nome,
                servico: servicos.find((s) => s.id === Number(servicosIds[0]))
                  ?.nome,
              }
            : a,
        ),
      );

      setEditandoId(null);
      setPetId("");
      setServicosIds([]);
      setData("");
      setHorario("");
      
      setOpenModal(false);

      alert("Agendamento alterado com sucesso!");
    } catch (erro) {
      console.error(
        "Erro ao alterar agendamento:",
        erro.response?.data ?? erro,
      );

      alert(
        erro.response?.data?.message ??
          "Não foi possível alterar o agendamento.",
      );
    }
  }
  // marcar ou desmarcar um serviço
  function alternarServico(id) {
    setServicosIds((atual) =>
      atual.includes(id) ? atual.filter((s) => s !== id) : [...atual, id],
    );
  }

  const buscarPet = (a) =>
    a.pet
      ? (pets.find((p) => p.nome === a.pet) ?? { nome: a.pet })
      : pets.find((p) => p.id === a.petId);

  const nomeDono = (a) => {
    const pet = buscarPet(a);

    return clientes.find((c) => c.id === pet?.donoId)?.nome ?? "";
  };

  const nomesServicos = (a) =>
    a.servico ??
    a.servicosIds
      ?.map((id) => servicos.find((s) => s.id === id)?.nome)
      .filter(Boolean)
      .join(", ") ??
    "";

  // soma dos serviços marcados
  const valorTotal = servicos
    .filter((s) => servicosIds.includes(s.id))
    .reduce((soma, s) => soma + Number(s.valor), 0);

  async function mudarStatus(id, status) {
    try {
      let resposta;

      if (status === "CANCELADO") {
        resposta = await api.put(`/api/agendamentos/${id}/cancelar`);
      } else if (status === "CONCLUIDO") {
        resposta = await api.put(`/api/agendamentos/${id}/concluido`);
      } else {
        alert("Não é possível voltar o agendamento para esse status.");
        return;
      }

      const atualizado = formatarAgendamento(resposta.data);

      setAgendamentos((atuais) =>
        atuais.map((a) => (a.id === id ? atualizado : a)),
      );
    } catch (erro) {
      console.error("Erro ao mudar status:", erro.response?.data ?? erro);
      alert("Não foi possível alterar o status no servidor.");
    }
  }

  const visiveis = agendamentos.filter((a) => {
    const passaFiltro = filtroAtivo === "todos" || a.status === filtroAtivo;
    const texto = busca.toLowerCase();
    const passaBusca = [
      buscarPet(a)?.nome ?? "",
      nomeDono(a),
      nomesServicos(a),
    ].some((campo) => campo.toLowerCase().includes(texto));
    return passaFiltro && passaBusca;
  });

  const corStatus = {
    pendente: "bg-warning-subtle text-warning-emphasis",
    confirmado: "bg-success-subtle text-success-emphasis",
    concluido: "bg-primary-subtle text-primary-emphasis",
    cancelado: "bg-danger-subtle text-danger-emphasis",
  };

  const camposAgenda = [
    {
      chave: "pet",
      rotulo: "Pet / Dono",
      render: (a) => (
        <div>
          <div className="fw-semibold">{buscarPet(a)?.nome}</div>
          <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
            {nomeDono(a)}
          </div>
        </div>
      ),
    },
    { chave: "servicos", rotulo: "Serviço", render: (a) => nomesServicos(a) },
    {
      chave: "data",
      rotulo: "Data & Hora",
      render: (a) => (
        <div>
          <div className="fw-semibold">
            {new Date(a.data + "T00:00:00").toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
            })}
          </div>
          <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
            {a.horario}
          </div>
        </div>
      ),
    },
    {
      chave: "valor",
      rotulo: "Valor",
      render: (a) =>
        a.valor == null
          ? "—"
          : Number(a.valor).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
    },
    {
      chave: "status",
      rotulo: "Status",
      render: (a) => (
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={a.status}
          onChange={(e) => mudarStatus(a.id, e.target.value)}
          disabled={a.status === "CONCLUIDO" || a.status === "CANCELADO"}
        >
          <option value="AGENDADO">Agendado</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      ),
    },
  ];

  return (
    <div>
      <S.Hagendamentos>
        <div>
          <h2>Agendamentos</h2>
        </div>

        <div>
          <Button
            className="btn-primary"
            texto="Novo Produto"
            onClick={() => setOpenModal(true)}
          />
        </div>
      </S.Hagendamentos>
      <S.FiltroT>
        <BarraFiltro
          busca={busca}
          aoBuscar={setBusca}
          placeholder="Buscar por pet, dono ou serviço..."
          filtros={filtros}
          filtroAtivo={filtroAtivo}
          aoMudarFiltro={setFiltroAtivo}
        />
        <Tabela
          aoExcluir={excluirAgendamento}
          aoEditar={iniciarEdicao}
          campos={camposAgenda}
          dados={visiveis}
        />
      </S.FiltroT>
      <div>
        <Modal largura={420} isOpen={openModal}>
          <Form
            // props do formulario
            hForm={
              <ButtonX
                //props do botao de sair
                texto={<X fontSize={16} />}
                onClick={() => setOpenModal(false)}
              />
            }
            tForm={editandoId ? "Alterar agendamento" : "Novo agendamento"}
          >
            <Select
              texto="Pet"
              valor={petId}
              onChange={(e) => setPetId(e.target.value)}
              placeholder="Escolha o pet"
              opcoes={pets.map((p) => {
                const dono = clientes.find((c) => c.id === p.donoId)?.nome;
                return { valor: p.id, rotulo: `${p.nome} (${dono})` };
              })}
            />

            <label className="form-label">Serviços</label>
            <div className="mb-3">
              {servicos.map((s) => (
                <Checkbox
                  key={s.id}
                  id={`serv-${s.id}`}
                  texto={`${s.nome} · ${Number(s.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
                  marcado={servicosIds.includes(s.id)}
                  onChange={() => alternarServico(s.id)}
                />
              ))}
            </div>

            <Input
              onChange={(e) => setData(e.target.value)}
              valor={data}
              texto="Data"
              type="date"
            />
            <Input
              onChange={(e) => setHorario(e.target.value)}
              valor={horario}
              texto="Horário"
              type="time"
            />
            

            <div className="fw-bold mb-2">
              Total:{" "}
              {valorTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>

            <div className="d-flex gap-2 mt-3">
              <Button
                className="btn-outline-secondary flex-fill"
                onClick={() => {
                  setOpenModal(false);
                  setEditandoId(null);
                  setPetId("");
                  setServicosIds([]);
                  setData("");
                  setHorario("");
                  
                }}
                texto="Cancelar"
              />

              <Button
                className="btn-primary flex-fill"
                onClick={editandoId ? editarAgendamento : addAgendamento}
                texto={editandoId ? "Salvar alterações" : "Cadastrar"}
              />
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Agendamentos;
