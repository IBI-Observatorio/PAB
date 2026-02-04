'use client';

import { motion } from 'framer-motion';

interface DeputadoFederal {
  id: number;
  nome: string;
  nomeUrna: string;
  partido: string;
  numeroUrna: string;
  votos2022: number;
  posicao: number;
  eleito: boolean;
}

interface DadosVotacaoData {
  votosPauloAlexandre2022: number;
  votosOutrosDeputadosFederais2022: number;
  votosPSDBTotal2022: number;
  votosPSDTotal2022: number;
  votosOutrosPartidos2022: number;
  votosPresidente2022: any;
  votosGovernador2022: any;
  pesquisasEleitorais?: any;
  votosLegendaPSDB45: number;
  votosLegendaPSD55: number;
}

interface VotacaoProps {
  data: {
    dadosVotacao: DadosVotacaoData | null;
    deputadosFederais?: DeputadoFederal[];
  } | null;
}

export default function Votacao({ data }: VotacaoProps) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum dado disponível</p>
      </div>
    );
  }

  const votacaoData = data.dadosVotacao;
  const deputados = data.deputadosFederais || [];

  // Se não houver nenhum dado, mostrar mensagem
  if (!votacaoData && deputados.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum dado de votação disponível</p>
      </div>
    );
  }

  // Parse JSON se for string (apenas se votacaoData existir)
  const votosPresidente = votacaoData && typeof votacaoData.votosPresidente2022 === 'string'
    ? JSON.parse(votacaoData.votosPresidente2022)
    : votacaoData?.votosPresidente2022;

  const votosGovernador = votacaoData && typeof votacaoData.votosGovernador2022 === 'string'
    ? JSON.parse(votacaoData.votosGovernador2022)
    : votacaoData?.votosGovernador2022;

  // Separar deputados: top 5 (posicao <= 5) e Paulo Alexandre
  const top5Deputados = deputados
    .filter(d => d.posicao <= 5)
    .sort((a, b) => a.posicao - b.posicao);

  // Encontrar Paulo Alexandre Barbosa
  const pauloAlexandre = deputados.find(d =>
    d.nome.toUpperCase().includes('PAULO ALEXANDRE')
  );

  // Verificar se Paulo Alexandre está no top 5
  const pauloNoTop5 = pauloAlexandre ? pauloAlexandre.posicao <= 5 : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Dados de Votação - Eleições 2022
      </h2>

      {/* Deputados Federais - Top 5 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h3 className="text-xl font-bold mb-4">🏆 Top 5 Deputados Federais - 2022</h3>
        {top5Deputados.length > 0 ? (
          <div className="space-y-3">
            {top5Deputados.map((deputado, index) => (
              <motion.div
                key={deputado.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="bg-primary/30 rounded-lg p-4 flex items-center justify-between hover:bg-primary/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    deputado.posicao === 1 ? 'bg-yellow-500/30 text-yellow-400' :
                    deputado.posicao === 2 ? 'bg-gray-400/30 text-gray-300' :
                    deputado.posicao === 3 ? 'bg-orange-600/30 text-orange-400' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {deputado.posicao}°
                  </div>
                  <div>
                    <p className="font-semibold text-white">{deputado.nomeUrna}</p>
                    <p className="text-sm text-gray-400">{deputado.partido}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{deputado.votos2022.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-400">votos</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Nenhum dado disponível</p>
        )}
      </motion.div>

      {/* Paulo Alexandre Barbosa - Se não estiver no top 5 */}
      {pauloAlexandre && !pauloNoTop5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card border-2 border-green-500/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h3 className="text-xl font-bold text-green-400">Paulo Alexandre Barbosa</h3>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{pauloAlexandre.nomeUrna}</p>
              <p className="text-sm text-gray-400">{pauloAlexandre.partido} • {pauloAlexandre.posicao}° colocado</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{pauloAlexandre.votos2022.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-gray-400">votos</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Votos de Legenda */}
      {votacaoData && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <span className="text-3xl font-bold text-blue-400">45</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Votos Legenda PSDB</h3>
              <p className="text-3xl font-bold text-blue-400">{votacaoData.votosLegendaPSDB45.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-500/20 rounded-lg">
              <span className="text-3xl font-bold text-green-400">55</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Votos Legenda PSD</h3>
              <p className="text-3xl font-bold text-green-400">{votacaoData.votosLegendaPSD55.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </motion.div>
      </div>
      )}

      {/* Presidente e Governador */}
      {votacaoData && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Presidente 2022 (2º turno)
          </h3>
          <div className="space-y-2">
            {votosPresidente && typeof votosPresidente === 'object' &&
              Object.entries(votosPresidente).map(([candidato, votos], index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-primary/30 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-semibold">{candidato}</span>
                  <span className="text-purple-400 font-bold">{Number(votos).toLocaleString('pt-BR')}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Governador 2022 (2º turno)
          </h3>
          <div className="space-y-2">
            {votosGovernador && typeof votosGovernador === 'object' &&
              Object.entries(votosGovernador).map(([candidato, votos], index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-primary/30 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-semibold">{candidato}</span>
                  <span className="text-orange-400 font-bold">{Number(votos).toLocaleString('pt-BR')}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
      )}
    </motion.div>
  );
}
