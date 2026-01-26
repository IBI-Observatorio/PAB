'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface City {
  id: number;
  nome: string;
}

interface CitySelectorProps {
  selectedCity: number | null;
  onCityChange: (cityId: number) => void;
}

export default function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cidades');
      const data = await response.json();
      setCities(data);
      if (data.length > 0 && !selectedCity) {
        onCityChange(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCityName = cities.find(c => c.id === selectedCity)?.nome || 'Selecione uma cidade';

  if (loading) {
    return (
      <div className="animate-pulse bg-primary-dark/50 h-12 rounded-lg w-64"></div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-medium hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-3 min-w-[250px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="flex-1 text-left">{selectedCityName}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full bg-primary-dark border border-primary-medium/30 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          {cities.map((city) => (
            <motion.button
              key={city.id}
              whileHover={{ backgroundColor: 'rgba(0, 35, 102, 0.3)' }}
              onClick={() => {
                onCityChange(city.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-6 py-3 transition-all duration-200 ${
                selectedCity === city.id
                  ? 'bg-primary-medium text-white font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {city.nome}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
