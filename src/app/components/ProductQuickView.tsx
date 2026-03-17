import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  stock: number;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen = true, onClose }: ProductQuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  if (!product) return null;

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    toast.success(`${product.name} agregado al carrito`, {
      description: `${quantity} unidad(es) - Talla ${selectedSize}`,
    });
    onClose();
  };

  const handleAddToWishlist = () => {
    toast.success('Agregado a favoritos ❤️', {
      description: product.name,
    });
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    -{product.discount}% OFF
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <h2 className="text-3xl font-serif mb-2" style={{ fontFamily: 'Cormorant, serif' }}>
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-[#3B82F6]">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      {product.stock} unidades disponibles
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    Prenda deportiva de alta calidad, diseñada con materiales premium para máximo confort y estilo. 
                    Perfecta para entrenamientos intensos o uso casual. Tecnología de secado rápido y control de humedad.
                  </p>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Talla</label>
                    <div className="flex gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedSize === size
                              ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                              : 'border-gray-200 hover:border-[#3B82F6]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Cantidad</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 rounded-lg border-2 border-gray-200 hover:border-[#3B82F6] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 rounded-lg border-2 border-gray-200 hover:border-[#3B82F6] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Agregar al Carrito
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToWishlist}
                      className="p-4 border-2 border-gray-200 hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-xl transition-all"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t">
                    <div className="text-sm">
                      <p className="text-gray-500">Material</p>
                      <p className="font-medium">90% Poliéster, 10% Elastano</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Cuidado</p>
                      <p className="font-medium">Lavado a máquina</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}