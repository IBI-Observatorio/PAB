'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerfilCidadeData {
  id: number;
  nome: string;
  gentilico: string;
  dataFundacao: string;
  dataAniversario: string;
  breveHistorico: string;
  padroeiro: string;
  pratoTipico: string;
  fotoPerfil?: string;
  fotoBackground?: string;
}

interface PerfilCidadeProps {
  data: PerfilCidadeData | null;
}

export default function PerfilCidade({ data }: PerfilCidadeProps) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum dado disponível</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header com Background e Foto de Perfil */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative h-64 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: data.fotoBackground
              ? `url(${data.fotoBackground})`
              : 'linear-gradient(135deg, #002366 0%, #001F3F 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
        </div>

        {/* Foto de Perfil e Nome */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-primary-dark">
              {data.fotoPerfil ? (
                <Image
                  src={data.fotoPerfil}
                  alt={data.nome || 'Cidade'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary-medium">
                  {data.nome?.charAt(0) || '?'}
                </div>
              )}
            </div>
          </motion.div>
          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-bold text-white mb-1">{data.nome || 'Cidade'}</h1>
            <p className="text-xl text-gray-300">{data.gentilico || ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Informações em Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card card-hover"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-medium/30 rounded-lg">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Data de Fundação / Emancipação</h3>
              <p className="text-xl font-semibold">{formatDate(data.dataFundacao)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card card-hover"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-medium/30 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Aniversário da Cidade</h3>
              <p className="text-xl font-semibold">{formatDate(data.dataAniversario)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card card-hover"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-medium/30 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Padroeiro(a) da Cidade</h3>
              <p className="text-xl font-semibold">{data.padroeiro}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card card-hover"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-medium/30 rounded-lg">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 mb-1">Prato Típico ou Produto Tradicional</h3>
              <p className="text-xl font-semibold">{data.pratoTipico}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Histórico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-medium/30 rounded-lg">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Breve Histórico / Origem</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{data.breveHistorico}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
