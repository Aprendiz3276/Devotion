import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Shield, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from '@/assets/48bac22df2a2b0456804549f5e1843df13f69db2.png';
import { SearchModal } from './SearchModal';
import { AuthModal } from './AuthModal';
import { CartModal } from './CartModal';
import { AdminPanel } from './AdminPanel';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Colecciones', href: '#colecciones' },
    { label: 'Ofertas', href: '#ofertas' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <a href="#inicio" className="flex items-center gap-3">
                <div className={`text-2xl md:text-3xl font-bold font-serif ${isScrolled ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Cormorant, serif' }}>
                  DEVOTION
                </div>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white font-medium hover:text-[#2d2d2d] transition-colors duration-300 relative group text-sm xl:text-base"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2d2d2d] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors text-white" 
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* User Button - Admin Only */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    aria-label="Administrador"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`}
                      alt={user.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white"
                    />
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>

                  {/* Admin Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div 
                          onClick={() => setShowUserMenu(false)}
                          className="fixed inset-0 z-40"
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                        >
                          {/* Admin Info */}
                          <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff`}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-white"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-white/80 truncate">{user.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs text-white">
                                  Administrador
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                setIsAdminPanelOpen(true);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                            >
                              <Shield className="w-5 h-5 text-[#3B82F6]" />
                              <span className="text-gray-700 font-medium">Abrir Panel Administrativo</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut className="w-5 h-5 text-red-500" />
                              <span className="text-gray-700">Cerrar Sesión</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors text-white" 
                  aria-label="Usuario"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <button 
                onClick={() => setIsCartModalOpen(true)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors relative text-white" 
                aria-label="Carrito"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#1D4ED8] text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-1.5 sm:p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menú"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t border-white/30 pt-3 sm:pt-4"
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block py-2 sm:py-2.5 text-white font-medium hover:text-[#2d2d2d] transition-colors text-sm sm:text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Modals */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
      <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
    </>
  );
}