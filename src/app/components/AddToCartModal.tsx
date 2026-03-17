import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  colors?: string[];
  size?: string[];
}

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.size && product.size.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize || 'Única',
      color: selectedColor || 'Estándar',
    });

    toast.success('¡Producto agregado!', {
      description: `${product.name} - Talla: ${selectedSize || 'Única'}`,
    });

    // Reset y cerrar
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    onClose();
  };

  const colorNames: { [key: string]: string } = {
    '#3B82F6': 'Azul',
    '#000000': 'Negro',
    '#FFFFFF': 'Blanco',
    '#808080': 'Gris',
    '#2563EB': 'Azul Oscuro',
    '#50C878': 'Verde',
    '#9B59B6': 'Morado',
    '#FF6B6B': 'Coral',
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl mb-1" style={{ fontFamily: 'Cormorant, serif' }}>
                    Agregar al Carrito
                  </h2>
                  <p className="text-sm text-white/90">Selecciona talla y color</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Product Info */}
              <div className="flex gap-4 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-[#3B82F6] font-medium text-lg">
                    ${product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                </div>
              </div>

              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Talla <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'border-[#3B82F6] bg-[#3B82F6] text-white'
                            : 'border-gray-300 hover:border-[#3B82F6]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Color {selectedColor && `(${colorNames[selectedColor] || 'Seleccionado'})`}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-[#3B82F6] scale-110'
                            : 'border-gray-300 hover:border-[#3B82F6]'
                        }`}
                        style={{
                          backgroundColor: color,
                          boxShadow: selectedColor === color ? '0 0 0 2px white, 0 0 0 4px #3B82F6' : 'none',
                        }}
                        title={colorNames[color] || color}
                      >
                        {selectedColor === color && (
                          <Check 
                            className={`w-5 h-5 mx-auto ${color === '#FFFFFF' || color === '#3B82F6' ? 'text-gray-700' : 'text-white'}`} 
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Cantidad</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-[#3B82F6] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-[#3B82F6] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  ✓ Envío gratis en compras superiores a $150.000
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}