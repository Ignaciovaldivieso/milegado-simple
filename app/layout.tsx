// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MiLegado - Testamentos Digitales en Chile",
  description: "Crea tu testamento en 15 minutos. Simple, rápido y válido en Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NavBar />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2025 MiLegado. Proyecto de Título - Universidad Gabriela Mistral </p>
            <p className="text-gray-400 text-sm mt-2">
              Este es un prototipo educativo. Consulte con un abogado para casos reales.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}