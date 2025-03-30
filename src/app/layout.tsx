import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientWalletProvider } from './components/ClientWalletProvider';
import { ClientChakraProvider } from './components/ClientChakraProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solana Multi Token Sender",
  description: "Send multiple tokens on Solana blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientChakraProvider>
          <ClientWalletProvider>
            {children}
          </ClientWalletProvider>
        </ClientChakraProvider>
      </body>
    </html>
  );
}
