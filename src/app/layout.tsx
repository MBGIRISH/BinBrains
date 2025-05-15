import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed due to module not found error
// import { GeistMono } from 'geist/font/mono'; // Removed due to module not found error
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const geistSans = GeistSans; // Removed

export const metadata: Metadata = {
  title: 'BinBrain - Smart Waste Management',
  description: 'Simulate and manage smart dustbins with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
