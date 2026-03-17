import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Eye, Filter, X, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { ProductQuickView } from './ProductQuickView';
import { useCart } from '../context/CartContext';
import { AddToCartModal } from './AddToCartModal';

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors: string[];
  size?: string[];
  sizes?: string[];
  stock?: number;
  description?: string;
}

// Generar productos: 140 total para "Todos", 35 por categoría individual
const generateProducts = (): Product[] => {
  const categories = ['Jeans Urbanos', 'Jeans Importados', 'Busos 1.1', 'Gorras', 'Conjuntos', 'Sudaderas', 'Bolsos', 'Pantalonetas', 'Mochos', 'Sacos'];
  const products: Product[] = [];
  let id = 1;

  const images = {
    'Jeans Urbanos': [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
      'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400',
    ],
    'Jeans Importados': [
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400',
      'https://images.unsplash.com/photo-1582552938357-32b906d82c65?w=400',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
    ],
    'Busos 1.1': [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
    ],
    'Gorras': [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
    ],
    'Conjuntos': [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400',
      'https://images.unsplash.com/photo-1618453292459-a41a1e33f3c6?w=400',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
      'https://images.unsplash.com/photo-1490092732522-5618d8c7a1f3?w=400',
    ],
    'Sudaderas': [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    ],
    'Bolsos': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
    ],
    'Pantalonetas': [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
      'https://images.unsplash.com/photo-1598032895407-b8164a03465c?w=400',
      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400',
    ],
    'Mochos': [
      'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    ],
    'Sacos': [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    ],
  };

  const names = {
    'Jeans Urbanos': ['Jean Skinny', 'Jean Recto', 'Jean Cargo', 'Jean Rasgado', 'Jean Clásico', 'Jean Slim Fit', 'Jean Biker', 'Jean Relaxed'],
    'Jeans Importados': ['Jean Premium', 'Jean Designer', 'Jean Luxury', 'Jean Fashion', 'Jean Elite', 'Jean Import', 'Jean Original', 'Jean Exclusive'],
    'Busos 1.1': ['Buso Básico', 'Buso Premium', 'Buso Capota', 'Buso Cuello Redondo', 'Buso Oversized', 'Buso Slim', 'Buso Estampado', 'Buso Liso'],
    'Gorras': ['Gorra Snapback', 'Gorra Trucker', 'Gorra Plana', 'Gorra Curva', 'Gorra Dad Hat', 'Gorra Beisbolera', 'Gorra Logo', 'Gorra Bordada'],
    'Conjuntos': ['Conjunto Deportivo', 'Conjunto Casual', 'Conjunto Premium', 'Conjunto Urbano', 'Conjunto Jogger', 'Conjunto Completo', 'Conjunto Set', 'Conjunto Fashion'],
    'Sudaderas': ['Sudadera Hoodie', 'Sudadera Capucha', 'Sudadera Zip', 'Sudadera Básica', 'Sudadera Premium', 'Sudadera Oversized', 'Sudadera Slim', 'Sudadera Logo'],
    'Bolsos': ['Bolso Mensajero', 'Carriel Clásico', 'Canguro Deportivo', 'Morral Urban', 'Bolso Crossbody', 'Riñonera Premium', 'Mochila Mini', 'Bolso Casual'],
    'Pantalonetas': ['Pantaloneta Deportiva', 'Pantaloneta Casual', 'Pantaloneta Jogger', 'Pantaloneta Básica', 'Pantaloneta Premium', 'Pantaloneta Gym', 'Short Urbano', 'Bermuda'],
    'Mochos': ['Mocho Básico', 'Mocho Premium', 'Mocho Oversize', 'Mocho Slim', 'Mocho Estampado', 'Mocho Liso', 'Mocho Fashion', 'Mocho Urban'],
    'Sacos': ['Saco Casual', 'Saco Formal', 'Blazer Slim', 'Saco Elegante', 'Chaqueta Sport', 'Saco Premium', 'Blazer Fashion', 'Saco Classic'],
  };

  const adjectives = ['Negro', 'Azul', 'Gris', 'Blanco', 'Beige', 'Verde', 'Café', 'Rojo', 'Navy', 'Camel'];

  categories.forEach(category => {
    for (let i = 0; i < 14; i++) {
      const basePrice = category === 'Gorras' || category === 'Bolsos' ? 
        Math.floor(Math.random() * 50000) + 30000 :
        category === 'Conjuntos' ?
        Math.floor(Math.random() * 100000) + 150000 :
        category === 'Sacos' ?
        Math.floor(Math.random() * 120000) + 180000 :
        Math.floor(Math.random() * 80000) + 60000;

      const hasDiscount = Math.random() > 0.7;
      
      products.push({
        id: id++,
        name: `${names[category as keyof typeof names][i % names[category as keyof typeof names].length]} ${adjectives[i % adjectives.length]}`,
        price: basePrice,
        originalPrice: hasDiscount ? Math.floor(basePrice * 1.4) : undefined,
        image: images[category as keyof typeof images][i % images[category as keyof typeof images].length],
        category,
        colors: ['#3B82F6', '#000000', '#FFFFFF'].slice(0, Math.floor(Math.random() * 3) + 1),
        size: ['S', 'M', 'L', 'XL', 'XXL'].slice(0, Math.floor(Math.random() * 3) + 2),
      });
    }
  });

  return products;
};

