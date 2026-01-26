'use client';

import { motion } from 'framer-motion';

interface Emenda {
  id: number;
  codigoEmenda?: string;
  numeroEmenda?: string;
  anoEmenda?: number;
  tipoEmenda?: string;
  autor?: string;
  localidadeGasto?: string;
  funcao?: string;
  subfuncao?: string;
  descricao: string;
  entidadeBeneficiada: string;
  valorEmenda: number;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
}

interface EmendasProps {
  data: Emenda[];
}

export default function Emendas({ data }: EmendasProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhuma emenda cadastrada</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalEmendas = data.reduce((sum, emenda) => sum + Number(emenda.valorEmenda), 0);
  const totalEmpenhado = data.reduce((sum, emenda) => sum + Number(emenda.valorEmpenhado), 0);
  const totalLiquidado = data.reduce((sum, emenda) => sum + Number(emenda.valorLiquidado || 0), 0);
  const totalPago = data.reduce((sum, emenda) => sum + Number(emenda.valorPago || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Emendas do PAB
        </h2>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card bg-gradient-to-br from-green-500/10 to-transparent border-green-500/30"
        >
          <h3 className="text-sm text-gray-400 mb-2">Total em Emendas</h3>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(totalEmendas)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30"
        >
          <h3 className="text-sm text-gray-400 mb-2">Empenhado</h3>
          <p className="text-3xl font-bold text-blue-400">{formatCurrency(totalEmpenhado)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30"
        >
          <h3 className="text-sm text-gray-400 mb-2">Liquidado</h3>
          <p className="text-3xl font-bold text-yellow-400">{formatCurrency(totalLiquidado)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30"
        >
          <h3 className="text-sm text-gray-400 mb-2">Pago</h3>
          <p className="text-3xl font-bold text-purple-400">{formatCurrency(totalPago)}</p>
        </motion.div>
      </div>

      {/* Lista de Emendas */}
      <div className="space-y-4">
        {data.map((emenda, index) => (
          <motion.div
            key={emenda.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="card card-hover"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-green-300">{emenda.entidadeBeneficiada}</h3>
                    {emenda.tipoEmenda && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                        {emenda.tipoEmenda}
                      </span>
                    )}
                    {emenda.anoEmenda && (
                      <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-300 rounded-full">
                        {emenda.anoEmenda}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed">{emenda.descricao}</p>
                  {emenda.localidadeGasto && (
                    <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {emenda.localidadeGasto}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-primary-medium/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Valor Total</p>
                    <p className="text-lg font-bold text-green-400">{formatCurrency(Number(emenda.valorEmenda))}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Empenhado</p>
                    <p className="text-lg font-bold text-blue-400">{formatCurrency(Number(emenda.valorEmpenhado))}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Liquidado</p>
                    <p className="text-lg font-bold text-yellow-400">{formatCurrency(Number(emenda.valorLiquidado || 0))}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pago</p>
                    <p className="text-lg font-bold text-purple-400">{formatCurrency(Number(emenda.valorPago || 0))}</p>
                  </div>
                </div>
              </div>

              {/* Barras de Progresso */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Empenhado</span>
                    <span className="text-blue-300 font-semibold">
                      {Number(emenda.valorEmenda) > 0
                        ? ((Number(emenda.valorEmpenhado) / Number(emenda.valorEmenda)) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-primary/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Number(emenda.valorEmenda) > 0
                          ? (Number(emenda.valorEmpenhado) / Number(emenda.valorEmenda)) * 100
                          : 0}%`
                      }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Pago</span>
                    <span className="text-purple-300 font-semibold">
                      {Number(emenda.valorEmenda) > 0
                        ? ((Number(emenda.valorPago || 0) / Number(emenda.valorEmenda)) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-primary/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Number(emenda.valorEmenda) > 0
                          ? (Number(emenda.valorPago || 0) / Number(emenda.valorEmenda)) * 100
                          : 0}%`
                      }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
