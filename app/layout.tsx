import type { Metadata } from 'next';
import Header from './components/layout/Header';
import './globals.css';

import '@fontsource/poppins/index.css';

export const metadata: Metadata = {
  title: 'Habit Nest',
  description: 'Stay on track with Habit Nest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
