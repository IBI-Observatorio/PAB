'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Evento {
  id: number;
  festaTradicional: string;
  dataFeriado: string;
  fotos: string | string[];
}

interface CalendarioEventosProps {
  data: Evento[];
  datasHistoricas?: string | null;
  periodoFestas?: string | null;
}

export default function CalendarioEventos({ data, datasHistoricas, periodoFestas }: CalendarioEventosProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const temDados = (data && data.length > 0) || datasHistoricas || periodoFestas;

  if (!temDados) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum evento cadastrado</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Seção: Datas de Relevância Histórica / Feriados Locais */}
      {datasHistoricas && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-amber-300 flex items-center gap-2">
                <span>📅</span> Datas de Relevância Histórica / Feriados Locais
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">{datasHistoricas}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Seção: Período de Exposições e Festas */}
      {periodoFestas && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 text-purple-300 flex items-center gap-2">
                <span>🎪</span> Período de Exposições e Festas
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">{periodoFestas}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Seção: Eventos Próximos */}
      {data && data.length > 0 && (
        <>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-pink-300">
            <span>🎉</span> Eventos Cadastrados
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.map((evento, index) => {
              // Parse JSON se for string
              const fotos = typeof evento.fotos === 'string'
                ? JSON.parse(evento.fotos)
                : evento.fotos;

              return (
                <motion.div
                  key={evento.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="card card-hover"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-pink-500/20 rounded-lg">
                        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-pink-300">{evento.festaTradicional}</h3>
                        <p className="text-gray-400 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(evento.dataFeriado)}
                        </p>
                      </div>
                    </div>

                    {fotos && fotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {fotos.slice(0, 3).map((foto: string, fotoIndex: number) => (
                          <motion.div
                            key={fotoIndex}
                            whileHover={{ scale: 1.1 }}
                            className="aspect-square rounded-lg overflow-hidden bg-primary-medium/30"
                          >
                            <img
                              src={foto}
                              alt={`${evento.festaTradicional} - foto ${fotoIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
