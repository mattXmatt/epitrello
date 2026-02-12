import type { Metadata } from 'next';
import { AuthProvider } from './contexts/AuthContext';
import './globals.css';
import Header from './components/layout/Header';

export const metadata: Metadata = {
  title: 'EpiTrello',
  description: 'A Trello clone built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
