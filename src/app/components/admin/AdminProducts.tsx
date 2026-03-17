import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Search, X, Save, Upload, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '../ui/ImageUploader';

interface Product {
  id: string;
  name: string;
  category: string;
  section: 'catalog' | 'collections' | 'offers';
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description: string;
  colors: string[];
  sizes?: string[];
  discount?: number;
  createdAt: string;
  publicId?: string; // Para Cloudinary
}

// Categorías predefinidas de DEVOTION
const CATEGORIES = [
  { id: 'jeans-urbanos', label: 'Jeans Urbanos', icon: '👖' },
  { id: 'jeans-importados', label: 'Jeans Importados', icon: '👖' },
  { id: 'busos', label: 'Busos 1.1', icon: '👕' },
  { id: 'gorras', label: 'Gorras', icon: '🧢' },
  { id: 'conjuntos', label: 'Conjuntos', icon: '👔' },
  { id: 'sudaderas', label: 'Sudaderas', icon: '🧥' },
  { id: 'bolsos', label: 'Bolsos', icon: '👜' },
  { id: 'pantalonetas', label: 'Pantalonetas', icon: '🩳' },
  { id: 'mochos', label: 'Mochos', icon: '🎒' },
  { id: 'sacos', label: 'Sacos', icon: '🧥' },
];

