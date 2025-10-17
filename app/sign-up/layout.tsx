import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar",
  description: "Formulário de cadastro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
