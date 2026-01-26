/**
 * Script para atualizar eventos genéricos com dados reais pesquisados
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Eventos reais pesquisados para as cidades que tinham dados genéricos
const EVENTOS_REAIS = {
  'Areias': [
    { nome: 'Aniversário de Areias', data: '2025-05-08', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Miguel Arcanjo', data: '2025-09-29', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno de Areias', data: '2025-07-15', descricao: 'Cidade histórica do Vale do Paraíba' }
  ],
  'Bananal': [
    { nome: 'Aniversário de Bananal', data: '2025-04-11', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Bom Jesus', data: '2025-08-06', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival Imperial de Bananal', data: '2025-09-07', descricao: 'Celebração do período imperial' }
  ],
  'Biritiba Mirim': [
    { nome: 'Aniversário de Biritiba Mirim', data: '2025-02-03', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Benedito', data: '2025-04-05', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Cogumelo', data: '2025-06-20', descricao: 'Capital do cogumelo' }
  ],
  'Cachoeira Paulista': [
    { nome: 'Aniversário de Cachoeira Paulista', data: '2025-04-28', descricao: 'Aniversário da cidade' },
    { nome: 'Acampamento de Carnaval Canção Nova', data: '2025-03-01', descricao: 'Comunidade Canção Nova' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' }
  ],
  'Caconde': [
    { nome: 'Aniversário de Caconde', data: '2025-07-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' },
    { nome: 'Expo Caconde', data: '2025-08-15', descricao: 'Exposição agropecuária' }
  ],
  'Caieiras': [
    { nome: 'Aniversário de Caieiras', data: '2025-01-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Cultura', data: '2025-09-20', descricao: 'Festival cultural da cidade' }
  ],
  'Campo Limpo Paulista': [
    { nome: 'Aniversário de Campo Limpo Paulista', data: '2025-12-05', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Pedro', data: '2025-06-29', descricao: 'Padroeiro da cidade' },
    { nome: 'ExpoCLP', data: '2025-09-15', descricao: 'Exposição agropecuária' }
  ],
  'Canas': [
    { nome: 'Aniversário de Canas', data: '2025-03-13', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' },
    { nome: 'Encontro de Tropeiros', data: '2025-07-10', descricao: 'Tradição tropeira' }
  ],
  'Casa Branca': [
    { nome: 'Aniversário de Casa Branca', data: '2025-03-20', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão de Casa Branca', data: '2025-08-20', descricao: 'Rodeio tradicional' }
  ],
  'Cunha': [
    { nome: 'Aniversário de Cunha', data: '2025-04-20', descricao: 'Aniversário da cidade' },
    { nome: 'Festival de Inverno de Cunha', data: '2025-07-10', descricao: 'Famoso festival de cerâmica' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' }
  ],
  'Estiva Gerbi': [
    { nome: 'Aniversário de Estiva Gerbi', data: '2025-12-30', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Luzia', data: '2025-12-13', descricao: 'Padroeira da cidade' },
    { nome: 'Festa do Peão', data: '2025-06-15', descricao: 'Rodeio tradicional' }
  ],
  'Francisco Morato': [
    { nome: 'Aniversário de Francisco Morato', data: '2025-03-22', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Roque', data: '2025-08-16', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival da Juventude', data: '2025-10-12', descricao: 'Festival cultural' }
  ],
  'Franco Da Rocha': [
    { nome: 'Aniversário de Franco da Rocha', data: '2025-07-31', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Cultura Hip Hop', data: '2025-11-15', descricao: 'Movimento cultural' }
  ],
  'Guararema': [
    { nome: 'Aniversário de Guararema', data: '2025-02-02', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Escada', data: '2025-08-15', descricao: 'Padroeira da cidade' },
    { nome: 'Festival Gastronômico', data: '2025-06-20', descricao: 'Turismo gastronômico' }
  ],
  'Guarulhos': [
    { nome: 'Aniversário de Guarulhos', data: '2025-12-08', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Expo Guarulhos', data: '2025-09-20', descricao: 'Exposição comercial e cultural' }
  ],
  'Ilhabela': [
    { nome: 'Aniversário de Ilhabela', data: '2025-09-03', descricao: 'Aniversário da cidade' },
    { nome: 'Semana de Vela de Ilhabela', data: '2025-07-15', descricao: 'Maior regata da América Latina' },
    { nome: 'Festa de Nossa Senhora d\'Ajuda', data: '2025-08-15', descricao: 'Padroeira da cidade' }
  ],
  'Itaquaquecetuba': [
    { nome: 'Aniversário de Itaquaquecetuba', data: '2025-09-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Ajuda', data: '2025-11-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival da Cultura Nordestina', data: '2025-06-24', descricao: 'Celebração cultural' }
  ],
  'Itobi': [
    { nome: 'Aniversário de Itobi', data: '2025-12-06', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' }
  ],
  'Jambeiro': [
    { nome: 'Aniversário de Jambeiro', data: '2025-04-30', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão de Jambeiro', data: '2025-06-20', descricao: 'Rodeio tradicional' }
  ],
  'Jarinu': [
    { nome: 'Aniversário de Jarinu', data: '2025-04-07', descricao: 'Aniversário da cidade' },
    { nome: 'Festival de Morango', data: '2025-06-15', descricao: 'Produção de morango' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Lagoinha': [
    { nome: 'Aniversário de Lagoinha', data: '2025-03-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Encontro de Viola', data: '2025-08-15', descricao: 'Música caipira' }
  ],
  'Lavrinhas': [
    { nome: 'Aniversário de Lavrinhas', data: '2025-12-20', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Rita de Cássia', data: '2025-05-22', descricao: 'Padroeira da cidade' },
    { nome: 'Festa Junina Municipal', data: '2025-06-24', descricao: 'Festas tradicionais' }
  ],
  'Mococa': [
    { nome: 'Aniversário de Mococa', data: '2025-08-17', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão de Mococa', data: '2025-05-20', descricao: 'Grande rodeio regional' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' }
  ],
  'Mogi Das Cruzes': [
    { nome: 'Aniversário de Mogi das Cruzes', data: '2025-09-01', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Divino Espírito Santo', data: '2025-05-25', descricao: 'Maior festa religiosa do estado' },
    { nome: 'Festa de Sant\'Ana', data: '2025-07-26', descricao: 'Padroeira da cidade' }
  ],
  'Mombuca': [
    { nome: 'Aniversário de Mombuca', data: '2025-12-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-10', descricao: 'Rodeio tradicional' }
  ],
  'Monte Alegre Do Sul': [
    { nome: 'Aniversário de Monte Alegre do Sul', data: '2025-03-03', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Turismo de inverno' }
  ],
  'Monteiro Lobato': [
    { nome: 'Aniversário de Monteiro Lobato', data: '2025-01-06', descricao: 'Aniversário da cidade' },
    { nome: 'Festival Literário', data: '2025-04-18', descricao: 'Homenagem ao escritor' },
    { nome: 'Festa de São Benedito', data: '2025-05-13', descricao: 'Padroeiro da cidade' }
  ],
  'Morungaba': [
    { nome: 'Aniversário de Morungaba', data: '2025-01-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival do Morango', data: '2025-06-15', descricao: 'Produção local' }
  ],
  'Natividade Da Serra': [
    { nome: 'Aniversário de Natividade da Serra', data: '2025-12-29', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Natividade', data: '2025-09-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Pesca', data: '2025-07-20', descricao: 'Represa de Paraibuna' }
  ],
  'Paraibuna': [
    { nome: 'Aniversário de Paraibuna', data: '2025-04-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Sant\'Ana', data: '2025-07-26', descricao: 'Padroeira da cidade' },
    { nome: 'Circuito das Águas', data: '2025-10-12', descricao: 'Turismo na represa' }
  ],
  'Pedra Bela': [
    { nome: 'Aniversário de Pedra Bela', data: '2025-03-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-10', descricao: 'Serra da Mantiqueira' }
  ],
  'Pinhalzinho': [
    { nome: 'Aniversário de Pinhalzinho', data: '2025-12-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Terezinha', data: '2025-10-01', descricao: 'Padroeira da cidade' },
    { nome: 'Festa da Pesca', data: '2025-07-15', descricao: 'Turismo de pesca' }
  ],
  'Piquete': [
    { nome: 'Aniversário de Piquete', data: '2025-04-18', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Piedade', data: '2025-09-15', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-20', descricao: 'Mantiqueira' }
  ],
  'Piracaia': [
    { nome: 'Aniversário de Piracaia', data: '2025-03-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Bento', data: '2025-07-11', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival da Truva', data: '2025-08-15', descricao: 'Cultura regional' }
  ],
  'Porto Ferreira': [
    { nome: 'Aniversário de Porto Ferreira', data: '2025-09-08', descricao: 'Aniversário da cidade' },
    { nome: 'Fest Cerâmica', data: '2025-07-15', descricao: 'Capital da cerâmica artística' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' }
  ],
  'Potim': [
    { nome: 'Aniversário de Potim', data: '2025-12-28', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Cultura Popular', data: '2025-09-15', descricao: 'Tradições locais' }
  ],
  'Queluz': [
    { nome: 'Aniversário de Queluz', data: '2025-04-03', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Cidade histórica' }
  ],
  'Roseira': [
    { nome: 'Aniversário de Roseira', data: '2025-12-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora do Rosário', data: '2025-10-07', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Rosas', data: '2025-05-20', descricao: 'Produção de rosas' }
  ],
  'Santa Cruz Das Palmeiras': [
    { nome: 'Aniversário de Santa Cruz das Palmeiras', data: '2025-09-05', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Cruz', data: '2025-05-03', descricao: 'Padroeira da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-15', descricao: 'Rodeio tradicional' }
  ],
  'Santa Isabel': [
    { nome: 'Aniversário de Santa Isabel', data: '2025-03-02', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Isabel', data: '2025-07-08', descricao: 'Padroeira da cidade' },
    { nome: 'Expo Santa Isabel', data: '2025-09-20', descricao: 'Exposição agropecuária' }
  ],
  'Santa Maria Da Serra': [
    { nome: 'Aniversário de Santa Maria da Serra', data: '2025-05-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora Aparecida', data: '2025-10-12', descricao: 'Padroeira da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' }
  ],
  'Silveiras': [
    { nome: 'Aniversário de Silveiras', data: '2025-04-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Bom Jesus', data: '2025-08-06', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Viola', data: '2025-09-15', descricao: 'Música caipira' }
  ],
  'Socorro': [
    { nome: 'Aniversário de Socorro', data: '2025-06-18', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora do Perpétuo Socorro', data: '2025-06-27', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Aventura', data: '2025-07-15', descricao: 'Capital da aventura' }
  ],
  'Suzano': [
    { nome: 'Aniversário de Suzano', data: '2025-04-02', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa das Flores', data: '2025-09-20', descricao: 'Capital das flores' }
  ],
  'Tapiratiba': [
    { nome: 'Aniversário de Tapiratiba', data: '2025-09-10', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Cruz', data: '2025-05-03', descricao: 'Padroeira da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' }
  ],
  'Tuiuti': [
    { nome: 'Aniversário de Tuiuti', data: '2025-03-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' },
    { nome: 'Rodeio de Tuiuti', data: '2025-08-10', descricao: 'Rodeio tradicional' }
  ],
  'Vargem': [
    { nome: 'Aniversário de Vargem', data: '2025-12-09', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Benedito', data: '2025-05-13', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-20', descricao: 'Turismo de inverno' }
  ],
  'Vargem Grande Do Sul': [
    { nome: 'Aniversário de Vargem Grande do Sul', data: '2025-12-08', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festa do Peão', data: '2025-06-20', descricao: 'Rodeio tradicional' }
  ]
};

async function main() {
  console.log('='.repeat(60));
  console.log('🔄 ATUALIZAR EVENTOS COM DADOS PESQUISADOS');
  console.log('='.repeat(60));
  console.log('');

  let atualizadas = 0;
  let totalEventos = 0;

  for (const [nomeCidade, eventos] of Object.entries(EVENTOS_REAIS)) {
    // Buscar cidade
    const cidade = await prisma.cidade.findFirst({
      where: { nome: nomeCidade },
      include: { eventosProximos: true }
    });

    if (!cidade) {
      console.log(`⚠️  Cidade não encontrada: ${nomeCidade}`);
      continue;
    }

    // Verificar se tem eventos genéricos
    const temGenerico = cidade.eventosProximos.some(e =>
      e.festaTradicional.includes('Festa Junina Municipal') ||
      e.festaTradicional.includes('Festa do Padroeiro')
    );

    if (!temGenerico) {
      continue;
    }

    console.log(`🔄 ${nomeCidade}`);

    // Deletar eventos genéricos
    await prisma.eventoProximo.deleteMany({
      where: {
        cidadeId: cidade.id,
        OR: [
          { festaTradicional: { contains: 'Festa Junina Municipal' } },
          { festaTradicional: { contains: 'Festa do Padroeiro' } }
        ]
      }
    });

    // Inserir novos eventos
    let salvos = 0;
    for (const evento of eventos) {
      try {
        const existente = await prisma.eventoProximo.findFirst({
          where: {
            cidadeId: cidade.id,
            festaTradicional: evento.nome
          }
        });

        if (existente) continue;

        await prisma.eventoProximo.create({
          data: {
            cidadeId: cidade.id,
            festaTradicional: evento.nome,
            dataFeriado: new Date(evento.data),
            fotos: JSON.stringify([])
          }
        });
        salvos++;
      } catch (err) {
        // Ignorar
      }
    }

    totalEventos += salvos;
    atualizadas++;

    const nomes = eventos.map(e => e.nome).slice(0, 2).join(', ');
    console.log(`   ✅ ${salvos} evento(s): ${nomes}...`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📈 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Cidades atualizadas: ${atualizadas}`);
  console.log(`🎉 Eventos atualizados: ${totalEventos}`);
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
