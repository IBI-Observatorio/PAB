# Geração de Ícones para PWA

O PWA requer ícones em formato PNG nos tamanhos 192x192 e 512x512 pixels.

## Opção 1: Converter o SVG Incluído

Use o arquivo `public/icon.svg` incluído no projeto e converta para PNG:

### Usando um serviço online:
1. Acesse: https://convertio.co/svg-png/
2. Faça upload do `public/icon.svg`
3. Converta para PNG em dois tamanhos:
   - 192x192 pixels
   - 512x512 pixels
4. Salve os arquivos como:
   - `public/icon-192x192.png`
   - `public/icon-512x512.png`

### Usando ImageMagick (linha de comando):
```bash
# Instale ImageMagick primeiro
# Windows: https://imagemagick.org/script/download.php
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Converter para 192x192
convert public/icon.svg -resize 192x192 public/icon-192x192.png

# Converter para 512x512
convert public/icon.svg -resize 512x512 public/icon-512x512.png
```

## Opção 2: Criar seus próprios ícones

Crie seus próprios ícones usando ferramentas como:
- **Figma** (https://figma.com) - Gratuito
- **Canva** (https://canva.com) - Gratuito
- **Adobe Illustrator** - Pago

### Especificações:
- Formato: PNG
- Tamanhos: 192x192px e 512x512px
- Fundo: Transparente ou #000022 (cor principal do app)
- Nome dos arquivos:
  - `icon-192x192.png`
  - `icon-512x512.png`
- Localização: pasta `public/`

## Opção 3: Usar um gerador de ícones PWA

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload de uma imagem base (mínimo 512x512px)
3. Configure as cores de fundo (#000022)
4. Baixe o pacote de ícones gerado
5. Copie os arquivos necessários para a pasta `public/`

## Verificar Instalação

Após gerar os ícones, verifique se os seguintes arquivos existem:
```
public/
  ├── icon-192x192.png
  ├── icon-512x512.png
  └── manifest.json (já incluído)
```

## Testar o PWA

1. Execute o build de produção:
```bash
npm run build
npm start
```

2. Acesse o app em Chrome/Edge
3. Procure o ícone de instalação na barra de endereços
4. Instale o PWA e teste

## Cores do Projeto

Use estas cores para manter consistência visual:
- Primary: #000022
- Primary Dark: #0A0A1A
- Primary Medium: #002366
- Primary Light: #001F3F

## Dica

Para melhor resultado, crie um design simples e reconhecível:
- Use formas geométricas simples
- Evite texto pequeno (pode ficar ilegível)
- Mantenha alto contraste
- Teste em diferentes tamanhos
