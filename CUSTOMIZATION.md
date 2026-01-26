# Guia de Personalização - PAB Webapp

Este guia mostra como personalizar o visual e funcionalidades do webapp.

## Cores

### Alterar Paleta de Cores

Edite o arquivo [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  primary: {
    DEFAULT: '#000022',    // Cor principal
    dark: '#0A0A1A',       // Escuro
    medium: '#002366',     // Médio
    light: '#001F3F',      // Claro
  },
}
```

### Adicionar Novas Cores

```typescript
colors: {
  primary: { /* ... */ },
  secondary: {
    DEFAULT: '#FF6B6B',
    dark: '#C92A2A',
    light: '#FFA8A8',
  },
  accent: '#4ECDC4',
}
```

### Usar Novas Cores nos Componentes

```tsx
<div className="bg-secondary text-white">
  <button className="bg-accent hover:bg-accent/80">
    Clique aqui
  </button>
</div>
```

## Animações

### Modificar Animações Existentes

Edite [tailwind.config.ts](tailwind.config.ts):

```typescript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in',      // Mudar duração
  'slide-up': 'slideUp 1s ease-out',     // Mais lento
  'scale-in': 'scaleIn 0.2s ease-out',   // Mais rápido
}
```

### Criar Nova Animação

1. Adicione o keyframe:
```typescript
keyframes: {
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}
```

2. Adicione a animação:
```typescript
animation: {
  'bounce-slow': 'bounce 2s infinite',
}
```

3. Use no componente:
```tsx
<div className="animate-bounce-slow">
  Conteúdo com bounce
</div>
```

## Tipografia

### Alterar Fonte

1. Adicione a fonte no [app/layout.tsx](app/layout.tsx):

```tsx
import { Inter, Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body>{children}</body>
    </html>
  );
}
```

2. Configure no [tailwind.config.ts](tailwind.config.ts):

```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-roboto)', 'sans-serif'],
    },
  },
}
```

## Layout

### Alterar Largura Máxima do Conteúdo

Em [app/page.tsx](app/page.tsx), mude:

```tsx
// De:
<div className="max-w-7xl mx-auto">

// Para:
<div className="max-w-6xl mx-auto">  // Mais estreito
// ou
<div className="max-w-full px-4">    // Largura total
```

### Modificar Espaçamento

```tsx
// Padding externo
<main className="p-8">              // Padrão
<main className="p-4 md:p-12">     // Menor mobile, maior desktop

// Espaçamento entre seções
<div className="space-y-6">        // Padrão
<div className="space-y-8">        // Mais espaçamento
```

## Abas

### Alterar Ícones das Abas

Em [app/page.tsx](app/page.tsx):

```tsx
const tabs = [
  { id: 1, name: 'Perfil da Cidade', icon: '🌆' },  // Mude o emoji
  { id: 2, name: 'Dados Demográficos', icon: '📈' },
  // ...
];
```

### Adicionar Nova Aba

1. Adicione no array de tabs:
```tsx
{ id: 8, name: 'Nova Aba', icon: '⭐' }
```

2. Crie o componente em `components/tabs/NovaAba.tsx`

3. Adicione no switch do `renderTabContent()`:
```tsx
case 8:
  return <NovaAba data={cityData.novaAba} />;
```

### Remover Aba

Simplesmente remova do array `tabs` e do switch case.

## Componentes

### Customizar Cards

Edite [app/globals.css](app/globals.css):

```css
.card {
  @apply bg-primary-dark/50 backdrop-blur-sm
         border border-primary-medium/30
         rounded-lg p-6 shadow-xl;

  /* Adicione seus estilos: */
  box-shadow: 0 0 20px rgba(0, 35, 102, 0.3);
  border-width: 2px;
}
```

### Criar Novo Estilo de Botão

```css
.btn-secondary {
  @apply bg-gradient-to-r from-purple-600 to-pink-600
         text-white font-bold py-3 px-8
         rounded-full shadow-lg
         hover:shadow-2xl hover:scale-105
         transition-all duration-300;
}
```

Use:
```tsx
<button className="btn-secondary">
  Clique aqui
</button>
```

## Gráficos

### Alterar Cores dos Gráficos

Em [components/tabs/DadosDemograficos.tsx](components/tabs/DadosDemograficos.tsx):

```tsx
// Mude as cores:
const COLORS_URBAN = ['#3B82F6', '#10B981'];  // Azul e Verde
const COLORS_RELIGION = ['#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'];
```

### Modificar Tipo de Gráfico

```tsx
// Pizza para Barra:
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

<BarChart data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Bar dataKey="value" fill="#3B82F6" />
</BarChart>
```

## PWA

### Alterar Nome do App

Edite [public/manifest.json](public/manifest.json):

```json
{
  "name": "Meu App Político",
  "short_name": "MeuApp",
  "description": "Descrição personalizada"
}
```

### Mudar Cor do Tema

```json
{
  "theme_color": "#1E3A8A",      // Sua cor
  "background_color": "#1E3A8A"  // Mesma cor
}
```

## Responsividade

### Breakpoints do Tailwind

```tsx
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

<div className="
  grid-cols-1          // Mobile: 1 coluna
  md:grid-cols-2       // Tablet: 2 colunas
  lg:grid-cols-3       // Desktop: 3 colunas
">
```

### Ocultar em Mobile

```tsx
<div className="hidden md:block">
  Visível apenas em telas médias ou maiores
</div>

<div className="block md:hidden">
  Visível apenas em mobile
</div>
```

## Idioma

### Mudar Textos

Todos os textos estão em português nos componentes. Para alterar:

1. Busque o texto no componente
2. Substitua pelo novo texto

Exemplo em [components/tabs/PerfilCidade.tsx](components/tabs/PerfilCidade.tsx):

```tsx
// De:
<h3>Breve Histórico / Origem</h3>

// Para:
<h3>História da Cidade</h3>
```

### Implementar Internacionalização (i18n)

Para suporte a múltiplos idiomas, use `next-intl`:

```bash
npm install next-intl
```

Consulte: https://next-intl-docs.vercel.app/

## Performance

### Lazy Loading de Componentes

```tsx
import dynamic from 'next/dynamic';

const DadosDemograficos = dynamic(
  () => import('@/components/tabs/DadosDemograficos'),
  { loading: () => <p>Carregando...</p> }
);
```

### Otimizar Imagens

```tsx
import Image from 'next/image';

<Image
  src="/foto.jpg"
  alt="Descrição"
  width={800}
  height={600}
  priority  // Para imagens acima da dobra
/>
```

## Deploy

### Variáveis de Ambiente em Produção

Crie `.env.production`:

```env
DATABASE_URL="sua_url_de_producao"
NEXT_PUBLIC_API_URL="https://seudominio.com"
```

### Build Otimizado

```bash
npm run build
npm start
```

## Dicas de Customização

### 1. Efeito Glassmorphism
```css
.glass {
  background: rgba(10, 10, 26, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2. Gradientes Personalizados
```tsx
<div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
```

### 3. Sombras Customizadas
```css
.shadow-custom {
  box-shadow: 0 20px 50px rgba(0, 35, 102, 0.4);
}
```

### 4. Animação de Hover em Cards
```tsx
<motion.div
  whileHover={{
    scale: 1.05,
    boxShadow: "0 25px 50px rgba(0, 35, 102, 0.5)"
  }}
  transition={{ duration: 0.2 }}
>
```

## Recursos

- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Recharts: https://recharts.org/
- Next.js: https://nextjs.org/docs

---

**Personalize à vontade e crie um design único para seu webapp!**
