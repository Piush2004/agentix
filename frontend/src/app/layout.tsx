import type { Metadata } from "next";
import { Inter, Space_Grotesk } from 'next/font/google';
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: "Agentix • Premium AI Operating System",
  description: "Agentix is an AI-powered enterprise workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans bg-background text-text-primary h-screen w-screen overflow-hidden">
        <AuthProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
