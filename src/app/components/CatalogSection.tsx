import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Eye, Filter, X, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { ProductQuickView } from './ProductQuickView';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { products, categories, type Product } from '../utils/productData';
import { AddToCartModal } from './AddToCartModal';

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
  const { searchTerm } = useSearch();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
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

  let filteredProducts = [...products];

  if (selectedCategory !== 'Todos') {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }

  // Filtro de búsqueda
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  }

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
          {searchTerm && (
            <p className="text-gray-700 text-sm mt-2">
              Resultados para: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )}
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