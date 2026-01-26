-- CreateTable
CREATE TABLE "cidades" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "gentilico" TEXT NOT NULL,
    "dataFundacao" DATETIME NOT NULL,
    "dataAniversario" DATETIME NOT NULL,
    "breveHistorico" TEXT NOT NULL,
    "padroeiro" TEXT NOT NULL,
    "pratoTipico" TEXT NOT NULL,
    "fotoPerfil" TEXT,
    "fotoBackground" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dados_demograficos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "percentualRural" REAL NOT NULL,
    "percentualUrbano" REAL NOT NULL,
    "percentualCatolico" REAL NOT NULL,
    "percentualEspirita" REAL NOT NULL,
    "percentualEvangelico" REAL NOT NULL,
    "percentualSemReligiao" REAL NOT NULL,
    "religiaoPredominante" TEXT NOT NULL,
    "idh" REAL NOT NULL,
    "escolaridadeMedia" REAL NOT NULL,
    "principaisBairros" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dados_demograficos_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eventos_proximos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "festaTradicional" TEXT NOT NULL,
    "dataFeriado" DATETIME NOT NULL,
    "fotos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "eventos_proximos_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dados_votacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "votosPauloAlexandre2022" INTEGER NOT NULL,
    "votosOutrosDeputadosFederais2022" INTEGER NOT NULL,
    "votosPSDBTotal2022" INTEGER NOT NULL,
    "votosPSDTotal2022" INTEGER NOT NULL,
    "votosOutrosPartidos2022" INTEGER NOT NULL,
    "votosPresidente2022" TEXT NOT NULL,
    "votosGovernador2022" TEXT NOT NULL,
    "pesquisasEleitorais" TEXT,
    "votosLegendaPSDB45" INTEGER NOT NULL,
    "votosLegendaPSD55" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "dados_votacao_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emendas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "entidadeBeneficiada" TEXT NOT NULL,
    "valorEmenda" REAL NOT NULL,
    "valorEmpenhado" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "emendas_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "liderancas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "partido" TEXT NOT NULL,
    "historicoComPAB" TEXT NOT NULL,
    "votos2024" INTEGER NOT NULL,
    "votosPrevistos2026" INTEGER NOT NULL,
    "dataVisitaGestor" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "liderancas_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pautas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "dataPublicacao" DATETIME NOT NULL,
    "urlFonte" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumoProblema" TEXT NOT NULL,
    "localizacaoEspecifica" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "volumeMencoes" INTEGER NOT NULL,
    "nivelUrgencia" INTEGER NOT NULL,
    "sentimentoPredominante" TEXT NOT NULL,
    "autoridadeResponsavel" TEXT NOT NULL,
    "statusResposta" TEXT NOT NULL,
    "tempoAtraso" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "pautas_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "dados_demograficos_cidadeId_key" ON "dados_demograficos"("cidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "dados_votacao_cidadeId_key" ON "dados_votacao"("cidadeId");
