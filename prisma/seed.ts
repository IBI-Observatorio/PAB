import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Verificar se o arquivo de dados existe
  const dataPath = path.join(__dirname, '..', 'scripts', 'dados-exportados.json');

  if (!fs.existsSync(dataPath)) {
    console.log('⚠️ Arquivo dados-exportados.json não encontrado. Pulando seed.');
    return;
  }

  const cidades = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📊 Carregando ${cidades.length} cidades...\n`);

  for (const cidade of cidades) {
    try {
      // Criar cidade
      const novaCidade = await prisma.cidade.create({
        data: {
          nome: cidade.nome,
          gentilico: cidade.gentilico,
          dataFundacao: new Date(cidade.dataFundacao),
          dataAniversario: new Date(cidade.dataAniversario),
          breveHistorico: cidade.breveHistorico,
          padroeiro: cidade.padroeiro,
          pratoTipico: cidade.pratoTipico,
          fotoPerfil: cidade.fotoPerfil,
          fotoBackground: cidade.fotoBackground,
        },
      });

      // Dados Demográficos
      if (cidade.dadosDemograficos) {
        await prisma.dadosDemograficos.create({
          data: {
            cidadeId: novaCidade.id,
            percentualRural: cidade.dadosDemograficos.percentualRural,
            percentualUrbano: cidade.dadosDemograficos.percentualUrbano,
            percentualCatolico: cidade.dadosDemograficos.percentualCatolico,
            percentualEspirita: cidade.dadosDemograficos.percentualEspirita,
            percentualEvangelico: cidade.dadosDemograficos.percentualEvangelico,
            percentualSemReligiao: cidade.dadosDemograficos.percentualSemReligiao,
            religiaoPredominante: cidade.dadosDemograficos.religiaoPredominante,
            idh: cidade.dadosDemograficos.idh,
            taxaAlfabetizacao: cidade.dadosDemograficos.taxaAlfabetizacao,
            principaisBairros: cidade.dadosDemograficos.principaisBairros,
          },
        });
      }

      // Dados Votação
      if (cidade.dadosVotacao) {
        await prisma.dadosVotacao.create({
          data: {
            cidadeId: novaCidade.id,
            votosPauloAlexandre2022: cidade.dadosVotacao.votosPauloAlexandre2022,
            votosOutrosDeputadosFederais2022: cidade.dadosVotacao.votosOutrosDeputadosFederais2022,
            votosPSDBTotal2022: cidade.dadosVotacao.votosPSDBTotal2022,
            votosPSDTotal2022: cidade.dadosVotacao.votosPSDTotal2022,
            votosOutrosPartidos2022: cidade.dadosVotacao.votosOutrosPartidos2022,
            votosPresidente2022: cidade.dadosVotacao.votosPresidente2022,
            votosGovernador2022: cidade.dadosVotacao.votosGovernador2022,
            pesquisasEleitorais: cidade.dadosVotacao.pesquisasEleitorais,
            votosLegendaPSDB45: cidade.dadosVotacao.votosLegendaPSDB45,
            votosLegendaPSD55: cidade.dadosVotacao.votosLegendaPSD55,
          },
        });
      }

      // Eventos
      for (const evento of cidade.eventosProximos || []) {
        await prisma.eventoProximo.create({
          data: {
            cidadeId: novaCidade.id,
            festaTradicional: evento.festaTradicional,
            dataFeriado: new Date(evento.dataFeriado),
            fotos: evento.fotos,
          },
        });
      }

      // Deputados Federais
      for (const deputado of cidade.deputadosFederais || []) {
        await prisma.deputadoFederal.create({
          data: {
            cidadeId: novaCidade.id,
            nome: deputado.nome,
            nomeUrna: deputado.nomeUrna,
            partido: deputado.partido,
            numeroUrna: deputado.numeroUrna,
            votos2022: deputado.votos2022,
            eleito: deputado.eleito,
          },
        });
      }

      // Emendas
      for (const emenda of cidade.emendas || []) {
        await prisma.emenda.create({
          data: {
            cidadeId: novaCidade.id,
            codigoEmenda: emenda.codigoEmenda,
            numeroEmenda: emenda.numeroEmenda,
            anoEmenda: emenda.anoEmenda,
            tipoEmenda: emenda.tipoEmenda,
            autor: emenda.autor,
            localidadeGasto: emenda.localidadeGasto,
            funcao: emenda.funcao,
            subfuncao: emenda.subfuncao,
            descricao: emenda.descricao,
            entidadeBeneficiada: emenda.entidadeBeneficiada,
            valorEmenda: emenda.valorEmenda,
            valorEmpenhado: emenda.valorEmpenhado,
            valorLiquidado: emenda.valorLiquidado,
            valorPago: emenda.valorPago,
          },
        });
      }

      // Lideranças
      for (const lideranca of cidade.liderancas || []) {
        await prisma.lideranca.create({
          data: {
            cidadeId: novaCidade.id,
            nomeLideranca: lideranca.nomeLideranca,
            fotoLideranca: lideranca.fotoLideranca,
            nomeGestor: lideranca.nomeGestor,
            cargo: lideranca.cargo,
            partido: lideranca.partido,
            historicoComPAB: lideranca.historicoComPAB,
            votos2024: lideranca.votos2024,
            votosPrevistos2026: lideranca.votosPrevistos2026,
            dataVisitaGestor: lideranca.dataVisitaGestor ? new Date(lideranca.dataVisitaGestor) : null,
          },
        });
      }

      // Pautas
      for (const pauta of cidade.pautas || []) {
        await prisma.pauta.create({
          data: {
            cidadeId: novaCidade.id,
            dataPublicacao: new Date(pauta.dataPublicacao),
            urlFonte: pauta.urlFonte,
            titulo: pauta.titulo,
            resumoProblema: pauta.resumoProblema,
            localizacaoEspecifica: pauta.localizacaoEspecifica,
            categoria: pauta.categoria,
            volumeMencoes: pauta.volumeMencoes,
            nivelUrgencia: pauta.nivelUrgencia,
            sentimentoPredominante: pauta.sentimentoPredominante,
            autoridadeResponsavel: pauta.autoridadeResponsavel,
            statusResposta: pauta.statusResposta,
            tempoAtraso: pauta.tempoAtraso,
          },
        });
      }

      console.log(`✅ ${cidade.nome}`);
    } catch (error: any) {
      console.log(`❌ Erro em ${cidade.nome}: ${error.message}`);
    }
  }

  console.log('\n🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
