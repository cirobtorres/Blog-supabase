import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Formulário de log in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
