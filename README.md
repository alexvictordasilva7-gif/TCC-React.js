# 🐾 Pet Shop — Sistema de Gerenciamento (TCC)

Repositório do **front-end** do Trabalho de Conclusão de Curso (TCC) desenvolvido durante o curso técnico de **Desenvolvimento de Sistemas da Etec de Embu**.

O projeto é uma aplicação web feita com **React.js** e **Vite**, que se conecta a uma **API REST em Java (Spring Boot)** para gerenciar a rotina de um petshop: clientes (tutores), pets, serviços, agendamentos, estoque e fornecedores.

---

## 📂 Estrutura do Repositório

```text
TCC-React.js
├── public
│   ├── Patinha.png
│   └── manutencao.jpeg
├── src
│   ├── components        → peças reutilizáveis (botões, modais, tabelas, barra lateral...)
│   ├── context           → DadosContext (dados compartilhados entre as telas)
│   ├── pages             → uma pasta por tela do sistema
│   │   ├── Login
│   │   ├── Cadastro
│   │   ├── Dashboard
│   │   ├── Clientes
│   │   ├── Pets
│   │   ├── Servicos
│   │   ├── Agendamentos
│   │   ├── Estoque
│   │   └── Fornecedor
│   ├── routes            → Rotas.jsx (rotas públicas e protegidas)
│   ├── service           → api.js (axios) e auth.js (token JWT)
│   ├── utils             → Alertas.jsx (toasts) e opcoes.js (listas fixas)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### Pastas principais

| Pasta / arquivo        | Descrição                                                                    |
| ---------------------- | ---------------------------------------------------------------------------- |
| `src/pages`            | As telas do sistema, cada uma com seu `.jsx` e, quando tem, o `.Styled.jsx`  |
| `src/components`       | Componentes reaproveitados em várias telas (Modal, Input, Select, Tabela...) |
| `src/context`          | `DadosContext`: guarda clientes, pets, serviços, agendamentos e estoque      |
| `src/routes/Rotas.jsx` | Define as rotas e protege as telas que exigem login                          |
| `src/service/api.js`   | Configuração do **axios**: endereço da API e envio do token em cada chamada  |
| `src/service/auth.js`  | Lê o token JWT, verifica se ainda é válido e faz o logout                    |
| `src/utils`            | Toasts personalizados e listas de opções (espécies, serviços, categorias)    |

---

## 📚 Funcionalidades

| Tela             | Rota            | O que faz                                                                  |
| ---------------- | --------------- | -------------------------------------------------------------------------- |
| **Login**        | `/Login`        | Entrada no sistema com e-mail e senha (gera o token JWT)                   |
| **Cadastro**     | `/Cadastro`     | Criação de uma nova conta de usuário                                       |
| **Dashboard**    | `/Dashboard`    | Página inicial do sistema *(em desenvolvimento)*                           |
| **Clientes**     | `/Clientes`     | Cadastro, edição e exclusão dos tutores                                    |
| **Pets**         | `/Pets`         | Cadastro dos pets vinculados a um tutor                                    |
| **Serviços**     | `/Servicos`     | Catálogo de serviços com categoria, duração e valor                        |
| **Agendamentos** | `/Agendamentos` | Agenda de serviços por pet, com filtro por status (agendado, concluído...) |
| **Estoque**      | `/Estoque`      | Produtos, quantidade mínima, valor total e alerta de estoque baixo         |
| **Fornecedor**   | `/Fornecedor`   | Cadastro de fornecedores com CNPJ, contato e status                        |

> As telas depois do login só abrem com um token válido. Sem login, o usuário volta para `/Login`.

### Comunicação com o back-end

O front conversa com a API pelas rotas abaixo (todas em `/api`):

| Recurso       | Rota                 | Operações                                                    |
| ------------- | -------------------- | ------------------------------------------------------------ |
| Autenticação  | `/api/auth`          | `POST /login` · `POST /registrar`                            |
| Tutores       | `/api/tutores`       | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}`                |
| Pets          | `/api/pets`          | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}`                |
| Serviços      | `/api/servicos`      | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}`                |
| Agendamentos  | `/api/agendamentos`  | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}` · `PUT /{id}/cancelar` · `PUT /{id}/concluido` |
| Produtos      | `/api/produtos`      | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}`                |
| Fornecedores  | `/api/fornecedores`  | `GET` · `POST` · `PUT /{id}` · `DELETE /{id}`                |

