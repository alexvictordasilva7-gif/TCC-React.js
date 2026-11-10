import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  Wrench, 
  TrendingUp, 
  Target, 
  AlertTriangle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

import  api  from '../../service/api';
import { 
  Container, 
  Header, 
  PeriodSelector, 
  Card, 
  MetricIcon, 
  Badge 
} from './Dashboard.styles';

export default function Dashboard() {
  const [periodoDias, setPeriodoDias] = useState(30);
  const [tipoGrafico, setTipoGrafico] = useState('diaria');
  
  const [resumo, setResumo] = useState(null);
  const [relatorio, setRelatorio] = useState(null);
  const [agendaHoje, setAgendaHoje] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [novaMeta, setNovaMeta] = useState('');

  const formatarDataIso = (date) => date.toISOString().split('T')[0];

  const carregarDados = async () => {
    try {
      setLoading(true);
      const hoje = new Date();
      const dataInicio = new Date();
      dataInicio.setDate(hoje.getDate() - periodoDias);

      const [resumoRes, agendaRes, relatorioRes] = await Promise.all([
        api.get('/api/dashboard/resumo'),
        api.get('/api/dashboard/agenda-hoje'),
        api.get(`/api/dashboard/relatorio?inicio=${formatarDataIso(dataInicio)}&fim=${formatarDataIso(hoje)}`),
      ]);

      setResumo(resumoRes.data);
      setAgendaHoje(agendaRes.data);
      setRelatorio(relatorioRes.data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [periodoDias]);

  const handleAlterarStatus = async (id, acao) => {
    try {
      await api.put(`/api/agendamentos/${id}/${acao}`);
      carregarDados();
    } catch (err) {
      console.error(`Erro ao ${acao} agendamento:`, err);
    }
  };

  const handleSalvarMeta = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/dashboard/meta', { valor: parseFloat(novaMeta) });
      setIsMetaModalOpen(false);
      carregarDados();
    } catch (err) {
      console.error('Erro ao salvar meta:', err);
    }
  };

  // FILTRO: Remove cancelados E ordena (AGENDADO primeiro, CONCLUIDO embaixo)
  const agendaAtivaHoje = useMemo(() => {
    if (!Array.isArray(agendaHoje)) return [];
    
    return agendaHoje
      .filter((item) => item.status !== 'CANCELADO')
      .sort((a, b) => {
        if (a.status === 'AGENDADO' && b.status !== 'AGENDADO') return -1;
        if (a.status !== 'AGENDADO' && b.status === 'AGENDADO') return 1;
        return 0;
      });
  }, [agendaHoje]);

  // Alerta de estoque baixo rigoroso (saldo <= quantMinima)
  const produtosEstoqueBaixo = useMemo(() => {
    if (!resumo?.estoqueBaixo) return [];
    return resumo.estoqueBaixo.filter((p) => {
      const saldo = p.saldo ?? p.quantMax ?? 0;
      const min = p.qtdMinima ?? p.quantMinima ?? 0;
      return saldo <= min;
    });
  }, [resumo]);

  const dadosGraficoFormatados = useMemo(() => {
    if (!relatorio?.receitaPorDia) return [];
    let acumulado = 0;
    return relatorio.receitaPorDia.map((item) => {
      const valor = Number(item.total) || 0;
      acumulado += valor;
      const [, mes, dia] = item.data.split('-');
      return {
        dataLabel: `${dia}/${mes}`,
        valor: tipoGrafico === 'acumulada' ? acumulado : valor,
      };
    });
  }, [relatorio, tipoGrafico]);

  if (loading && !resumo) {
    return <div className="text-center p-5 text-muted">A carregar dashboard...</div>;
  }

  const metaValor = resumo?.meta?.valor || 0;
  const faturamentoAtual = resumo?.faturamentoMes || 0;
  const porcentagemMeta = metaValor > 0 ? Math.min(100, (Number(faturamentoAtual) / Number(metaValor)) * 100) : 0;

  return (
    <Container>
      <Header>
        <div>
          <h1>Bom dia, Admin</h1>
          <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>

        <PeriodSelector>
          {[
            { label: '7 dias', dias: 7 },
            { label: '30 dias', dias: 30 },
            { label: '90 dias', dias: 90 },
            { label: '1 ano', dias: 365 },
          ].map((item) => (
            <button
              key={item.dias}
              onClick={() => setPeriodoDias(item.dias)}
              className={periodoDias === item.dias ? 'active' : ''}
            >
              {item.label}
            </button>
          ))}
        </PeriodSelector>
      </Header>

      {/* Cards de Métricas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <Card className="h-100">
            <MetricIcon className="emerald"><DollarSign size={20} /></MetricIcon>
            <div className="mt-3">
              <h3 className="fs-4 fw-bold mb-0">
                R$ {Number(relatorio?.receitaTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-muted small mt-1 mb-0">Receita total <br />no período</p>
            </div>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="h-100">
            <MetricIcon className="blue"><Wrench size={20} /></MetricIcon>
            <div className="mt-3">
              <h3 className="fs-4 fw-bold mb-0">{relatorio?.totalServicos || 0}</h3>
              <p className="text-muted small mt-1 mb-0">Serviços concluídos <br />no período</p>
            </div>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="h-100">
            <MetricIcon className="purple"><TrendingUp size={20} /></MetricIcon>
            <div className="mt-3">
              <h3 className="fs-4 fw-bold mb-0">
                R$ {Number(relatorio?.ticketMedio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-muted small mt-1 mb-0">Ticket médio <br />por serviço</p>
            </div>
          </Card>
        </div>

        <div className="col-md-3">
          <Card className="h-100">
            <div className="d-flex justify-content-between align-items-start">
              <MetricIcon className="amber"><Target size={20} /></MetricIcon>
              <button 
                onClick={() => setIsMetaModalOpen(true)}
                className="btn btn-sm btn-outline-secondary py-0 px-2"
                style={{ fontSize: '0.75rem' }}
              >
                Editar meta
              </button>
            </div>
            <div className="mt-3">
              <h3 className="fs-4 fw-bold mb-0">
                R$ {Number(faturamentoAtual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-muted small mb-2">Faturamento do mês</p>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${porcentagemMeta}%` }} />
              </div>
              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                Meta R$ {Number(metaValor).toLocaleString('pt-BR')}
              </small>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabela de Agendamentos e Lateral */}
      <div className="row g-3">
        <div className="col-lg-8">
          <Card className="h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>Agendamentos de hoje</h5>
              <div className="d-flex gap-2">
                <Badge className="warning">{resumo?.hoje?.agendados || 0} agendados</Badge>
                <Badge className="success">{resumo?.hoje?.concluidos || 0} concluídos</Badge>
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '360px', overflowY: 'auto' }}>
              <table className="table table-borderless align-middle mb-0">
                <tbody>
                  {agendaAtivaHoje.length === 0 ? (
                    <tr><td colSpan="3" className="text-center text-muted small py-4">Nenhum agendamento ativo para hoje.</td></tr>
                  ) : (
                    agendaAtivaHoje.map((item) => (
                      <tr key={item.id} className="border-bottom border-light">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                              {item.pet?.charAt(0)}
                            </div>
                            <div>
                              <span className="fw-bold d-block" style={{ fontSize: '0.875rem' }}>{item.pet} <span className="text-muted fw-normal">· {item.tutor}</span></span>
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.servico}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          <span className="fw-bold d-block" style={{ fontSize: '0.875rem' }}>{item.hora}</span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>R$ {item.valor}</span>
                        </td>
                        <td className="text-end">
                          {item.status === 'CONCLUIDO' && <Badge className="success">Concluído</Badge>}
                          {item.status === 'AGENDADO' && (
                            <div className="d-flex gap-1 justify-content-end">
                              <button onClick={() => handleAlterarStatus(item.id, 'concluido')} className="btn btn-sm btn-outline-success py-0 px-2" style={{ fontSize: '0.75rem' }}>Concluir</button>
                              <button onClick={() => handleAlterarStatus(item.id, 'cancelar')} className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '0.75rem' }}>Cancelar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-3">
          {produtosEstoqueBaixo.length > 0 && (
            <div className="alert alert-warning border-0 p-3 rounded-4 mb-0" style={{ backgroundColor: '#fef3c7', fontSize: '0.8rem' }}>
              <div className="d-flex gap-2">
                <AlertTriangle size={18} className="text-warning flex-shrink-0" />
                <div><span className="fw-bold text-dark">Vale conferir o estoque.</span> Há produtos abaixo do mínimo.</div>
              </div>
            </div>
          )}

          <Card>
            <span className="text-muted fw-bold text-uppercase mb-2" style={{ fontSize: '0.65rem' }}>Clientes do Mês</span>
            <div className="row text-center g-2">
              <div className="col-6">
                <h4 className="fw-bold mb-0">{resumo?.clientes?.total || 0}</h4>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>total</small>
              </div>
              <div className="col-6">
                <h4 className="fw-bold mb-0">{resumo?.clientes?.novoMes || 0}</h4>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>novos este mês</small>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Gráfico */}
      <div className="row mt-4">
        <div className="col-12">
          <Card>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>Receita ao longo do tempo</h5>
              <PeriodSelector>
                <button onClick={() => setTipoGrafico('diaria')} className={tipoGrafico === 'diaria' ? 'active' : ''}>Diária</button>
                <button onClick={() => setTipoGrafico('acumulada')} className={tipoGrafico === 'acumulada' ? 'active' : ''}>Acumulada</button>
              </PeriodSelector>
            </div>

            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosGraficoFormatados}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dataLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="valor" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Meta */}
      {isMetaModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleSalvarMeta} className="modal-content border-0 rounded-4 p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Definir Meta Mensal</h5>
                <button type="button" className="btn-close" onClick={() => setIsMetaModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label small fw-semibold text-muted">Novo valor da meta (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={novaMeta}
                  onChange={(e) => setNovaMeta(e.target.value)}
                  placeholder="Ex: 15000.00"
                  className="form-control rounded-3"
                />
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-light btn-sm rounded-3 px-3" onClick={() => setIsMetaModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-sm rounded-3 px-3">Salvar Meta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}