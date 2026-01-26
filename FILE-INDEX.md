# Índice de Arquivos do Projeto PAB Webapp

## 📂 Estrutura Completa

```
PAB/
│
├── 📄 Configuração do Projeto
│   ├── package.json                    - Dependências e scripts
│   ├── tsconfig.json                   - Configuração TypeScript
│   ├── next.config.js                  - Configuração Next.js + PWA
│   ├── tailwind.config.ts              - Configuração Tailwind (cores, animações)
│   ├── postcss.config.js               - Configuração PostCSS
│   ├── .eslintrc.json                  - Configuração ESLint
│   ├── .gitignore                      - Arquivos ignorados pelo Git
│   └── .env                            - Variáveis de ambiente
│
├── 📱 Aplicação (app/)
│   ├── layout.tsx                      - Layout raiz + metadata PWA
│   ├── page.tsx                        - Página principal (7 abas)
│   ├── globals.css                     - Estilos globais customizados
│   └── api/                            - API Routes
│       └── cidades/
│           ├── route.ts                - GET, POST (listar, criar)
│           └── [id]/
│               └── route.ts            - GET, PUT, DELETE (por ID)
│
├── 🎨 Componentes (components/)
│   ├── CitySelector.tsx                - Seletor de cidades
│   └── tabs/                           - Componentes das 7 abas
│       ├── PerfilCidade.tsx            - Aba 1: Perfil
│       ├── DadosDemograficos.tsx       - Aba 2: Demografia + Gráficos
│       ├── CalendarioEventos.tsx       - Aba 3: Eventos
│       ├── Votacao.tsx                 - Aba 4: Dados eleitorais
│       ├── Emendas.tsx                 - Aba 5: Emendas PAB
│       ├── Liderancas.tsx              - Aba 6: Lideranças
│       └── Pautas.tsx                  - Aba 7: Pautas sociais
│
├── 🗄️ Banco de Dados (prisma/)
│   ├── schema.prisma                   - Schema completo (7 tabelas)
│   └── seed.ts                         - Seed para popular banco
│
├── 🔧 Utilitários (lib/)
│   ├── prisma.ts                       - Cliente Prisma
│   └── date-utils.ts                   - Funções de formatação
│
├── 🌐 Arquivos Públicos (public/)
│   ├── manifest.json                   - Manifest PWA
│   └── icon.svg                        - Ícone para conversão
│
└── 📚 Documentação
    ├── README.md                       - Documentação principal
    ├── SETUP.md                        - Guia de instalação detalhado
    ├── QUICKSTART.md                   - Guia rápido (5 min)
    ├── API-DOCS.md                     - Documentação da API
    ├── ICONS.md                        - Guia de ícones PWA
    ├── CUSTOMIZATION.md                - Guia de personalização
    ├── PROJECT-SUMMARY.md              - Resumo do projeto
    ├── FILE-INDEX.md                   - Este arquivo
    └── database-example.sql            - SQL para popular banco
```

## 📋 Descrição Detalhada dos Arquivos

### Configuração

#### package.json
- Dependências do projeto
- Scripts npm (dev, build, start)
- Configuração do Prisma seed

