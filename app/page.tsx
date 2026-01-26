'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelector from '@/components/CitySelector';
import PerfilCidade from '@/components/tabs/PerfilCidade';
import DadosDemograficos from '@/components/tabs/DadosDemograficos';
import CalendarioEventos from '@/components/tabs/CalendarioEventos';
import Votacao from '@/components/tabs/Votacao';
import Emendas from '@/components/tabs/Emendas';
import Liderancas from '@/components/tabs/Liderancas';
import Pautas from '@/components/tabs/Pautas';

const tabs = [
  { id: 1, name: 'Perfil da Cidade', icon: '🏙️' },
  { id: 2, name: 'Dados Demográficos', icon: '📊' },
  { id: 3, name: 'Eventos', icon: '🎉' },
  { id: 4, name: 'Votação', icon: '🗳️' },
  { id: 5, name: 'Emendas', icon: '💰' },
  { id: 6, name: 'Lideranças', icon: '👥' },
  { id: 7, name: 'Pautas', icon: '⚠️' },
];

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [cityData, setCityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      fetchCityData();
    }
  }, [selectedCity]);

  const fetchCityData = async () => {
    if (!selectedCity) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cidades/${selectedCity}`);
      const data = await response.json();
      setCityData(data);
    } catch (error) {
      console.error('Erro ao carregar dados da cidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary-medium border-t-white rounded-full"
          />
        </div>
      );
    }

    if (!cityData) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Selecione uma cidade para visualizar os dados</p>
        </div>
      );
    }

    switch (activeTab) {
      case 1:
        return <PerfilCidade data={cityData} />;
      case 2:
        return <DadosDemograficos data={cityData.dadosDemograficos} />;
      case 3:
        return <CalendarioEventos data={cityData.eventosProximos || []} />;
      case 4:
        return <Votacao data={{ dadosVotacao: cityData.dadosVotacao, deputadosFederais: cityData.deputadosFederais }} />;
      case 5:
        return <Emendas data={cityData.emendas || []} />;
      case 6:
        return <Liderancas data={cityData.liderancas || []} />;
      case 7:
        return <Pautas data={cityData.pautas || []} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PAB Informações Políticas
              </h1>
              <p className="text-gray-400 text-lg">Sistema de Gestão de Dados Municipais</p>
            </div>
            <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-primary-medium scrollbar-track-primary">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
