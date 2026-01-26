# Guia de Instalação e Configuração - PAB Webapp

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- Git instalado

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

#### 2.1. Criar o banco de dados

Abra o PostgreSQL e execute:

```sql
CREATE DATABASE pab_webapp;
```

#### 2.2. Configurar variáveis de ambiente

Edite o arquivo `.env` e configure a URL de conexão com o PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pab_webapp?schema=public"
```

Substitua `usuario` e `senha` pelas credenciais do seu PostgreSQL.

### 3. Executar Migrations do Prisma

```bash
npx prisma migrate dev --name init
```

Este comando irá:
- Criar todas as tabelas no banco de dados
- Aplicar as relações entre tabelas
- Gerar o Prisma Client

### 4. (Opcional) Popular o Banco com Dados de Exemplo

```bash
npx prisma db seed
```

Para configurar o seed, adicione ao `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

E instale o ts-node:

```bash
npm install -D ts-node
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em: [http://localhost:3000](http://localhost:3000)

### 6. (Opcional) Abrir Prisma Studio

Para gerenciar dados visualmente:

```bash
npx prisma studio
```

Isso abrirá uma interface web em [http://localhost:5555](http://localhost:5555)

## Estrutura de Dados

### Tabelas Principais

1. **cidades** - Informações básicas das cidades
2. **dados_demograficos** - Dados demográficos e sociais
3. **eventos_proximos** - Calendário de eventos
4. **dados_votacao** - Informações eleitorais
5. **emendas** - Emendas parlamentares
6. **liderancas** - Lideranças políticas
7. **pautas** - Pautas sociais

### Inserindo Dados Manualmente

Você pode usar o Prisma Studio ou inserir via SQL:

```sql
-- Exemplo: Inserir cidade
INSERT INTO cidades (nome, gentilico, "dataFundacao", "dataAniversario", "breveHistorico", padroeiro, "pratoTipico", "createdAt", "updatedAt")
VALUES (
  'Campinas',
  'Campineiro',
  '1842-07-14',
  '2024-07-14',
  'Campinas é uma importante cidade do interior paulista...',
  'Nossa Senhora da Conceição',
  'Linguiça de Campinas',
  NOW(),
  NOW()
);
```

## Build para Produção

### 1. Criar Build

```bash
npm run build
```

### 2. Iniciar em Produção

```bash
npm start
```

## Instalação como PWA

Quando acessar o webapp em um navegador compatível (Chrome, Edge, Safari), você verá um prompt para "Instalar" o aplicativo. Isso permitirá usá-lo como um app nativo.

## Troubleshooting

### Erro: "Can't reach database server"

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão com: `npx prisma db push`

### Erro: "Module not found"

Execute novamente:
```bash
npm install
npx prisma generate
```

### Erro ao fazer build

Limpe o cache do Next.js:
```bash
rm -rf .next
npm run build
```

## Recursos Adicionais

### Prisma Commands Úteis

```bash
# Ver status das migrations
npx prisma migrate status

# Resetar banco de dados (cuidado!)
npx prisma migrate reset

# Atualizar schema sem migrations
npx prisma db push

# Formatar schema.prisma
npx prisma format
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` para variáveis locais:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pab_webapp"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Suporte

Para dúvidas ou problemas, consulte a documentação:
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
