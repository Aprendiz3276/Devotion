import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { CollectionsSection } from './components/CollectionsSection';
import { OffersSection } from './components/OffersSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Toaster } from './components/ui/sonner';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <div className="min-h-screen overflow-x-hidden">
            <Header />
            <main className="overflow-x-hidden">
              <HeroSection />
              <OffersSection />
              <CatalogSection />
              <CollectionsSection />
              <ContactSection />
            </main>
            <Footer />
            <WhatsAppButton />
            <Toaster />
          </div>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}