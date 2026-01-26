# Guia Rápido de Início - PAB Webapp

## Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

Edite o arquivo `.env` e configure sua conexão PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pab_webapp?schema=public"
```

### 3. Criar Banco e Tabelas
```bash
npx prisma migrate dev --name init
```

### 4. (Opcional) Popular com Dados de Exemplo

#### Opção A: Usar o seed do Prisma
```bash
npm install -D ts-node
npx prisma db seed
```

#### Opção B: Usar o script SQL
Execute o arquivo `database-example.sql` no PostgreSQL:
```bash
psql -U usuario -d pab_webapp -f database-example.sql
```

### 5. Gerar Ícones PWA

Converta o `public/icon.svg` para PNG (ver instruções em [ICONS.md](ICONS.md)) ou use qualquer imagem 512x512px:
- Salve como `public/icon-192x192.png`
- Salve como `public/icon-512x512.png`

### 6. Iniciar o Servidor
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Estrutura de Navegação

O webapp possui 7 abas principais:

1. **🏙️ Perfil da Cidade** - Informações básicas e histórico
2. **📊 Dados Demográficos** - População, religião, IDH, bairros
3. **🎉 Eventos** - Festas e feriados municipais
4. **🗳️ Votação** - Resultados eleitorais de 2022
5. **💰 Emendas** - Emendas do PAB e execução
6. **👥 Lideranças** - Políticos locais e previsões
7. **⚠️ Pautas** - Questões sociais e urgências

## Gerenciar Dados

### Via Prisma Studio (Interface Visual)
```bash
npx prisma studio
```
Abre em: [http://localhost:5555](http://localhost:5555)

### Via API (Programaticamente)
Consulte [API-DOCS.md](API-DOCS.md) para endpoints disponíveis.

### Via SQL Direto
Conecte ao PostgreSQL e use queries SQL normalmente.

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build otimizado
npm start                # Inicia servidor de produção

# Banco de Dados
npx prisma studio        # Interface visual do BD
npx prisma migrate dev   # Criar nova migration
npx prisma db push       # Aplicar mudanças sem migration
npx prisma generate      # Gerar Prisma Client

# Linting
npm run lint             # Verificar código
```

## Problemas Comuns

### "Can't reach database server"
- Verifique se PostgreSQL está rodando
- Confirme credenciais no `.env`
- Teste: `psql -U usuario -d pab_webapp`

### "Module not found"
```bash
npm install
npx prisma generate
```

### Build falha
```bash
rm -rf .next node_modules
npm install
npm run build
```

### PWA não instala
- Use HTTPS em produção
- Verifique se ícones PNG existem
- Teste em Chrome/Edge (melhor suporte)

## Próximos Passos

1. ✅ Adicione suas cidades
2. ✅ Popule com dados reais
3. ✅ Customize cores e design
4. ✅ Adicione suas próprias fotos
5. ✅ Deploy em produção

## Documentação Completa

- [README.md](README.md) - Visão geral completa
- [SETUP.md](SETUP.md) - Guia detalhado de instalação
- [API-DOCS.md](API-DOCS.md) - Documentação da API
- [ICONS.md](ICONS.md) - Como gerar ícones PWA

## Suporte

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Tailwind: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

---

**Desenvolvido para gerenciamento de informações políticas municipais**
