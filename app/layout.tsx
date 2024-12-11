import './globals.css';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActionButton from '../components/FloatingActionButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Auction House',
  description: 'Bid on exciting items or sell your own!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingActionButton />
      </body>
    </html>
  );
}
