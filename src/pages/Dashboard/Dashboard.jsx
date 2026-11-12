import { useMemo, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import CardResumo from "../../components/Cards/CardResumo";
import AvisoEstoque from "../../components/AlertaAviso/AvisoEstoque";
import AgendamentosHoje from "../../components/Cards/Agendamentoshoje";
import ModalConfirmacao from "../../components/Modal/ModalConfirmacao";

// ---- DADOS DE TESTE (trocar pela API quando o back estiver pronto) ----
const AGENDA_MOCK = [
  {
    id: 1,
    pet: "Pet_4",
    tutor: "Cliente 30",
    servico: "Serviço de Leva e Traz",
    hora: "19:18",
    valor: 30,
    status: "AGENDADO",
  },
  {
    id: 2,
    pet: "Pet_9",
    tutor: "Cliente 17",
    servico: "Vacinação Anual",
    hora: "19:19",
    valor: 120,
    status: "AGENDADO",
  },
  {
    id: 3,
    pet: "Pet_58",
    tutor: "Cliente 6",
    servico: "Vacinação Anual",
    hora: "11:39",
    valor: 120,
    status: "CONCLUIDO",
  },
];
const CLIENTES_NOVOS_HOJE = 4;
const PETS_NOVOS_HOJE = 6;
const PRODUTOS_ESTOQUE_BAIXO = 3;
// -----------------------------------------------------------------------

const moeda = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState(AGENDA_MOCK);
  const [filtro, setFiltro] = useState(null); // null = todos
  const [acao, setAcao] = useState(null); // { tipo: "concluir" | "cancelar", item }

  // serviço concluído entra na receita diária
  const receitaHoje = useMemo(
    () =>
      agenda
        .filter((i) => i.status === "CONCLUIDO")
        .reduce((s, i) => s + i.valor, 0),
    [agenda],
  );

  function confirmar() {
    const novoStatus = acao.tipo === "concluir" ? "CONCLUIDO" : "CANCELADO";
    // quando o back existir: await PUT /api/agendamentos/{id}/concluido ou /cancelar
    setAgenda((lista) =>
      lista.map((i) =>
        i.id === acao.item.id ? { ...i, status: novoStatus } : i,
      ),
    );
    setAcao(null);
  }

  return (
    <div className="p-4">
      <CabecalhoPagina
        sobre="Controle de produtos"
        icone= {"LayoutDashboard"}
        titulo="Dashboard"
        subtitulo="Resumo operacional do dia."
      />
      

      <Row className="g-3 mb-3">
        <Col md={4}>
          <CardResumo
            tema
            titulo="Receita diária"
            valor={moeda(receitaHoje)}
            icone="currency-dollar"
            corIcone="#2563eb"
          />
        </Col>
        <Col md={4}>
          <CardResumo
            tema
            titulo="Clientes novos do dia"
            valor={CLIENTES_NOVOS_HOJE}
            icone="people"
            corIcone="#7c3aed"
          />
        </Col>
        <Col md={4}>
          <CardResumo
            tema
            titulo="Pets novos do dia"
            valor={PETS_NOVOS_HOJE}
            icone="heart"
            corIcone="#16a34a"
          />
        </Col>
      </Row>

      <AvisoEstoque
        quantidade={PRODUTOS_ESTOQUE_BAIXO}
        aoClicar={() => navigate("/Produtos")}
      />

      <AgendamentosHoje
        itens={agenda}
        filtro={filtro}
        aoMudarFiltro={setFiltro}
        aoConcluir={(item) => setAcao({ tipo: "concluir", item })}
        aoCancelar={(item) => setAcao({ tipo: "cancelar", item })}
      />

      <ModalConfirmacao
        aberto={!!acao}
        perigo={acao?.tipo === "cancelar"}
        titulo={
          acao?.tipo === "concluir"
            ? "Concluir atendimento"
            : "Cancelar agendamento"
        }
        texto={
          acao &&
          (acao.tipo === "concluir"
            ? `Confirmar que o atendimento de ${acao.item.pet} (${acao.item.servico}) foi concluído? O valor entra na receita diária.`
            : `Tem certeza que deseja cancelar o agendamento de ${acao.item.pet} (${acao.item.servico})?`)
        }
        textoConfirmar={
          acao?.tipo === "concluir" ? "Sim, concluir" : "Sim, cancelar"
        }
        aoConfirmar={confirmar}
        aoFechar={() => setAcao(null)}
      />
    </div>
  );
}
