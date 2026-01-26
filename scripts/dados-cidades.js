// Dados pesquisados das 71 cidades do projeto PAB
// Fonte: Wikipedia, IBGE, Prefeituras Municipais

const dadosCidades = {
  // ===== BAIXADA SANTISTA =====
  "Santos": {
    gentilico: "Santista",
    dataFundacao: "1546-01-26",
    dataAniversario: "01-26",
    breveHistorico: "Fundada em 1546 por Brás Cubas, Santos abriga o maior porto da América Latina e a Santa Casa de Misericórdia (1543), primeiro hospital das Américas. Possui os jardins de praia mais extensos do mundo (7km), reconhecidos pelo Guinness. Berço do Santos FC e de Pelé.",
    padroeiro: "Nossa Senhora do Monte Serrat",
    pratoTipico: "Meca Santista (meca grelhada com risoto de pupunha e farofa de banana)"
  },
  "São Vicente": {
    gentilico: "Vicentino",
    dataFundacao: "1532-01-22",
    dataAniversario: "01-22",
    breveHistorico: "Primeira vila fundada no Brasil, em 22 de janeiro de 1532 por Martim Afonso de Sousa. Conhecida como 'Cellula Mater da Nacionalidade', realizou a primeira eleição das Américas em 1532. Preserva a Casa de Taipa (1516-1520), primeira construção do Brasil.",
    padroeiro: "São Vicente Mártir",
    pratoTipico: "Caldeirada de Frutos do Mar"
  },
  "Cubatão": {
    gentilico: "Cubatense",
    dataFundacao: "1949-01-09",
    dataAniversario: "04-09",
    breveHistorico: "Emancipada em 1949, Cubatão foi ponto de passagem para o Planalto desde o período colonial. Tornou-se polo industrial no século XX e, após ser conhecida como 'Vale da Morte' nos anos 80, é hoje referência mundial em recuperação ambiental.",
    padroeiro: "Nossa Senhora da Lapa",
    pratoTipico: "Azul Marinho (moqueca de peixe com banana verde)"
  },

  // ===== LITORAL NORTE =====
  "Caraguatatuba": {
    gentilico: "Caraguatatubense",
    dataFundacao: "1665-01-01",
    dataAniversario: "04-20",
    breveHistorico: "Fundada entre 1664-1665 por Manuel de Faria Dória. O nome vem de 'caraguatá-tuba' (grande quantidade de caraguatás). Foi devastada por epidemias no século XVII, sendo chamada de 'Vila que desertou'. Tornou-se Estância Balneária em 1947.",
    padroeiro: "Santo Antônio",
    pratoTipico: "Camarão (Festa do Camarão)"
  },
  "Ubatuba": {
    gentilico: "Ubatubense",
    dataFundacao: "1637-10-28",
    dataAniversario: "10-28",
    breveHistorico: "Habitada pelos índios Tupinambás, foi onde Hans Staden foi aprisionado. Local da histórica 'Paz de Iperoig', primeiro tratado de paz das Américas entre portugueses e índios. Possui 102 praias e é conhecida como 'Capital do Surfe'.",
    padroeiro: "Nossa Senhora da Exaltação da Santa Cruz",
    pratoTipico: "Azul Marinho (peixe cozido com banana verde)"
  },
  "Ilhabela": {
    gentilico: "Ilhabelense",
    dataFundacao: "1805-01-01",
    dataAniversario: "09-03",
    breveHistorico: "Descoberta em 1502 pela expedição de Gonçalo Coelho e Américo Vespúcio, batizada em homenagem a São Sebastião. A Vila foi criada em 1636. Arquipélago com rica cultura caiçara e tradições como a Congada. Abriga o maior núcleo de Mata Atlântica insular do Brasil.",
    padroeiro: "Nossa Senhora D'Ajuda e Bom Sucesso",
    pratoTipico: "Peixe caiçara com banana"
  },

  // ===== VALE DO PARAÍBA =====
  "Guarulhos": {
    gentilico: "Guarulhense",
    dataFundacao: "1560-12-08",
    dataAniversario: "12-08",
    breveHistorico: "Fundada em 8 de dezembro de 1560 pelo Padre Jesuíta Manuel de Paiva, com o nome de Nossa Senhora da Conceição. Importante centro de mineração de ouro no período colonial. Abriga o maior aeroporto da América do Sul e é a segunda maior cidade de SP.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Guisado (tradição da família Caraça)"
  },
  "Mogi Das Cruzes": {
    gentilico: "Mogiano",
    dataFundacao: "1611-09-01",
    dataAniversario: "09-01",
    breveHistorico: "Elevada à vila em 1611 como Sant'Anna de Mogi Mirim. O nome 'Mogi' vem de M'Boigy (Rio das Cobras). As cruzes eram marcos dos limites da vila. Centro irradiador de bandeirismo e ponto de repouso dos tropeiros. Sede da tradicional Festa do Divino Espírito Santo há mais de 400 anos.",
    padroeiro: "Sant'Anna (Santa Ana)",
    pratoTipico: "Afogado (prato típico da Festa do Divino)"
  },
  "Taubaté": {
    gentilico: "Taubateano",
    dataFundacao: "1645-12-05",
    dataAniversario: "12-05",
    breveHistorico: "Primeira vila do Vale do Paraíba, fundada em 1645 por Jacques Felix. Centro irradiador do bandeirismo e sede da Casa de Fundição de Ouro. Foi a maior produtora de café do Vale no início do século XX. Terra natal de Monteiro Lobato, é a 'Capital Nacional da Literatura Infantil'.",
    padroeiro: "São Francisco das Chagas",
    pratoTipico: "Comida tropeira"
  },
  "Pindamonhangaba": {
    gentilico: "Pindamonhangabense",
    dataFundacao: "1705-07-10",
    dataAniversario: "07-10",
    breveHistorico: "O nome significa 'lugar onde se fazem anzóis' em Tupi. Emancipada de Taubaté em 1705. Conhecida como 'Princesa do Norte', foi grande centro cafeeiro nas décadas de 1820-1920. Viveu intensa industrialização entre 1970-1985.",
    padroeiro: "Nossa Senhora do Bom Sucesso",
    pratoTipico: "Comida caipira"
  },
  "Lorena": {
    gentilico: "Lorenense",
    dataFundacao: "1788-11-14",
    dataAniversario: "11-14",
    breveHistorico: "Surgiu como apoio às expedições bandeirantes no porto de Guaypacaré (braço da Lagoa Torta). A capela de Nossa Senhora da Piedade foi construída em 1709. Desenvolveu-se com o café no século XIX. Conhecida como 'Terra das Palmeiras Imperiais'.",
    padroeiro: "Nossa Senhora da Piedade",
    pratoTipico: "Comida tropeira"
  },
  "Aparecida": {
    gentilico: "Aparecidense",
    dataFundacao: "1928-12-17",
    dataAniversario: "12-17",
    breveHistorico: "A história começou em 1717 com o encontro da imagem de Nossa Senhora da Conceição Aparecida por pescadores no Rio Paraíba. Desmembrada de Guaratinguetá em 1928. Abriga o Santuário Nacional, maior templo católico do Brasil e segundo do mundo. Capital Mariana do Brasil.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida mineira"
  },
  "Cruzeiro": {
    gentilico: "Cruzeirense",
    dataFundacao: "1901-03-18",
    dataAniversario: "03-18",
    breveHistorico: "Surgiu com a chegada da Estrada de Ferro Central do Brasil. Emancipada em 1901. Importante entroncamento ferroviário que ligava São Paulo, Rio de Janeiro e Minas Gerais. Polo industrial e comercial do Alto Vale do Paraíba.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida mineira"
  },

  // ===== REGIÃO BRAGANTINA =====
  "Atibaia": {
    gentilico: "Atibaiense",
    dataFundacao: "1665-06-24",
    dataAniversario: "06-24",
    breveHistorico: "Fundada em 24 de junho de 1665 pelo bandeirante Jerônimo de Camargo. O nome vem de 'atubaia' (água agradável ao paladar). Possui um dos melhores climas do mundo segundo a UNESCO. Capital Nacional do Morango desde 2022, com tradição iniciada por imigrantes japoneses e italianos.",
    padroeiro: "São João Batista",
    pratoTipico: "Morango (Capital Nacional do Morango)"
  },
  "Bragança Paulista": {
    gentilico: "Bragantino",
    dataFundacao: "1797-12-15",
    dataAniversario: "12-15",
    breveHistorico: "Fundada em 1797, foi elevada a cidade em 1856. Importante centro comercial e agrícola da região. Sede da Universidade São Francisco. Conhecida pela arquitetura histórica do centro e pela forte tradição religiosa.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Linguiça artesanal"
  },
  "Piracaia": {
    gentilico: "Piracaiense",
    dataFundacao: "1859-04-16",
    dataAniversario: "04-16",
    breveHistorico: "Fundada como freguesia em 1859. O nome vem do Tupi 'pira-caia' (peixe assado). Emancipada em 1891. Conhecida pela Represa de Piracaia e pelas festas religiosas tradicionais. Clima serrano e paisagens naturais.",
    padroeiro: "Sant'Ana",
    pratoTipico: "Peixe de água doce"
  },

  // ===== REGIÃO DE CAMPINAS =====
  "Americana": {
    gentilico: "Americanense",
    dataFundacao: "1875-08-27",
    dataAniversario: "08-27",
    breveHistorico: "Fundada em 27 de agosto de 1875 com a inauguração da Estação Santa Bárbara por Dom Pedro II. Povoada por imigrantes estadunidenses confederados após a Guerra Civil, além de italianos. A Fábrica Carioba (1875) foi uma das primeiras têxteis do estado.",
    padroeiro: "Santo Antônio de Pádua",
    pratoTipico: "Melancia Cascavel da Geórgia (tradição dos confederados)"
  },
  "Piracicaba": {
    gentilico: "Piracicabano",
    dataFundacao: "1767-08-01",
    dataAniversario: "08-01",
    breveHistorico: "Fundada em 1º de agosto de 1767. O nome significa 'lugar onde o peixe chega' em Tupi. Importante centro açucareiro e depois cafeeiro. Sede da ESALQ/USP. Conhecida pelo Salto do Rio Piracicaba e pela tradicional Festa do Divino.",
    padroeiro: "Santo Antônio de Pádua",
    pratoTipico: "Peixe no Tambor"
  },
  "Holambra": {
    gentilico: "Holambrense",
    dataFundacao: "1948-06-05",
    dataAniversario: "06-05",
    breveHistorico: "Fundada em 1948 por imigrantes holandeses após a 2ª Guerra Mundial. O nome une Holland-America-Brazil. Emancipada em 1991. Maior produtor de flores da América Latina, responsável por 40% da produção nacional. Sede da Expoflora desde 1981.",
    padroeiro: "Divino Espírito Santo",
    pratoTipico: "Culinária holandesa (stroopwafel, queijos)"
  },
  "Amparo": {
    gentilico: "Amparense",
    dataFundacao: "1829-05-07",
    dataAniversario: "05-07",
    breveHistorico: "Fundada em 1829. A cidade prosperou com o ciclo do café no século XIX. Preserva importante acervo arquitetônico do período cafeeiro. Conhecida pelas águas minerais e pelo turismo rural no Circuito das Águas Paulista.",
    padroeiro: "Nossa Senhora do Amparo",
    pratoTipico: "Comida caipira"
  },
  "Itatiba": {
    gentilico: "Itatibense",
    dataFundacao: "1857-04-02",
    dataAniversario: "04-02",
    breveHistorico: "Fundada como freguesia em 1857. O nome vem do Tupi 'itá-tyba' (abundância de pedras). Desenvolveu-se com a cultura do café. Hoje é importante polo industrial, especialmente no setor de autopeças e plásticos.",
    padroeiro: "Nossa Senhora do Belém",
    pratoTipico: "Comida italiana"
  },
  "Jundiaí": {
    gentilico: "Jundiaiense",
    dataFundacao: "1655-12-14",
    dataAniversario: "12-14",
    breveHistorico: "Fundada em 14 de dezembro de 1655. O nome vem do Tupi 'jundiá' (bagre). Foi ponto de parada dos bandeirantes. Importante centro ferroviário e industrial. Conhecida como 'Terra da Uva' pela tradição vitivinícola trazida por imigrantes italianos.",
    padroeiro: "Nossa Senhora do Desterro",
    pratoTipico: "Uva e derivados (Capital da Uva)"
  },
  "Louveira": {
    gentilico: "Louveirense",
    dataFundacao: "1963-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Jundiaí em 1963. O nome homenageia Francisco de Assis Louveira, dono das terras onde surgiu o povoado. Polo industrial e logístico importante por sua localização estratégica entre São Paulo e Campinas.",
    padroeiro: "São João Batista",
    pratoTipico: "Uva (tradição da região)"
  },
  "Itupeva": {
    gentilico: "Itupevense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Jundiaí em 1964. O nome vem do Tupi 'ytu-peba' (cachoeira rasa). Destaca-se pelo turismo de aventura, parques temáticos e pela produção de uvas. Possui importantes centros de distribuição logística.",
    padroeiro: "Nossa Senhora da Candelária",
    pratoTipico: "Uva e vinhos"
  },
  "Jarinu": {
    gentilico: "Jarinuense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Atibaia em 1964. O nome é uma corruptela de 'Jerônimo', em homenagem ao bandeirante Jerônimo de Camargo. Conhecida pela produção de vinhos e pelo turismo rural. Clima ameno e paisagens serranas.",
    padroeiro: "São João Batista",
    pratoTipico: "Vinho colonial"
  },
  "Campo Limpo Paulista": {
    gentilico: "Campo-limpense",
    dataFundacao: "1965-04-19",
    dataAniversario: "04-19",
    breveHistorico: "Emancipada de Jundiaí em 1965. Surgiu às margens da Estrada de Ferro Santos-Jundiaí. O nome refere-se aos campos naturais da região. Polo industrial com destaque para metalurgia e cerâmica.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida italiana"
  },
  "Várzea Paulista": {
    gentilico: "Várzea-paulistense",
    dataFundacao: "1965-04-19",
    dataAniversario: "04-19",
    breveHistorico: "Emancipada de Jundiaí em 1965. Surgiu como estação ferroviária. O nome refere-se às várzeas do Rio Jundiaí. Polo industrial com presença de indústrias químicas e metalúrgicas.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida italiana"
  },
  "Cabreúva": {
    gentilico: "Cabreuvano",
    dataFundacao: "1859-04-24",
    dataAniversario: "04-24",
    breveHistorico: "Fundada como freguesia em 1859. O nome vem de 'caburé-yba' (árvore do caburé). Preserva importante patrimônio histórico e natural. Conhecida pelas cachoeiras e pelo Mosteiro de São Bento, fundado em 1941.",
    padroeiro: "Nossa Senhora da Piedade",
    pratoTipico: "Comida caipira"
  },

  // ===== CIRCUITO DAS ÁGUAS =====
  "Serra Negra": {
    gentilico: "Serra-negrense",
    dataFundacao: "1859-03-10",
    dataAniversario: "03-10",
    breveHistorico: "Fundada em 1859. O nome refere-se à serra coberta de mata escura. Estância hidromineral conhecida pelas águas medicinais. Importante destino turístico do Circuito das Águas Paulista.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida caipira"
  },
  "Socorro": {
    gentilico: "Socorrense",
    dataFundacao: "1829-06-18",
    dataAniversario: "06-18",
    breveHistorico: "Fundada em 1829. Conhecida como 'Capital da Aventura' pelos esportes radicais e ecoturismo. Estância hidromineral do Circuito das Águas. Destaca-se pela acessibilidade e turismo inclusivo.",
    padroeiro: "Nossa Senhora do Perpétuo Socorro",
    pratoTipico: "Trutas e comida caipira"
  },
  "Monte Alegre Do Sul": {
    gentilico: "Monte-alegrense",
    dataFundacao: "1948-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada em 1948. Pequena cidade do Circuito das Águas, conhecida pelo clima ameno, tranquilidade e paisagens rurais. Destino de turismo rural e ecológico.",
    padroeiro: "São Gonçalo",
    pratoTipico: "Comida caipira"
  },

  // ===== CAMPOS DO JORDÃO E REGIÃO =====
  "Campos Do Jordão": {
    gentilico: "Jordanense",
    dataFundacao: "1874-04-29",
    dataAniversario: "04-29",
    breveHistorico: "Fundada em 29 de abril de 1874 por Mateus da Costa Pinto. Cidade mais alta do Brasil (1.628m). Foi sanátorio para tuberculosos no início do século XX. Hoje é o principal destino de inverno do Brasil, com arquitetura europeia e festival de música clássica.",
    padroeiro: "São Mateus",
    pratoTipico: "Truta (pioneirismo de Kyoshi Koike)"
  },
  "São Bento Do Sapucaí": {
    gentilico: "São-bentense",
    dataFundacao: "1858-04-21",
    dataAniversario: "04-21",
    breveHistorico: "Fundada em 1858. Localizada na Serra da Mantiqueira, é conhecida pela Pedra do Baú e pelo turismo de aventura. Preserva tradições rurais e arquitetura histórica. Importante destino de ecoturismo.",
    padroeiro: "São Bento",
    pratoTipico: "Pinhão e comida caipira"
  },
  "Santo Antônio Do Pinhal": {
    gentilico: "Pinhalense",
    dataFundacao: "1953-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de São Bento do Sapucaí em 1953. Localizada na Serra da Mantiqueira, a 1.080m de altitude. Conhecida pelo clima frio, produção de trutas e artesanato. Destino de turismo rural e gastronômico.",
    padroeiro: "Santo Antônio",
    pratoTipico: "Truta e fondue"
  },

  // ===== REGIÃO DE SÃO JOSÉ DOS CAMPOS =====
  "São José Dos Campos": {
    gentilico: "Joseense",
    dataFundacao: "1767-07-27",
    dataAniversario: "07-27",
    breveHistorico: "Fundada como aldeia indígena em 1590, elevada a vila em 1767. Foi sanátorio para tuberculosos no início do século XX. Hoje é polo tecnológico e aeroespacial, sede do INPE, ITA e Embraer. Terceira maior cidade do interior paulista.",
    padroeiro: "São José",
    pratoTipico: "Comida tropeira"
  },
  "Jacareí": {
    gentilico: "Jacareiense",
    dataFundacao: "1653-01-03",
    dataAniversario: "01-03",
    breveHistorico: "Fundada em 1653 por Antônio Afonso. O nome vem do Tupi 'yacaré-y' (rio dos jacarés). Importante centro industrial do Vale do Paraíba. Preserva casarões do período cafeeiro e tradições culturais.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida caipira"
  },
  "Caçapava": {
    gentilico: "Caçapavano",
    dataFundacao: "1855-04-26",
    dataAniversario: "04-26",
    breveHistorico: "Fundada como freguesia em 1785, emancipada em 1855. O nome vem do Tupi 'caá-çapaba' (travessia da mata). Polo industrial do Vale do Paraíba. Abriga o 12º Grupo de Artilharia de Campanha do Exército.",
    padroeiro: "Nossa Senhora da Ajuda",
    pratoTipico: "Comida tropeira"
  },

  // ===== OUTRAS CIDADES =====
  "São Paulo": {
    gentilico: "Paulistano",
    dataFundacao: "1554-01-25",
    dataAniversario: "01-25",
    breveHistorico: "Fundada em 25 de janeiro de 1554 pelos padres jesuítas José de Anchieta e Manuel da Nóbrega. De pequeno colégio jesuíta, tornou-se a maior metrópole da América do Sul. Capital financeira e cultural do Brasil, com mais de 12 milhões de habitantes.",
    padroeiro: "São Paulo Apóstolo",
    pratoTipico: "Virado à Paulista"
  },
  "Suzano": {
    gentilico: "Suzanense",
    dataFundacao: "1949-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Mogi das Cruzes em 1949. O nome homenageia a família Suzano, proprietária das terras. Polo industrial com destaque para papel e celulose. Centro de produção de hortifrutigranjeiros.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida oriental (influência japonesa)"
  },
  "Itaquaquecetuba": {
    gentilico: "Itaquaquecetubense",
    dataFundacao: "1953-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Mogi das Cruzes em 1953. O nome vem do Tupi 'taquara-kecetuba' (muita taquara fina). Polo industrial da Região Metropolitana de São Paulo. Importante centro comercial.",
    padroeiro: "Nossa Senhora da Ajuda",
    pratoTipico: "Comida nordestina"
  },
  "Santa Isabel": {
    gentilico: "Santaisabelense",
    dataFundacao: "1832-05-10",
    dataAniversario: "05-10",
    breveHistorico: "Fundada em 1832. Desenvolveu-se com a agricultura e a chegada da ferrovia. Conhecida pelo Parque Estadual de Itapetinga e pela Represa de Santa Isabel. Preserva tradições rurais.",
    padroeiro: "Santa Isabel",
    pratoTipico: "Comida caipira"
  },
  "Guararema": {
    gentilico: "Guararemense",
    dataFundacao: "1898-03-19",
    dataAniversario: "03-19",
    breveHistorico: "Emancipada em 1898. O nome vem do Tupi 'guarare-ma' (lugar dos guararás). Conhecida pela Maria Fumaça e pela preservação histórica. Destino turístico com cachoeiras e turismo rural.",
    padroeiro: "Nossa Senhora da Escada",
    pratoTipico: "Comida caipira"
  },
  "Biritiba Mirim": {
    gentilico: "Biritibaense",
    dataFundacao: "1964-04-18",
    dataAniversario: "04-18",
    breveHistorico: "Emancipada de Mogi das Cruzes em 1964. O nome vem do Tupi 'mbiritiba-mirim' (pequenas palmeiras). Grande produtora de hortaliças e flores. Conhecida pela Represa de Biritiba.",
    padroeiro: "São Benedito",
    pratoTipico: "Comida oriental (comunidade japonesa)"
  },
  "Salesópolis": {
    gentilico: "Salesopolitano",
    dataFundacao: "1857-02-18",
    dataAniversario: "02-18",
    breveHistorico: "Fundada em 1857. Cidade nascente do Rio Tietê, preserva a história das nascentes. Conhecida pelo ecoturismo e pelas cachoeiras. Mantém forte tradição de pesca esportiva.",
    padroeiro: "Nossa Senhora do Carmo",
    pratoTipico: "Truta"
  },
  "Francisco Morato": {
    gentilico: "Moratense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Franco da Rocha em 1964. O nome homenageia Francisco Morato, jurista e político. Cidade dormitório da Região Metropolitana de São Paulo.",
    padroeiro: "Santa Luzia",
    pratoTipico: "Comida nordestina"
  },
  "Franco Da Rocha": {
    gentilico: "Franco-rochense",
    dataFundacao: "1944-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Juqueri em 1944. O nome homenageia o Dr. Francisco Franco da Rocha, fundador do Hospital Psiquiátrico do Juqueri. Possui o Parque Estadual do Juqueri e importante patrimônio histórico hospitalar.",
    padroeiro: "Nossa Senhora das Dores",
    pratoTipico: "Comida caipira"
  },
  "Caieiras": {
    gentilico: "Caieirense",
    dataFundacao: "1959-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Franco da Rocha em 1959. O nome refere-se às antigas caieiras (fornos de cal). Sede da Companhia Melhoramentos, importante indústria de papel desde 1890.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida italiana"
  },
  "Mairiporã": {
    gentilico: "Mairiporense",
    dataFundacao: "1889-03-06",
    dataAniversario: "03-06",
    breveHistorico: "Fundada em 1889. O nome vem do Tupi 'mairi-porã' (aldeia bonita). Conhecida pela Serra da Cantareira e pela Represa de Mairiporã. Destino de ecoturismo e turismo de aventura.",
    padroeiro: "Nossa Senhora do Desterro",
    pratoTipico: "Comida caipira"
  },

  // ===== REGIÃO DE SÃO JOÃO DA BOA VISTA =====
  "São João Da Boa Vista": {
    gentilico: "São-joanense",
    dataFundacao: "1821-04-24",
    dataAniversario: "04-24",
    breveHistorico: "Fundada em 1821. Importante centro do ciclo do café. Preserva rico patrimônio arquitetônico do período cafeeiro. Polo regional de comércio e serviços.",
    padroeiro: "São João Batista",
    pratoTipico: "Frango com quiabo"
  },
  "Casa Branca": {
    gentilico: "Casa-branquense",
    dataFundacao: "1841-03-27",
    dataAniversario: "03-27",
    breveHistorico: "Fundada em 1841. O nome refere-se a uma casa caiada de branco que servia de referência. Desenvolveu-se com o café e possui importante patrimônio ferroviário.",
    padroeiro: "Nossa Senhora das Dores",
    pratoTipico: "Comida mineira"
  },
  "Mococa": {
    gentilico: "Mocoquense",
    dataFundacao: "1855-03-24",
    dataAniversario: "03-24",
    breveHistorico: "Fundada em 1855. O nome vem do Tupi 'moqueca' (comida assada). Importante centro cafeeiro e hoje polo agroindustrial. Conhecida pela produção de café e grãos.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida mineira"
  },
  "Caconde": {
    gentilico: "Cacondense",
    dataFundacao: "1865-04-11",
    dataAniversario: "04-11",
    breveHistorico: "Fundada em 1865. O nome vem do Tupi 'caconde' (mato cerrado). Localizada na divisa com Minas Gerais, possui forte influência mineira na cultura e gastronomia.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida mineira"
  },
  "Porto Ferreira": {
    gentilico: "Porto-ferreirense",
    dataFundacao: "1896-03-19",
    dataAniversario: "03-19",
    breveHistorico: "Emancipada em 1896. O nome refere-se a um porto no Rio Mogi-Guaçu. Conhecida como 'Capital Nacional da Cerâmica Artística' pela tradição ceramista iniciada por imigrantes italianos.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida italiana"
  },
  "Vargem Grande Do Sul": {
    gentilico: "Vargem-grandense",
    dataFundacao: "1874-03-02",
    dataAniversario: "03-02",
    breveHistorico: "Fundada em 1874. O nome refere-se às grandes várzeas da região. Centro agrícola com produção de café, cana e grãos. Preserva tradições rurais.",
    padroeiro: "São Joaquim",
    pratoTipico: "Comida caipira"
  },
  "Tambaú": {
    gentilico: "Tambauense",
    dataFundacao: "1896-01-14",
    dataAniversario: "01-14",
    breveHistorico: "Emancipada em 1896. O nome vem do Tupi 'tambaú' (concha). Conhecida como 'Capital Nacional da Cerâmica Vermelha' pela tradição na produção de telhas e tijolos.",
    padroeiro: "Senhor Bom Jesus",
    pratoTipico: "Comida caipira"
  },
  "Aguaí": {
    gentilico: "Aguaiense",
    dataFundacao: "1898-07-19",
    dataAniversario: "07-19",
    breveHistorico: "Emancipada em 1898. O nome vem do Tupi 'aguaí' (fruta nativa). Centro agrícola com produção de café, cana e citrus. Possui estação ferroviária histórica.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida caipira"
  },

  // ===== CIDADES MENORES =====
  "Arapeí": {
    gentilico: "Arapeiense",
    dataFundacao: "1993-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Bananal em 1993. Menor município do estado em população. Preserva características do período colonial e do ciclo do café.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida tropeira"
  },
  "Areias": {
    gentilico: "Areiense",
    dataFundacao: "1816-04-21",
    dataAniversario: "04-21",
    breveHistorico: "Fundada em 1816. O nome refere-se às areias do Rio Paraíba. Foi importante centro cafeeiro no século XIX. Preserva casarões coloniais e igrejas históricas.",
    padroeiro: "Sant'Ana",
    pratoTipico: "Comida tropeira"
  },
  "Bananal": {
    gentilico: "Bananalense",
    dataFundacao: "1832-01-26",
    dataAniversario: "01-26",
    breveHistorico: "Fundada em 1832. O nome refere-se às plantações de banana. Foi a cidade mais rica do Brasil no auge do café. Preserva impressionante patrimônio arquitetônico do período imperial.",
    padroeiro: "Senhor Bom Jesus do Livramento",
    pratoTipico: "Comida tropeira"
  },
  "Queluz": {
    gentilico: "Queluzense",
    dataFundacao: "1842-03-26",
    dataAniversario: "03-26",
    breveHistorico: "Fundada em 1842. O nome homenageia o Palácio de Queluz em Portugal. Desenvolveu-se com o café e a ferrovia. Preserva arquitetura do período cafeeiro.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida tropeira"
  },
  "São José Do Barreiro": {
    gentilico: "Barreirense",
    dataFundacao: "1859-04-14",
    dataAniversario: "04-14",
    breveHistorico: "Fundada em 1859. Foi importante centro cafeeiro. Preserva fazendas históricas do período imperial. Portal de acesso ao Parque Nacional da Serra da Bocaina.",
    padroeiro: "São José",
    pratoTipico: "Comida tropeira"
  },
  "Silveiras": {
    gentilico: "Silveirense",
    dataFundacao: "1842-03-09",
    dataAniversario: "03-09",
    breveHistorico: "Fundada em 1842. O nome homenageia a família Silveira. Foi centro produtor de café. Preserva igrejas e casarões do período colonial.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida tropeira"
  },
  "Lagoinha": {
    gentilico: "Lagoinhense",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada em 1935. O nome refere-se às pequenas lagoas da região. Localizada na Serra da Mantiqueira, é conhecida pelo turismo rural e cachoeiras.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida caipira"
  },
  "Natividade Da Serra": {
    gentilico: "Natividadense",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada em 1935. Localizada às margens da Represa de Paraibuna, é conhecida pelo ecoturismo e pesca esportiva. Preserva tradições caiçaras.",
    padroeiro: "Nossa Senhora da Natividade",
    pratoTipico: "Peixe de água doce"
  },
  "Paraibuna": {
    gentilico: "Paraibunense",
    dataFundacao: "1832-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Fundada em 1832. O nome vem do Rio Paraibuna. Conhecida pela Represa de Paraibuna, é importante para geração de energia e turismo náutico.",
    padroeiro: "São Vicente Ferrer",
    pratoTipico: "Peixe de água doce"
  },
  "São Luís Do Paraitinga": {
    gentilico: "Luisense",
    dataFundacao: "1773-05-08",
    dataAniversario: "05-08",
    breveHistorico: "Fundada em 1773. Preserva o maior conjunto arquitetônico colonial do Vale do Paraíba. Conhecida pelo Carnaval de Marchinhas e pelas festas do Divino. Patrimônio histórico nacional.",
    padroeiro: "São Luís de Tolosa",
    pratoTipico: "Comida tropeira"
  },
  "Redenção Da Serra": {
    gentilico: "Redençoense",
    dataFundacao: "1944-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada em 1944. O nome refere-se à abolição da escravatura. Localizada na Serra da Mantiqueira, é conhecida pelo clima ameno e turismo rural.",
    padroeiro: "Divino Espírito Santo",
    pratoTipico: "Comida caipira"
  },
  "Cunha": {
    gentilico: "Cunhense",
    dataFundacao: "1785-05-27",
    dataAniversario: "05-27",
    breveHistorico: "Fundada em 1785. Era rota dos tropeiros entre São Paulo e Paraty. Conhecida como 'Capital Paulista da Cerâmica' pela tradição de olarias de alta temperatura. Portal da Serra do Mar.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Pinhão e comida tropeira"
  },
  "Monteiro Lobato": {
    gentilico: "Lobatense",
    dataFundacao: "1948-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de São José dos Campos em 1948. O nome homenageia o escritor Monteiro Lobato, que tinha fazenda na região. Preserva paisagens da Serra da Mantiqueira.",
    padroeiro: "São Benedito",
    pratoTipico: "Truta"
  },
  "Tremembé": {
    gentilico: "Tremembeense",
    dataFundacao: "1896-03-19",
    dataAniversario: "03-19",
    breveHistorico: "Emancipada de Taubaté em 1896. O nome vem do Tupi 'terembé' (pássaro). Conhecida como 'Cidade dos Arranha-céus do Vale', possui importante parque industrial.",
    padroeiro: "Santo Antônio",
    pratoTipico: "Comida tropeira"
  },
  "Jambeiro": {
    gentilico: "Jambeirense",
    dataFundacao: "1991-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Paraibuna em 1991. O nome refere-se aos jambeiros (árvores). Pequena cidade rural com economia baseada na agropecuária.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida caipira"
  },
  "Roseira": {
    gentilico: "Roseirense",
    dataFundacao: "1991-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Aparecida em 1991. O nome refere-se às roseiras cultivadas. Pequena cidade às margens da Via Dutra, próxima ao Santuário Nacional.",
    padroeiro: "Santa Rosa de Lima",
    pratoTipico: "Comida mineira"
  },
  "Potim": {
    gentilico: "Potinense",
    dataFundacao: "1991-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Guaratinguetá em 1991. Pequena cidade do Vale do Paraíba com economia baseada em serviços e agricultura.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida caipira"
  },
  "Cachoeira Paulista": {
    gentilico: "Cachoeirense",
    dataFundacao: "1880-04-24",
    dataAniversario: "04-24",
    breveHistorico: "Fundada em 1880. O nome refere-se às cachoeiras do Rio Paraíba. Sede da Comunidade Canção Nova, importante centro católico carismático e de comunicação religiosa.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida mineira"
  },
  "Lavrinhas": {
    gentilico: "Lavrinhense",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Queluz em 1935. O nome refere-se às pequenas lavras de ouro. Pequena cidade da Serra da Mantiqueira com economia rural.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida tropeira"
  },
  "Canas": {
    gentilico: "Canense",
    dataFundacao: "1991-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Lorena em 1991. O nome refere-se às plantações de cana-de-açúcar. Pequena cidade com economia baseada na agricultura.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida caipira"
  },
  "Piquete": {
    gentilico: "Piquetense",
    dataFundacao: "1891-06-20",
    dataAniversario: "06-20",
    breveHistorico: "Fundada em 1891. O nome refere-se a um piquete militar na região. Localizada na Serra da Mantiqueira, abriga parte do Parque Nacional de Itatiaia. Sede de unidades militares.",
    padroeiro: "Bom Jesus",
    pratoTipico: "Pinhão e comida mineira"
  },

  // ===== REGIÃO DE PIRACICABA =====
  "Saltinho": {
    gentilico: "Saltinhense",
    dataFundacao: "1993-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Piracicaba em 1993. O nome refere-se a um pequeno salto d'água. Economia baseada na agricultura, especialmente cana-de-açúcar.",
    padroeiro: "São João Batista",
    pratoTipico: "Comida caipira"
  },
  "Santa Maria Da Serra": {
    gentilico: "Santa-mariense",
    dataFundacao: "1993-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Santa Bárbara d'Oeste em 1993. O nome homenageia Nossa Senhora e a localização serrana. Economia baseada na agropecuária.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida caipira"
  },
  "Mombuca": {
    gentilico: "Mombucano",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Capivari em 1964. O nome vem do Tupi 'mombyca' (abelha nativa). Um dos menores municípios do estado. Economia rural baseada na cana-de-açúcar.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida caipira"
  },
  "Araras": {
    gentilico: "Ararense",
    dataFundacao: "1871-03-24",
    dataAniversario: "03-24",
    breveHistorico: "Fundada em 1871. O nome refere-se às araras que habitavam a região. Desenvolveu-se com o café e depois com a cana-de-açúcar. Importante polo industrial e agrícola.",
    padroeiro: "São Bento",
    pratoTipico: "Comida italiana"
  },
  "Leme": {
    gentilico: "Lemense",
    dataFundacao: "1895-08-25",
    dataAniversario: "08-25",
    breveHistorico: "Emancipada de Pirassununga em 1895. O nome homenageia a família Leme. Centro agrícola com produção de cana, laranja e grãos.",
    padroeiro: "Bom Jesus",
    pratoTipico: "Comida caipira"
  },
  "Cordeirópolis": {
    gentilico: "Cordeiropolense",
    dataFundacao: "1948-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Limeira em 1948. O nome homenageia Antônio Cordeiro. Conhecida pela tradição ceramista e pela produção de laranja.",
    padroeiro: "São José",
    pratoTipico: "Comida italiana"
  },
  "Estiva Gerbi": {
    gentilico: "Estiva-gerbense",
    dataFundacao: "1993-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Mogi Guaçu em 1993. O nome homenageia a família Gerbi e refere-se ao local de descanso dos tropeiros (estiva). Economia rural.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Comida italiana"
  },
  "Morungaba": {
    gentilico: "Morungabense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Amparo em 1964. O nome vem do Tupi 'morungaba' (lugar de descanso). Conhecida pelo clima ameno e pelo Circuito das Frutas.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Morango"
  },
  "Pedreira": {
    gentilico: "Pedreirense",
    dataFundacao: "1896-03-19",
    dataAniversario: "03-19",
    breveHistorico: "Emancipada de Amparo em 1896. O nome refere-se às pedreiras de granito. Conhecida como 'Princesa da Porcelana' pela tradição ceramista, especialmente em louças finas.",
    padroeiro: "São José",
    pratoTipico: "Comida italiana"
  },
  "Jaguariúna": {
    gentilico: "Jaguariunense",
    dataFundacao: "1953-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Mogi Mirim em 1953. O nome vem do Tupi 'jaguari-una' (onça preta). Polo tecnológico e industrial, sede de empresas de TI. Conhecida pelo Rodeio de Jaguariúna.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida country"
  },
  "Vargem": {
    gentilico: "Vargense",
    dataFundacao: "1991-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Bragança Paulista em 1991. O nome refere-se às várzeas da região. Pequena cidade com economia baseada na agricultura e pecuária.",
    padroeiro: "São Sebastião",
    pratoTipico: "Comida caipira"
  },
  "Tuiuti": {
    gentilico: "Tuiutiense",
    dataFundacao: "1993-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Bragança Paulista em 1993. O nome homenageia a Batalha de Tuiuti na Guerra do Paraguai. Pequena cidade com turismo rural e cachoeiras.",
    padroeiro: "São Roque",
    pratoTipico: "Comida caipira"
  },
  "Pinhalzinho": {
    gentilico: "Pinhalzinhense",
    dataFundacao: "1991-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Bragança Paulista em 1991. O nome refere-se aos pinhais da região. Turismo rural e clima serrano. Economia baseada na agropecuária.",
    padroeiro: "Nossa Senhora Aparecida",
    pratoTipico: "Pinhão"
  },
  "Pedra Bela": {
    gentilico: "Pedra-belense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Bragança Paulista em 1964. O nome refere-se a uma rocha de granito de formato peculiar. Turismo rural e trilhas ecológicas.",
    padroeiro: "Senhor Bom Jesus",
    pratoTipico: "Comida caipira"
  },
  "Nazaré Paulista": {
    gentilico: "Nazareno",
    dataFundacao: "1898-12-19",
    dataAniversario: "12-19",
    breveHistorico: "Emancipada de Santa Isabel em 1898. O nome homenageia Nossa Senhora de Nazaré. Conhecida pela Represa de Atibainha e pelo turismo ecológico.",
    padroeiro: "Nossa Senhora de Nazaré",
    pratoTipico: "Comida caipira"
  },
  "Joanópolis": {
    gentilico: "Joanopolitano",
    dataFundacao: "1917-12-26",
    dataAniversario: "12-26",
    breveHistorico: "Emancipada de Bragança Paulista em 1917. O nome homenageia Dom João VI. Localizada na Serra da Mantiqueira, é destino de turismo de inverno e aventura.",
    padroeiro: "Nossa Senhora do Belém",
    pratoTipico: "Truta"
  },
  "Bom Jesus Dos Perdões": {
    gentilico: "Perdoense",
    dataFundacao: "1965-01-01",
    dataAniversario: "01-01",
    breveHistorico: "Emancipada de Atibaia em 1965. O nome refere-se ao Santuário do Bom Jesus dos Perdões. Turismo religioso e rural. Clima ameno.",
    padroeiro: "Bom Jesus dos Perdões",
    pratoTipico: "Morango"
  },

  // ===== CIDADES RESTANTES =====
  "Itobi": {
    gentilico: "Itobiense",
    dataFundacao: "1964-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Casa Branca em 1964. O nome vem do Tupi 'itó-bi' (água verde). Pequena cidade com economia agrícola, especialmente café.",
    padroeiro: "Nossa Senhora da Conceição",
    pratoTipico: "Comida mineira"
  },
  "Tapiratiba": {
    gentilico: "Tapiratibano",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de Caconde em 1935. O nome vem do Tupi 'tapiratiba' (muito tapir). Economia agrícola com produção de café.",
    padroeiro: "Senhor Bom Jesus",
    pratoTipico: "Comida mineira"
  },
  "Divinolândia": {
    gentilico: "Divinolandense",
    dataFundacao: "1953-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de São José do Rio Pardo em 1953. O nome homenageia o Divino Espírito Santo. Localizada na Serra da Mantiqueira, é polo de turismo rural.",
    padroeiro: "Divino Espírito Santo",
    pratoTipico: "Comida mineira"
  },
  "São José Do Rio Pardo": {
    gentilico: "Rio-pardense",
    dataFundacao: "1865-07-27",
    dataAniversario: "07-27",
    breveHistorico: "Fundada em 1865. Conhecida como 'Berço de Euclides da Cunha', onde o escritor reconstruiu a ponte e escreveu 'Os Sertões'. Preserva rico patrimônio histórico.",
    padroeiro: "São José",
    pratoTipico: "Comida mineira"
  },
  "São Sebastião Da Grama": {
    gentilico: "Gramense",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de São José do Rio Pardo em 1935. O nome homenageia São Sebastião e a grama da região. Centro produtor de café especial.",
    padroeiro: "São Sebastião",
    pratoTipico: "Café e comida mineira"
  },
  "Espírito Santo Do Pinhal": {
    gentilico: "Pinhalense",
    dataFundacao: "1849-08-16",
    dataAniversario: "08-16",
    breveHistorico: "Fundada em 1849. O nome homenageia o Divino Espírito Santo e os pinhais. Centro produtor de café de alta qualidade. Preserva arquitetura do ciclo cafeeiro.",
    padroeiro: "Divino Espírito Santo",
    pratoTipico: "Café e comida mineira"
  },
  "Santo Antônio Do Jardim": {
    gentilico: "Santo-antoniense",
    dataFundacao: "1927-12-28",
    dataAniversario: "12-28",
    breveHistorico: "Emancipada de Espírito Santo do Pinhal em 1927. O nome homenageia Santo Antônio. Pequena cidade produtora de café especial.",
    padroeiro: "Santo Antônio",
    pratoTipico: "Comida mineira"
  },
  "Águas Da Prata": {
    gentilico: "Pratense",
    dataFundacao: "1935-12-30",
    dataAniversario: "12-30",
    breveHistorico: "Emancipada de São João da Boa Vista em 1935. Estância hidromineral conhecida pelas fontes de águas minerais. Turismo de saúde e lazer.",
    padroeiro: "Nossa Senhora de Lourdes",
    pratoTipico: "Comida mineira"
  },
  "Santa Cruz Das Palmeiras": {
    gentilico: "Santa-cruzense",
    dataFundacao: "1895-02-14",
    dataAniversario: "02-14",
    breveHistorico: "Emancipada em 1895. O nome refere-se à cruz e às palmeiras da região. Centro agrícola com produção de cana-de-açúcar e laranja.",
    padroeiro: "Santa Cruz",
    pratoTipico: "Comida caipira"
  },
  "Guaratinguetá": {
    gentilico: "Guaratinguetaense",
    dataFundacao: "1630-01-01",
    dataAniversario: "06-13",
    breveHistorico: "Fundada por volta de 1630. Uma das cidades mais antigas do Vale do Paraíba. Foi capital da Capitania de São Paulo. Berço de Frei Galvão, primeiro santo brasileiro.",
    padroeiro: "Santo Antônio",
    pratoTipico: "Comida tropeira"
  }
};

module.exports = { dadosCidades };
