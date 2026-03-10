import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Api de projetos",
  description: "API de componentes de PDP",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
