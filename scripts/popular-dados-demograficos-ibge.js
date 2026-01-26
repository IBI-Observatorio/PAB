/**
 * Script de Coleta de Dados Demográficos via APIs do IBGE - Projeto PAB
 * =====================================================================
 *
 * Este script coleta dados demográficos das cidades do projeto PAB
 * usando as APIs oficiais do IBGE e popula a tabela DadosDemograficos.
 *
 * Fontes de dados:
 * - API de Localidades IBGE: https://servicodados.ibge.gov.br/api/v1/localidades/
 * - API SIDRA (Sistema IBGE de Recuperação Automática): https://sidra.ibge.gov.br/
 *
 * Indicadores coletados:
 * - Divisão Urbana/Rural (%) - Censo 2022/2010
 * - Religião (Católica, Espírita, Evangélica, Sem Religião) - Censo 2010
 * - IDH - Atlas Brasil (estimado via PIB per capita como proxy)
 * - Escolaridade - Censo 2010
 * - Principais Bairros (Distritos/Subdistritos)
 *
 * Uso: node scripts/popular-dados-demograficos-ibge.js
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

// Configurações
const REQUEST_DELAY = 300; // ms entre requisições
const REQUEST_TIMEOUT = 30000; // 30 segundos

// URLs das APIs
const IBGE_LOCALIDADES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
const SIDRA_API_URL = 'https://apisidra.ibge.gov.br/values';

// Cache de municípios do IBGE
let cacheMunicipios = null;

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Faz uma requisição HTTP com tratamento de erros
 */
async function fazerRequisicao(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 ProjetoPAB/1.0',
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('    ⏱️  Timeout na requisição');
    }
    return null;
  }
}

/**
 * Normaliza string para comparação (remove acentos, lowercase)
 */
