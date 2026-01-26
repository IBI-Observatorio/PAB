# Documentação da API - PAB Webapp

Base URL: `http://localhost:3000/api`

## Endpoints de Cidades

### Listar todas as cidades

```http
GET /api/cidades
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 1,
    "nome": "São Paulo"
  },
  {
    "id": 2,
    "nome": "Campinas"
  }
]
```

### Buscar cidade por ID (com todos os dados)

```http
GET /api/cidades/:id
```

**Parâmetros:**
- `id` (number, obrigatório) - ID da cidade

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "nome": "São Paulo",
  "gentilico": "Paulistano",
  "dataFundacao": "1554-01-25T00:00:00.000Z",
  "dataAniversario": "2024-01-25T00:00:00.000Z",
  "breveHistorico": "São Paulo foi fundada em 25 de janeiro de 1554...",
  "padroeiro": "São Paulo Apóstolo",
  "pratoTipico": "Virado à Paulista",
  "fotoPerfil": null,
  "fotoBackground": null,
  "createdAt": "2024-11-20T10:00:00.000Z",
  "updatedAt": "2024-11-20T10:00:00.000Z",
  "dadosDemograficos": {
    "id": 1,
    "cidadeId": 1,
    "percentualRural": 5.5,
    "percentualUrbano": 94.5,
    "percentualCatolico": 58.2,
    "percentualEspirita": 3.5,
    "percentualEvangelico": 22.1,
    "percentualSemReligiao": 16.2,
    "religiaoPredominante": "Católico",
    "idh": 0.805,
    "taxaAlfabetizacao": 96.5,
    "principaisBairros": ["Pinheiros", "Vila Mariana", "Mooca"]
  },
  "eventosProximos": [
    {
      "id": 1,
      "cidadeId": 1,
      "festaTradicional": "Aniversário de São Paulo",
      "dataFeriado": "2025-01-25T00:00:00.000Z",
      "fotos": []
    }
  ],
  "dadosVotacao": {
    "id": 1,
    "cidadeId": 1,
    "votosPauloAlexandre2022": 45230,
    "votosOutrosDeputadosFederais2022": 1250000,
    "votosPSDBTotal2022": 320000,
    "votosPSDTotal2022": 280000,
    "votosOutrosPartidos2022": 1800000,
    "votosPresidente2022": {
      "Luiz Inácio Lula da Silva": 3200000,
      "Jair Bolsonaro": 2800000
    },
    "votosGovernador2022": {
      "Tarcísio de Freitas": 2900000,
      "Fernando Haddad": 3100000
    },
    "pesquisasEleitorais": null,
    "votosLegendaPSDB45": 45000,
    "votosLegendaPSD55": 38000
  },
  "emendas": [
    {
      "id": 1,
      "cidadeId": 1,
      "descricao": "Construção de nova unidade básica de saúde...",
      "entidadeBeneficiada": "Prefeitura Municipal de São Paulo",
      "valorEmenda": 2500000.00,
      "valorEmpenhado": 2500000.00
    }
  ],
  "liderancas": [
    {
      "id": 1,
      "cidadeId": 1,
      "nome": "João Silva",
      "cargo": "Vereador",
      "partido": "PSDB",
      "historicoComPAB": "Parceria estabelecida desde 2020...",
      "votos2024": 15420,
      "votosPrevistos2026": 18500,
      "dataVisitaGestor": "2024-03-15T00:00:00.000Z"
    }
  ],
  "pautas": [
    {
      "id": 1,
      "cidadeId": 1,
      "dataPublicacao": "2024-11-20T00:00:00.000Z",
      "urlFonte": "https://exemplo.com/noticia",
      "titulo": "Falta de iluminação pública...",
      "resumoProblema": "Moradores do bairro...",
      "localizacaoEspecifica": "Jardim Aurora",
      "categoria": "Infraestrutura",
      "volumeMencoes": 350,
      "nivelUrgencia": 4,
      "sentimentoPredominante": "Negativo",
      "autoridadeResponsavel": "Prefeitura Municipal",
      "statusResposta": "Em análise",
      "tempoAtraso": 45
    }
  ]
}
```

**Resposta de Erro (404):**
```json
{
  "error": "Cidade não encontrada"
}
```

### Criar nova cidade

```http
POST /api/cidades
```

**Body:**
```json
{
  "nome": "Campinas",
  "gentilico": "Campineiro",
  "dataFundacao": "1842-07-14",
  "dataAniversario": "2024-07-14",
  "breveHistorico": "Campinas é uma das cidades mais importantes...",
  "padroeiro": "Nossa Senhora da Conceição",
  "pratoTipico": "Linguiça de Campinas",
  "fotoPerfil": "https://exemplo.com/foto.jpg",
  "fotoBackground": "https://exemplo.com/background.jpg"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 2,
  "nome": "Campinas",
  "gentilico": "Campineiro",
  "dataFundacao": "1842-07-14T00:00:00.000Z",
  "dataAniversario": "2024-07-14T00:00:00.000Z",
  "breveHistorico": "Campinas é uma das cidades mais importantes...",
  "padroeiro": "Nossa Senhora da Conceição",
  "pratoTipico": "Linguiça de Campinas",
  "fotoPerfil": "https://exemplo.com/foto.jpg",
  "fotoBackground": "https://exemplo.com/background.jpg",
  "createdAt": "2024-11-20T10:00:00.000Z",
  "updatedAt": "2024-11-20T10:00:00.000Z"
}
```

### Atualizar cidade

```http
PUT /api/cidades/:id
```

**Parâmetros:**
- `id` (number, obrigatório) - ID da cidade

**Body (todos os campos são opcionais):**
```json
{
  "nome": "São Paulo",
  "gentilico": "Paulistano",
  "breveHistorico": "Novo texto do histórico...",
  "fotoPerfil": "https://exemplo.com/nova-foto.jpg"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 1,
  "nome": "São Paulo",
  "gentilico": "Paulistano",
  "dataFundacao": "1554-01-25T00:00:00.000Z",
  "dataAniversario": "2024-01-25T00:00:00.000Z",
  "breveHistorico": "Novo texto do histórico...",
  "padroeiro": "São Paulo Apóstolo",
  "pratoTipico": "Virado à Paulista",
  "fotoPerfil": "https://exemplo.com/nova-foto.jpg",
  "fotoBackground": null,
  "createdAt": "2024-11-20T10:00:00.000Z",
  "updatedAt": "2024-11-20T15:00:00.000Z"
}
```

### Deletar cidade

```http
DELETE /api/cidades/:id
```

**Parâmetros:**
- `id` (number, obrigatório) - ID da cidade

**Resposta de Sucesso (200):**
```json
{
  "message": "Cidade deletada com sucesso"
}
```

**Nota:** Deletar uma cidade também remove todos os dados relacionados (dados demográficos, eventos, votação, emendas, lideranças e pautas) devido ao cascade delete configurado no Prisma.

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Dados inválidos na requisição
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

## Exemplos de Uso com cURL

### Listar cidades
```bash
curl http://localhost:3000/api/cidades
```

### Buscar cidade específica
```bash
curl http://localhost:3000/api/cidades/1
```

### Criar cidade
```bash
curl -X POST http://localhost:3000/api/cidades \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Campinas",
    "gentilico": "Campineiro",
    "dataFundacao": "1842-07-14",
    "dataAniversario": "2024-07-14",
    "breveHistorico": "História da cidade...",
    "padroeiro": "Nossa Senhora da Conceição",
    "pratoTipico": "Linguiça de Campinas"
  }'
