import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from './components/layout/Header';
import './globals.css';

import '@fontsource/poppins/index.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Habit Nest',
  description: 'Stay on track with your habits',
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
