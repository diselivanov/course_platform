import { Metadata } from 'next';
import { Onest } from 'next/font/google';
import Layout from '@/app/components/Layout';
import './globals.scss';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: {
    template: 'Abkhaz Store - %s',
    default: 'Abkhaz Store',
  },
  description: 'Доска объявлений Абхазии',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={onest.variable}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
