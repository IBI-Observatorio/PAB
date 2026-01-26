-- Script SQL para popular o banco de dados com dados de exemplo
-- Execute este script após rodar as migrations do Prisma

-- Inserir cidade de exemplo: Campinas
INSERT INTO cidades (nome, gentilico, "dataFundacao", "dataAniversario", "breveHistorico", padroeiro, "pratoTipico", "createdAt", "updatedAt")
VALUES (
  'Campinas',
  'Campineiro',
  '1842-07-14',
  '2024-07-14',
  'Campinas é uma das cidades mais importantes do interior paulista. Fundada em 1774, teve seu crescimento impulsionado pelo ciclo do café no século XIX. Atualmente é um importante polo tecnológico e universitário, abrigando a UNICAMP e diversas empresas de tecnologia.',
  'Nossa Senhora da Conceição',
  'Linguiça de Campinas',
  NOW(),
  NOW()
) RETURNING id;

-- Obter o ID da cidade inserida (substitua 1 pelo ID real retornado acima)
-- Para os próximos INSERTs, use o ID correto da cidade

-- Dados Demográficos
INSERT INTO dados_demograficos ("cidadeId", "percentualRural", "percentualUrbano", "percentualCatolico", "percentualEspirita", "percentualEvangelico", "percentualSemReligiao", "religiaoPredominante", idh, "taxaAlfabetizacao", "principaisBairros", "createdAt", "updatedAt")
VALUES (
  1, -- Substitua pelo ID da cidade
  8.5,
  91.5,
  55.3,
  4.2,
  24.8,
  15.7,
  'Católico',
  0.805,
  96.8,
  ARRAY['Cambuí', 'Taquaral', 'Centro', 'Barão Geraldo', 'Nova Campinas', 'Jardim Guanabara'],
  NOW(),
  NOW()
);

-- Eventos
INSERT INTO eventos_proximos ("cidadeId", "festaTradicional", "dataFeriado", fotos, "createdAt", "updatedAt")
VALUES
  (1, 'Aniversário de Campinas', '2025-07-14', ARRAY[]::text[], NOW(), NOW()),
  (1, 'Festa de Nossa Senhora da Conceição', '2024-12-08', ARRAY[]::text[], NOW(), NOW()),
  (1, 'Expocampinas - Exposição Agropecuária', '2025-04-15', ARRAY[]::text[], NOW(), NOW());

-- Dados de Votação
INSERT INTO dados_votacao (
  "cidadeId",
  "votosPauloAlexandre2022",
  "votosOutrosDeputadosFederais2022",
  "votosPSDBTotal2022",
  "votosPSDTotal2022",
  "votosOutrosPartidos2022",
  "votosPresidente2022",
  "votosGovernador2022",
  "pesquisasEleitorais",
  "votosLegendaPSDB45",
  "votosLegendaPSD55",
  "createdAt",
  "updatedAt"
)
VALUES (
  1,
  28500,
  450000,
  125000,
  98000,
  650000,
  '{"Luiz Inácio Lula da Silva": 380000, "Jair Bolsonaro": 340000}'::jsonb,
  '{"Tarcísio de Freitas": 350000, "Fernando Haddad": 370000}'::jsonb,
  NULL,
  15200,
  12800,
  NOW(),
  NOW()
);

-- Emendas
INSERT INTO emendas ("cidadeId", descricao, "entidadeBeneficiada", "valorEmenda", "valorEmpenhado", "createdAt", "updatedAt")
VALUES
  (
    1,
    'Reforma e ampliação da UBS do bairro Jardim Campos Elíseos',
    'Prefeitura Municipal de Campinas - Secretaria de Saúde',
    1500000.00,
    1500000.00,
    NOW(),
    NOW()
  ),
  (
    1,
    'Aquisição de equipamentos para hospital municipal',
    'Hospital Municipal Dr. Mário Gatti',
    800000.00,
    650000.00,
    NOW(),
    NOW()
  ),
  (
    1,
    'Construção de quadra poliesportiva coberta',
    'Escola Estadual Prof. João Cruz',
    450000.00,
    450000.00,
    NOW(),
    NOW()
  );

