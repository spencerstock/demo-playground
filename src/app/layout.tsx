import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
