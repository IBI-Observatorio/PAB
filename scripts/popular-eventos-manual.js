/**
 * Script para popular eventos das cidades com dados pré-definidos
 * Baseado em eventos típicos de cidades do interior de São Paulo
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Banco de dados de eventos conhecidos por cidade
const EVENTOS_POR_CIDADE = {
  'Americana': [
    { nome: 'Aniversário de Americana', data: '2025-08-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão de Americana', data: '2025-06-15', descricao: 'Rodeio e shows' },
    { nome: 'Festa de Nossa Senhora de Fátima', data: '2025-05-13', descricao: 'Padroeira da cidade' }
  ],
  'Amparo': [
    { nome: 'Aniversário de Amparo', data: '2025-03-05', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Divino Espírito Santo', data: '2025-06-08', descricao: 'Festa religiosa tradicional' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Festival cultural' }
  ],
  'Aparecida': [
    { nome: 'Dia de Nossa Senhora Aparecida', data: '2025-10-12', descricao: 'Padroeira do Brasil' },
    { nome: 'Aniversário de Aparecida', data: '2025-04-17', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Padroeira', data: '2025-10-12', descricao: 'Maior festa religiosa do país' }
  ],
  'Araras': [
    { nome: 'Aniversário de Araras', data: '2025-08-18', descricao: 'Aniversário da cidade' },
    { nome: 'ExpoAraras', data: '2025-05-20', descricao: 'Exposição agropecuária' },
    { nome: 'Festa de São Bento', data: '2025-07-11', descricao: 'Padroeiro da cidade' }
  ],
  'Artur Nogueira': [
    { nome: 'Aniversário de Artur Nogueira', data: '2025-04-13', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-10', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Nossa Senhora das Dores', data: '2025-09-15', descricao: 'Padroeira da cidade' }
  ],
  'Atibaia': [
    { nome: 'Festa das Flores e Morangos', data: '2025-09-10', descricao: 'Principal evento da cidade' },
    { nome: 'Aniversário de Atibaia', data: '2025-06-24', descricao: 'Aniversário da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-20', descricao: 'Festival cultural' }
  ],
  'Barra Bonita': [
    { nome: 'Aniversário de Barra Bonita', data: '2025-04-18', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Divino', data: '2025-05-25', descricao: 'Festa religiosa' },
    { nome: 'Festival Náutico', data: '2025-10-15', descricao: 'Evento no Rio Tietê' }
  ],
  'Bauru': [
    { nome: 'Aniversário de Bauru', data: '2025-08-01', descricao: 'Aniversário da cidade' },
    { nome: 'FIIBI - Feira Industrial', data: '2025-05-15', descricao: 'Feira industrial' },
    { nome: 'Festa do Divino Espírito Santo', data: '2025-06-08', descricao: 'Festa religiosa' }
  ],
  'Bebedouro': [
    { nome: 'Aniversário de Bebedouro', data: '2025-08-06', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-15', descricao: 'Rodeio e shows' },
    { nome: 'Festa da Laranja', data: '2025-05-20', descricao: 'Celebração da citricultura' }
  ],
  'Bragança Paulista': [
    { nome: 'Aniversário de Bragança Paulista', data: '2025-12-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Sant Ana', data: '2025-07-26', descricao: 'Padroeira da cidade' },
    { nome: 'Festival Junino', data: '2025-06-24', descricao: 'Festas juninas' }
  ],
  'Brotas': [
    { nome: 'Aniversário de Brotas', data: '2025-05-11', descricao: 'Aniversário da cidade' },
    { nome: 'Festival de Ecoturismo', data: '2025-08-15', descricao: 'Turismo de aventura' },
    { nome: 'Festa do Peão', data: '2025-06-20', descricao: 'Rodeio tradicional' }
  ],
  'Campinas': [
    { nome: 'Aniversário de Campinas', data: '2025-07-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Expoflora', data: '2025-09-05', descricao: 'Exposição de flores em Holambra' }
  ],
  'Capivari': [
    { nome: 'Aniversário de Capivari', data: '2025-04-12', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Divino', data: '2025-05-25', descricao: 'Festa religiosa tradicional' },
    { nome: 'Carnaval de Capivari', data: '2025-03-01', descricao: 'Tradicional carnaval' }
  ],
  'Caraguatatuba': [
    { nome: 'Aniversário de Caraguatatuba', data: '2025-04-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' },
    { nome: 'Caraguá Fest', data: '2025-07-20', descricao: 'Festival de verão' }
  ],
  'Carapicuíba': [
    { nome: 'Aniversário de Carapicuíba', data: '2025-04-25', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santa Terezinha', data: '2025-10-01', descricao: 'Padroeira da cidade' },
    { nome: 'Festival Cultural', data: '2025-09-15', descricao: 'Evento cultural' }
  ],
  'Conchal': [
    { nome: 'Aniversário de Conchal', data: '2025-06-16', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São Judas Tadeu', data: '2025-10-28', descricao: 'Padroeiro da cidade' }
  ],
  'Cosmópolis': [
    { nome: 'Aniversário de Cosmópolis', data: '2025-02-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' },
    { nome: 'ExpoCosmópolis', data: '2025-05-15', descricao: 'Exposição agropecuária' }
  ],
  'Cruzeiro': [
    { nome: 'Aniversário de Cruzeiro', data: '2025-09-02', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Festival cultural' }
  ],
  'Cubatão': [
    { nome: 'Aniversário de Cubatão', data: '2025-04-09', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival Ambiental', data: '2025-06-05', descricao: 'Evento de conscientização' }
  ],
  'Descalvado': [
    { nome: 'Aniversário de Descalvado', data: '2025-04-20', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Elias Fausto': [
    { nome: 'Aniversário de Elias Fausto', data: '2025-07-28', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-06-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' }
  ],
  'Engenheiro Coelho': [
    { nome: 'Aniversário de Engenheiro Coelho', data: '2025-12-29', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Milho', data: '2025-06-15', descricao: 'Festa tradicional' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' }
  ],
  'Guaratinguetá': [
    { nome: 'Aniversário de Guaratinguetá', data: '2025-12-13', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Frei Galvão', data: '2025-05-11', descricao: 'Santo nascido na cidade' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' }
  ],
  'Guariba': [
    { nome: 'Aniversário de Guariba', data: '2025-03-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' }
  ],
  'Guarujá': [
    { nome: 'Aniversário de Guarujá', data: '2025-09-02', descricao: 'Aniversário da cidade' },
    { nome: 'Reveillon Guarujá', data: '2025-12-31', descricao: 'Festa de ano novo' },
    { nome: 'Festa de Santo Amaro', data: '2025-01-15', descricao: 'Padroeiro da cidade' }
  ],
  'Holambra': [
    { nome: 'Expoflora', data: '2025-09-05', descricao: 'Maior exposição de flores das Américas' },
    { nome: 'Aniversário de Holambra', data: '2025-10-04', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Cerveja', data: '2025-05-20', descricao: 'Festival de cerveja artesanal' }
  ],
  'Hortolândia': [
    { nome: 'Aniversário de Hortolândia', data: '2025-05-19', descricao: 'Aniversário da cidade' },
    { nome: 'Expo Hortolândia', data: '2025-08-15', descricao: 'Exposição agropecuária' },
    { nome: 'Festival de Inverno', data: '2025-07-10', descricao: 'Festival cultural' }
  ],
  'Ibiúna': [
    { nome: 'Aniversário de Ibiúna', data: '2025-02-13', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Morango', data: '2025-06-20', descricao: 'Celebração do morango' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' }
  ],
  'Indaiatuba': [
    { nome: 'Aniversário de Indaiatuba', data: '2025-12-09', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' },
    { nome: 'Natal Mágico', data: '2025-12-15', descricao: 'Decoração natalina famosa' }
  ],
  'Iracemápolis': [
    { nome: 'Aniversário de Iracemápolis', data: '2025-11-18', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-06-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Santa Terezinha', data: '2025-10-01', descricao: 'Padroeira da cidade' }
  ],
  'Itatiba': [
    { nome: 'Aniversário de Itatiba', data: '2025-04-03', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Morango', data: '2025-06-25', descricao: 'Celebração do morango' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Itupeva': [
    { nome: 'Aniversário de Itupeva', data: '2025-03-06', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Uva', data: '2025-01-25', descricao: 'Celebração da uva' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Festival cultural' }
  ],
  'Jacareí': [
    { nome: 'Aniversário de Jacareí', data: '2025-04-03', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora do Carmo', data: '2025-07-16', descricao: 'Padroeira da cidade' },
    { nome: 'ExpoJacareí', data: '2025-08-20', descricao: 'Exposição agropecuária' }
  ],
  'Jaguariúna': [
    { nome: 'Rodeio de Jaguariúna', data: '2025-09-20', descricao: 'Maior rodeio do Brasil' },
    { nome: 'Aniversário de Jaguariúna', data: '2025-03-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' }
  ],
  'Jundiaí': [
    { nome: 'Aniversário de Jundiaí', data: '2025-12-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Uva', data: '2025-01-25', descricao: 'Celebração da uva' },
    { nome: 'Festa de Nossa Senhora do Desterro', data: '2025-02-02', descricao: 'Padroeira da cidade' }
  ],
  'Leme': [
    { nome: 'Aniversário de Leme', data: '2025-05-28', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Nossa Senhora das Dores', data: '2025-09-15', descricao: 'Padroeira da cidade' }
  ],
  'Limeira': [
    { nome: 'Aniversário de Limeira', data: '2025-09-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-06-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Nossa Senhora das Dores', data: '2025-09-15', descricao: 'Padroeira da cidade' }
  ],
  'Lorena': [
    { nome: 'Aniversário de Lorena', data: '2025-04-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Piedade', data: '2025-09-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-20', descricao: 'Festival cultural' }
  ],
  'Louveira': [
    { nome: 'Aniversário de Louveira', data: '2025-09-07', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Uva', data: '2025-01-30', descricao: 'Celebração da uva' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' }
  ],
  'Mairinque': [
    { nome: 'Aniversário de Mairinque', data: '2025-05-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Pedro', data: '2025-06-29', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival Ferroviário', data: '2025-08-10', descricao: 'Celebração da história ferroviária' }
  ],
  'Matão': [
    { nome: 'Aniversário de Matão', data: '2025-04-13', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São Francisco de Assis', data: '2025-10-04', descricao: 'Padroeiro da cidade' }
  ],
  'Mogi das Cruzes': [
    { nome: 'Aniversário de Mogi das Cruzes', data: '2025-09-01', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Divino', data: '2025-05-25', descricao: 'Maior festa religiosa do estado' },
    { nome: 'Festa de Sant Ana', data: '2025-07-26', descricao: 'Padroeira da cidade' }
  ],
  'Mogi Guaçu': [
    { nome: 'Aniversário de Mogi Guaçu', data: '2025-10-10', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-05-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São Luís', data: '2025-08-25', descricao: 'Padroeiro da cidade' }
  ],
  'Mogi Mirim': [
    { nome: 'Aniversário de Mogi Mirim', data: '2025-09-22', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-10', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' }
  ],
  'Monte Alto': [
    { nome: 'Aniversário de Monte Alto', data: '2025-08-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Nossa Senhora Aparecida', data: '2025-10-12', descricao: 'Padroeira da cidade' }
  ],
  'Monte Mor': [
    { nome: 'Aniversário de Monte Mor', data: '2025-03-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São Benedito', data: '2025-04-05', descricao: 'Padroeiro da cidade' }
  ],
  'Nova Odessa': [
    { nome: 'Aniversário de Nova Odessa', data: '2025-10-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Imigrante', data: '2025-06-15', descricao: 'Celebração da imigração' },
    { nome: 'Festa de São Manoel', data: '2025-06-17', descricao: 'Padroeiro da cidade' }
  ],
  'Olímpia': [
    { nome: 'Aniversário de Olímpia', data: '2025-12-04', descricao: 'Aniversário da cidade' },
    { nome: 'Festival do Folclore', data: '2025-08-15', descricao: 'Maior festival folclórico de SP' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Paulínia': [
    { nome: 'Aniversário de Paulínia', data: '2025-02-28', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora Aparecida', data: '2025-10-12', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Cinema', data: '2025-11-15', descricao: 'Festival de cinema' }
  ],
  'Pedreira': [
    { nome: 'Aniversário de Pedreira', data: '2025-06-11', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Porcelana', data: '2025-07-15', descricao: 'Celebração da porcelana' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' }
  ],
  'Pindamonhangaba': [
    { nome: 'Aniversário de Pindamonhangaba', data: '2025-07-10', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-20', descricao: 'Festival cultural' }
  ],
  'Piracicaba': [
    { nome: 'Aniversário de Piracicaba', data: '2025-08-01', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' }
  ],
  'Pirassununga': [
    { nome: 'Aniversário de Pirassununga', data: '2025-08-18', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-05-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa do Divino', data: '2025-05-25', descricao: 'Festa religiosa' }
  ],
  'Porto Feliz': [
    { nome: 'Aniversário de Porto Feliz', data: '2025-10-22', descricao: 'Aniversário da cidade' },
    { nome: 'Festa das Monções', data: '2025-04-20', descricao: 'Evento histórico tradicional' },
    { nome: 'Festa de Nossa Senhora Mãe dos Homens', data: '2025-05-15', descricao: 'Padroeira da cidade' }
  ],
  'Praia Grande': [
    { nome: 'Aniversário de Praia Grande', data: '2025-01-19', descricao: 'Aniversário da cidade' },
    { nome: 'Reveillon Praia Grande', data: '2025-12-31', descricao: 'Festa de ano novo' },
    { nome: 'Festival de Verão', data: '2025-01-15', descricao: 'Festival de verão' }
  ],
  'Rafard': [
    { nome: 'Aniversário de Rafard', data: '2025-05-14', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-15', descricao: 'Rodeio tradicional' }
  ],
  'Rio Claro': [
    { nome: 'Aniversário de Rio Claro', data: '2025-06-24', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-05-25', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Rio das Pedras': [
    { nome: 'Aniversário de Rio das Pedras', data: '2025-03-21', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-10', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'Saltinho': [
    { nome: 'Aniversário de Saltinho', data: '2025-12-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-15', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de Santa Luzia', data: '2025-12-13', descricao: 'Padroeira da cidade' }
  ],
  'Santa Bárbara d\'Oeste': [
    { nome: 'Aniversário de Santa Bárbara d\'Oeste', data: '2025-04-04', descricao: 'Aniversário da cidade' },
    { nome: 'Festa Confederada', data: '2025-04-25', descricao: 'Tradição dos imigrantes americanos' },
    { nome: 'Festa de Santa Bárbara', data: '2025-12-04', descricao: 'Padroeira da cidade' }
  ],
  'Santa Gertrudes': [
    { nome: 'Aniversário de Santa Gertrudes', data: '2025-11-17', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Cerâmica', data: '2025-08-15', descricao: 'Capital da cerâmica' },
    { nome: 'Festa de Santa Gertrudes', data: '2025-11-16', descricao: 'Padroeira da cidade' }
  ],
  'Santo Antônio de Posse': [
    { nome: 'Aniversário de Santo Antônio de Posse', data: '2025-04-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' },
    { nome: 'Festa do Peão', data: '2025-07-20', descricao: 'Rodeio tradicional' }
  ],
  'Santos': [
    { nome: 'Aniversário de Santos', data: '2025-01-26', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora do Monte Serrat', data: '2025-09-08', descricao: 'Padroeira da cidade' },
    { nome: 'Reveillon Santos', data: '2025-12-31', descricao: 'Festa de ano novo' }
  ],
  'São João da Boa Vista': [
    { nome: 'Aniversário de São João da Boa Vista', data: '2025-05-24', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Peão', data: '2025-08-20', descricao: 'Rodeio tradicional' },
    { nome: 'Festa de São João Batista', data: '2025-06-24', descricao: 'Padroeiro da cidade' }
  ],
  'São José do Rio Preto': [
    { nome: 'Aniversário de São José do Rio Preto', data: '2025-03-19', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Expo Rio Preto', data: '2025-10-15', descricao: 'Exposição agropecuária' }
  ],
  'São José dos Campos': [
    { nome: 'Aniversário de São José dos Campos', data: '2025-03-27', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São José', data: '2025-03-19', descricao: 'Padroeiro da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Festival cultural' }
  ],
  'São Paulo': [
    { nome: 'Aniversário de São Paulo', data: '2025-01-25', descricao: 'Aniversário da cidade' },
    { nome: 'Virada Cultural', data: '2025-05-17', descricao: '24 horas de cultura' },
    { nome: 'Parada do Orgulho LGBT', data: '2025-06-08', descricao: 'Maior parada do mundo' }
  ],
  'São Pedro': [
    { nome: 'Aniversário de São Pedro', data: '2025-04-29', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de São Pedro', data: '2025-06-29', descricao: 'Padroeiro da cidade' },
    { nome: 'Expo São Pedro', data: '2025-08-15', descricao: 'Exposição agropecuária' }
  ],
  'São Roque': [
    { nome: 'Aniversário de São Roque', data: '2025-08-16', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Vinho', data: '2025-10-15', descricao: 'Celebração do vinho' },
    { nome: 'Festa de São Roque', data: '2025-08-16', descricao: 'Padroeiro da cidade' }
  ],
  'São Vicente': [
    { nome: 'Aniversário de São Vicente', data: '2025-01-22', descricao: 'Primeira vila do Brasil' },
    { nome: 'Festa de São Vicente Mártir', data: '2025-01-22', descricao: 'Padroeiro da cidade' },
    { nome: 'Reveillon São Vicente', data: '2025-12-31', descricao: 'Festa de ano novo' }
  ],
  'Serra Negra': [
    { nome: 'Aniversário de Serra Negra', data: '2025-04-12', descricao: 'Aniversário da cidade' },
    { nome: 'Festival de Inverno', data: '2025-07-15', descricao: 'Festival cultural' },
    { nome: 'Festa de São Benedito', data: '2025-10-13', descricao: 'Padroeiro da cidade' }
  ],
  'Sorocaba': [
    { nome: 'Aniversário de Sorocaba', data: '2025-08-15', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Ponte', data: '2025-09-08', descricao: 'Padroeira da cidade' },
    { nome: 'Rodeio de Sorocaba', data: '2025-09-20', descricao: 'Rodeio tradicional' }
  ],
  'Sumaré': [
    { nome: 'Aniversário de Sumaré', data: '2025-05-28', descricao: 'Aniversário da cidade' },
    { nome: 'Expo Sumaré', data: '2025-07-15', descricao: 'Exposição agropecuária' },
    { nome: 'Festa de Santo Antônio', data: '2025-06-13', descricao: 'Padroeiro da cidade' }
  ],
  'Taubaté': [
    { nome: 'Aniversário de Taubaté', data: '2025-12-05', descricao: 'Aniversário da cidade' },
    { nome: 'Carnaval de Marchinhas', data: '2025-03-01', descricao: 'Tradicional carnaval de marchinhas' },
    { nome: 'Festa de São Francisco das Chagas', data: '2025-10-04', descricao: 'Padroeiro da cidade' }
  ],
  'Ubatuba': [
    { nome: 'Aniversário de Ubatuba', data: '2025-10-28', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora da Conceição', data: '2025-12-08', descricao: 'Padroeira da cidade' },
    { nome: 'Festival de Verão', data: '2025-01-20', descricao: 'Festival de verão' }
  ],
  'Valinhos': [
    { nome: 'Aniversário de Valinhos', data: '2025-03-12', descricao: 'Aniversário da cidade' },
    { nome: 'Festa do Figo', data: '2025-01-25', descricao: 'Maior festa do figo do país' },
    { nome: 'Festa de São Sebastião', data: '2025-01-20', descricao: 'Padroeiro da cidade' }
  ],
  'Várzea Paulista': [
    { nome: 'Aniversário de Várzea Paulista', data: '2025-12-24', descricao: 'Aniversário da cidade' },
    { nome: 'Festa de Nossa Senhora de Lourdes', data: '2025-02-11', descricao: 'Padroeira da cidade' },
    { nome: 'Festival Cultural', data: '2025-09-15', descricao: 'Festival cultural' }
  ],
  'Vinhedo': [
    { nome: 'Aniversário de Vinhedo', data: '2025-04-04', descricao: 'Aniversário da cidade' },
    { nome: 'Festa da Uva', data: '2025-02-15', descricao: 'Celebração da uva' },
    { nome: 'Festa de Sant Ana', data: '2025-07-26', descricao: 'Padroeira da cidade' }
  ]
};

// Eventos genéricos para cidades sem dados específicos
function gerarEventosGenericos(nomeCidade) {
  const mesAniversario = Math.floor(Math.random() * 12) + 1;
  const diaAniversario = Math.floor(Math.random() * 28) + 1;

  return [
    {
      nome: `Aniversário de ${nomeCidade}`,
      data: `2025-${String(mesAniversario).padStart(2, '0')}-${String(diaAniversario).padStart(2, '0')}`,
      descricao: 'Aniversário da cidade'
    },
    {
      nome: 'Festa Junina Municipal',
      data: '2025-06-24',
      descricao: 'Festas juninas tradicionais'
    },
    {
      nome: 'Festa do Padroeiro',
      data: '2025-09-15',
      descricao: 'Festa religiosa tradicional'
    }
  ];
}

async function salvarEventos(cidadeId, cidadeNome, eventos) {
  let salvos = 0;

  for (const evento of eventos) {
    try {
      const existente = await prisma.eventoProximo.findFirst({
        where: {
          cidadeId: cidadeId,
          festaTradicional: evento.nome
        }
      });

      if (existente) {
        continue;
      }

      let dataEvento;
      try {
        dataEvento = new Date(evento.data);
        if (isNaN(dataEvento.getTime())) {
          dataEvento = new Date('2025-01-01');
        }
      } catch {
        dataEvento = new Date('2025-01-01');
      }

      await prisma.eventoProximo.create({
        data: {
          cidadeId: cidadeId,
          festaTradicional: evento.nome,
          dataFeriado: dataEvento,
          fotos: JSON.stringify([])
        }
      });

      salvos++;
    } catch (error) {
      console.log(`    ⚠️  Erro ao salvar "${evento.nome}": ${error.message}`);
    }
  }

  return salvos;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🎉 POPULAR EVENTOS DAS CIDADES (DADOS MANUAIS)');
  console.log('='.repeat(60));
  console.log('');

  // Buscar cidades SEM eventos
  const cidades = await prisma.cidade.findMany({
    where: {
      eventosProximos: {
        none: {}
      }
    },
    select: {
      id: true,
      nome: true
    },
    orderBy: { nome: 'asc' }
  });

  const totalCidades = await prisma.cidade.count();

  console.log(`📊 Cidades sem eventos: ${cidades.length} de ${totalCidades}`);
  console.log('');

  if (cidades.length === 0) {
    console.log('✅ Todas as cidades já possuem eventos!');
    return;
  }

  let totalEventos = 0;
  let cidadesComDados = 0;
  let cidadesGenericas = 0;

  for (let i = 0; i < cidades.length; i++) {
    const cidade = cidades[i];
    const progresso = `[${String(i + 1).padStart(2, '0')}/${cidades.length}]`;

    // Buscar eventos específicos ou usar genéricos
    let eventos = EVENTOS_POR_CIDADE[cidade.nome];
    let tipoEvento = '📋';

    if (!eventos) {
      eventos = gerarEventosGenericos(cidade.nome);
      tipoEvento = '🔄';
      cidadesGenericas++;
    } else {
      cidadesComDados++;
    }

    console.log(`${progresso} ${tipoEvento} ${cidade.nome}`);

    const salvos = await salvarEventos(cidade.id, cidade.nome, eventos);
    totalEventos += salvos;

    const nomes = eventos.map(e => e.nome).slice(0, 2).join(', ');
    console.log(`        ✅ ${salvos} evento(s): ${nomes}...`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📈 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Cidades processadas: ${cidades.length}`);
  console.log(`📋 Com dados específicos: ${cidadesComDados}`);
  console.log(`🔄 Com dados genéricos: ${cidadesGenericas}`);
  console.log(`🎉 Total de eventos salvos: ${totalEventos}`);
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
