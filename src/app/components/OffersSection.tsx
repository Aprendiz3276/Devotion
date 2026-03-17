import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, ShoppingCart, Heart, Eye, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProductQuickView } from './ProductQuickView';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { loadProductsBySection } from '../utils/productLoader';

interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: number;
  stock: number;
  colors?: string[];
}

const defaultOfferProducts: Product[] = [
  {
    id: 1,
    name: 'Traje Premium Ejecutivo',
    price: 99900,
    originalPrice: 199900,
    image: 'https://images.unsplash.com/photo-1758875568800-29fb434c7b17?w=400',
    discount: 50,
    stock: 12,
  },
  {
    id: 2,
    name: 'Camisa Formal Elegante',
    price: 69900,
    originalPrice: 139900,
    image: 'https://images.unsplash.com/photo-1596641211273-938aeaf926a9?w=400',
    discount: 50,
    stock: 8,
  },
  {
    id: 3,
    name: 'Blazer Elite Negro',
    price: 44900,
    originalPrice: 89900,
    image: 'https://images.unsplash.com/photo-1613686955273-4ac02632ae12?w=400',
    discount: 50,
    stock: 15,
  },
  {
    id: 4,
    name: 'Set Business Completo',
    price: 124900,
    originalPrice: 249900,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    discount: 50,
    stock: 10,
  },
  {
    id: 5,
    name: 'Zapatos Cuero Italiano',
    price: 89900,
    originalPrice: 179900,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
    discount: 50,
    stock: 20,
  },
  {
    id: 6,
    name: 'Cinturón Premium Cuero',
    price: 34900,
    originalPrice: 69900,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    discount: 50,
    stock: 25,
  },
  {
    id: 7,
    name: 'Corbata Seda Premium',
    price: 24900,
    originalPrice: 49900,
    image: 'https://images.unsplash.com/photo-1613521227604-1d6c7e1f0c9e?w=400',
    discount: 50,
    stock: 30,
  },
  {
    id: 8,
    name: 'Chaqueta Denim Lujo',
    price: 79900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1601524909162-abeb2ced4da7?w=400',
    discount: 50,
    stock: 14,
  },
  {
    id: 9,
    name: 'Pantalón Slim Premium',
    price: 54900,
    originalPrice: 109900,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400',
    discount: 50,
    stock: 18,
  },
  {
    id: 10,
    name: 'Bolso Elegante Cuero',
    price: 94900,
    originalPrice: 189900,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    discount: 50,
    stock: 11,
  },
  {
    id: 11,
    name: 'Reloj Clásico Elegante',
    price: 149900,
    originalPrice: 299900,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    discount: 50,
    stock: 7,
  },
  {
    id: 12,
    name: 'Abrigo Premium Invierno',
    price: 134900,
    originalPrice: 269900,
    image: 'https://images.unsplash.com/photo-1539533057440-7814bae1ef51?w=400',
    discount: 50,
    stock: 9,
  },
];

export function OffersSection() {
  const [hoveredOffer, setHoveredOffer] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(defaultOfferProducts);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  const loadOfferProducts = () => {
    const adminProducts = loadProductsBySection('offers');
    
    if (adminProducts.length > 0) {
      // Convert admin products to offer format
      const offerProducts = adminProducts.slice(0, 6).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || p.price * 1.5,
        image: p.image,
        discount: p.discount || (p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0),
        stock: p.stock || 10,
        colors: p.colors,
      }));
      setProducts(offerProducts);
    } else {
      setProducts(defaultOfferProducts);
    }
  };

  useEffect(() => {
    loadOfferProducts();
    
    // Listen for product updates
    const handleProductsUpdated = () => {
      loadOfferProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success('¡Agregado al carrito!', {
      description: product.name,
      icon: '🛒',
    });
  };

  const handleAddToFavorites = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('¡Agregado a favoritos!', {
      description: product.name,
      icon: '❤️',
    });
  };

  const handleQuickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const adaptedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      stock: product.stock,
      description: `Oferta especial con ${product.discount}% de descuento. ¡Aprovecha esta promoción limitada!`,
      colors: product.colors || ['#000000', '#FFFFFF', '#3B82F6'],
      size: ['S', 'M', 'L', 'XL'],
    };
    setQuickViewProduct(adaptedProduct);
    setShowQuickView(true);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  return (
    <section id="ofertas" className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 lg:pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 sm:px-6 py-2 rounded-full mb-3 sm:mb-4 shadow-lg">
            <span className="font-bold text-sm sm:text-base">OFERTAS FLASH</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
            Aprovecha Hoy
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Descuentos especiales por tiempo limitado
          </p>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6 sm:mb-8 md:mb-10"
        >
          <div className="bg-gradient-to-r from-black to-gray-800 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-xs sm:text-sm md:text-base font-medium">Termina en</span>
            </div>
            <div className="flex gap-2 sm:gap-3 md:gap-4">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 text-white/80">Horas</div>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold self-center">:</div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 text-white/80">Minutos</div>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold self-center">:</div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 text-white/80">Segundos</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Carousel Container */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredOffer(index)}
                onMouseLeave={() => setHoveredOffer(null)}
                className="flex-shrink-0 w-56 bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-red-500 snap-center"
              >
                <div className="relative overflow-hidden aspect-square">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs sm:text-sm font-bold shadow-lg z-10">
                    -{product.discount}%
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium">
                    {product.stock} disponibles
                  </div>

                  {/* Overlay Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredOffer === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-end p-3 sm:p-4"
                  >
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="p-2 sm:p-2.5 bg-white hover:bg-[#3B82F6] text-gray-800 hover:text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={(e) => handleAddToFavorites(product, e)}
                        className="p-2 sm:p-2.5 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                      >
                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={(e) => handleQuickView(product, e)}
                        className="p-2 sm:p-2.5 bg-white hover:bg-[#3B82F6] text-gray-800 hover:text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="p-2.5 sm:p-3 md:p-4">
                  <h3 className="text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-red-600">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 sm:mt-3">
                    <div className="bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full"
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all transform hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-full p-2 sm:p-3 shadow-lg transition-all transform hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay ofertas disponibles en este momento.</p>
            <p className="text-sm text-gray-400 mt-2">Las ofertas aparecerán aquí cuando las agregues desde el panel administrativo.</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView 
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </section>
  );
}