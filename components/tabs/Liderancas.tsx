'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

interface Lideranca {
  id: number;
  nomeLideranca?: string;
  fotoLideranca?: string;
  nomeGestor: string;
  cargo: string;
  partido: string;
  historicoComPAB: string;
  votos2024: number;
  votosPrevistos2026: number;
  dataVisitaGestor?: string;
}

interface LiderancasProps {
  data: Lideranca[];
}

export default function Liderancas({ data }: LiderancasProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhuma liderança cadastrada</p>
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Não visitado';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Lideranças
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((lideranca, index) => (
          <motion.div
            key={lideranca.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="card card-hover"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                {lideranca.fotoLideranca ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500">
                    <Image
                      src={lideranca.fotoLideranca}
                      alt={lideranca.nomeLideranca || 'Liderança'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-purple-500/20 rounded-full">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-300">{lideranca.nomeLideranca || 'Sem nome'}</h3>
                  <p className="text-sm text-gray-400">Gestor: {lideranca.nomeGestor}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                      {lideranca.cargo}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                      {lideranca.partido}
                    </span>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div className="bg-primary/30 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-gray-400 mb-1">Histórico com PAB</p>
                <p className="text-gray-300 leading-relaxed">{lideranca.historicoComPAB}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Votos 2024</p>
                  <p className="text-2xl font-bold text-blue-400">{lideranca.votos2024.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-primary/30 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-1">Previstos 2026</p>
                  <p className="text-2xl font-bold text-green-400">{lideranca.votosPrevistos2026.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {/* Variação */}
              <div className="flex items-center justify-between bg-primary/30 rounded-lg p-4">
                <span className="text-sm text-gray-400">Variação Estimada</span>
                <div className="flex items-center gap-2">
                  {lideranca.votosPrevistos2026 > lideranca.votos2024 ? (
                    <>
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-green-400 font-bold">
                        +{((lideranca.votosPrevistos2026 - lideranca.votos2024) / lideranca.votos2024 * 100).toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      <span className="text-red-400 font-bold">
                        {((lideranca.votosPrevistos2026 - lideranca.votos2024) / lideranca.votos2024 * 100).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Data de Visita */}
              <div className="flex items-center gap-3 bg-primary/30 rounded-lg p-4">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Última Visita do Gestor</p>
                  <p className="text-sm font-semibold text-yellow-300">{formatDate(lideranca.dataVisitaGestor)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