-- Lideranças
INSERT INTO liderancas (
  "cidadeId",
  nome,
  cargo,
  partido,
  "historicoComPAB",
  "votos2024",
  "votosPrevistos2026",
  "dataVisitaGestor",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    1,
    'Maria Santos',
    'Vereadora',
    'PSDB',
    'Parceria estabelecida desde 2018. Atuação conjunta em projetos de saúde e assistência social. Apoio em emendas para UBS e projetos sociais.',
    18500,
    22000,
    '2024-05-20',
    NOW(),
    NOW()
  ),
  (
    1,
    'Carlos Oliveira',
    'Deputado Estadual',
    'PSD',
    'Colaboração iniciada em 2020 em projetos de infraestrutura. Forte atuação regional com foco em educação e segurança.',
    45200,
    52000,
    '2024-08-12',
    NOW(),
    NOW()
  ),
  (
    1,
    'Ana Paula Costa',
    'Prefeita',
    'PSDB',
    'Relacionamento institucional desde o início do mandato em 2021. Apoio em diversas iniciativas municipais e estaduais.',
    280000,
    320000,
    '2024-10-05',
    NOW(),
    NOW()
  );

-- Pautas
INSERT INTO pautas (
  "cidadeId",
  "dataPublicacao",
  "urlFonte",
  titulo,
  "resumoProblema",
  "localizacaoEspecifica",
  categoria,
  "volumeMencoes",
  "nivelUrgencia",
  "sentimentoPredominante",
  "autoridadeResponsavel",
  "statusResposta",
  "tempoAtraso",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    1,
    '2024-11-15',
    'https://exemplo.com/noticia1',
    'Buraco na Avenida Norte-Sul causa acidentes',
    'Moradores relatam grande buraco na Avenida Norte-Sul que tem causado acidentes e danificado veículos. O problema persiste há mais de 2 meses sem solução.',
    'Avenida Norte-Sul, altura do km 95',
    'Infraestrutura',
    580,
    5,
    'Negativo',
    'Prefeitura Municipal - Secretaria de Obras',
    'Aguardando reparo',
    65,
    NOW(),
    NOW()
  ),
  (
    1,
    '2024-11-20',
    'https://exemplo.com/noticia2',
    'Demora no atendimento do Pronto Socorro Central',
    'Pacientes reclamam de longas esperas no PS Central, com alguns casos relatando mais de 6 horas de espera para atendimento.',
    'Pronto Socorro Central - Região Central',
    'Saúde',
    420,
    4,
    'Negativo',
    'Secretaria Municipal de Saúde',
    'Em análise',
    30,
    NOW(),
    NOW()
  ),
  (
    1,
    '2024-11-25',
    'https://exemplo.com/noticia3',
    'Falta de professores em escolas municipais',
    'Várias escolas municipais estão com quadro de professores incompleto, prejudicando o ensino e sobrecarregando os docentes existentes.',
    'Escolas Municipais - Diversas regiões',
    'Educação',
    350,
    3,
    'Negativo',
    'Secretaria Municipal de Educação',
    'Concurso em andamento',
    45,
    NOW(),
    NOW()
  ),
  (
    1,
    '2024-12-01',
    'https://exemplo.com/noticia4',
    'Nova ciclovia inaugurada no Cambuí recebe elogios',
    'Moradores e ciclistas aprovam a nova ciclovia inaugurada no bairro Cambuí, que conecta pontos importantes da região.',
    'Bairro Cambuí - Avenida Nove de Julho',
    'Mobilidade',
    280,
    1,
    'Positivo',
    'Prefeitura Municipal - Secretaria de Mobilidade',
    'Concluído',
    0,
    NOW(),
    NOW()
  );

-- Verificar dados inseridos
SELECT 'Cidades inseridas:' as tabela, COUNT(*) as total FROM cidades
UNION ALL
SELECT 'Dados Demográficos:', COUNT(*) FROM dados_demograficos
UNION ALL
SELECT 'Eventos:', COUNT(*) FROM eventos_proximos
UNION ALL
SELECT 'Votação:', COUNT(*) FROM dados_votacao
UNION ALL
SELECT 'Emendas:', COUNT(*) FROM emendas
UNION ALL
SELECT 'Lideranças:', COUNT(*) FROM liderancas
UNION ALL
SELECT 'Pautas:', COUNT(*) FROM pautas;
