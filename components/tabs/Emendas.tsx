'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Emenda {
  id: number;
  cidadeId: number;
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
  cidadeId?: number;
  onUpdate?: () => void;
}

const emptyForm: Omit<Emenda, 'id'> = {
  cidadeId: 0,
  codigoEmenda: '',
  numeroEmenda: '',
  anoEmenda: new Date().getFullYear(),
  tipoEmenda: '',
  autor: '',
  localidadeGasto: '',
  funcao: '',
  subfuncao: '',
  descricao: '',
  entidadeBeneficiada: '',
  valorEmenda: 0,
  valorEmpenhado: 0,
  valorLiquidado: 0,
  valorPago: 0,
};

const tiposEmenda = [
  'Individual',
  'Bancada',
  'Comissao',
  'Relator',
];

export default function Emendas({ data, cidadeId, onUpdate }: EmendasProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleOpenForm = (emenda?: Emenda) => {
    if (emenda) {
      setEditingId(emenda.id);
      setFormData({
        cidadeId: emenda.cidadeId,
        codigoEmenda: emenda.codigoEmenda || '',
        numeroEmenda: emenda.numeroEmenda || '',
        anoEmenda: emenda.anoEmenda || new Date().getFullYear(),
        tipoEmenda: emenda.tipoEmenda || '',
        autor: emenda.autor || '',
        localidadeGasto: emenda.localidadeGasto || '',
        funcao: emenda.funcao || '',
        subfuncao: emenda.subfuncao || '',
        descricao: emenda.descricao,
        entidadeBeneficiada: emenda.entidadeBeneficiada,
        valorEmenda: emenda.valorEmenda,
        valorEmpenhado: emenda.valorEmpenhado,
        valorLiquidado: emenda.valorLiquidado,
        valorPago: emenda.valorPago,
      });
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, cidadeId: cidadeId || 0 });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/emendas/${editingId}` : '/api/emendas';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseForm();
        if (onUpdate) onUpdate();
        window.location.reload();
      } else {
        alert('Erro ao salvar emenda');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar emenda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emendas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteConfirm(null);
        if (onUpdate) onUpdate();
        window.location.reload();
      } else {
        alert('Erro ao excluir emenda');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir emenda');
    } finally {
      setLoading(false);
    }
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
        {cidadeId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Emenda
          </motion.button>
        )}
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

      {(!data || data.length === 0) && !showForm ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma emenda cadastrada</p>
          {cidadeId && (
            <button
              onClick={() => handleOpenForm()}
              className="mt-4 text-green-400 hover:text-green-300 underline"
            >
              Adicionar primeira emenda
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((emenda, index) => (
            <motion.div
              key={emenda.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="card card-hover relative"
            >
              {/* Botoes de acao */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenForm(emenda)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDeleteConfirm(emenda.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 pr-24">
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
                    {emenda.autor && (
                      <p className="text-sm text-gray-400 mt-1">Autor: {emenda.autor}</p>
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

              {/* Modal de confirmacao de exclusao */}
              <AnimatePresence>
                {deleteConfirm === emenda.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center p-4 z-20"
                  >
                    <div className="text-center">
                      <p className="text-white mb-4">Tem certeza que deseja excluir esta emenda?</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDelete(emenda.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          {loading ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Formulario */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-primary-dark rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-green-300">
                  {editingId ? 'Editar Emenda' : 'Nova Emenda'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-primary-medium/30 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informacoes Basicas */}
                <div className="bg-primary/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Informacoes Basicas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Codigo da Emenda
                      </label>
                      <input
                        type="text"
                        value={formData.codigoEmenda}
                        onChange={(e) => setFormData({ ...formData, codigoEmenda: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Ex: 123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Numero da Emenda
                      </label>
                      <input
                        type="text"
                        value={formData.numeroEmenda}
                        onChange={(e) => setFormData({ ...formData, numeroEmenda: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Ex: 001/2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Ano
                      </label>
                      <input
                        type="number"
                        value={formData.anoEmenda}
                        onChange={(e) => setFormData({ ...formData, anoEmenda: parseInt(e.target.value) || new Date().getFullYear() })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        min="2000"
                        max="2100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Tipo de Emenda
                      </label>
                      <select
                        value={formData.tipoEmenda}
                        onChange={(e) => setFormData({ ...formData, tipoEmenda: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                      >
                        <option value="">Selecione...</option>
                        {tiposEmenda.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Autor
                      </label>
                      <input
                        type="text"
                        value={formData.autor}
                        onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Nome do autor"
                      />
                    </div>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="bg-primary/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Detalhes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Entidade Beneficiada *
                      </label>
                      <input
                        type="text"
                        value={formData.entidadeBeneficiada}
                        onChange={(e) => setFormData({ ...formData, entidadeBeneficiada: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Nome da entidade"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Localidade do Gasto
                      </label>
                      <input
                        type="text"
                        value={formData.localidadeGasto}
                        onChange={(e) => setFormData({ ...formData, localidadeGasto: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Municipio/Localidade"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Funcao
                      </label>
                      <input
                        type="text"
                        value={formData.funcao}
                        onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Funcao orcamentaria"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Subfuncao
                      </label>
                      <input
                        type="text"
                        value={formData.subfuncao}
                        onChange={(e) => setFormData({ ...formData, subfuncao: e.target.value })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Subfuncao orcamentaria"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Descricao *
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors min-h-[100px]"
                      placeholder="Descreva a emenda..."
                      required
                    />
                  </div>
                </div>

                {/* Valores */}
                <div className="bg-primary/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Valores (R$)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Valor da Emenda *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.valorEmenda}
                        onChange={(e) => setFormData({ ...formData, valorEmenda: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="0,00"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Valor Empenhado
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.valorEmpenhado}
                        onChange={(e) => setFormData({ ...formData, valorEmpenhado: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="0,00"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Valor Liquidado
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.valorLiquidado}
                        onChange={(e) => setFormData({ ...formData, valorLiquidado: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="0,00"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Valor Pago
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.valorPago}
                        onChange={(e) => setFormData({ ...formData, valorPago: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="0,00"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Botoes */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingId ? 'Atualizar' : 'Cadastrar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
