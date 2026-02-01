'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface City {
  id: number;
  nome: string;
}

interface RelatoriosProps {
  currentCityId: number | null;
}

const availableTabs = [
  { id: 'perfil', name: 'Perfil da Cidade', icon: '🏙️' },
  { id: 'demograficos', name: 'Dados Demográficos', icon: '📊' },
  { id: 'eventos', name: 'Calendário de Eventos', icon: '🎉' },
  { id: 'votacao', name: 'Votação', icon: '🗳️' },
  { id: 'emendas', name: 'Emendas do PAB', icon: '💰' },
  { id: 'liderancas', name: 'Lideranças', icon: '👥' },
  { id: 'pautas', name: 'Pautas', icon: '⚠️' },
];

export default function Relatorios({ currentCityId }: RelatoriosProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(currentCityId);
  const [selectedTabs, setSelectedTabs] = useState<string[]>(availableTabs.map(t => t.id));
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [cityData, setCityData] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch('/api/cidades');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  }, []);

  const fetchCityData = useCallback(async () => {
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
  }, [selectedCity]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    if (currentCityId) {
      setSelectedCity(currentCityId);
    }
  }, [currentCityId]);

  useEffect(() => {
    if (selectedCity) {
      fetchCityData();
    }
  }, [selectedCity, fetchCityData]);

  const toggleTab = (tabId: string) => {
    setSelectedTabs(prev =>
      prev.includes(tabId)
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const selectAllTabs = () => {
    setSelectedTabs(availableTabs.map(t => t.id));
  };

  const deselectAllTabs = () => {
    setSelectedTabs([]);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para carregar imagem como base64
  const loadImageAsBase64 = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataURL);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => {
        resolve(null);
      };
      // Timeout de 5 segundos
      setTimeout(() => resolve(null), 5000);
      img.src = url;
    });
  };

  // Pré-carregar todas as imagens das lideranças
  const preloadLiderancaImages = async (liderancas: any[]): Promise<Map<number, string>> => {
    const imageMap = new Map<number, string>();

    const loadPromises = liderancas.map(async (lider) => {
      if (lider.fotoLideranca) {
        const base64 = await loadImageAsBase64(lider.fotoLideranca);
        if (base64) {
          imageMap.set(lider.id, base64);
        }
      }
    });

    await Promise.all(loadPromises);
    return imageMap;
  };

  const generatePDF = async () => {
    if (!cityData || selectedTabs.length === 0) return;

    setGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Header
      pdf.setFillColor(0, 35, 102);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Relatório - ${cityData.nome || 'Cidade'}`, margin, 25);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, margin, 35);

      yPosition = 50;

      // Perfil da Cidade
      if (selectedTabs.includes('perfil')) {
        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Perfil da Cidade', margin, yPosition);
        yPosition += 10;

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');

        const perfilInfo = [
          `Nome: ${cityData.nome || 'Não informado'}`,
          `Gentílico: ${cityData.gentilico || 'Não informado'}`,
          `Data de Fundação: ${cityData.dataFundacao ? formatDate(cityData.dataFundacao) : 'Não informada'}`,
          `Aniversário: ${cityData.dataAniversario ? formatDate(cityData.dataAniversario) : 'Não informado'}`,
          `Padroeiro: ${cityData.padroeiro || 'Não informado'}`,
          `Prato Típico: ${cityData.pratoTipico || 'Não informado'}`,
        ];

        perfilInfo.forEach(info => {
          pdf.text(info, margin, yPosition);
          yPosition += 7;
        });

        if (cityData.breveHistorico) {
          yPosition += 3;
          pdf.setFont('helvetica', 'bold');
          pdf.text('Breve Histórico:', margin, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');

          const historico = pdf.splitTextToSize(cityData.breveHistorico, pageWidth - 2 * margin);
          historico.forEach((line: string) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
        }

        yPosition += 10;
      }

      // Dados Demográficos
      if (selectedTabs.includes('demograficos') && cityData.dadosDemograficos) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dados Demográficos', margin, yPosition);
        yPosition += 10;

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');

        const demo = cityData.dadosDemograficos;
        const demoInfo = [
          `População Urbana: ${Number(demo.percentualUrbano).toFixed(2)}%`,
          `População Rural: ${Number(demo.percentualRural).toFixed(2)}%`,
          `Taxa de Alfabetização: ${Number(demo.taxaAlfabetizacao).toFixed(2)}%`,
          `Religião Predominante: ${demo.religiaoPredominante}`,
          `  - Católicos: ${Number(demo.percentualCatolico).toFixed(2)}%`,
          `  - Evangélicos: ${Number(demo.percentualEvangelico).toFixed(2)}%`,
          `  - Espíritas: ${Number(demo.percentualEspirita).toFixed(2)}%`,
          `  - Sem Religião: ${Number(demo.percentualSemReligiao).toFixed(2)}%`,
        ];

        demoInfo.forEach(info => {
          pdf.text(info, margin, yPosition);
          yPosition += 7;
        });

        yPosition += 10;
      }

      // Eventos
      if (selectedTabs.includes('eventos') && cityData.eventosProximos?.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Calendário de Eventos', margin, yPosition);
        yPosition += 10;

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);

        cityData.eventosProximos.forEach((evento: any) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.text(`• ${evento.festa}`, margin, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          if (evento.dataFeriado) {
            pdf.text(`  Data: ${formatDate(evento.dataFeriado)}`, margin, yPosition);
            yPosition += 6;
          }
        });

        yPosition += 10;
      }

      // Votação
      if (selectedTabs.includes('votacao') && cityData.dadosVotacao) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dados de Votação', margin, yPosition);
        yPosition += 10;

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');

        const votacao = cityData.dadosVotacao;
        const votacaoInfo = [
          `Votos Presidente 2022: ${votacao.votosPresidente2022?.toLocaleString('pt-BR') || 'N/A'}`,
          `Votos Governador 2022: ${votacao.votosGovernador2022?.toLocaleString('pt-BR') || 'N/A'}`,
        ];

        votacaoInfo.forEach(info => {
          pdf.text(info, margin, yPosition);
          yPosition += 7;
        });

        if (cityData.deputadosFederais?.length > 0) {
          yPosition += 3;
          pdf.setFont('helvetica', 'bold');
          pdf.text('Deputados Federais Mais Votados:', margin, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');

          cityData.deputadosFederais.slice(0, 5).forEach((dep: any) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(`• ${dep.nomeUrna} (${dep.partido}) - ${dep.votos2022?.toLocaleString('pt-BR') || 0} votos`, margin, yPosition);
            yPosition += 6;
          });
        }

        yPosition += 10;
      }

      // Emendas
      if (selectedTabs.includes('emendas') && cityData.emendas?.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Emendas do PAB', margin, yPosition);
        yPosition += 10;

        const totalEmendas = cityData.emendas.reduce((sum: number, e: any) => sum + Number(e.valorEmenda), 0);
        const totalEmpenhado = cityData.emendas.reduce((sum: number, e: any) => sum + Number(e.valorEmpenhado), 0);
        const totalPago = cityData.emendas.reduce((sum: number, e: any) => sum + Number(e.valorPago || 0), 0);

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Resumo Financeiro:', margin, yPosition);
        yPosition += 7;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total em Emendas: ${formatCurrency(totalEmendas)}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Total Empenhado: ${formatCurrency(totalEmpenhado)}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Total Pago: ${formatCurrency(totalPago)}`, margin, yPosition);
        yPosition += 10;

        pdf.setFont('helvetica', 'bold');
        pdf.text('Detalhamento:', margin, yPosition);
        yPosition += 7;
        pdf.setFont('helvetica', 'normal');

        cityData.emendas.forEach((emenda: any, index: number) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFont('helvetica', 'bold');
          pdf.text(`${index + 1}. ${emenda.entidadeBeneficiada}`, margin, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');

          const descricao = pdf.splitTextToSize(emenda.descricao, pageWidth - 2 * margin - 5);
          descricao.slice(0, 2).forEach((line: string) => {
            pdf.text(`   ${line}`, margin, yPosition);
            yPosition += 5;
          });

          pdf.text(`   Valor: ${formatCurrency(Number(emenda.valorEmenda))} | Pago: ${formatCurrency(Number(emenda.valorPago || 0))}`, margin, yPosition);
          yPosition += 8;
        });

        yPosition += 5;
      }

      // Lideranças
      if (selectedTabs.includes('liderancas') && cityData.liderancas?.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Lideranças', margin, yPosition);
        yPosition += 10;

        // Pré-carregar todas as imagens das lideranças
        const liderancaImages = await preloadLiderancaImages(cityData.liderancas);

        for (const lider of cityData.liderancas) {
          // Verificar se precisa de nova página (espaço para foto + conteúdo)
          if (yPosition > pageHeight - 80) {
            pdf.addPage();
            yPosition = margin;
          }

          const photoSize = 35; // Tamanho da foto em mm
          const photoX = margin;
          const photoY = yPosition;
          const textX = margin + photoSize + 8; // Texto começa após a foto + 8mm de margem
          const textWidth = pageWidth - textX - margin;
          let textY = photoY + 4; // 12px (~4mm) abaixo do início da foto

          // Verificar se temos a imagem pré-carregada
          const imageBase64 = liderancaImages.get(lider.id);

          if (imageBase64) {
            try {
              // Adicionar a imagem real ao PDF
              pdf.addImage(imageBase64, 'JPEG', photoX, photoY, photoSize, photoSize);
              // Adicionar borda
              pdf.setDrawColor(150, 150, 150);
              pdf.roundedRect(photoX, photoY, photoSize, photoSize, 3, 3, 'S');
            } catch {
              // Se falhar, desenhar placeholder
              pdf.setDrawColor(150, 150, 150);
              pdf.setFillColor(240, 240, 240);
              pdf.roundedRect(photoX, photoY, photoSize, photoSize, 3, 3, 'FD');
              pdf.setFontSize(8);
              pdf.setTextColor(120, 120, 120);
              pdf.text('Sem foto', photoX + photoSize/2, photoY + photoSize/2, { align: 'center' });
            }
          } else {
            // Placeholder sem foto
            pdf.setDrawColor(150, 150, 150);
            pdf.setFillColor(240, 240, 240);
            pdf.roundedRect(photoX, photoY, photoSize, photoSize, 3, 3, 'FD');
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text('Sem foto', photoX + photoSize/2, photoY + photoSize/2, { align: 'center' });
          }

          // Nome da cidade - Arial Black (usando helvetica bold como substituto) tamanho 28
          pdf.setTextColor(0, 35, 102);
          pdf.setFontSize(18); // Reduzido para caber
          pdf.setFont('helvetica', 'bold');
          const cidadeNome = lider.cidade?.nome || cityData.nome || 'Cidade';
          pdf.text(cidadeNome, textX, textY);
          textY += 8;

          // Nome da Liderança - Arial Black tamanho 11
          pdf.setTextColor(40, 40, 40);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          const nomeLider = lider.nomeLideranca || 'Nome não informado';
          pdf.text(nomeLider, textX, textY);
          textY += 5;

          // Cargo + Partido na mesma linha
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);
          pdf.text(`${lider.cargo || 'N/A'} - ${lider.partido || 'N/A'}`, textX, textY);
          textY += 5;

          // Nome do Gestor
          pdf.text(`Gestor: ${lider.nomeGestor || 'N/A'}`, textX, textY);
          textY += 5;

          // Posicionar abaixo da foto com 12px (~4mm) de distância
          yPosition = photoY + photoSize + 9;

          // Layout: Histórico na metade esquerda, Votos na metade direita
          pdf.setFontSize(10);
          pdf.setTextColor(60, 60, 60);

          const halfPage = pageWidth / 2;
          const historicoMaxWidth = halfPage - margin - 5; // Metade esquerda
          const votosX = halfPage + 5; // Metade direita começa aqui

          // Guardar posição inicial para alinhar os votos
          const votosStartY = yPosition;

          // Histórico com o PAB (lado esquerdo)
          if (lider.historicoComPAB) {
            pdf.setFont('helvetica', 'bold');
            pdf.text('Histórico com o PAB:', margin, yPosition);
            pdf.setFont('helvetica', 'normal');
            yPosition += 5;

            // Quebrar o texto do histórico em múltiplas linhas (metade da página)
            const historicoLines = pdf.splitTextToSize(lider.historicoComPAB, historicoMaxWidth);
            historicoLines.forEach((line: string, index: number) => {
              if (index < 4) { // Limitar a 4 linhas
                pdf.text(line, margin, yPosition);
                yPosition += 4;
              }
            });
            if (historicoLines.length > 4) {
              pdf.text('...', margin, yPosition);
              yPosition += 4;
            }
          } else {
            pdf.text('Histórico com o PAB: N/A', margin, yPosition);
            yPosition += 5;
          }

          // Votos 2024 e 2026 (lado direito, alinhados verticalmente)
          pdf.setFont('helvetica', 'bold');
          pdf.text('Votos 2024:', votosX, votosStartY);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${lider.votos2024?.toLocaleString('pt-BR') || '0'}`, votosX, votosStartY + 5);

          pdf.setFont('helvetica', 'bold');
          pdf.text('Votos 2026:', votosX, votosStartY + 12);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${lider.votosPrevistos2026 || '-'}`, votosX, votosStartY + 17);

          // Última visita do gestor (abaixo do histórico)
          yPosition += 3;
          const visitaText = lider.dataVisitaGestor ? `Última Visita do Gestor: ${formatDate(lider.dataVisitaGestor)}` : 'Última Visita do Gestor: Não registrada';
          pdf.text(visitaText, margin, yPosition);
          yPosition += 10;
        }

        yPosition += 5;
      }

      // Pautas
      if (selectedTabs.includes('pautas') && cityData.pautas?.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setTextColor(0, 35, 102);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Pautas', margin, yPosition);
        yPosition += 10;

        pdf.setTextColor(60, 60, 60);
        pdf.setFontSize(11);

        cityData.pautas.forEach((pauta: any) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFont('helvetica', 'bold');
          const titulo = pdf.splitTextToSize(`• ${pauta.titulo}`, pageWidth - 2 * margin);
          titulo.forEach((line: string) => {
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });

          pdf.setFont('helvetica', 'normal');
          pdf.text(`  Urgência: ${pauta.urgencia}/5 | Status: ${pauta.status || 'Pendente'}`, margin, yPosition);
          yPosition += 8;
        });
      }

      // Footer em todas as páginas
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(9);
        pdf.text(`PAB - Sistema de Gestão de Dados Municipais | Página ${i} de ${totalPages}`, margin, pageHeight - 6);
      }

      // Salvar PDF
      const nomeArquivo = cityData.nome ? cityData.nome.replace(/\s+/g, '_') : 'Cidade';
      pdf.save(`Relatorio_${nomeArquivo}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-3xl font-bold">Gerar Relatório em PDF</h2>
      </div>

      {/* Seleção de Cidade */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Selecione a Cidade
        </h3>

        <select
          value={selectedCity || ''}
          onChange={(e) => setSelectedCity(Number(e.target.value))}
          className="w-full bg-primary-dark border border-primary-medium/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Selecione uma cidade...</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.nome}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Seleção de Abas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Selecione as Seções do Relatório
          </h3>
          <div className="flex gap-2">
            <button
              onClick={selectAllTabs}
              className="text-sm px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Selecionar Todas
            </button>
            <button
              onClick={deselectAllTabs}
              className="text-sm px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Limpar Seleção
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTabs.map((tab) => (
            <motion.label
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                selectedTabs.includes(tab.id)
                  ? 'bg-blue-500/20 border border-blue-500/50'
                  : 'bg-primary-dark/50 border border-primary-medium/30 hover:border-primary-medium/50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTabs.includes(tab.id)}
                onChange={() => toggleTab(tab.id)}
                className="w-5 h-5 rounded border-primary-medium bg-primary-dark text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className="text-2xl">{tab.icon}</span>
              <span className={`font-medium ${selectedTabs.includes(tab.id) ? 'text-white' : 'text-gray-400'}`}>
                {tab.name}
              </span>
            </motion.label>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-400">
          {selectedTabs.length} de {availableTabs.length} seções selecionadas
        </p>
      </motion.div>

      {/* Preview e Botão de Gerar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Resumo do Relatório
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 border-4 border-primary-medium border-t-white rounded-full"
            />
          </div>
        ) : selectedCity && cityData ? (
          <div className="space-y-4">
            <div className="bg-primary-dark/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-medium/30 flex items-center justify-center text-2xl font-bold">
                  {cityData.nome ? cityData.nome.charAt(0) : '?'}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{cityData.nome || 'Cidade'}</h4>
                  <p className="text-gray-400">{cityData.gentilico || ''}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-primary-dark/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-400">{cityData.emendas?.length || 0}</p>
                <p className="text-xs text-gray-400">Emendas</p>
              </div>
              <div className="bg-primary-dark/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-400">{cityData.liderancas?.length || 0}</p>
                <p className="text-xs text-gray-400">Lideranças</p>
              </div>
              <div className="bg-primary-dark/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-400">{cityData.eventosProximos?.length || 0}</p>
                <p className="text-xs text-gray-400">Eventos</p>
              </div>
              <div className="bg-primary-dark/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-400">{cityData.pautas?.length || 0}</p>
                <p className="text-xs text-gray-400">Pautas</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePDF}
              disabled={generating || selectedTabs.length === 0}
              className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                generating || selectedTabs.length === 0
                  ? 'bg-gray-500/30 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              }`}
            >
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                  />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Gerar Relatório em PDF
                </>
              )}
            </motion.button>

            {selectedTabs.length === 0 && (
              <p className="text-center text-yellow-400 text-sm">
                Selecione pelo menos uma seção para gerar o relatório.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400">Selecione uma cidade para visualizar o resumo e gerar o relatório</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