#### tsconfig.json
- Configuração do TypeScript
- Paths aliases (@/*)
- Opções de compilação

#### next.config.js
- Configuração do Next.js
- Integração next-pwa
- Configuração de imagens

#### tailwind.config.ts
- Cores customizadas (primary, dark, medium, light)
- Animações (fade-in, slide-up, slide-down, scale-in)
- Keyframes personalizados

#### .env
- DATABASE_URL (PostgreSQL)
- Variáveis de ambiente

### Aplicação Next.js

#### app/layout.tsx
- Layout raiz da aplicação
- Metadata PWA (manifest, icons, theme)
- Configuração HTML/Body

#### app/page.tsx
- Página principal
- Sistema de abas (7 tabs)
- Seletor de cidades
- Gerenciamento de estado
- Renderização condicional das abas

#### app/globals.css
- Reset CSS
- Estilos do body
- Scrollbar customizada
- Classes utilitárias (.card, .btn-primary, etc)

#### app/api/cidades/route.ts
- GET: Lista todas as cidades
- POST: Cria nova cidade

#### app/api/cidades/[id]/route.ts
- GET: Busca cidade por ID (com relacionamentos)
- PUT: Atualiza cidade
- DELETE: Remove cidade

### Componentes React

#### components/CitySelector.tsx
- Dropdown animado para seleção de cidades
- Busca e filtragem
- Loading states
- Integração com API

#### components/tabs/PerfilCidade.tsx
- **Aba 1**: Perfil da Cidade
- Header com foto de perfil e background
- Cards com informações (fundação, aniversário, padroeiro, prato típico)
- Seção de histórico
- Animações de entrada

#### components/tabs/DadosDemograficos.tsx
- **Aba 2**: Dados Demográficos e Sociais
- Gráfico de pizza: Urbano/Rural
- Gráfico de pizza: Religiões (4 categorias)
- Cards com IDH e Escolaridade
- Grid de bairros principais
- Tooltips customizados

#### components/tabs/CalendarioEventos.tsx
- **Aba 3**: Calendário de Eventos
- Lista de festas e feriados
- Grid de fotos (até 3 por evento)
- Formatação de datas
- Cards animados

#### components/tabs/Votacao.tsx
- **Aba 4**: Votação
- Gráficos de barras (Deputados, Partidos)
- Cards de votos de legenda (45, 55)
- Listas de votos (Presidente, Governador)
- Dados eleitorais 2022

#### components/tabs/Emendas.tsx
- **Aba 5**: Emendas do PAB
- Resumo financeiro (total, empenhado)
- Lista detalhada de emendas
- Barra de progresso de execução
- Formatação de valores em BRL

#### components/tabs/Liderancas.tsx
- **Aba 6**: Lideranças
- Cards de lideranças políticas
- Estatísticas (votos 2024, previsão 2026)
- Variação percentual
- Data de visita do gestor
- Tags de cargo e partido

#### components/tabs/Pautas.tsx
- **Aba 7**: Pautas e Sensibilidade Social
- Cards de pautas ordenados
- Tags coloridas (urgência, sentimento, categoria)
- Volume de menções
- Status e tempo de atraso
- Links para fontes

### Banco de Dados

#### prisma/schema.prisma
Contém 7 tabelas principais:

1. **Cidade**
   - Informações básicas
   - Relacionamentos (1:1, 1:N)

2. **DadosDemograficos**
   - Percentuais urbano/rural
   - Religiões (4 categorias)
   - IDH e escolaridade
   - Array de bairros

3. **EventoProximo**
   - Festas tradicionais
   - Datas de feriados
   - Array de fotos

4. **DadosVotacao**
   - Votos deputados
   - Votos partidos
   - JSONB para presidente/governador
   - Votos de legenda

5. **Emenda**
   - Descrição e entidade
   - Valores (emenda, empenhado)

6. **Lideranca**
   - Dados pessoais
   - Histórico com PAB
   - Votos e previsões

7. **Pauta**
   - Informações completas
   - Níveis de urgência
   - Status e atrasos

#### prisma/seed.ts
- Script TypeScript para popular banco
- Dados de exemplo (São Paulo)
- Todas as 7 tabelas preenchidas

### Utilitários

#### lib/prisma.ts
- Cliente Prisma singleton
- Configuração para desenvolvimento/produção
- Prevenção de múltiplas instâncias

#### lib/date-utils.ts
- formatDate(): dd/MM/yyyy
- formatDateLong(): "25 de janeiro de 2024"
- formatCurrency(): R$ 1.000,00
- formatNumber(): 1.000
- formatPercent(): 50,00%

### PWA

#### public/manifest.json
- Nome da aplicação
- Ícones (192x192, 512x512)
- Cores (theme, background)
- Display mode (standalone)
- Orientação

#### public/icon.svg
- Ícone base em SVG
- Cores do projeto
- Pronto para conversão em PNG

### Documentação

#### README.md
- Overview completo do projeto
- Recursos e tecnologias
- Estrutura de pastas
- Guia de instalação básico
- Scripts disponíveis
- Estrutura do banco
- API endpoints
- Paleta de cores

#### SETUP.md
- Guia detalhado passo a passo
- Configuração PostgreSQL
- Migrations e seed
- Troubleshooting
- Comandos úteis do Prisma
- Variáveis de ambiente

#### QUICKSTART.md
- Início rápido (5 minutos)
- Comandos essenciais
- Estrutura de navegação
- Gerenciamento de dados
- Problemas comuns
- Próximos passos

#### API-DOCS.md
- Documentação completa da API
- Todos os endpoints
- Request/Response exemplos
- Códigos HTTP
- Exemplos cURL
- Exemplos JavaScript/fetch

#### ICONS.md
- Guia para gerar ícones PWA
- 3 opções de conversão SVG → PNG
- Especificações técnicas
- Ferramentas recomendadas
- Verificação de instalação
- Teste do PWA

#### CUSTOMIZATION.md
- Guia de personalização
- Alterar cores
- Modificar animações
- Customizar tipografia
- Ajustar layout
- Personalizar componentes
- Modificar gráficos
- Configurar PWA
- Responsividade
- Performance

#### PROJECT-SUMMARY.md
- Resumo completo do projeto
- Visão geral das funcionalidades
- Estrutura de arquivos
- Banco de dados
- Tecnologias
- Recursos PWA
- API REST
- Diferenciais
- Estatísticas
- Checklist de entrega

#### database-example.sql
- Script SQL alternativo
- Popular banco manualmente
- Dados de exemplo (Campinas)
- Todas as tabelas
- Query de verificação

## 🎯 Arquivos por Categoria

### Frontend (14 arquivos)
- Layout e página principal
- 7 componentes de abas
- Seletor de cidades
- Estilos globais
- Configurações Tailwind

### Backend (5 arquivos)
- Schema Prisma
- Cliente Prisma
- 3 rotas API
- Seed

### Configuração (7 arquivos)
- package.json
- TypeScript config
- Next.js config
- Tailwind config
- PostCSS config
- ESLint config
- .env

### Documentação (9 arquivos)
- 7 arquivos markdown
- 1 SQL
- 1 SVG icon

### Utilitários (2 arquivos)
- Prisma client
- Date/number formatters

## 📊 Totais

- **Arquivos TypeScript/TSX**: 21
- **Arquivos de Configuração**: 7
- **Arquivos de Documentação**: 9
- **Arquivos de Estilo**: 2
- **Arquivos de Dados**: 2

**Total**: ~41 arquivos criados

## 🔍 Como Navegar no Projeto

### Para desenvolver:
1. Inicie com [QUICKSTART.md](QUICKSTART.md)
2. Configure banco com [SETUP.md](SETUP.md)
3. Personalize com [CUSTOMIZATION.md](CUSTOMIZATION.md)

### Para entender a API:
- Leia [API-DOCS.md](API-DOCS.md)
- Veja exemplos em `app/api/cidades/`

### Para modificar UI:
- Componentes em `components/tabs/`
- Estilos em `app/globals.css`
- Cores em `tailwind.config.ts`

### Para ajustar BD:
- Schema em `prisma/schema.prisma`
- Client em `lib/prisma.ts`
- Seed em `prisma/seed.ts`

---

*Índice completo de todos os arquivos do projeto PAB Webapp*
