import styled from "styled-components";

// todos os painéis seguem o mesmo tamanho, borda e espaçamento
const ALTURA_PAINEL = "420px";

export const Pagina = styled.div`
  /* cores das séries (validadas para daltonismo): atual = azul, anterior = laranja */
  --serie-atual: #1d5bf0;
  --serie-anterior: #e8731a;
  --status-ok: #198754;
  --status-pendente: #1d5bf0;
  --status-erro: #dc3545;
  --grade: #e4e8f0;

  [data-bs-theme="dark"] & {
    --serie-atual: #5b8cff;
    --serie-anterior: #d0702a;
    --status-ok: #3fb67a;
    --status-pendente: #5b8cff;
    --status-erro: #f0646c;
    --grade: #263051;
  }
`;

export const SeletorMes = styled.select`
  min-width: 200px;
  height: 46px;
  padding: 0 16px;
  border: 1.5px solid var(--ps-borda);
  border-radius: 14px;
  background-color: var(--ps-superficie);
  color: var(--ps-texto);
  font-weight: 600;
  box-shadow: var(--ps-sombra);
  outline: none;

  &:focus {
    border-color: var(--ps-primaria);
    box-shadow: 0 0 0 3px var(--bs-focus-ring-color);
  }
`;

/* ===== KPIs ===== */
export const GradeKpi = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const Kpi = styled.div`
  height: 170px;
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  border-radius: 20px;
  border: 1px solid ${({ $destaque }) => ($destaque ? "transparent" : "var(--ps-borda)")};
  background: ${({ $destaque }) => ($destaque ? "var(--ps-preenchimento)" : "var(--ps-superficie)")};
  color: ${({ $destaque }) => ($destaque ? "#fff" : "var(--ps-texto)")};
  box-shadow: var(--ps-sombra);

  .icone {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: ${({ $destaque, $fundo }) => ($destaque ? "rgba(255,255,255,0.18)" : $fundo)};
    color: ${({ $destaque, $cor }) => ($destaque ? "#fff" : $cor)};
  }

  .rotulo {
    margin-top: auto;
    font-size: 14px;
    opacity: ${({ $destaque }) => ($destaque ? 0.9 : 1)};
  }

  .valor {
    font-family: var(--ps-fonte-titulo);
    font-size: clamp(22px, 2.2vw, 30px);
    font-weight: 800;
    line-height: 1.15;
    white-space: nowrap;
  }

  small {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ $destaque }) => ($destaque ? "rgba(255,255,255,0.85)" : "var(--ps-texto-suave)")};
  }
`;

/* ===== faixa da conta do lucro ===== */
export const Conta = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  padding: 14px;
  margin-bottom: 16px;
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const ItemConta = styled.div`
  height: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 14px;
  border-radius: 14px;
  background: ${({ $tipo }) =>
    $tipo === "resultado" ? "rgba(25, 135, 84, 0.12)" : "var(--ps-primaria-clara)"};

  span {
    font-size: 12px;
    color: ${({ $tipo }) => ($tipo === "resultado" ? "var(--status-ok)" : "var(--ps-texto-suave)")};
  }

  strong {
    font-size: 15px;
    white-space: nowrap;
    color: ${({ $tipo }) =>
      $tipo === "saida"
        ? "var(--status-erro)"
        : $tipo === "resultado"
          ? "var(--status-ok)"
          : $tipo === "vazio"
            ? "var(--ps-texto-suave)"
            : "var(--ps-texto)"};
    font-weight: ${({ $tipo }) => ($tipo === "vazio" ? 500 : 700)};
  }
`;

/* ===== painéis ===== */
export const GradePaineis = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const Painel = styled.section`
  height: ${ALTURA_PAINEL};
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 22px 24px;
  border-radius: 20px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  color: var(--ps-texto);

  .cabecalho {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
  }

  .sub {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--ps-texto-suave);
  }

  .corpo {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
`;

