import styled from "styled-components";

/* ===== Botão "Ver carrinho" ===== */
export const BotaoCarrinho = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 16px;
  background: var(--ps-preenchimento);
  color: #fff;
  font-weight: 700;
  box-shadow: var(--ps-sombra-botao);
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--ps-preenchimento-hover);
  }

  .contador {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--ps-destaque);
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ===== Busca + categorias ===== */
export const CaixaBusca = styled.div`
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: var(--ps-sombra);
`;

export const CampoBusca = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 16px;
  margin: 0 0 12px;
  border-radius: 999px;
  background: var(--ps-superficie-2);
  border: 1.5px solid var(--ps-borda);
  cursor: text;

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ps-texto);
  }
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Chip = styled.button`
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $ativo }) => ($ativo ? "var(--ps-preenchimento)" : "var(--ps-primaria-clara)")};
  color: ${({ $ativo }) => ($ativo ? "#fff" : "var(--ps-texto-suave)")};
`;

/* ===== Grade de produtos ===== */
export const Grade = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const CardProduto = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  box-shadow: var(--ps-sombra);
  opacity: ${({ $esgotado }) => ($esgotado ? 0.55 : 1)};

  .imagem {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, var(--ps-primaria-clara), transparent);
    color: var(--ps-secundaria);
    font-size: 30px;
  }

  .corpo {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 14px 16px 16px;
  }

  .categoria {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }

  h3 {
    margin: 4px 0 12px;
    font-size: 17px;
    font-weight: 800;
    line-height: 1.2;
    color: var(--ps-texto);
  }

  .rodape {
    margin-top: auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .preco {
    font-size: 18px;
    font-weight: 800;
    color: var(--ps-texto);
  }

  small {
    display: block;
    font-size: 11px;
    color: var(--ps-texto-suave);
  }

  .baixo {
    color: var(--ps-destaque);
    font-weight: 600;
  }
`;

export const BotaoMais = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #fdc98a;
  color: #111827;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Vazio = styled.p`
  padding: 32px;
  text-align: center;
  color: var(--ps-texto-suave);
`;

/* ===== Carrinho (painel lateral) ===== */
export const Fundo = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: var(--ps-fundo-modal);
`;

export const Painel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1051;
  width: min(380px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--ps-superficie);
  color: var(--ps-texto);
  box-shadow: -8px 0 24px rgba(17, 24, 39, 0.15);

  .topo {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ps-borda);
  }

  .sobre {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ps-primaria);
  }

  h2 {
    margin: 2px 0 0;
    font-size: 24px;
    font-weight: 900;
  }

  .fechar {
    border: none;
    background: transparent;
    color: var(--ps-texto);
    font-size: 20px;
  }

  .itens {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid var(--ps-borda);

    strong {
      font-size: 24px;
      color: var(--ps-primaria);
    }
  }

  .aviso {
    margin-top: 8px;
    text-align: center;
    font-size: 11px;
    color: var(--ps-texto-suave);
  }
`;

export const ItemCarrinho = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 14px;
  background: var(--ps-superficie-2);
  border: 1px solid var(--ps-borda);

  strong {
    display: block;
    font-size: 14px;
  }

  small {
    color: var(--ps-texto-suave);
  }

  .qtd {
    display: flex;
    align-items: center;
    gap: 6px;

    button {
      width: 26px;
      height: 26px;
      border: 1px solid var(--ps-borda);
      border-radius: 8px;
      background: var(--ps-superficie);
      color: var(--ps-texto);
      line-height: 1;
    }
  }

  .lixeira {
    border: none;
    background: transparent;
    color: #9aa3b8;
  }
`;

export const BotaoFinalizar = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 16px;
  background: var(--ps-preenchimento);
  color: #fff;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ===== Últimas vendas ===== */
export const CaixaTabela = styled.div`
  background: var(--ps-superficie);
  border: 1px solid var(--ps-borda);
  border-radius: 20px;
  box-shadow: var(--ps-sombra);
  overflow: hidden;

  h2 {
    margin: 0;
    padding: 20px 24px;
    font-size: 20px;
    font-weight: 800;
    color: var(--ps-texto);
  }

  table {
    width: 100%;
    margin: 0;
  }

  th {
    padding: 12px 24px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--ps-texto-suave);
    background: var(--ps-primaria-clara);
  }

  td {
    padding: 14px 24px;
    text-align: center;
    border-top: 1px solid var(--ps-borda);
    color: var(--ps-texto);
  }

  .numero {
    font-family: monospace;
    font-weight: 700;
    color: var(--ps-primaria);
  }

  .direita {
    text-align: center;
  }
`;

/* aviso abaixo do campo cliente (cadastrado ou balcão) */
export const AvisoCliente = styled.small`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: ${({ $cadastrado }) => ($cadastrado ? "#15803d" : "var(--ps-texto-suave)")};

  i {
    margin-top: 1px;
  }
`;
