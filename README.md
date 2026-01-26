# PAB - Informações Políticas

PWA (Progressive Web App) para gestão de informações políticas municipais com design elegante e profissional.

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **PostgreSQL** - Banco de dados
- **Prisma ORM** - ORM para PostgreSQL
- **Recharts** - Gráficos e visualizações
- **next-pwa** - Suporte PWA

## Estrutura do Projeto

```
PAB/
├── app/                    # Rotas e páginas Next.js
│   ├── api/               # API Routes
│   │   └── cidades/       # Endpoints de cidades
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── tabs/             # Componentes das 7 abas
│   │   ├── PerfilCidade.tsx
│   │   ├── DadosDemograficos.tsx
│   │   ├── CalendarioEventos.tsx
│   │   ├── Votacao.tsx
│   │   ├── Emendas.tsx
│   │   ├── Liderancas.tsx
│   │   └── Pautas.tsx
│   └── CitySelector.tsx   # Seletor de cidades
├── lib/                   # Bibliotecas e utilitários
│   └── prisma.ts         # Cliente Prisma
├── prisma/               # Schema do banco de dados
│   └── schema.prisma     # Modelo de dados
└── public/               # Arquivos estáticos
    └── manifest.json     # Manifest PWA

## Recursos

### 7 Abas Principais

1. **Perfil da Cidade** - Informações básicas, histórico, padroeiro, prato típico
2. **Dados Demográficos** - População urbana/rural, religiões, IDH, escolaridade, bairros
3. **Calendário de Eventos** - Festas tradicionais e feriados municipais
4. **Votação** - Dados eleitorais de 2022 (deputados, partidos, presidente, governador)
5. **Emendas do PAB** - Emendas parlamentares, valores e execução
6. **Lideranças** - Políticos locais, votos e previsões
7. **Pautas** - Questões sociais, urgências e sensibilidades

### Recursos Técnicos

- Tela responsiva para todos os dispositivos
- Micro-animações usando Framer Motion
- Gráficos interativos (pizza e barras)
- Design clean com cores #000022, #0A0A1A, #002366, #001F3F
- PWA instalável
- Seletor de cidades dinâmico
- API REST completa

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados PostgreSQL no arquivo `.env`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pab_webapp?schema=public"
```

3. Execute as migrations do Prisma:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter
- `npx prisma studio` - Abre interface visual do banco de dados

## Estrutura do Banco de Dados

O banco de dados PostgreSQL possui as seguintes tabelas:

- `cidades` - Dados principais das cidades
- `dados_demograficos` - Informações demográficas
- `eventos_proximos` - Calendário de eventos
- `dados_votacao` - Informações eleitorais
- `emendas` - Emendas parlamentares
- `liderancas` - Lideranças políticas locais
- `pautas` - Pautas sociais e sensibilidades

## API Endpoints

### Cidades
- `GET /api/cidades` - Lista todas as cidades
- `GET /api/cidades/[id]` - Busca cidade por ID (com todos os relacionamentos)
- `POST /api/cidades` - Cria nova cidade
- `PUT /api/cidades/[id]` - Atualiza cidade
- `DELETE /api/cidades/[id]` - Remove cidade

## Paleta de Cores

- Primary: #000022
- Primary Dark: #0A0A1A
- Primary Medium: #002366
- Primary Light: #001F3F

## Contribuindo

Este projeto foi desenvolvido para gerenciamento de informações políticas municipais.

## Licença

Desenvolvido por PAB - Todos os direitos reservados.
