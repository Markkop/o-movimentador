import { Fraunces, IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import { TooltipProvider } from "../components/ui/tooltip";
import { ThemeProvider } from "../ui/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-primary-var",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-secondary-var",
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-primary-condensed-var",
});

export const metadata = {
  title: "Movimentador",
  description: "Coach visual para sair do sedentarismo com micro-hábitos, tarefas e progresso.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${plexSans.variable} ${plexCondensed.variable} font-secondary antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
