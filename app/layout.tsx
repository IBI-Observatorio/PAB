import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PAB - Informações Políticas',
  description: 'Webapp de informações políticas das cidades',
  manifest: '/manifest.json',
  themeColor: '#000022',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
