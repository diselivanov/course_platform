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
    template: '%s | Wincode',
    default: 'Wincode',
  },
  description: 'Курсы по разработке современных продуктов',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
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
