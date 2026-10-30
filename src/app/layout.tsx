import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Bit } from "@/components/site/Bit";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-archivo" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.suez.co.ao"),
  title: { default: "Suez Academy · Formação tech em Angola", template: "%s · Suez Academy" },
  description:
    "A escola prática da Suez Inovações: engenharia de software, DevOps e cloud, redes, cibersegurança, product management e carreira. Luanda, presencial e online.",
  openGraph: {
    title: "Suez Academy",
    description: "Aprende a programar o futuro. Formação prática em tecnologia, em Luanda.",
    images: ["/og-image.jpg"],
    locale: "pt_AO",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { themeColor: "#050a14" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <a href="#conteudo" className="btn fixed left-4 top-4 z-[60] -translate-y-24 focus:translate-y-0">
          Saltar para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <Bit />
      </body>
    </html>
  );
}
