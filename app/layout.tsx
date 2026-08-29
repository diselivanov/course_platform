import { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Layout from '@/app/components/Layout';
import './globals.scss';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    template: 'Wincode - %s',
    default: 'Wincode',
  },
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${jetbrainsMono.variable}`}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