Exemplo do que é enviado ao cadastrar um agendamento:

```json
{
  "dataHora": "10-11-2026 09:00:00",
  "petID": 4,
  "servicoID": 1
}
```

---

## 🔐 Autenticação com JWT

Depois do login, o back devolve um **token JWT**, que fica salvo no `localStorage` com o nome `token`. O `api.js` coloca esse token em todas as chamadas:

```js
config.headers.Authorization = `Bearer ${token}`;
```

Se o back responder **401** (token vencido ou inválido), o usuário é deslogado e levado de volta para a tela de login.

---

# ⚙️ Como configurar o back-end

O back-end fica em um repositório separado: **[link do repositório do back-end]**

O front procura a API neste endereço, nesta ordem:

1. A variável `VITE_API_URL`, se ela existir;
2. Caso contrário, `http://localhost:8080`.

Para usar o back publicado (Render), crie um arquivo **`.env`** na raiz do projeto:

```text
VITE_API_URL=https://pet-shop-tcc-etec.onrender.com
```

> 💡 Para rodar com o back na sua máquina, não precisa do `.env`: basta deixar a API Spring Boot rodando na porta `8080`.

> ⚠️ Depois de criar ou alterar o `.env`, pare o Vite e rode `npm run dev` de novo.

---

# 💻 Como executar o projeto no VS Code

### 1. Pré-requisitos

* **Node.js** instalado (versão 20 ou mais nova)
* **Git**
* **VS Code**

### 2. Clonar o repositório

```bash
git clone [link deste repositório]
cd TCC-React.js
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Rodar o projeto

```bash
npm run dev
```

A aplicação abrirá em um endereço parecido com:

```text
http://localhost:5173
```

### 5. Testar

Para validar o sistema, siga esta ordem:

```text
1 → Criar uma conta em /Cadastro
2 → Entrar em /Login
3 → Cadastrar um cliente
4 → Cadastrar um pet para esse cliente
5 → Cadastrar um serviço
6 → Criar um agendamento para o pet
7 → Concluir ou cancelar o agendamento
8 → Cadastrar um fornecedor e um produto no estoque
```

Essa sequência passa por todas as telas e confirma que o front está conversando com a API.

### Outros comandos

| Comando           | O que faz                                    |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Roda o projeto em modo de desenvolvimento    |
| `npm run build`   | Gera a versão final na pasta `dist`          |
| `npm run preview` | Abre a versão gerada pelo `build`            |
| `npm run lint`    | Procura problemas no código com o **oxlint** |

---

# 🌿 Como contribuir (trabalho em grupo)

O projeto é desenvolvido em grupo. Cada integrante trabalha no seu **fork**, em uma **branch** própria:

```bash
git checkout -b minha-alteracao
git add .
git commit -m "Descrição do que foi feito"
git push origin minha-alteracao
```

Depois, abra um **Pull Request** para o repositório principal, para o grupo revisar antes de juntar.

---

# 🗄️ Tecnologias utilizadas

* **React 19**
* **Vite**
* **React Router DOM**
* **Axios**
* **Bootstrap 5** e **Bootstrap Icons**
* **styled-components**
* **React Toastify**
* **Lucide React** e **React Icons**
* **jwt-decode**
* **API REST em Java (Spring Boot)**

---

# 🎓 Sobre o projeto

Este repositório foi desenvolvido para fins **acadêmicos e educacionais**, como **Trabalho de Conclusão de Curso** do curso técnico de **Desenvolvimento de Sistemas da Etec de Embu**.

**Integrantes:** [nomes dos integrantes do grupo]

**Orientador(a):** [nome do professor orientador]

O objetivo é aplicar na prática os conhecimentos de desenvolvimento web, integração com APIs REST, autenticação e organização de projetos em equipe, construindo um sistema completo para a gestão de um petshop.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.