const products = generateProducts();
const categories = ['Todos', 'Jeans Urbanos', 'Jeans Importados', 'Busos 1.1', 'Gorras', 'Conjuntos', 'Sudaderas', 'Bolsos', 'Pantalonetas', 'Mochos', 'Sacos'];

export function CatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [addToCartProduct, setAddToCartProduct] = useState<Product | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const { addToCart } = useCart();
  
  // Filtros avanzados
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 300000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortBy('newest');
  };

  // Cambiar de categoría reinicia la página a 1
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  let filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Aplicar filtros avanzados
  filteredProducts = filteredProducts.filter(p => {
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    const sizeMatch = selectedSizes.length === 0 || p.size.some(s => selectedSizes.includes(s));
    return priceMatch && sizeMatch;
  });

  // Aplicar ordenamiento
  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Paginación: 20 productos por página en todas las categorías
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of catalog
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Funciones para los botones de acción
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddToCartProduct(product);
    setShowAddToCartModal(true);
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
    // Adaptar el producto para el modal de vista rápida
    const adaptedProduct = {
      ...product,
      originalPrice: product.originalPrice || product.price * 1.4,
      discount: product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0,
      stock: Math.floor(Math.random() * 50) + 10, // Stock aleatorio entre 10-60
    };
    setQuickViewProduct(adaptedProduct);
    setShowQuickView(true);
  };

  return (
    <section id="catalogo" className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-5xl mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
            Nuestro Catálogo
          </h2>
          <p className="text-gray-600 text-lg">
            Descubre nuestra colección completa de moda deportiva
          </p>
        </motion.div>

        {/* Categories & Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
                  selectedCategory === category
                    ? 'bg-[#6B7280] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#6B7280] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filter & Sort Buttons */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-6 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {(selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 300000) && (
                <span className="bg-[#6B7280] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {selectedSizes.length + (priceRange[0] > 0 || priceRange[1] < 300000 ? 1 : 0)}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 lg:flex-initial px-4 py-2 bg-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#6B7280]"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg p-6 mb-6 shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-lg">Filtros Avanzados</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Limpiar todo
                  </button>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Rango de Precio</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-medium mb-3">Tallas</h4>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                            : 'bg-white border-gray-300 hover:border-[#3B82F6]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="font-medium mb-3">Colores</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Azul', value: '#3B82F6' },
                      { name: 'Negro', value: '#000000' },
                      { name: 'Blanco', value: '#FFFFFF' },
                    ].map(color => (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedColors.includes(color.name)
                            ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]'
                            : 'border-gray-300 hover:border-[#3B82F6]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {paginatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-square">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
                >
                  <button
                    className="p-2 bg-white rounded-full hover:bg-[#3B82F6] hover:text-white transition-colors"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full hover:bg-[#3B82F6] hover:text-white transition-colors"
                    onClick={(e) => handleAddToFavorites(product, e)}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full hover:bg-[#3B82F6] hover:text-white transition-colors"
                    onClick={(e) => handleQuickView(product, e)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </motion.div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-base mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-base md:text-lg font-medium text-[#3B82F6]">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#3B82F6] text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView 
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      {/* Add to Cart Modal */}
      <AddToCartModal
        product={addToCartProduct}
        isOpen={showAddToCartModal}
        onClose={() => setShowAddToCartModal(false)}
      />
    </section>
  );
}