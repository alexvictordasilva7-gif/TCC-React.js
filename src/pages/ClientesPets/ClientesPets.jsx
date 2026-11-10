import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Modal from "../../components/Modal/Modal";
import Form from "../../components/Forms/Forms";
import Input from "../../components/Input/Input.jsx";
import ButtonX from "../../components/Button/ButtonX.jsx";
import ModalRodape from "../../components/Modal/ModalRodape.jsx";
import BarraFiltro from "../../components/Filtro/BarraFiltro.jsx";
import CardResumo from "../../components/Cards/CardResumo.jsx";
import CabecalhoPagina from "../../components/CabecalhoPagina/CabecalhoPagina.jsx";
import { useDados } from "../../context/DadosContext";
import { alerta } from "../../utils/Alertas";
import { normalizarPet, lista, mensagemDeErro } from "../../utils/normalizar";
import api from "../../service/api";
import * as S from "./ClientesPets.Styled";



const CORES = ["#1d5bf0", "#7c4dff", "#f5a04a", "#22a06b", "#e5534b"];

const iniciais = (nome = "") =>
  nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";

// (11) 98765-4321 enquanto digita
function mascaraTelefone(valor) {
  const d = String(valor).replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

let contadorChave = 0;
const novaChave = () => `novo-${Date.now()}-${contadorChave++}`;
const petVazio = () => ({ chave: novaChave(), id: null, nome: "", raca: "", original: null });
const tutorVazio = { id: null, nome: "", email: "", telefone: "", endereco: "" };

export default function ClientesPets() {
  const { clientes, setClientes, pets, setPets } = useDados();

  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  // ----- modal -----
  const [modalAberto, setModalAberto] = useState(false);
  const [tutor, setTutor] = useState(tutorVazio);
  const [petsForm, setPetsForm] = useState([]);
  const [petsRemovidos, setPetsRemovidos] = useState([]);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [salvando, setSalvando] = useState(false);

  /* ---------- carregar ---------- */
  useEffect(() => {
    async function carregar() {
      const [resTutores, resPets] = await Promise.allSettled([
        api.get("/api/tutores?size=200"),
        api.get("/api/pets?size=200"),
      ]);

      if (resTutores.status === "fulfilled") setClientes(lista(resTutores.value.data));
      else alerta.erro("Não foi possível carregar os clientes.");

      if (resPets.status === "fulfilled") setPets(lista(resPets.value.data).map(normalizarPet));
      else alerta.erro("Não foi possível carregar os pets.");

      setCarregando(false);
    }
    carregar();
  }, []);

  /* ---------- tutor + pets juntos ---------- */
  const tutores = useMemo(
    () =>
      clientes.map((c) => ({
        ...c,
        pets: pets.filter((p) => String(p.donoId) === String(c.id)),
      })),
    [clientes, pets],
  );

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return tutores;
    return tutores.filter((t) =>
      [t.nome, t.email, t.telefone, t.endereco, ...t.pets.flatMap((p) => [p.nome, p.raca, p.especie])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(termo)),
    );
  }, [tutores, busca]);

  /* ---------- abrir / fechar ---------- */
  function abrirNovo() {
    setTutor(tutorVazio);
    setPetsForm([petVazio()]);
    setPetsRemovidos([]);
    setErros({});
    setErroGeral("");
    setModalAberto(true);
  }

  function abrirEdicao(t) {
    setTutor({
      id: t.id,
      nome: t.nome ?? "",
      email: t.email ?? "",
      telefone: t.telefone ?? "",
      endereco: t.endereco ?? "",
    });
    setPetsForm(
      t.pets.map((p) => ({
        chave: `pet-${p.id}`,
        id: p.id,
        nome: p.nome ?? "",
        raca: p.raca ?? "",
        original: { nome: p.nome ?? "", raca: p.raca ?? "" },
      })),
    );
    setPetsRemovidos([]);
    setErros({});
    setErroGeral("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
  }

  /* ---------- pets dentro do formulário ---------- */
  const alterarPet = (chave, campo, valor) =>
    setPetsForm((l) => l.map((p) => (p.chave === chave ? { ...p, [campo]: valor } : p)));

  function removerPet(pet) {
    if (pet.id) setPetsRemovidos((r) => [...r, pet.id]);
    setPetsForm((l) => l.filter((p) => p.chave !== pet.chave));
  }

  /* ---------- validação (mesmas regras da tela antiga de Clientes) ---------- */
  function validar() {
    const e = {};
    if (!tutor.nome.trim()) e.nome = "Informe o nome do tutor.";
    const digitos = tutor.telefone.replace(/\D/g, "");
    if (!/^\d{10,11}$/.test(digitos)) e.telefone = "Digite um telefone válido (10 ou 11 dígitos).";
    if (tutor.email && !/^\S+@\S+\.\S+$/.test(tutor.email)) e.email = "Digite um e-mail válido.";
    petsForm.forEach((p) => {
      if (!p.nome.trim() && (p.raca.trim() || p.id)) e[`pet-${p.chave}`] = "Informe o nome do pet.";
    });
    setErros(e);
    return Object.keys(e).length === 0;
  }

  /* ---------- salvar: tutor primeiro, depois cada pet ---------- */
  async function salvar() {
    setErroGeral("");
    if (!validar()) return;

    setSalvando(true);
    const falhas = [];

    try {
      // 1) tutor
      const dadosTutor = {
        nome: tutor.nome.trim(),
        email: tutor.email.trim(),
        telefone: tutor.telefone.trim(),
        endereco: tutor.endereco.trim(),
      };

      let tutorSalvo;
      if (tutor.id) {
        const r = await api.put(`/api/tutores/${tutor.id}`, dadosTutor);
        tutorSalvo = { ...dadosTutor, ...r.data, id: r.data?.id ?? tutor.id };
        setClientes((atuais) => atuais.map((c) => (String(c.id) === String(tutor.id) ? tutorSalvo : c)));
      } else {
        const r = await api.post("/api/tutores", dadosTutor);
        tutorSalvo = r.data;
        if (!tutorSalvo?.id) throw new Error("O back não devolveu o id do tutor.");
        setClientes((atuais) => [...atuais, tutorSalvo]);
        // se algum pet falhar, tentar de novo não cria o tutor duas vezes
        setTutor((t) => ({ ...t, id: tutorSalvo.id }));
      }
      const tutorId = tutorSalvo.id;

      // 2) pets novos ou alterados
      for (const pet of petsForm.filter((p) => p.nome.trim())) {
        const corpo = { nome: pet.nome.trim(), raca: pet.raca.trim(), tutorIds: [tutorId] };
        const mudou =
          !pet.original || pet.original.nome !== corpo.nome || pet.original.raca !== corpo.raca;
        if (pet.id && !mudou) continue;

        try {
          if (pet.id) {
            const r = await api.put(`/api/pets/${pet.id}`, corpo);
            const atualizado = normalizarPet({ ...corpo, ...r.data, id: pet.id });
            setPets((atuais) => atuais.map((p) => (p.id === pet.id ? { ...p, ...atualizado } : p)));
            alterarPetSalvo(pet.chave, pet.id, corpo);
          } else {
            const r = await api.post("/api/pets", corpo);
            const criado = normalizarPet({ ...corpo, ...r.data });
            if (criado.donoId == null) criado.donoId = tutorId;
            setPets((atuais) => [...atuais, criado]);
            alterarPetSalvo(pet.chave, criado.id, corpo);
          }
        } catch (erro) {
          falhas.push(`${pet.nome}: ${mensagemDeErro(erro, "não foi salvo")}`);
        }
      }

      // 3) pets removidos no formulário
      for (const id of petsRemovidos) {
        try {
          await api.delete(`/api/pets/${id}`);
          setPets((atuais) => atuais.filter((p) => p.id !== id));
        } catch (erro) {
          falhas.push(`Pet #${id}: ${mensagemDeErro(erro, "não foi excluído")}`);
        }
      }
      setPetsRemovidos([]);

      if (falhas.length) {
        setErroGeral(`O tutor foi salvo, mas houve problema com:\n${falhas.join("\n")}`);
        return;
      }

      alerta.sucesso(tutor.id ? "Cadastro atualizado!" : "Tutor e pets cadastrados!");
      setModalAberto(false);
    } catch (erro) {
      console.error("Erro ao salvar tutor:", erro.response?.data ?? erro);
      setErroGeral(mensagemDeErro(erro, "Não foi possível salvar o tutor."));
    } finally {
      setSalvando(false);
    }
  }

  // depois de salvar um pet, o formulário passa a "conhecer" o id dele
  function alterarPetSalvo(chave, id, corpo) {
    setPetsForm((l) =>
      l.map((p) => (p.chave === chave ? { ...p, id, original: { nome: corpo.nome, raca: corpo.raca } } : p)),
    );
  }

  /* ---------- excluir tutor (igual à tela antiga de Clientes) ---------- */
  async function excluirTutor(t) {
    const aviso = t.pets.length
      ? `Excluir ${t.nome}? Os ${t.pets.length} pet(s) vinculados também deixam de aparecer.`
      : `Excluir ${t.nome}?`;
    if (!window.confirm(aviso)) return;

    try {
      await api.delete(`/api/tutores/${t.id}`);
      setClientes((atuais) => atuais.filter((c) => c.id !== t.id));
      setPets((atuais) => atuais.filter((p) => String(p.donoId) !== String(t.id)));
      alerta.sucesso("Cliente excluído.");
    } catch (erro) {
      console.error(erro.response?.data ?? erro);
      alerta.erro(mensagemDeErro(erro, "Não foi possível excluir."));
    }
  }

  /* ---------- tela ---------- */
  return (
    <div className="ps-tema">
      <CabecalhoPagina
        sobre="Cadastro unificado"
        icone="people"
        titulo="Clientes & Pets"
        subtitulo="Tutor e seus pets."
        acao={
          <S.BotaoNovo type="button" onClick={abrirNovo}>
            <span className="icone">
              <i className="bi bi-person" aria-hidden="true"></i>
              <span className="mais" aria-hidden="true">+</span>
            </span>
            <span>
              <strong>Novo cadastro</strong>
              <small>Tutor e pet conectados</small>
            </span>
          </S.BotaoNovo>
        }
      />

      <S.Numeros>
        <CardResumo tema titulo="Tutores" valor={clientes.length} icone="person" destaque />
        <CardResumo tema titulo="Pets cadastrados" valor={pets.length} icone="heart" corIcone="#e8731a" />
      </S.Numeros>

      <BarraFiltro
        tema
        busca={busca}
        aoBuscar={setBusca}
        placeholder="Buscar por tutor, contato, pet ou raça..."
      />

      {carregando ? (
        <S.EstadoVazio>
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Carregando clientes e pets...
        </S.EstadoVazio>
      ) : visiveis.length === 0 ? (
        <S.EstadoVazio>
          <i className="bi bi-people" aria-hidden="true"></i>
          {busca ? "Nenhum resultado para essa busca." : "Nenhum tutor cadastrado ainda."}
        </S.EstadoVazio>
      ) : (
        <S.Lista>
          {visiveis.map((t, i) => (
            <S.Card key={t.id} $cor={CORES[i % CORES.length]}>
              <S.Tutor>
                <S.LinhaTutor>
                  <S.Avatar className="ps-fonte-titulo" aria-hidden="true">{iniciais(t.nome)}</S.Avatar>
                  <S.NomeTutor>
                    <strong className="ps-fonte-titulo">{t.nome}</strong>
                    <span>
                      {t.pets.length} {t.pets.length === 1 ? "pet vinculado" : "pets vinculados"}
                    </span>
                  </S.NomeTutor>
                  <S.Acoes>
                    <S.BotaoIcone type="button" onClick={() => abrirEdicao(t)} title="Editar" aria-label={`Editar ${t.nome}`}>
                      <i className="bi bi-pencil"></i>
                    </S.BotaoIcone>
                    <S.BotaoIcone type="button" $perigo onClick={() => excluirTutor(t)} title="Excluir" aria-label={`Excluir ${t.nome}`}>
                      <i className="bi bi-trash"></i>
                    </S.BotaoIcone>
                  </S.Acoes>
                </S.LinhaTutor>

                <S.Contato>
                  {t.telefone && <li><i className="bi bi-telephone" aria-hidden="true"></i>{t.telefone}</li>}
                  {t.email && <li><i className="bi bi-envelope" aria-hidden="true"></i>{t.email}</li>}
                  {t.endereco && <li><i className="bi bi-geo-alt" aria-hidden="true"></i>{t.endereco}</li>}
                </S.Contato>
              </S.Tutor>

              <S.Pets>
                <S.TopoPets>
                  <span>Animais do tutor</span>
                </S.TopoPets>

                {t.pets.length === 0 ? (
                  <S.Vazio>Nenhum pet vinculado.</S.Vazio>
                ) : (
                  <S.GradePets>
                    {t.pets.map((p) => (
                      <S.Pet key={p.id}>
                        <span className="icone" aria-hidden="true">
                          <i className="bi bi-heart-fill"></i>
                        </span>
                        <div className="textos">
                          <strong>{p.nome}</strong>
                          <span>{[p.especie, p.raca].filter(Boolean).join(" · ") || "Raça não informada"}</span>
                        </div>
                      </S.Pet>
                    ))}
                  </S.GradePets>
                )}
              </S.Pets>
            </S.Card>
          ))}
        </S.Lista>
      )}

      {/* ===== Modal: tutor + pets ===== */}
      <Modal tema largura={1080} isOpen={modalAberto} aoFechar={fecharModal}>
        <Form
          tema
          tForm={tutor.id ? "Editar cadastro" : "Novo cadastro"}
          hForm={<ButtonX tema texto={<X size={16} />} onClick={fecharModal} />}
        >
          <S.Secao>
            <S.TituloSecao>
              <div>
                <legend>1. Dados do tutor</legend>
                <p>O cliente será o responsável por todos os pets abaixo.</p>
              </div>
            </S.TituloSecao>

            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  tema
                  texto="Nome completo *"
                  valor={tutor.nome}
                  onChange={(e) => {
                    setTutor({ ...tutor, nome: e.target.value });
                    setErros((x) => ({ ...x, nome: "" }));
                  }}
                  placeholder="ex: João da Silva"
                  erro={erros.nome}
                  autoFocus
                />
              </div>
              <div className="col-md-6">
                <Input
                  tema
                  texto="E-mail"
                  type="email"
                  valor={tutor.email}
                  onChange={(e) => {
                    setTutor({ ...tutor, email: e.target.value });
                    setErros((x) => ({ ...x, email: "" }));
                  }}
                  placeholder="exemplo@email.com"
                  obrigatorio={false}
                  erro={erros.email}
                />
              </div>
              <div className="col-md-4">
                <Input
                  tema
                  texto="Telefone *"
                  type="tel"
                  valor={tutor.telefone}
                  onChange={(e) => {
                    setTutor({ ...tutor, telefone: mascaraTelefone(e.target.value) });
                    setErros((x) => ({ ...x, telefone: "" }));
                  }}
                  placeholder="(00) 00000-0000"
                  erro={erros.telefone}
                />
              </div>
              <div className="col-md-8">
                <Input
                  tema
                  texto="Endereço"
                  valor={tutor.endereco}
                  onChange={(e) => setTutor({ ...tutor, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                  obrigatorio={false}
                />
              </div>
            </div>
          </S.Secao>

          <S.Secao>
            <S.TituloSecao>
              <div>
                <legend>2. Pets vinculados</legend>
                <p>Eles ficarão conectados automaticamente a este tutor.</p>
              </div>
              <S.BotaoOutroPet type="button" onClick={() => setPetsForm((l) => [...l, petVazio()])}>
                <i className="bi bi-plus-lg" aria-hidden="true"></i> Outro pet
              </S.BotaoOutroPet>
            </S.TituloSecao>

            {petsForm.length === 0 && <S.Vazio>Nenhum pet. Clique em “Outro pet” para adicionar.</S.Vazio>}

            <div className="row g-3">
            {petsForm.map((p, i) => (
              <div className="col-lg-6" key={p.chave}>
              <S.PetForm>
                <div className="topo">
                  <span className="titulo">
                    <span className="bolinha" aria-hidden="true"><i className="bi bi-heart"></i></span>
                    Pet {i + 1}
                  </span>
                  <S.BotaoIcone type="button" $perigo onClick={() => removerPet(p)} aria-label={`Remover pet ${i + 1}`} title="Remover pet">
                    <i className="bi bi-trash"></i>
                  </S.BotaoIcone>
                </div>
                <S.DuasColunas>
                  <Input
                    tema
                    texto="Nome do pet"
                    valor={p.nome}
                    onChange={(e) => {
                      alterarPet(p.chave, "nome", e.target.value);
                      setErros((x) => ({ ...x, [`pet-${p.chave}`]: "" }));
                    }}
                    placeholder="Ex.: Rex"
                    obrigatorio={false}
                    erro={erros[`pet-${p.chave}`]}
                  />
                  <Input
                    tema
                    texto="Raça"
                    valor={p.raca}
                    onChange={(e) => alterarPet(p.chave, "raca", e.target.value)}
                    placeholder="Ex.: Labrador"
                    obrigatorio={false}
                  />
                </S.DuasColunas>
                <span className="chip">Tutor: {tutor.nome.trim() || "—"}</span>
              </S.PetForm>
              </div>
            ))}
            </div>
          </S.Secao>

          {erroGeral && <S.Alerta role="alert">{erroGeral}</S.Alerta>}

          <ModalRodape
            aoCancelar={fecharModal}
            aoConfirmar={salvar}
            carregando={salvando}
            textoConfirmar={salvando ? "Salvando..." : "Salvar cadastro"}
            extra={
              <span className="text-secondary small">
                <i className="bi bi-heart me-1"></i>
                {petsForm.filter((p) => p.nome.trim()).length} pet(s) neste cadastro
              </span>
            }
          />
        </Form>
      </Modal>
    </div>
  );
}
