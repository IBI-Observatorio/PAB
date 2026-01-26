# Comandos Úteis - PAB Webapp

## 🚀 Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar em modo watch (com hot reload)
npm run dev -- --turbo

# Verificar código com ESLint
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint -- --fix
```

## 🏗️ Comandos de Build

```bash
# Criar build de produção
npm run build

# Iniciar servidor de produção
npm start

# Build + Start
npm run build && npm start

# Limpar cache do Next.js
rm -rf .next

# Limpar tudo e reinstalar
rm -rf .next node_modules package-lock.json
npm install
```

## 🗄️ Comandos do Prisma

### Migrations
```bash
# Criar migration (desenvolvimento)
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (CUIDADO! Apaga todos os dados)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status

# Resolver problemas de migration
npx prisma migrate resolve
```

### Schema
```bash
# Gerar Prisma Client
npx prisma generate

# Validar schema.prisma
npx prisma validate

# Formatar schema.prisma
npx prisma format

# Aplicar mudanças sem criar migration
npx prisma db push

# Criar schema baseado no banco existente
npx prisma db pull
```

### Dados
```bash
# Popular banco com seed
npx prisma db seed

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Abrir Studio em porta específica
npx prisma studio --port 5555
```

### Inspeção
```bash
# Ver informações do banco
npx prisma db execute --stdin < query.sql

# Executar query SQL
npx prisma db execute --stdin <<< "SELECT * FROM cidades;"
```

## 📦 Comandos do Git

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Initial commit"

# Ver status
git status

# Ver diferenças
git diff

# Criar branch
git checkout -b feature/nova-feature

# Mudar de branch
git checkout main

# Ver histórico
git log --oneline

# Conectar com repositório remoto
git remote add origin https://github.com/usuario/pab-webapp.git

# Push para o remoto
git push -u origin main
```

## 🌐 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs
```

### Docker
```bash
# Build da imagem
docker build -t pab-webapp .

# Rodar container
docker run -p 3000:3000 pab-webapp

# Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

## 🔍 Diagnóstico

```bash
# Ver versão do Node
node --version

# Ver versão do npm
npm --version

# Ver informações do sistema
npx envinfo --system --binaries

# Testar conexão com PostgreSQL
psql -U usuario -d pab_webapp -c "SELECT version();"

# Ver processos usando a porta 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Matar processo na porta 3000
kill -9 $(lsof -ti:3000)  # Mac/Linux
taskkill /F /PID <PID>  # Windows
```

## 🧪 Testes

```bash
# Rodar testes (se implementados)
npm test

# Rodar testes em modo watch
npm test -- --watch

# Ver cobertura de testes
npm test -- --coverage
```

## 📊 Performance

```bash
# Analisar tamanho do bundle
npm run build -- --analyze

# Ver relatório de build
npm run build -- --profile

# Lighthouse (performance audit)
npx lighthouse http://localhost:3000
```

## 🔧 Manutenção

```bash
# Atualizar dependências
npm update

# Ver dependências desatualizadas
npm outdated

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# Limpar cache do npm
npm cache clean --force

# Verificar integridade dos pacotes
npm ci
```

## 🛠️ Utilitários

```bash
# Criar novo componente (exemplo manual)
mkdir -p components/tabs
touch components/tabs/NovoComponente.tsx

# Encontrar arquivos por nome
find . -name "*.tsx" -type f

# Buscar texto em arquivos
grep -r "texto" .

# Contar linhas de código
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Ver tamanho da pasta node_modules
du -sh node_modules

# Remover node_modules de todos os projetos
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
```

## 🌍 Servidor Local

```bash
# Iniciar PostgreSQL
# Mac/Linux
sudo service postgresql start

# Windows
pg_ctl start -D "C:\Program Files\PostgreSQL\14\data"

# Parar PostgreSQL
sudo service postgresql stop

# Status do PostgreSQL
sudo service postgresql status
```

## 📝 PostgreSQL

```bash
# Conectar ao PostgreSQL
psql -U usuario -d pab_webapp

# Listar bancos de dados
\l

# Listar tabelas
\dt

# Descrever tabela
\d nome_da_tabela

# Executar arquivo SQL
psql -U usuario -d pab_webapp -f arquivo.sql

# Backup do banco
pg_dump -U usuario pab_webapp > backup.sql

# Restaurar backup
psql -U usuario -d pab_webapp < backup.sql

# Criar novo banco
createdb -U usuario pab_webapp

# Deletar banco
dropdb -U usuario pab_webapp
```

## 🎨 Tailwind

```bash
# Gerar arquivo de tipos Tailwind (opcional)
npx tailwindcss-language-server --stdio

# Verificar classes não utilizadas
npx tailwind-config-viewer

# Build CSS standalone
npx tailwindcss -i ./app/globals.css -o ./output.css
```

## ⚡ Atalhos Úteis

```bash
# Alias úteis (adicione ao ~/.bashrc ou ~/.zshrc)
alias dev="npm run dev"
alias build="npm run build"
alias db="npx prisma studio"
alias migrate="npx prisma migrate dev"
alias seed="npx prisma db seed"

# Recarregar shell
source ~/.bashrc  # ou source ~/.zshrc
```

## 🔑 Variáveis de Ambiente

```bash
# Ver variáveis de ambiente
printenv

# Ver variável específica
echo $DATABASE_URL

# Definir variável (temporário)
export DATABASE_URL="postgresql://..."

# Carregar .env (usando dotenv-cli)
npx dotenv-cli npm run dev
```

## 📱 PWA

```bash
# Validar manifest.json
npx pwa-manifest-validator public/manifest.json

# Testar service worker
npx lighthouse http://localhost:3000 --view

# Gerar ícones (usando sharp-cli)
npx sharp-cli -i public/icon.svg -o public/icon-192x192.png -w 192
npx sharp-cli -i public/icon.svg -o public/icon-512x512.png -w 512
```

## 🎯 One-Liners Úteis

```bash
# Setup completo do zero
npm install && npx prisma migrate dev --name init && npx prisma db seed && npm run dev

# Reset completo do banco
npx prisma migrate reset --force && npx prisma db seed

# Limpar e rebuild
rm -rf .next node_modules && npm install && npm run build

# Ver todos os processos Node
ps aux | grep node

# Matar todos os processos Node
pkill -9 node

# Ver uso de memória
node --max-old-space-size=4096 node_modules/.bin/next build
```

## 📚 Help Commands

```bash
# Help do Next.js
npx next --help

# Help do Prisma
npx prisma --help

# Help de um comando específico
npx prisma migrate --help
```

---

**Dica**: Salve os comandos que você mais usa como alias ou scripts npm no package.json!
