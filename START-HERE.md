# 🚀 COMECE AQUI - PAB Webapp

## Bem-vindo ao seu novo sistema de informações políticas!

Este é um **PWA completo e profissional** para gerenciar informações políticas de cidades.

## ⚡ Início Super Rápido (3 comandos)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados (edite DATABASE_URL no .env antes!)
npx prisma migrate dev --name init

# 3. Iniciar aplicação
npm run dev
```

Acesse: **http://localhost:3000**

## 📚 O que você precisa saber

### 1️⃣ Primeiro: Configure o Banco de Dados

Edite o arquivo `.env` e coloque suas credenciais PostgreSQL:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/pab_webapp?schema=public"
```

### 2️⃣ Segundo: Crie as Tabelas

```bash
npx prisma migrate dev --name init
```

### 3️⃣ Terceiro: (Opcional) Adicione Dados de Teste

```bash
npm install -D ts-node
npx prisma db seed
```

### 4️⃣ Quarto: Inicie o Servidor

```bash
npm run dev
```

## 🎯 O que você tem aqui

### ✅ 7 Abas Completas
1. 🏙️ **Perfil da Cidade** - Nome, histórico, padroeiro
2. 📊 **Dados Demográficos** - População, religião, IDH (com gráficos!)
3. 🎉 **Eventos** - Festas e feriados
4. 🗳️ **Votação** - Resultados eleitorais 2022
5. 💰 **Emendas** - Emendas do PAB
6. 👥 **Lideranças** - Políticos locais
7. ⚠️ **Pautas** - Questões sociais

### ✅ Recursos Técnicos
- PWA instalável
- Design responsivo
- Microanimações
- Gráficos interativos
- API REST completa
- PostgreSQL + Prisma

## 📖 Documentação Disponível

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| [QUICKSTART.md](QUICKSTART.md) | Início rápido (5 min) | Para começar rapidamente |
| [SETUP.md](SETUP.md) | Guia detalhado | Para configuração completa |
| [README.md](README.md) | Visão geral | Para entender o projeto |
| [API-DOCS.md](API-DOCS.md) | Documentação API | Para integrar com a API |
| [CUSTOMIZATION.md](CUSTOMIZATION.md) | Personalização | Para customizar design |
| [ICONS.md](ICONS.md) | Ícones PWA | Para gerar ícones do app |
| [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) | Resumo completo | Para visão geral técnica |
| [FILE-INDEX.md](FILE-INDEX.md) | Índice de arquivos | Para navegar no código |

## 🎨 Personalize Agora

### Mudar Cores

Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#000022',  // Sua cor aqui
    dark: '#0A0A1A',
    // ...
  }
}
```

### Adicionar Logo

Substitua os arquivos em `public/`:
- `icon-192x192.png`
- `icon-512x512.png`

## 🗄️ Gerenciar Dados

### Opção 1: Interface Visual (Recomendado)
```bash
npx prisma studio
```
Abre em: http://localhost:5555

### Opção 2: Via API
Use os endpoints em `http://localhost:3000/api/cidades`

### Opção 3: SQL Direto
Conecte ao PostgreSQL normalmente

## 🚀 Deploy em Produção

### Vercel (Recomendado)
1. Crie conta em https://vercel.com
2. Conecte seu repositório GitHub
3. Configure a variável `DATABASE_URL`
4. Deploy automático!

### Docker
```bash
npm run build
npm start
```

## ❓ Precisa de Ajuda?

### Problemas Comuns

**"Can't reach database server"**
- PostgreSQL está rodando? (`sudo service postgresql start`)
- Credenciais corretas no `.env`?

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build falha**
```bash
rm -rf .next
npm run build
```

## 📞 Próximos Passos

1. ✅ Configure o banco de dados
2. ✅ Inicie o servidor (`npm run dev`)
3. ✅ Adicione sua primeira cidade
4. ✅ Personalize as cores
5. ✅ Gere os ícones PWA
6. ✅ Faça deploy!

## 🎉 Pronto!

Seu sistema está **100% funcional e pronto para uso**.

Divirta-se gerenciando informações políticas! 🚀

---

### Links Rápidos

- 📖 [Documentação Completa](README.md)
- 🚀 [Guia Rápido](QUICKSTART.md)
- 🎨 [Personalização](CUSTOMIZATION.md)
- 🔧 [API](API-DOCS.md)

---

**Desenvolvido com ❤️ usando Next.js, React, TypeScript e PostgreSQL**
