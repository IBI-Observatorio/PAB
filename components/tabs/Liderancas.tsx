'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

interface Lideranca {
  id: number;
  cidadeId: number;
  nomeLideranca: string;
  fotoLideranca?: string;
  nomeGestor: string;
  cargo: string;
  partido: string;
  historicoComPAB: string;
  votos2024: number;
  votosPrevistos2026?: string;
  dataVisitaGestor?: string;
}

interface LiderancasProps {
  data: Lideranca[];
  cidadeId?: number;
  onUpdate?: () => void;
}

const emptyForm: Omit<Lideranca, 'id'> = {
  cidadeId: 0,
  nomeLideranca: '',
  fotoLideranca: '',
  nomeGestor: '',
  cargo: '',
  partido: '',
  historicoComPAB: '',
  votos2024: 0,
  votosPrevistos2026: '',
  dataVisitaGestor: '',
};

export default function Liderancas({ data, cidadeId, onUpdate }: LiderancasProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Nao visitado';
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data invalida';
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const handleOpenForm = (lideranca?: Lideranca) => {
    if (lideranca) {
      setEditingId(lideranca.id);
      setFormData({
        cidadeId: lideranca.cidadeId,
        nomeLideranca: lideranca.nomeLideranca || '',
        fotoLideranca: lideranca.fotoLideranca || '',
        nomeGestor: lideranca.nomeGestor,
        cargo: lideranca.cargo,
        partido: lideranca.partido,
        historicoComPAB: lideranca.historicoComPAB,
        votos2024: lideranca.votos2024,
        votosPrevistos2026: lideranca.votosPrevistos2026,
        dataVisitaGestor: formatDateForInput(lideranca.dataVisitaGestor),
      });
      setPreviewUrl(lideranca.fotoLideranca || null);
    } else {
      setEditingId(null);
      setFormData({ ...emptyForm, cidadeId: cidadeId || 0 });
      setPreviewUrl(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setPreviewUrl(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview imediatamente
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, fotoLideranca: data.url }));
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao fazer upload');
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da imagem');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, fotoLideranca: '' }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `/api/liderancas/${editingId}` : '/api/liderancas';
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
        alert('Erro ao salvar lideranca');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar lideranca');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/liderancas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteConfirm(null);
        if (onUpdate) onUpdate();
        window.location.reload();
      } else {
        alert('Erro ao excluir lideranca');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao excluir lideranca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Liderancas
        </h2>
        {cidadeId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Lideranca
          </motion.button>
        )}
      </div>

      {(!data || data.length === 0) && !showForm ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma lideranca cadastrada</p>
          {cidadeId && (
            <button
              onClick={() => handleOpenForm()}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Adicionar primeira lideranca
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.map((lideranca, index) => (
            <motion.div
              key={lideranca.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card card-hover relative"
            >
              {/* Botoes de acao */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenForm(lideranca)}
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
                  onClick={() => setDeleteConfirm(lideranca.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-4 pr-20">
                  {lideranca.fotoLideranca ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500">
                      <Image
                        src={lideranca.fotoLideranca}
                        alt={lideranca.nomeLideranca || 'Lideranca'}
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

                {/* Historico */}
                <div className="bg-primary/30 rounded-lg p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-400 mb-1">Historico com PAB</p>
                  <p className="text-gray-300 leading-relaxed">{lideranca.historicoComPAB}</p>
                </div>

                {/* Estatisticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Votos 2024</p>
                    <p className="text-2xl font-bold text-blue-400">{lideranca.votos2024.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-primary/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Previstos 2026</p>
                    <p className="text-2xl font-bold text-green-400">{lideranca.votosPrevistos2026 || '-'}</p>
                  </div>
                </div>

                {/* Data de Visita */}
                <div className="flex items-center gap-3 bg-primary/30 rounded-lg p-4">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Ultima Visita do Gestor</p>
                    <p className="text-sm font-semibold text-yellow-300">{formatDate(lideranca.dataVisitaGestor)}</p>
                  </div>
                </div>
              </div>

              {/* Modal de confirmacao de exclusao */}
              <AnimatePresence>
                {deleteConfirm === lideranca.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center p-4"
                  >
                    <div className="text-center">
                      <p className="text-white mb-4">Tem certeza que deseja excluir esta lideranca?</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDelete(lideranca.id)}
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
              className="bg-primary-dark rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-purple-300">
                  {editingId ? 'Editar Lideranca' : 'Nova Lideranca'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome da Lideranca */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nome da Lideranca *
                    </label>
                    <input
                      type="text"
                      value={formData.nomeLideranca}
                      onChange={(e) => setFormData({ ...formData, nomeLideranca: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Nome da lideranca politica"
                      required
                    />
                  </div>

                  {/* Nome do Gestor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nome do Gestor *
                    </label>
                    <input
                      type="text"
                      value={formData.nomeGestor}
                      onChange={(e) => setFormData({ ...formData, nomeGestor: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Nome do gestor responsavel"
                      required
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Ex: Prefeito, Vereador, Deputado"
                      required
                    />
                  </div>

                  {/* Partido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Partido *
                    </label>
                    <input
                      type="text"
                      value={formData.partido}
                      onChange={(e) => setFormData({ ...formData, partido: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Ex: PSDB, PSD, MDB"
                      required
                    />
                  </div>

                  {/* Votos 2024 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Votos 2024
                    </label>
                    <input
                      type="number"
                      value={formData.votos2024}
                      onChange={(e) => setFormData({ ...formData, votos2024: parseInt(e.target.value) || 0 })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Votos Previstos 2026 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Votos Previstos 2026
                    </label>
                    <input
                      type="text"
                      value={formData.votosPrevistos2026 || ''}
                      onChange={(e) => setFormData({ ...formData, votosPrevistos2026: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Ex: 5000 ou 5000-7000"
                    />
                  </div>

                  {/* Data da Ultima Visita */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Ultima Visita do Gestor
                    </label>
                    <input
                      type="date"
                      value={formData.dataVisitaGestor}
                      onChange={(e) => setFormData({ ...formData, dataVisitaGestor: e.target.value })}
                      className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Data da Ultima Visita - movido para cima */}
                </div>

                {/* Upload de Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Foto da Lideranca
                  </label>
                  <div className="flex items-start gap-4">
                    {/* Preview da foto */}
                    <div className="relative">
                      {(previewUrl || formData.fotoLideranca) ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500">
                          <Image
                            src={previewUrl || formData.fotoLideranca || ''}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary border-2 border-dashed border-primary-medium/50 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Botoes de upload */}
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{uploading ? 'Enviando...' : 'Escolher Foto'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {(previewUrl || formData.fotoLideranca) && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remover Foto</span>
                        </button>
                      )}
                      <p className="text-xs text-gray-500">JPG, PNG, GIF ou WEBP. Max 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Historico com PAB */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Historico com PAB *
                  </label>
                  <textarea
                    value={formData.historicoComPAB}
                    onChange={(e) => setFormData({ ...formData, historicoComPAB: e.target.value })}
                    className="w-full bg-primary border border-primary-medium/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[120px]"
                    placeholder="Descreva o historico de relacionamento com o PAB..."
                    required
                  />
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
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
