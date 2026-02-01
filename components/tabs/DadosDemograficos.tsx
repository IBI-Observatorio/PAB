'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DadosDemograficosData {
  percentualRural: number;
  percentualUrbano: number;
  percentualCatolico: number;
  percentualEspirita: number;
  percentualEvangelico: number;
  percentualSemReligiao: number;
  religiaoPredominante: string;
  taxaAlfabetizacao: number;
  principaisBairros: string | string[];
}

interface DadosDemograficosProps {
  data: DadosDemograficosData | null;
}

const COLORS_URBAN = ['#3B82F6', '#10B981'];
const COLORS_RELIGION = ['#8B5CF6', '#EC4899', '#F59E0B', '#6B7280'];

export default function DadosDemograficos({ data }: DadosDemograficosProps) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum dado disponível</p>
      </div>
    );
  }

  const urbanRuralData = [
    { name: 'Urbano', value: Number(data.percentualUrbano), percentage: Number(data.percentualUrbano) },
    { name: 'Rural', value: Number(data.percentualRural), percentage: Number(data.percentualRural) },
  ];

  const religionData = [
    { name: 'Católico', value: Number(data.percentualCatolico), percentage: Number(data.percentualCatolico) },
    { name: 'Espírita', value: Number(data.percentualEspirita), percentage: Number(data.percentualEspirita) },
    { name: 'Evangélico', value: Number(data.percentualEvangelico), percentage: Number(data.percentualEvangelico) },
    { name: 'Sem Religião', value: Number(data.percentualSemReligiao), percentage: Number(data.percentualSemReligiao) },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary-dark border border-primary-medium/30 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-gray-300">{payload[0].value.toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Divisão Urbana/Rural */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Divisão Urbana / Rural
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urbanRuralData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${Number(percentage).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {urbanRuralData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_URBAN[index % COLORS_URBAN.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-primary/30 rounded-lg p-4 border border-blue-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-300">Urbano</span>
                <span className="text-2xl font-bold text-blue-400">{Number(data.percentualUrbano).toFixed(2)}%</span>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-primary/30 rounded-lg p-4 border border-green-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-green-300">Rural</span>
                <span className="text-2xl font-bold text-green-400">{Number(data.percentualRural).toFixed(2)}%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Religião */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Religião Predominante
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={religionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={800}
                >
                  {religionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_RELIGION[index % COLORS_RELIGION.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-500/20 to-transparent rounded-lg p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-400 mb-1">Religião Mais Predominante</p>
              <p className="text-3xl font-bold text-purple-300">{data.religiaoPredominante}</p>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Católico</span>
                <span className="font-bold text-purple-400">{Number(data.percentualCatolico).toFixed(2)}%</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-pink-300">Espírita</span>
                <span className="font-bold text-pink-400">{Number(data.percentualEspirita).toFixed(2)}%</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-orange-300">Evangélico</span>
                <span className="font-bold text-orange-400">{Number(data.percentualEvangelico).toFixed(2)}%</span>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-primary/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sem Religião</span>
                <span className="font-bold text-gray-400">{Number(data.percentualSemReligiao).toFixed(2)}%</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Escolaridade */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card card-hover"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-lg">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm text-gray-400 mb-1">Taxa de Alfabetização</h3>
            <p className="text-3xl font-bold text-blue-400">{Number(data.taxaAlfabetizacao).toFixed(2)}%</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