const defaultProducts: Product[] = [
  // Catálogo
  {
    id: '1',
    name: 'Jean Urbano Azul Classic',
    category: 'Jeans Urbanos',
    section: 'catalog',
    price: 129900,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1542272454315-7ad9f8e0891e?w=400',
    description: 'Jean urbano de corte moderno con diseño clásico',
    colors: ['#1E3A8A', '#000000', '#4B5563'],
    sizes: ['28', '30', '32', '34', '36'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Buso 1.1 Deportivo Negro',
    category: 'Busos 1.1',
    section: 'catalog',
    price: 89900,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    description: 'Buso deportivo de alta calidad y confort',
    colors: ['#000000', '#3B82F6', '#808080'],
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Gorra Urbana Premium',
    category: 'Gorras',
    section: 'catalog',
    price: 45900,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    description: 'Gorra de estilo urbano con bordado premium',
    colors: ['#000000', '#3B82F6', '#FFFFFF'],
    sizes: ['Única'],
    createdAt: new Date().toISOString(),
  },
  // Colecciones
  {
    id: '4',
    name: 'Conjunto Urbano Completo',
    category: 'Conjuntos',
    section: 'collections',
    price: 189900,
    originalPrice: 249900,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    description: 'Conjunto completo urbano premium con diseño moderno',
    colors: ['#000000', '#808080', '#3B82F6'],
    sizes: ['M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sudadera Oversize Gris',
    category: 'Sudaderas',
    section: 'collections',
    price: 119900,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400',
    description: 'Sudadera oversize de alta calidad',
    colors: ['#808080', '#000000', '#FFFFFF'],
    sizes: ['M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
  },
  // Ofertas
  {
    id: '6',
    name: 'Jean Importado Premium',
    category: 'Jeans Importados',
    section: 'offers',
    price: 159900,
    originalPrice: 219900,
    discount: 27,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400',
    description: 'Jean importado de alta calidad con diseño exclusivo',
    colors: ['#1E3A8A', '#000000'],
    sizes: ['28', '30', '32', '34', '36'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Bolso Deportivo Urban',
    category: 'Bolsos',
    section: 'catalog',
    price: 79900,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    description: 'Bolso deportivo de gran capacidad',
    colors: ['#000000', '#3B82F6', '#808080'],
    sizes: ['Única'],
    createdAt: new Date().toISOString(),
  },
];

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'catalog' | 'collections' | 'offers'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    section: 'catalog' as 'catalog' | 'collections' | 'offers',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    imagePublicId: '',
    description: '',
    colors: '#3B82F6,#000000,#FFFFFF',
    sizes: 'S,M,L,XL',
    discount: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('allProducts');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading products:', error);
        // Initialize with default products if none exist
        saveProducts(defaultProducts);
      }
    } else {
      // Initialize with default products
      saveProducts(defaultProducts);
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('allProducts', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('productsUpdated'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.image) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category || 'General',
      section: formData.section,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock) || 0,
      image: formData.image,
      publicId: formData.imagePublicId || undefined,
      description: formData.description,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : undefined,
      discount: formData.discount ? parseInt(formData.discount) : undefined,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    if (editingProduct) {
      const updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      saveProducts(updatedProducts);
      toast.success('Producto actualizado exitosamente');
    } else {
      saveProducts([...products, productData]);
      toast.success('Producto creado exitosamente');
    }

    closeModal();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      section: product.section,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      image: product.image,
      imagePublicId: product.publicId || '',
      description: product.description,
      colors: product.colors.join(','),
      sizes: product.sizes?.join(',') || '',
      discount: product.discount?.toString() || '',
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const product = products.find(p => p.id === id);

      // Si el producto tiene publicId, borrar de Cloudinary
      if (product?.publicId) {
        try {
          const response = await fetch(`/api/delete/${product.publicId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            console.warn('Error borrando imagen de Cloudinary:', await response.text());
          }
        } catch (error) {
          console.warn('Error borrando imagen de Cloudinary:', error);
        }
      }

      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
      toast.success('Producto eliminado exitosamente');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      section: 'catalog',
      price: '',
      originalPrice: '',
      stock: '',
      image: '',
      imagePublicId: '',
      description: '',
      colors: '#3B82F6,#000000,#FFFFFF',
      sizes: 'S,M,L,XL',
      discount: '',
    });
    setImagePreview('');
  };

  const handlePreviewUrl = () => {
    if (formData.image.trim()) {
      setImagePreview(formData.image);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection === 'all' || product.section === selectedSection;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesSection && matchesCategory;
  });

  const sections = [
    { id: 'all', label: 'Todos', count: products.length },
    { id: 'catalog', label: 'Catálogo', count: products.filter(p => p.section === 'catalog').length },
    { id: 'collections', label: 'Colecciones', count: products.filter(p => p.section === 'collections').length },
    { id: 'offers', label: 'Ofertas', count: products.filter(p => p.section === 'offers').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-serif text-gray-800">Productos</h3>
          <p className="text-gray-600 text-sm mt-1">
            Gestiona los productos de todas las secciones
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
          />
        </div>

        {/* Section Filters */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Filtrar por sección:
          </label>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedSection === section.id
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.label} ({section.count})
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Filtrar por categoría:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.label
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden group"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400';
                }}
              />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  -{product.discount}%
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Editar producto"
                >
                  <Edit2 className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Eliminar producto"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${
                  product.section === 'catalog' ? 'bg-blue-100 text-blue-700' :
                  product.section === 'collections' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {product.section === 'catalog' ? 'Catálogo' :
                   product.section === 'collections' ? 'Colección' : 'Oferta'}
                </span>
              </div>

              <div className="mb-2">
                {product.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Colors */}
              <div className="flex gap-1 mb-2">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              {/* Stock */}
              <div className="text-xs text-gray-500">
                Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock} unidades
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white p-6 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-xl font-bold">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <p className="text-sm text-white/80 mt-1">
                    {editingProduct ? 'Actualiza la información del producto' : 'Agrega un nuevo producto a la tienda'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Section Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sección <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                    required
                  >
                    <option value="catalog">Catálogo</option>
                    <option value="collections">Colecciones</option>
                    <option value="offers">Ofertas</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona en qué sección aparecerá el producto
                  </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Producto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Camisa Formal Azul"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.label}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Selecciona la categoría del producto
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="89900"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Original (opcional)
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="129900"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Para mostrar precio tachado
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="15"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descuento % (opcional)
                      </label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="25"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen del Producto <span className="text-red-500">*</span>
                      </label>
                      <ImageUploader
                        value={imagePreview}
                        uploadUrl="/api/upload"
                        onChange={(base64OrUrl, publicId) => {
                          setFormData({ ...formData, image: base64OrUrl, imagePublicId: publicId || '' });
                          setImagePreview(base64OrUrl);
                        }}
                        onPreview={setImagePreview}
                      />
                    </div>

                    {/* URL Input (Alternative) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O ingresa una URL de imagen
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={handlePreviewUrl}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colores (códigos hex separados por coma)
                      </label>
                      <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        placeholder="#3B82F6,#000000,#FFFFFF"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Usa códigos hex como #3B82F6 o #000000
                      </p>
                      {/* Color Preview */}
                      <div className="flex gap-2 mt-2">
                        {formData.colors.split(',').map((color, index) => {
                          const trimmedColor = color.trim();
                          if (!trimmedColor) return null;
                          return (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: trimmedColor }}
                              title={trimmedColor}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tallas (separadas por coma)
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        placeholder="S,M,L,XL o 30,32,34,36"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Description - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción detallada del producto..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
