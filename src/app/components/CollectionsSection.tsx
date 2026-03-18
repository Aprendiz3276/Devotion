import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { loadProductsBySection, Product } from '../utils/productLoader';
import { ProductQuickView } from './ProductQuickView';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';

const defaultCollectionImages = [
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400',
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400',
];

// Generate default products if admin hasn't created any
const generateDefaultProducts = (collectionImages: string[]): any[] => {
  const products: any[] = [];
  const images = collectionImages.length > 0 ? collectionImages : defaultCollectionImages;

  const productData = [
    {
      name: 'Conjunto Urbano Completo',
      basePrice: 189900,
      originalPrice: 249900,
      colors: ['#000000', '#1F2937', '#3B82F6'],
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400'
    },
    {
      name: 'Sudadera Oversize Gris',
      basePrice: 119900,
      originalPrice: undefined,
      colors: ['#9CA3AF', '#6B7280', '#D1D5DB'],
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'
    },
    {
      name: 'Set Premium Deportivo',
      basePrice: 159900,
      originalPrice: 219900,
      colors: ['#000000', '#3B82F6', '#FFFFFF'],
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
    },
    {
      name: 'Outfit Street Modern',
      basePrice: 179900,
      originalPrice: 249900,
      colors: ['#1F2937', '#000000', '#6B7280'],
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400'
    },
    {
      name: 'Conjunto Elite Fashion',
      basePrice: 199900,
      originalPrice: 299900,
      colors: ['#3B82F6', '#000000', '#FFFFFF'],
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400'
    },
    {
      name: 'Set Casual Elegante',
      basePrice: 149900,
      originalPrice: 199900,
      colors: ['#6B7280', '#D1D5DB', '#000000'],
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400'
    },
    {
      name: 'Outfit Modern Minimalista',
      basePrice: 169900,
      originalPrice: 229900,
      colors: ['#FFFFFF', '#000000', '#9CA3AF'],
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'
    },
    {
      name: 'Conjunto Premium Urbano',
      basePrice: 189900,
      originalPrice: 279900,
      colors: ['#000000', '#3B82F6', '#6B7280'],
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'
    },
    {
      name: 'Set Fashion Exclusivo',
      basePrice: 209900,
      originalPrice: 309900,
      colors: ['#3B82F6', '#000000', '#1F2937'],
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400'
    },
    {
      name: 'Outfit Luxury Completo',
      basePrice: 219900,
      originalPrice: 319900,
      colors: ['#000000', '#6B7280', '#3B82F6'],
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400'
    }
  ];

  productData.forEach((data, index) => {
    products.push({
      id: `default-${index + 1}`,
      name: data.name,
      price: data.basePrice,
      originalPrice: data.originalPrice,
      image: data.image,
      colors: data.colors,
    });
  });

  return products;
};

export function CollectionsSection() {
  const [hoveredCollection, setHoveredCollection] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
    
    const product = products.find((p) => p.id === productId);
    if (product) {
      if (favorites.includes(productId)) {
        toast.info('Removido de favoritos', { description: product.name });
      } else {
        toast.success('Agregado a favoritos ❤️', { description: product.name });
      }
    }
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const loadCollectionProducts = () => {
    // Try to load from admin products first
    const adminProducts = loadProductsBySection('collections');
    
    if (adminProducts.length > 0) {
      // Convert admin products to display format
      const displayProducts = adminProducts.slice(0, 10).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        colors: p.colors,
      }));
      setProducts(displayProducts);
    } else {
      // Load collection images for defaults
      const savedImages = localStorage.getItem('siteImages');
      let collectionImages: string[] = [];
      
      if (savedImages) {
        try {
          const images = JSON.parse(savedImages);
          collectionImages = images
            .filter((img: any) => img.category === 'collections')
            .map((img: any) => img.currentImage);
        } catch (error) {
          console.error('Error loading collection images:', error);
        }
      }
      
      setProducts(generateDefaultProducts(collectionImages));
    }
  };

  useEffect(() => {
    loadCollectionProducts();
    
    // Listen for product updates
    const handleProductsUpdated = () => {
      loadCollectionProducts();
    };
    
    const handleImagesUpdated = () => {
      loadCollectionProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdated);
    window.addEventListener('imagesUpdated', handleImagesUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
      window.removeEventListener('imagesUpdated', handleImagesUpdated);
    };
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success('¡Agregado al carrito!', {
      description: product.name,
    });
  };

  return (
    <section id="colecciones" className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 lg:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
            Estilos Destacados
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Outfits completos para el hombre urbano y moderno
          </p>
        </motion.div>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredCollection(index)}
              onMouseLeave={() => setHoveredCollection(null)}
              className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-square">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay con acciones */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCollection === index ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col items-center justify-end p-3 sm:p-4"
                >
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 sm:p-2.5 bg-white hover:bg-[#3B82F6] text-gray-800 hover:text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`p-2 sm:p-2.5 rounded-full transition-all transform hover:scale-110 shadow-lg ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white hover:bg-red-500 text-gray-800 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleQuickView(product)}
                      className="p-2 sm:p-2.5 bg-white hover:bg-[#3B82F6] text-gray-800 hover:text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </motion.div>

                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-2.5 sm:p-3 md:p-4">
                <h3 className="text-xs sm:text-sm md:text-base mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                  {product.name}
                </h3>
                
                {/* Colors */}
                <div className="flex gap-1 mb-1.5 sm:mb-2">
                  {product.colors.slice(0, 3).map((color: string, i: number) => (
                    <div
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos en esta sección aún.</p>
            <p className="text-sm text-gray-400 mt-2">Los productos aparecerán aquí cuando los agregues desde el panel administrativo.</p>
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