export const Legenda = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--ps-texto-suave);

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    display: inline-block;
  }
`;

export const Dica = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  color: var(--ps-texto);
  font-size: 13px;

  strong {
    display: block;
    margin-bottom: 4px;
  }

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  i {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    display: inline-block;
  }
`;

/* ===== agendamentos (rosca) ===== */
export const Rosca = styled.div`
  position: relative;
  height: 200px;

  .centro {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    strong {
      font-family: var(--ps-fonte-titulo);
      font-size: 30px;
      line-height: 1;
    }
    span {
      font-size: 13px;
      color: var(--ps-texto-suave);
    }
  }
`;

export const ListaStatus = styled.ul`
  list-style: none;
  margin: 12px 0 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 0;
    font-size: 14px;
  }

  .nome {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .bolinha {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .num {
    color: var(--ps-texto-suave);

    b {
      color: var(--ps-texto);
    }
  }
`;

/* ===== serviços populares ===== */
export const Ranking = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;

  li + li {
    margin-top: 16px;
  }

  .linha {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .pos {
    margin-right: 6px;
    color: var(--ps-texto-suave);
  }

  .num {
    color: var(--ps-texto-suave);
    white-space: nowrap;

    b {
      color: var(--ps-texto);
    }
  }

  .trilho {
    height: 8px;
    border-radius: 999px;
    background: var(--ps-primaria-clara);
    overflow: hidden;
  }

  .barra {
    height: 100%;
    border-radius: 999px;
    background: var(--serie-atual);
  }
`;

/* ===== clientes e pets ===== */
export const CardBase = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: var(--ps-primaria-clara);

  & + & {
    margin-top: 14px;
  }

  .icone {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: var(--ps-superficie);
    color: ${({ $cor }) => $cor};
  }

  .texto {
    flex: 1;

    span {
      font-size: 14px;
      color: var(--ps-texto-suave);
    }
    strong {
      display: block;
      font-family: var(--ps-fonte-titulo);
      font-size: 28px;
      line-height: 1.1;
    }
  }

  .novos {
    text-align: right;

    strong {
      display: block;
      font-size: 20px;
      color: var(--status-ok);
    }
    span {
      font-size: 12px;
      color: var(--ps-texto-suave);
    }
  }
`;

/* ===== fornecedores ===== */
export const Chips = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  overflow-x: auto;
  scrollbar-width: thin;
`;

export const Chip = styled.button`
  border: none;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${({ $ativo }) => ($ativo ? "var(--ps-preenchimento)" : "transparent")};
  color: ${({ $ativo }) => ($ativo ? "#fff" : "var(--ps-texto)")};
`;

export const SeletorPequeno = styled.select`
  flex-shrink: 0;
  height: 36px;
  padding: 0 12px;
  border: 1.5px solid var(--ps-borda);
  border-radius: 10px;
  background-color: var(--ps-superficie);
  color: var(--ps-texto);
  font-size: 13px;
`;

export const LinhaFornecedor = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid var(--ps-borda);
  }

  .pos {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    background: ${({ $primeiro }) => ($primeiro ? "var(--ps-preenchimento)" : "var(--ps-primaria-clara)")};
    color: ${({ $primeiro }) => ($primeiro ? "#fff" : "var(--ps-texto)")};
  }

  .nome {
    flex: 1;
    min-width: 0;
    font-weight: 600;

    small {
      display: block;
      font-weight: 400;
      color: var(--ps-texto-suave);
    }
  }

  .nota {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    white-space: nowrap;

    i {
      color: #f5a524;
    }
  }

  .custo {
    text-align: right;

    span {
      display: block;
      font-size: 12px;
      color: var(--ps-texto-suave);
    }
    strong {
      white-space: nowrap;
    }
  }
`;

export const Vazio = styled.p`
  margin: 0;
  padding: 40px 12px;
  text-align: center;
  font-size: 14px;
  color: var(--ps-texto-suave);
`;
