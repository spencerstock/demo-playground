import type { Metadata } from 'next';
import './globals.css';
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: 'Base Demo Playground',
  description: 'Build and preview Base blockchain product integrations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
