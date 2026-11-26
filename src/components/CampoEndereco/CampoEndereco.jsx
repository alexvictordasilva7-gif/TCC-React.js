import { useRef, useState } from "react";
import styled from "styled-components";
import Input from "../Input/Input.jsx";
import api from "../../service/api";

/*
  Endereço com busca por CEP (GET /api/cep/{cep}, que consulta o ViaCEP).
  O valor é um objeto: { cep, rua, numero, complemento, bairro, cidade, uf }.

  O back guarda o endereço do tutor como UM texto só. Para isso existem:
    montarEndereco(obj) -> "Rua X, 123 - Apto 4 - Centro, Embu das Artes/SP - CEP 06810-000"
    lerEndereco(texto)  -> o objeto de volta (para a tela de edição)
*/

export const enderecoVazio = {
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

const mascaraCep = (v) =>
  String(v ?? "")
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");

export function montarEndereco(e) {
  if (!e) return "";
  const ruaNumero = [e.rua, e.numero].map((x) => x?.trim()).filter(Boolean).join(", ");
  const cidadeUf = [e.cidade?.trim(), e.uf?.trim()].filter(Boolean).join("/");
  const bairroCidade = [e.bairro?.trim(), cidadeUf].filter(Boolean).join(", ");
  const partes = [ruaNumero, e.complemento?.trim(), bairroCidade];
  if (e.cep?.replace(/\D/g, "").length === 8) partes.push(`CEP ${mascaraCep(e.cep)}`);
  return partes.filter(Boolean).join(" - ");
}

export function lerEndereco(texto) {
  const t = String(texto ?? "").trim();
  if (!t) return { ...enderecoVazio };

  const partes = t.split(" - ");
  const fim = partes[partes.length - 1];
  const temCep = /^CEP \d{5}-?\d{3}$/.test(fim);
  const meio = temCep ? partes.slice(0, -1) : partes;
  const ultimo = meio[meio.length - 1] ?? "";
  const temCidade = meio.length >= 2 && /\/[A-Z]{2}$/.test(ultimo);

  // texto antigo, digitado livre: vai inteiro para "Rua"
  if (!temCep && !temCidade) return { ...enderecoVazio, rua: t };

  const [ruaNumero = "", ...resto] = temCidade ? meio.slice(0, -1) : meio;
  const virgula = ruaNumero.lastIndexOf(", ");
  const [bairroCidade, uf = ""] = temCidade ? [ultimo.slice(0, -3), ultimo.slice(-2)] : ["", ""];
  const corte = bairroCidade.lastIndexOf(", ");

  return {
    cep: temCep ? mascaraCep(fim) : "",
    rua: virgula >= 0 ? ruaNumero.slice(0, virgula) : ruaNumero,
    numero: virgula >= 0 ? ruaNumero.slice(virgula + 2) : "",
    complemento: resto.join(" - "),
    bairro: corte >= 0 ? bairroCidade.slice(0, corte) : "",
    cidade: corte >= 0 ? bairroCidade.slice(corte + 2) : bairroCidade,
    uf,
  };
}

const Aviso = styled.small`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: ${({ $tipo }) =>
    $tipo === "erro" ? "#e5534b" : $tipo === "ok" ? "#15803d" : "var(--ps-texto-suave, #6c757d)"};
`;

export default function CampoEndereco({ valor, onChange, tema = false }) {
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo, texto }
  const refNumero = useRef(null);
  const ultimoBuscado = useRef("");

  const mudar = (campo, v) => onChange({ ...valor, [campo]: v });

  async function buscarCep(cepDigitado) {
    const numeros = cepDigitado.replace(/\D/g, "");
    if (numeros.length !== 8 || numeros === ultimoBuscado.current) return;
    ultimoBuscado.current = numeros;

    setBuscando(true);
    setAviso({ tipo: "info", texto: "Buscando endereço..." });
    try {
      const { data } = await api.get(`/api/cep/${numeros}`);
      onChange({
        ...valor,
        cep: mascaraCep(numeros),
        rua: data.logradouro ?? "",
        bairro: data.bairro ?? "",
        cidade: data.cidade ?? "",
        uf: data.uf ?? "",
      });
      setAviso({ tipo: "ok", texto: "Endereço encontrado. Complete o número." });
      setTimeout(() => refNumero.current?.focus(), 0);
    } catch (erro) {
      ultimoBuscado.current = ""; // deixa tentar de novo
      const mensagens = erro.response?.data?.mensagens;
      setAviso({
        tipo: "erro",
        texto: Array.isArray(mensagens) ? mensagens.join(" ") : "Não foi possível buscar o CEP.",
      });
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <Input
          tema={tema}
          texto="CEP"
          valor={valor.cep}
          onChange={(e) => {
            const cep = mascaraCep(e.target.value);
            onChange({ ...valor, cep });
            setAviso(null);
            // busca sozinho quando completa os 8 números
            if (cep.replace(/\D/g, "").length === 8) buscarCep(cep);
          }}
          onBlur={() => buscarCep(valor.cep)}
          placeholder="00000-000"
          inputMode="numeric"
          obrigatorio={false}
          disabled={buscando}
        />
        {aviso && <Aviso $tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      </div>
      <div className="col-md-6">
        <Input
          tema={tema}
          texto="Rua"
          valor={valor.rua}
          onChange={(e) => mudar("rua", e.target.value)}
          placeholder="Preenchida pelo CEP"
          obrigatorio={false}
        />
      </div>
      <div className="col-md-3">
        <Input
          tema={tema}
          ref={refNumero}
          texto="Número"
          valor={valor.numero}
          onChange={(e) => mudar("numero", e.target.value)}
          placeholder="Ex.: 123"
          obrigatorio={false}
        />
      </div>
      <div className="col-md-4">
        <Input
          tema={tema}
          texto="Complemento"
          valor={valor.complemento}
          onChange={(e) => mudar("complemento", e.target.value)}
          placeholder="Apto, bloco... (opcional)"
          obrigatorio={false}
        />
      </div>
      <div className="col-md-3">
        <Input
          tema={tema}
          texto="Bairro"
          valor={valor.bairro}
          onChange={(e) => mudar("bairro", e.target.value)}
          obrigatorio={false}
        />
      </div>
      <div className="col-md-3">
        <Input
          tema={tema}
          texto="Cidade"
          valor={valor.cidade}
          onChange={(e) => mudar("cidade", e.target.value)}
          obrigatorio={false}
        />
      </div>
      <div className="col-md-2">
        <Input
          tema={tema}
          texto="UF"
          valor={valor.uf}
          onChange={(e) => mudar("uf", e.target.value.toUpperCase().slice(0, 2))}
          placeholder="SP"
          obrigatorio={false}
        />
      </div>
    </div>
  );
}
