import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CartToast from '../components/CartToast';
import BubbleTrail from '../components/BubbleTrail';

export const metadata: Metadata = {
  title: 'Shrimps & Giggles — Live Neocaridina shrimp',
  description:
    'Home-bred Neocaridina shrimp for planted aquariums. Vivid colour, hardy stock, live arrival guaranteed.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
        </CartProvider>
        <BubbleTrail />
      </body>
    </html>
  );
}
