import styled from "styled-components";
import { PawPrint } from "lucide-react";

// Cores de status iguais às da tela de Agendamentos
const STATUS = {
  AGENDADO: { rotulo: "agendados", singular: "Agendado", fundo: "#fef3c7", cor: "#b45309", borda: "#fcd34d" },
  CONCLUIDO: { rotulo: "concluídos", singular: "Concluído", fundo: "#dcfce7", cor: "#15803d", borda: "#86efac" },
  CANCELADO: { rotulo: "cancelados", singular: "Cancelado", fundo: "#fee2e2", cor: "#b91c1c", borda: "#fca5a5" },
};

const moeda = (v) =>
  Number(v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ===== estilos (mesmo padrão dos cards de Clientes & Pets) ===== */
const Caixa = styled.section`
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  color: var(--ps-texto);
  overflow: hidden;
`;

const Topo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--ps-borda);

  .sobre {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
  }

  h2 {
    margin: 2px 0 0;
    font-family: var(--ps-fonte-titulo);
    font-size: 20px;
    font-weight: 800;
  }
`;

const Pilula = styled.button`
  border: 1.5px solid ${({ $ativo, $s }) => ($ativo ? $s.cor : "transparent")};
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $s }) => $s.fundo};
  color: ${({ $s }) => $s.cor};
  opacity: ${({ $apagada }) => ($apagada ? 0.55 : 1)};
`;

const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 22px;
  max-height: 420px; /* 20 agendamentos não quebram o layout */
  overflow-y: auto;
`;

const Linha = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid var(--ps-borda);
  }

  .icone {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ps-destaque-clara);
    color: var(--ps-destaque);
  }

  .textos {
    flex: 1;
    min-width: 0;

    strong,
    small {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    small {
      color: var(--ps-texto-suave);
    }
    .tutor {
      font-weight: 400;
      color: var(--ps-texto-suave);
    }
  }

  .horario {
    text-align: right;

    strong {
      display: block;
      font-family: var(--ps-fonte-titulo);
      font-size: 17px;
    }
    small {
      color: var(--ps-texto-suave);
    }
  }

  .acoes {
    width: 190px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;

    .acoes {
      width: 100%;
      justify-content: flex-start;
    }
  }
`;

const BotaoAcao = styled.button`
  border: 1.5px solid ${({ $s }) => $s.borda};
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
  background: var(--ps-superficie);
  color: ${({ $s }) => $s.cor};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $s }) => $s.fundo};
  }
`;

const Etiqueta = styled.span`
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $s }) => $s.fundo};
  color: ${({ $s }) => $s.cor};
`;

const Vazio = styled.p`
  margin: 0;
  padding: 32px 0;
  text-align: center;
  color: var(--ps-texto-suave);
`;

export default function AgendamentosHoje({ itens, filtro, aoMudarFiltro, aoConcluir, aoCancelar }) {
  const contar = (s) => itens.filter((i) => i.status === s).length;
  const visiveis = filtro ? itens.filter((i) => i.status === filtro) : itens;

  return (
    <Caixa>
      <Topo>
        <div>
          <span className="sobre">Agenda</span>
          <h2>Agendamentos de hoje</h2>
        </div>

        {/* as pílulas também são o filtro: clique para filtrar, clique de novo para limpar */}
        <div className="d-flex flex-wrap gap-2">
          {Object.entries(STATUS).map(([chave, s]) => {
            const ativo = filtro === chave;
            return (
              <Pilula
                key={chave}
                type="button"
                $s={s}
                $ativo={ativo}
                $apagada={filtro && !ativo}
                aria-pressed={ativo}
                onClick={() => aoMudarFiltro(ativo ? null : chave)}
              >
                {contar(chave)} {s.rotulo}
              </Pilula>
            );
          })}
        </div>
      </Topo>

      <Lista>
        {visiveis.length === 0 && <Vazio>Nenhum agendamento por aqui.</Vazio>}

        {visiveis.map((item) => (
          <Linha key={item.id}>
            <span className="icone" aria-hidden="true">
              <PawPrint size={18} />
            </span>

            <div className="textos">
              <strong>
                {item.pet}
                {item.tutor && <span className="tutor"> · {item.tutor}</span>}
              </strong>
              <small>{item.servico}</small>
            </div>

            <div className="horario">
              <strong>{item.hora}</strong>
              <small>{moeda(item.valor)}</small>
            </div>

            <div className="acoes">
              {item.status === "AGENDADO" ? (
                <>
                  <BotaoAcao type="button" $s={STATUS.CONCLUIDO} onClick={() => aoConcluir(item)}>
                    Concluir
                  </BotaoAcao>
                  <BotaoAcao type="button" $s={STATUS.CANCELADO} onClick={() => aoCancelar(item)}>
                    Cancelar
                  </BotaoAcao>
                </>
              ) : (
                <Etiqueta $s={STATUS[item.status]}>{STATUS[item.status].singular}</Etiqueta>
              )}
            </div>
          </Linha>
        ))}
      </Lista>
    </Caixa>
  );
}
