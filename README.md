# Ignite Call

Aplicação web de agendamento de compromissos integrada ao Google Calendar, desenvolvida com Next.js e TypeScript.

O Ignite Call permite que usuários configurem sua disponibilidade e compartilhem horários para facilitar o agendamento de reuniões, com integração ao calendário do Google.

## Tecnologias

- **Next.js 16** — framework React para desenvolvimento da aplicação.
- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **Prisma ORM** — comunicação com o banco de dados.
- **PostgreSQL** — banco de dados relacional.
- **Neon** — hospedagem e gerenciamento do banco de dados.
- **NextAuth.js** — autenticação de usuários.
- **Google APIs** — integração com o Google Calendar.
- **TanStack Query** — gerenciamento de requisições e cache.
- **React Hook Form** — gerenciamento de formulários.
- **Zod** — validação de dados.
- **Day.js** — manipulação de datas e horários.
- **Axios** — requisições HTTP.
- **ESLint** — análise e padronização de código.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Autenticação utilizando conta Google.
- Integração com o Google Calendar.
- Configuração de disponibilidade para agendamentos.
- Organização de horários e compromissos.
- Verificação de horários ocupados por meio da integração com o calendário.

## Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) ou uma instância hospedada no [Neon](https://neon.tech/).
- Uma aplicação OAuth configurada no [Google Cloud Console](https://console.cloud.google.com/).

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/ThiagoTora/ignite-call.git
```

### 2. Acesse a pasta do projeto

```bash
cd ignite-call
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

```env
# Database - Neon PostgreSQL
DATABASE_URL=
DATABASE_URL_UNPOOLED=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=

# Neon Configuration
NEON_BRANCH=
NEON_BRANCH_ID=
NEON_FUNCTION_HOST_SUFFIX=
```

### Descrição das variáveis

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão com o banco de dados Neon utilizando o pool de conexões. |
| `DATABASE_URL_UNPOOLED` | URL de conexão direta com o banco de dados, sem pool. |
| `GOOGLE_CLIENT_ID` | Identificador do cliente OAuth configurado no Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | Chave secreta do cliente OAuth. |
| `NEXTAUTH_SECRET` | Segredo utilizado pelo NextAuth para proteger sessões e tokens. |
| `NEON_BRANCH` | Nome da branch do banco de dados Neon. |
| `NEON_BRANCH_ID` | Identificador da branch no Neon. |
| `NEON_FUNCTION_HOST_SUFFIX` | Sufixo de host utilizado na configuração das funções do Neon. |

**Importante:**
- Substitua os valores vazios pelas suas próprias credenciais.
- Nunca compartilhe chaves privadas ou credenciais.
- Não envie arquivos `.env` para o GitHub.
- Configure as mesmas variáveis no painel da Vercel para o ambiente de produção.
- O `NEXTAUTH_SECRET` pode ser gerado com:

```bash
openssl rand -base64 32
```

### 5. Configure o banco de dados

Execute as migrações do Prisma:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

### 6. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run start` | Inicia a aplicação em produção. |
| `npm run lint` | Executa a análise estática com ESLint. |
| `npx prisma generate` | Gera o Prisma Client. |
| `npx prisma migrate dev` | Executa as migrações do banco de dados. |

## 🔗 Integração com Google Calendar

A aplicação utiliza OAuth 2.0 para autenticar usuários por meio de suas contas Google e permitir a integração com o Google Calendar.

Para configurar a integração:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie ou selecione um projeto.
3. Habilite a Google Calendar API.
4. Configure a tela de consentimento OAuth.
5. Crie credenciais OAuth 2.0 do tipo aplicação Web.
6. Configure as URLs de redirecionamento autorizadas:

**Desenvolvimento:**

```text
http://localhost:3000/api/auth/callback/google
```

**Produção:**

```text
https://SEU-DOMINIO/api/auth/callback/google
```

Desenvolvido como projeto de estudo, com foco em desenvolvimento web, autenticação, integração com APIs externas, gerenciamento de banco de dados e construção de aplicações modernas com React e Next.js.
