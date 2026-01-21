import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Appointment Bot - Sistema de Agendamiento",
  description: "Sistema completo de chatbot para WhatsApp que permite agendar citas con integración a Google Sheets y Calendar. Ideal para peluquerías, clínicas, spas y cualquier negocio que necesite gestionar citas.",
  keywords: "whatsapp, chatbot, agendamiento, citas, google sheets, google calendar, baileys, negocios",
  authors: [{ name: "WhatsApp Appointment Bot" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#25D366" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}