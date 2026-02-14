import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaos Helper - Cortador de Mídias",
  description: "Corte e comprima imagens e vídeos em massa com processamento rápido",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