```

### Atualizar cidade
```bash
curl -X PUT http://localhost:3000/api/cidades/1 \
  -H "Content-Type: application/json" \
  -d '{
    "breveHistorico": "Nova história..."
  }'
```

### Deletar cidade
```bash
curl -X DELETE http://localhost:3000/api/cidades/1
```

## Exemplos de Uso com JavaScript (fetch)

### Listar cidades
```javascript
const cidades = await fetch('http://localhost:3000/api/cidades')
  .then(res => res.json());
```

### Buscar cidade específica
```javascript
const cidade = await fetch('http://localhost:3000/api/cidades/1')
  .then(res => res.json());
```

### Criar cidade
```javascript
const novaCidade = await fetch('http://localhost:3000/api/cidades', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Campinas',
    gentilico: 'Campineiro',
    dataFundacao: '1842-07-14',
    dataAniversario: '2024-07-14',
    breveHistorico: 'História da cidade...',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Linguiça de Campinas'
  })
}).then(res => res.json());
```

## Notas Importantes

1. **Datas**: Todas as datas devem ser enviadas no formato ISO 8601 (YYYY-MM-DD)
2. **IDs**: Todos os IDs são números inteiros auto-incrementados
3. **Relacionamentos**: Ao buscar uma cidade, todos os dados relacionados são retornados automaticamente
4. **Validação**: A API valida automaticamente os tipos de dados através do Prisma
5. **CORS**: Em desenvolvimento, CORS está habilitado para todas as origens

## Futuras Expansões da API

APIs específicas para cada entidade podem ser adicionadas:
- `/api/demograficos/:id`
- `/api/eventos/:id`
- `/api/votacao/:id`
- `/api/emendas/:id`
- `/api/liderancas/:id`
- `/api/pautas/:id`

Atualmente, todas essas informações são acessíveis através do endpoint principal de cidades.
