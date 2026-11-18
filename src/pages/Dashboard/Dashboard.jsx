import { useCallback, useEffect, useMemo, useState } from "react";
import * as S from "./Dashboard.styles";
import { useNavigate } from "react-router-dom";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import CardResumo from "../../components/Cards/CardResumo";
import AvisoEstoque from "../../components/AlertaAviso/AvisoEstoque";
import AgendamentosHoje from "../../components/Cards/Agendamentoshoje";
import ModalConfirmacao from "../../components/Modal/ModalConfirmacao";
import { useDados } from "../../context/DadosContext";
import { alerta } from "../../utils/Alertas";
import api from "../../service/api";
import { PawPrint } from "lucide-react";

const moeda = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// a lista da tela só conhece 3 situações; CONFIRMADO e EM_ANDAMENTO contam como "agendado"
const statusDaTela = (s) => (s === "CONCLUIDO" || s === "CANCELADO" ? s : "AGENDADO");

// "14:30:00" -> "14:30"
const hora = (h) => String(h ?? "").slice(0, 5);

const ehHoje = (iso) => new Date(iso).toDateString() === new Date().toDateString();

export default function Dashboard() {
  const navigate = useNavigate();
  const { vendas } = useDados();
  const [agenda, setAgenda] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [vendasHoje, setVendasHoje] = useState(null); // GET /api/vendas/hoje
  const [filtro, setFiltro] = useState(null); // null = todos
  const [acao, setAcao] = useState(null); // { tipo: "concluir" | "cancelar", item }
  const [salvando, setSalvando] = useState(false);

  // tudo do dia vem do back: agenda de hoje + resumo (estoque baixo, clientes, pets)
  const carregar = useCallback(async () => {
    const [ag, res, ven] = await Promise.allSettled([
      api.get("/api/dashboard/agenda-hoje"),
      api.get("/api/dashboard/resumo"),
      api.get("/api/vendas/hoje"),
    ]);

    if (ag.status === "fulfilled") {
      setAgenda(
        (ag.value.data ?? []).map((i) => ({
          ...i,
          hora: hora(i.hora),
          valor: Number(i.valor ?? 0),
          statusOriginal: i.status,
          status: statusDaTela(i.status),
        })),
      );
    } else {
      console.error("Erro ao carregar a agenda de hoje:", ag.reason);
      alerta.erro("Não foi possível carregar os agendamentos de hoje.");
    }

    if (res.status === "fulfilled") setResumo(res.value.data);
    else console.error("Erro ao carregar o resumo:", res.reason);

    if (ven.status === "fulfilled") setVendasHoje(ven.value.data);
    else console.error("Erro ao carregar as vendas de hoje:", ven.reason);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // receita do dia: serviços concluídos hoje + vendas feitas hoje
  const receitaServicos = useMemo(
    () =>
      agenda
        .filter((i) => i.status === "CONCLUIDO")
        .reduce((s, i) => s + i.valor, 0),
    [agenda],
  );
  // total vendido hoje vem do banco; se a rota falhar, usa o histórico do navegador
  const receitaVendas = vendasHoje
    ? Number(vendasHoje.totalVendido ?? 0)
    : vendas
        .filter((v) => ehHoje(v.dataHora))
        .reduce((s, v) => s + Number(v.total ?? 0), 0);
  const receitaHoje = receitaServicos + receitaVendas;

  // estoque baixo: lista pronta do back (sem cálculo no front)
  const estoqueBaixo = resumo?.estoqueBaixo ?? [];

  async function confirmar() {
    const rota = acao.tipo === "concluir" ? "concluido" : "cancelar";
    setSalvando(true);
    try {
      await api.put(`/api/agendamentos/${acao.item.id}/${rota}`);
      alerta.sucesso(
        acao.tipo === "concluir" ? "Atendimento concluído!" : "Agendamento cancelado.",
      );
      setAcao(null);
      carregar(); // recarrega a agenda e a receita
    } catch (erro) {
      console.error("Erro ao atualizar agendamento:", erro.response?.data ?? erro);
      const mensagens = erro.response?.data?.mensagens;
      alerta.erro(
        Array.isArray(mensagens) ? mensagens.join("\n") : "Não foi possível atualizar o agendamento.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="ps-tema">
      <CabecalhoPagina
        sobre="Visão do dia"
        icone="speedometer2"
        titulo="Dashboard"
        subtitulo="Resumo operacional de hoje, em tempo real."
      />

      <S.Numeros>
        <CardResumo
          tema
          titulo="Receita diária"
          valor={moeda(receitaHoje)}
          icone="currency-dollar"
        />
        {/* TODO: trocar por "novos do dia" quando o /resumo devolver novoHoje */}
        <CardResumo
          tema
          titulo="Clientes novos no mês"
          valor={resumo?.clientes?.novoMes ?? "—"}
          icone="person"
          corIcone="#6a5cf5"
        />
        <CardResumo
          tema
          titulo="Pets novos no mês"
          valor={resumo?.pets?.novoMes ?? "—"}
          icone={<PawPrint size={20} />}
          corIcone="#e8731a"
        />
      </S.Numeros>

      <AvisoEstoque
        quantidade={estoqueBaixo.length}
        itens={estoqueBaixo}
        aoClicar={() => navigate("/Estoque")}
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
        carregando={salvando}
        aoConfirmar={confirmar}
        aoFechar={() => setAcao(null)}
      />
    </div>
  );
}