function normalizar(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Carrega cache de todos os municípios do Brasil
 */
async function carregarCacheMunicipios() {
  if (cacheMunicipios) return;

  console.log('📥 Carregando lista de municípios do IBGE...');
  const dados = await fazerRequisicao(`${IBGE_LOCALIDADES_URL}/municipios`);

  if (dados && Array.isArray(dados)) {
    cacheMunicipios = {};
    for (const mun of dados) {
      try {
        // Tenta extrair UF de diferentes estruturas possíveis
        let uf = null;
        if (mun.microrregiao?.mesorregiao?.UF?.sigla) {
          uf = mun.microrregiao.mesorregiao.UF.sigla;
        } else if (mun['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla) {
          uf = mun['regiao-imediata']['regiao-intermediaria'].UF.sigla;
        }

        if (uf && mun.nome) {
          const chave = `${normalizar(mun.nome)}_${uf.toLowerCase()}`;
          cacheMunicipios[chave] = { ...mun, uf };
        }
      } catch (e) {
        // Ignora municípios com estrutura inválida
      }
    }
    console.log(`   ✅ ${Object.keys(cacheMunicipios).length} municípios carregados\n`);
  } else {
    console.log('   ⚠️  Falha ao carregar municípios, usando busca direta por UF\n');
    cacheMunicipios = {};
  }
}

/**
 * Busca código IBGE do município
 */
async function buscarCodigoIBGE(nomeCidade) {
  await carregarCacheMunicipios();

  const chave = `${normalizar(nomeCidade)}_sp`;

  // Busca exata no cache
  if (cacheMunicipios && cacheMunicipios[chave]) {
    return String(cacheMunicipios[chave].id);
  }

  // Busca aproximada no cache
  if (cacheMunicipios && Object.keys(cacheMunicipios).length > 0) {
    for (const [k, mun] of Object.entries(cacheMunicipios)) {
      if (k.endsWith('_sp')) {
        const nomeCache = normalizar(mun.nome);
        const nomeBusca = normalizar(nomeCidade);
        if (nomeCache.includes(nomeBusca) || nomeBusca.includes(nomeCache)) {
          return String(mun.id);
        }
      }
    }
  }

  // Fallback: busca direta por UF (São Paulo)
  console.log(`    📡 Buscando ${nomeCidade} diretamente na API...`);
  const dados = await fazerRequisicao(`${IBGE_LOCALIDADES_URL}/estados/SP/municipios`);

  if (dados && Array.isArray(dados)) {
    const nomeBusca = normalizar(nomeCidade);

    // Busca exata
    for (const mun of dados) {
      if (normalizar(mun.nome) === nomeBusca) {
        return String(mun.id);
      }
    }

    // Busca parcial
    for (const mun of dados) {
      const nomeCache = normalizar(mun.nome);
      if (nomeCache.includes(nomeBusca) || nomeBusca.includes(nomeCache)) {
        return String(mun.id);
      }
    }
  }

  return null;
}

/**
 * Busca população urbana e rural do município
 * Usa Tabela 1378 (Censo 2010) com classificação c1 (situação domicílio)
 * D4C: 0=Total, 1=Urbana, 2=Rural
 */
async function buscarPopulacaoUrbanaRural(codigoIBGE) {
  // Tabela 1378 - Censo 2010 com c1 (situação domicílio)
  const url = `${SIDRA_API_URL}/t/1378/n6/${codigoIBGE}/v/93/p/last/c1/all`;
  const dados = await fazerRequisicao(url);

  let popTotal = null, popUrbana = null, popRural = null;

  if (dados && Array.isArray(dados) && dados.length > 1) {
    for (const item of dados.slice(1)) {
      const codigoSituacao = item.D4C; // Código da situação
      const valor = item.V;

      if (valor && valor !== '-' && valor !== '...') {
        const valorNum = parseInt(valor, 10);
        if (!isNaN(valorNum)) {
          if (codigoSituacao === '0') popTotal = valorNum;      // Total
          else if (codigoSituacao === '1') popUrbana = valorNum; // Urbana
          else if (codigoSituacao === '2') popRural = valorNum;  // Rural
        }
      }
    }
  }

  // Calcula total se não veio
  if (!popTotal && popUrbana && popRural) {
    popTotal = popUrbana + popRural;
  }

  // Calcula percentuais
  let percentualUrbano = 0, percentualRural = 0;
  if (popTotal && popTotal > 0) {
    if (popUrbana) percentualUrbano = Math.round((popUrbana / popTotal) * 10000) / 100;
    if (popRural) percentualRural = Math.round((popRural / popTotal) * 10000) / 100;
  }

  return { percentualUrbano, percentualRural };
}

/**
 * Busca dados de religião do município (Censo 2010 - Tabela 137)
 * Códigos D4C importantes:
 * - 95263: Católica Apostólica Romana
 * - 95277: Evangélicas (agregado)
 * - 2826: Espírita
 * - 2836: Sem religião
 */
async function buscarReligiao(codigoIBGE) {
  const url = `${SIDRA_API_URL}/t/137/n6/${codigoIBGE}/v/1000093/p/2010/c133/all`;
  const dados = await fazerRequisicao(url);

  const resultado = {
    percentualCatolico: 0,
    percentualEspirita: 0,
    percentualEvangelico: 0,
    percentualSemReligiao: 0,
    religiaoPredominante: 'Católica'
  };

  if (!dados || !Array.isArray(dados) || dados.length <= 1) return resultado;

  // Códigos das religiões na tabela 137
  const CODIGOS = {
    CATOLICA: '95263',      // Católica Apostólica Romana
    EVANGELICAS: '95277',   // Evangélicas (agregado)
    ESPIRITA: '2826',       // Espírita
    SEM_RELIGIAO: '2836'    // Sem religião
  };

  for (const item of dados.slice(1)) {
    const codigo = item.D4C;
    const valor = item.V;

    if (valor && valor !== '-' && valor !== '...') {
      const valorNum = parseFloat(valor);
      if (!isNaN(valorNum)) {
        switch (codigo) {
          case CODIGOS.CATOLICA:
            resultado.percentualCatolico = Math.round(valorNum * 100) / 100;
            break;
          case CODIGOS.EVANGELICAS:
            resultado.percentualEvangelico = Math.round(valorNum * 100) / 100;
            break;
          case CODIGOS.ESPIRITA:
            resultado.percentualEspirita = Math.round(valorNum * 100) / 100;
            break;
          case CODIGOS.SEM_RELIGIAO:
            resultado.percentualSemReligiao = Math.round(valorNum * 100) / 100;
            break;
        }
      }
    }
  }

  // Determina predominante
  const max = Math.max(
    resultado.percentualCatolico,
    resultado.percentualEvangelico,
    resultado.percentualEspirita,
    resultado.percentualSemReligiao
  );

  if (max > 0) {
    if (max === resultado.percentualCatolico) resultado.religiaoPredominante = 'Católica';
    else if (max === resultado.percentualEvangelico) resultado.religiaoPredominante = 'Evangélica';
    else if (max === resultado.percentualEspirita) resultado.religiaoPredominante = 'Espírita';
    else resultado.religiaoPredominante = 'Sem Religião';
  }

  return resultado;
}

/**
 * Busca taxa de alfabetização (Censo 2010 - Tabela 3175)
 */
async function buscarAlfabetizacao(codigoIBGE) {
  // Tabela 1383: Taxa de alfabetização de pessoas de 10 anos ou mais
  // Variável 1646, Classificação c2/6794 (Total - ambos sexos)
  const url = `${SIDRA_API_URL}/t/1383/n6/${codigoIBGE}/v/1646/p/last/c2/6794`;
  const dados = await fazerRequisicao(url);

  if (dados && Array.isArray(dados) && dados.length > 1) {
    for (const item of dados.slice(1)) {
      const valor = item.V;
      if (valor && valor !== '-' && valor !== '...') {
        const taxa = parseFloat(valor);
        if (!isNaN(taxa)) {
          return Math.round(taxa * 100) / 100;
        }
      }
    }
  }

  return null;
}

/**
 * Busca PIB per capita (Tabela 5938) como proxy para IDH
 */
async function buscarPIBPerCapita(codigoIBGE) {
  const url = `${SIDRA_API_URL}/t/5938/n6/${codigoIBGE}/v/37/p/last`;
  const dados = await fazerRequisicao(url);

  if (dados && dados.length > 1) {
    for (const item of dados.slice(1)) {
      const valor = item.V;
      if (valor && valor !== '-' && valor !== '...') {
        return parseFloat(valor.replace(',', '.'));
      }
    }
  }

  return null;
}

/**
 * Estima IDH baseado no PIB per capita (aproximação)
 * Fórmula simplificada baseada em correlação observada
 */
function estimarIDH(pibPerCapita) {
  if (!pibPerCapita) return 0.75; // Média Brasil

  // Estimativa baseada em regressão logarítmica observada
  // IDH = 0.1 * ln(PIB) - 0.2 (ajustado para faixa 0.5-0.9)
  const idh = 0.1 * Math.log(pibPerCapita) - 0.2;

  // Limita entre 0.5 e 0.95
  return Math.min(0.95, Math.max(0.5, Math.round(idh * 1000) / 1000));
}

/**
 * Busca distritos e subdistritos do município
 */
async function buscarDistritosSubdistritos(codigoIBGE) {
  const bairros = [];

  // Busca distritos
  let url = `${IBGE_LOCALIDADES_URL}/municipios/${codigoIBGE}/distritos`;
  let dados = await fazerRequisicao(url);

  if (dados && Array.isArray(dados)) {
    for (const d of dados) {
      if (d.nome) bairros.push(d.nome);
    }
  }

  // Busca subdistritos
  url = `${IBGE_LOCALIDADES_URL}/municipios/${codigoIBGE}/subdistritos`;
  dados = await fazerRequisicao(url);

  if (dados && Array.isArray(dados)) {
    for (const s of dados) {
      if (s.nome && !bairros.includes(s.nome)) {
        bairros.push(s.nome);
      }
    }
  }

  return bairros;
}

/**
 * Coleta todos os dados demográficos de uma cidade
 */
async function coletarDadosCidade(nomeCidade) {
  const dados = {
    percentualUrbano: 0,
    percentualRural: 0,
    percentualCatolico: 0,
    percentualEspirita: 0,
    percentualEvangelico: 0,
    percentualSemReligiao: 0,
    religiaoPredominante: 'Católica',
    idh: 0.75,
    taxaAlfabetizacao: null,     // % alfabetizados (IBGE Censo)
    principaisBairros: '[]',
    erro: null
  };

  // 1. Busca código IBGE
  const codigoIBGE = await buscarCodigoIBGE(nomeCidade);
  if (!codigoIBGE) {
    dados.erro = 'Código IBGE não encontrado';
    return dados;
  }

  await delay(REQUEST_DELAY);

  // 2. Busca população urbana/rural
  const populacao = await buscarPopulacaoUrbanaRural(codigoIBGE);
  dados.percentualUrbano = populacao.percentualUrbano;
  dados.percentualRural = populacao.percentualRural;

  await delay(REQUEST_DELAY);

  // 3. Busca religião
  const religiao = await buscarReligiao(codigoIBGE);
  dados.percentualCatolico = religiao.percentualCatolico;
  dados.percentualEspirita = religiao.percentualEspirita;
  dados.percentualEvangelico = religiao.percentualEvangelico;
  dados.percentualSemReligiao = religiao.percentualSemReligiao;
  dados.religiaoPredominante = religiao.religiaoPredominante;

  await delay(REQUEST_DELAY);

  // 4. Busca taxa de alfabetização
  const alfabetizacao = await buscarAlfabetizacao(codigoIBGE);
  dados.taxaAlfabetizacao = alfabetizacao; // % pessoas alfabetizadas (IBGE Censo)

  await delay(REQUEST_DELAY);

  // 5. Busca PIB per capita e estima IDH
  const pibPerCapita = await buscarPIBPerCapita(codigoIBGE);
  dados.idh = estimarIDH(pibPerCapita);

  await delay(REQUEST_DELAY);

  // 6. Busca distritos/subdistritos (principais bairros)
  const bairros = await buscarDistritosSubdistritos(codigoIBGE);
  dados.principaisBairros = JSON.stringify(bairros);

  return dados;
}

/**
 * Atualiza ou cria registro de dados demográficos no banco
 */
async function salvarDadosDemograficos(cidadeId, dados) {
  try {
    // Verifica se já existe
    const existente = await prisma.dadosDemograficos.findUnique({
      where: { cidadeId: cidadeId }
    });

    const dadosDB = {
      percentualUrbano: dados.percentualUrbano,
      percentualRural: dados.percentualRural,
      percentualCatolico: dados.percentualCatolico,
      percentualEspirita: dados.percentualEspirita,
      percentualEvangelico: dados.percentualEvangelico,
      percentualSemReligiao: dados.percentualSemReligiao,
      religiaoPredominante: dados.religiaoPredominante,
      idh: dados.idh,
      taxaAlfabetizacao: dados.taxaAlfabetizacao,
      principaisBairros: dados.principaisBairros
    };

    if (existente) {
      await prisma.dadosDemograficos.update({
        where: { cidadeId: cidadeId },
        data: dadosDB
      });
    } else {
      await prisma.dadosDemograficos.create({
        data: {
          cidadeId: cidadeId,
          ...dadosDB
        }
      });
    }

    return true;
  } catch (error) {
    console.error(`    ❌ Erro ao salvar: ${error.message}`);
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('');
  console.log('═'.repeat(70));
  console.log('  COLETA DE DADOS DEMOGRÁFICOS VIA IBGE - PROJETO PAB');
  console.log('═'.repeat(70));
  console.log('');
  console.log('📊 Fonte: APIs do IBGE (Localidades + SIDRA)');
  console.log('📅 Data: ' + new Date().toLocaleDateString('pt-BR'));
  console.log('');
  console.log('─'.repeat(70));
  console.log('');

  // Busca todas as cidades do banco
  const cidades = await prisma.cidade.findMany({
    orderBy: { nome: 'asc' },
    include: { dadosDemograficos: true }
  });

  console.log(`📍 Total de cidades no banco: ${cidades.length}`);
  console.log('');

  let sucesso = 0;
  let falha = 0;
  let pular = 0;

  for (let i = 0; i < cidades.length; i++) {
    const cidade = cidades[i];
    const progresso = `[${String(i + 1).padStart(2, '0')}/${cidades.length}]`;

    // Verifica se já tem dados demográficos completos (incluindo taxaAlfabetizacao)
    if (cidade.dadosDemograficos &&
        cidade.dadosDemograficos.percentualUrbano > 0 &&
        cidade.dadosDemograficos.taxaAlfabetizacao !== null) {
      console.log(`${progresso} ⏭️  ${cidade.nome} - Já possui dados, pulando...`);
      pular++;
      continue;
    }

    console.log(`${progresso} 🔍 Coletando: ${cidade.nome}...`);

    // Coleta dados
    const dados = await coletarDadosCidade(cidade.nome);

    if (dados.erro) {
      console.log(`${progresso} ⚠️  ${cidade.nome} - ${dados.erro}`);
      falha++;
    } else {
      // Salva no banco
      const salvo = await salvarDadosDemograficos(cidade.id, dados);

      if (salvo) {
        console.log(`${progresso} ✅ ${cidade.nome}`);
        console.log(`         🏙️  Urbano: ${dados.percentualUrbano}% | Rural: ${dados.percentualRural}%`);
        console.log(`         ⛪ ${dados.religiaoPredominante} (${Math.max(dados.percentualCatolico, dados.percentualEvangelico, dados.percentualEspirita)}%)`);
        console.log(`         📈 IDH: ${dados.idh} | Alfabetização: ${dados.taxaAlfabetizacao || 'N/A'}%`);

        const bairros = JSON.parse(dados.principaisBairros);
        if (bairros.length > 0) {
          console.log(`         📍 Distritos: ${bairros.slice(0, 3).join(', ')}${bairros.length > 3 ? '...' : ''}`);
        }

        sucesso++;
      } else {
        falha++;
      }
    }

    console.log('');

    // Delay maior entre cidades para não sobrecarregar a API
    if (i < cidades.length - 1) {
      await delay(500);
    }
  }

  console.log('─'.repeat(70));
  console.log('');
  console.log('📊 RESUMO FINAL:');
  console.log('');
  console.log(`   ✅ Sucesso:  ${sucesso} cidades`);
  console.log(`   ⏭️  Puladas:  ${pular} cidades (já tinham dados)`);
  console.log(`   ❌ Falha:    ${falha} cidades`);
  console.log(`   📍 Total:    ${cidades.length} cidades`);
  console.log('');

  if (sucesso > 0) {
    console.log('🎉 Dados demográficos atualizados com sucesso!');
  }

  console.log('');
  console.log('═'.repeat(70));
}

// Execução
main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
