import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, ShoppingCart, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { AddToCartModal } from './AddToCartModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors?: string[];
  size?: string[];
}

// Base de datos de productos para búsqueda
const allProducts: Product[] = [
  // Tops
  { id: 1, name: 'Top Deportivo Premium Rosa', price: 65900, originalPrice: 89900, image: 'https://images.unsplash.com/photo-1613686955273-4ac02632ae12?w=400', category: 'Tops', size: ['XS', 'S', 'M', 'L', 'XL'], colors: ['#D8A7B1', '#000000', '#FFFFFF'] },
  { id: 2, name: 'Bralette Sport Elite Negro', price: 54900, image: 'https://images.unsplash.com/photo-1617185719150-06b4f4cfbbea?w=400', category: 'Tops', size: ['S', 'M', 'L'], colors: ['#000000', '#FFFFFF'] },
  { id: 3, name: 'Top Mesh Active Blanco', price: 59900, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', category: 'Tops', size: ['XS', 'S', 'M', 'L'], colors: ['#FFFFFF', '#D8A7B1'] },
  { id: 4, name: 'Crop Top Seamless Gris', price: 49900, originalPrice: 69900, image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400', category: 'Tops', size: ['S', 'M', 'L', 'XL'], colors: ['#808080', '#000000'] },
  
  // Leggings
  { id: 5, name: 'Leggings Push-Up Rosa', price: 89900, originalPrice: 120000, image: 'https://images.unsplash.com/photo-1596641211273-938aeaf926a9?w=400', category: 'Leggings', size: ['XS', 'S', 'M', 'L', 'XL'], colors: ['#D8A7B1', '#000000'] },
  { id: 6, name: 'Mallas Yoga Comfort Negro', price: 79900, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', category: 'Leggings', size: ['S', 'M', 'L', 'XL'], colors: ['#000000', '#FFFFFF'] },
  { id: 7, name: 'Leggings Capri Active Azul', price: 69900, image: 'https://images.unsplash.com/photo-1767303595123-c624497afb18?w=400', category: 'Leggings', size: ['XS', 'S', 'M', 'L'], colors: ['#4A90E2', '#000000'] },
  { id: 8, name: 'Tights Power Flex Verde', price: 84900, originalPrice: 110000, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400', category: 'Leggings', size: ['S', 'M', 'L', 'XL'], colors: ['#50C878', '#000000'] },
  
  // Conjuntos
  { id: 9, name: 'Conjunto Premium Primavera', price: 149900, originalPrice: 199900, image: 'https://images.unsplash.com/photo-1758875568800-29fb434c7b17?w=400', category: 'Conjuntos', size: ['S', 'M', 'L'], colors: ['#D8A7B1', '#FFFFFF'] },
  { id: 10, name: 'Set Training Completo Negro', price: 169900, image: 'https://images.unsplash.com/photo-1759476529288-cc6bbde6f0a3?w=400', category: 'Conjuntos', size: ['XS', 'S', 'M', 'L', 'XL'], colors: ['#000000'] },
  { id: 11, name: 'Outfit Gym Elite Rosa', price: 139900, originalPrice: 189900, image: 'https://images.unsplash.com/photo-1645318800862-0d343ebd4e6a?w=400', category: 'Conjuntos', size: ['S', 'M', 'L', 'XL'], colors: ['#D8A7B1', '#000000'] },
  { id: 12, name: 'Kit Training Pro Gris', price: 159900, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', category: 'Conjuntos', size: ['M', 'L', 'XL'], colors: ['#808080', '#000000'] },
  
  // Accesorios
  { id: 13, name: 'Botella Sport Premium', price: 35900, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400', category: 'Accesorios', colors: ['#D8A7B1', '#000000', '#FFFFFF'] },
  { id: 14, name: 'Guantes Training Pro', price: 29900, originalPrice: 39900, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', category: 'Accesorios', size: ['S', 'M', 'L'], colors: ['#000000'] },
  { id: 15, name: 'Mat Yoga Premium', price: 89900, image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400', category: 'Accesorios', colors: ['#9B59B6', '#D8A7B1', '#4A90E2'] },
  { id: 16, name: 'Bolso Gym Elite', price: 69900, originalPrice: 89900, image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400', category: 'Accesorios', colors: ['#000000', '#D8A7B1'] },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const trendingSearches = [
    'Leggings deportivos',
    'Conjuntos gym',
    'Tops de yoga',
    'Accesorios fitness',
    'Ropa running',
  ];

  const recentSearches = [
    'Leggings negros',
    'Top rosado',
  ];

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: 'M', // Talla por defecto
      color: 'N/A', // Color por defecto
    });
    toast.success(`"${product.name}" se ha añadido al carrito`);
  };

  const handleAddToFavorites = (product: Product) => {
    toast.success(`\"${product.name}\" se ha a��adido a favoritos`);
  };

  const handleProductClick = (product: Product) => {
    // Cerrar el modal
    onClose();
    
    // Navegar a la sección de catálogo
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Mostrar notificación de que el producto está en el catálogo
      setTimeout(() => {
        toast.info(`Mostrando productos de ${product.category}`, {
          description: 'Explora nuestro catálogo para encontrar el producto que buscas'
        });
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-white z-50 shadow-2xl"
          >
            <div className="max-w-4xl mx-auto p-6">
              {/* Search Input */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#3B82F6] focus:outline-none text-lg"
                    autoFocus
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Recent Searches */}
              {!searchTerm && recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Búsquedas recientes</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(search)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {!searchTerm && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Tendencias de búsqueda
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchTerm(search)}
                        className="px-4 py-2 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] rounded-full text-sm transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchTerm && (
                <div>
                  {filteredProducts.length > 0 ? (
                    <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                      {filteredProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          {/* Imagen pequeña */}
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                          />
                          
                          {/* Info del producto */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.category}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {product.originalPrice && (
                                <span className="text-xs line-through text-gray-400">
                                  ${product.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <span className="text-sm font-medium text-[#3B82F6]">
                                ${product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToFavorites(product);
                              }}
                              className="p-1.5 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-[#3B82F6]"
                              title="Añadir a favoritos"
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddToCartProduct(product);
                                setShowAddToCartModal(true);
                              }}
                              className="px-3 py-1.5 bg-[#3B82F6] text-white rounded-full transition-colors hover:bg-[#2563EB] flex items-center gap-1.5"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span className="text-xs">Añadir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No se encontraron resultados para \"{searchTerm}\".
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
      
      {/* Add to Cart Modal */}
      <AddToCartModal
        product={addToCartProduct}
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
      />
    </AnimatePresence>
  );
}