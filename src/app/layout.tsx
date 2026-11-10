import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import { ToastProvider } from '@/components/common/Toast';

const josefinSlab = localFont({
  src: './fonts/JosefinSlab-Variable.woff2',
  variable: '--font-josefin-slab',
  weight: '100 700',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GitCanvas — GitHub Profile README Studio',
  description:
    'Ingest GitHub public profile data, synthesize tailored developer archetypes, and customize aesthetic modular README sections.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${josefinSlab.variable}`}>
      <body className={`${josefinSlab.className} min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 font-normal`}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

