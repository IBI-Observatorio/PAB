'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Pauta {
  id: number;
  dataPublicacao: string;
  urlFonte: string;
  titulo: string;
  resumoProblema: string;
  localizacaoEspecifica: string;
  categoria: string;
  volumeMencoes: number;
  nivelUrgencia: number;
  sentimentoPredominante: string;
  autoridadeResponsavel: string;
  statusResposta: string;
  tempoAtraso: number;
}

interface PautasProps {
  data: Pauta[];
}

export default function Pautas({ data }: PautasProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhuma pauta cadastrada</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getUrgenciaColor = (nivel: number) => {
    if (nivel >= 4) return 'text-red-400 bg-red-500/20';
    if (nivel >= 3) return 'text-orange-400 bg-orange-500/20';
    return 'text-yellow-400 bg-yellow-500/20';
  };

  const getSentimentoColor = (sentimento: string) => {
    const s = sentimento.toLowerCase();
    if (s.includes('negativo')) return 'text-red-400 bg-red-500/20';
    if (s.includes('neutro')) return 'text-gray-400 bg-gray-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Pautas e Sensibilidade Social
      </h2>

      <div className="space-y-4">
        {data.map((pauta, index) => (
          <motion.div
            key={pauta.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="card card-hover"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-red-300 mb-2">{pauta.titulo}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                      {pauta.categoria}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgenciaColor(pauta.nivelUrgencia)}`}>
                      Urgência: {pauta.nivelUrgencia}/5
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentoColor(pauta.sentimentoPredominante)}`}>
                      {pauta.sentimentoPredominante}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Publicado em</p>
                  <p className="text-sm font-semibold text-gray-300">{formatDate(pauta.dataPublicacao)}</p>
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-primary/30 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-gray-300 leading-relaxed">{pauta.resumoProblema}</p>
              </div>

              {/* Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Localização</p>
                  <p className="text-sm font-semibold text-gray-200">{pauta.localizacaoEspecifica}</p>
                </div>
                <div className="bg-primary/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Volume de Menções</p>
                  <p className="text-sm font-bold text-purple-400">{pauta.volumeMencoes.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-primary/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Responsável</p>
                  <p className="text-sm font-semibold text-gray-200">{pauta.autoridadeResponsavel}</p>
                </div>
                <div className="bg-primary/30 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="text-sm font-semibold text-blue-300">{pauta.statusResposta}</p>
                </div>
              </div>

              {/* Atraso e Fonte */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-primary-medium/30">
                <div className="flex items-center gap-2">
                  {pauta.tempoAtraso > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold text-red-300">
                        {pauta.tempoAtraso} dia{pauta.tempoAtraso !== 1 ? 's' : ''} de atraso
                      </span>
                    </div>
                  )}
                </div>
                <a
                  href={pauta.urlFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm font-semibold">Ver Fonte</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
