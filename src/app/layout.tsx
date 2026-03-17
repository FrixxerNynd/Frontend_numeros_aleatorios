import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casino Unificado - Experiencia Premium",
  description: "La mejor plataforma de juegos de casino con arquitectura hexagonal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <Navbar />
        <main className="pt-24 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
