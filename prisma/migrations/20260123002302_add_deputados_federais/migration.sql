-- CreateTable
CREATE TABLE "deputados_federais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cidadeId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeUrna" TEXT NOT NULL,
    "partido" TEXT NOT NULL,
    "numeroUrna" TEXT NOT NULL,
    "votos2022" INTEGER NOT NULL,
    "eleito" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "deputados_federais_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "cidades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
