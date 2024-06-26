import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home",
  description: "A custom start page for your browser created by Techlism",
  keywords : ["Techlism", "Startpage", "Browser", "Custom", "New Tab"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
