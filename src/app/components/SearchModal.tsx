import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ShoppingCart, Heart } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { products, type Product } from '../utils/productData';
import { AddToCartModal } from './AddToCartModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { searchTerm, setSearchTerm } = useSearch();
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

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
    toast.success(`"${product.name}" se ha añadido a favoritos`);
  };

  const handleProductClick = (product: Product) => {
    // Mantener el término de búsqueda para filtrar el catálogo
    setSearchTerm(product.name);

    // Cerrar el modal
    onClose();

    // Navegar a la sección de catálogo
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Mostrar notificación de que el producto está en el catálogo
      setTimeout(() => {
        toast.info(`Mostrando productos de ${product.category}`, {
          description: 'Explora nuestro catálogo para encontrar el producto que buscas',
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
            onClick={handleClose}
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
                  onClick={handleClose}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!searchTerm && (
                <div className="text-center py-12 text-gray-500">
                  Escribe para buscar productos dentro del catálogo.
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