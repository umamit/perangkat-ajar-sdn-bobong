import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Perangkat Ajar Online - SD Negeri Bobong',
  description: 'Aplikasi Internal Perangkat Ajar Guru SD Negeri Bobong, Kabupaten Pulau Taliabu',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ajar SDN Bobong',
  },
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="theme-color" content="#12A5B8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ajar SDN Bobong" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/assets/logo-sdn-bobong.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
