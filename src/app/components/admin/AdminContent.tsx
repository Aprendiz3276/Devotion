import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  ShoppingBag,
  Sparkles,
  Heart,
  Instagram,
  Plus,
  Edit2,
  Trash2,
  Save,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateProductModal } from './CreateProductModal';
import { BlogModal } from './BlogModal';
import { InstagramModal } from './InstagramModal';

interface SectionProduct {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  section: 'ofertas' | 'tops' | 'leggings' | 'conjuntos' | 'accesorios' | 'colecciones';
  featured: boolean;
  order: number;
}

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  link: string;
}

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<'sections' | 'blog' | 'instagram'>('sections');
  const [products, setProducts] = useState<any[]>([]);
  const [sectionProducts, setSectionProducts] = useState<SectionProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionProduct['section']>('ofertas');
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [blogForm, setBlogForm] = useState({ title: '', description: '', image: '', category: '' });
  const [instagramForm, setInstagramForm] = useState({ image: '', caption: '', link: '' });
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [editingInstagramPost, setEditingInstagramPost] = useState<InstagramPost | null>(null);

  // New Product Form
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    colors: '',
    sizes: '',
  });

  // Image upload states
  const [blogImagePreview, setBlogImagePreview] = useState<string>('');
  const [instagramImagePreview, setInstagramImagePreview] = useState<string>('');
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [isUploadingBlogImage, setIsUploadingBlogImage] = useState(false);
  const [isUploadingInstagramImage, setIsUploadingInstagramImage] = useState(false);
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const savedSectionProducts = JSON.parse(localStorage.getItem('sectionProducts') || '[]');
    const savedBlogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const savedInstagramPosts = JSON.parse(localStorage.getItem('instagramPosts') || '[]');

    setProducts(savedProducts);
    setSectionProducts(savedSectionProducts);
    setBlogPosts(savedBlogPosts);
    setInstagramPosts(savedInstagramPosts);
  };

  const sections = [
    { id: 'ofertas', name: 'Ofertas Flash', icon: Flame, color: 'from-red-400 to-orange-500' },
    { id: 'tops', name: 'Tops', icon: ShoppingBag, color: 'from-pink-400 to-pink-600' },
    { id: 'leggings', name: 'Leggings', icon: ShoppingBag, color: 'from-purple-400 to-purple-600' },
    { id: 'conjuntos', name: 'Conjuntos', icon: Sparkles, color: 'from-blue-400 to-blue-600' },
    { id: 'accesorios', name: 'Accesorios', icon: Heart, color: 'from-green-400 to-green-600' },
    { id: 'colecciones', name: 'Colecciones Destacadas', icon: Sparkles, color: 'from-[#F2D6E0] to-[#E8C5CF]' },
  ] as const;

  // Add product to section
  const handleAddToSection = () => {
    if (!selectedProductId) {
      toast.error('Por favor selecciona un producto');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    // Check if product already exists in this section
    const exists = sectionProducts.find(
      sp => sp.productId === selectedProductId && sp.section === selectedSection
    );

    if (exists) {
      toast.error('Este producto ya está en esta sección');
      return;
    }

    const newSectionProduct: SectionProduct = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      productPrice: product.price,
      section: selectedSection,
      featured: false,
      order: sectionProducts.filter(sp => sp.section === selectedSection).length,
    };

    const updated = [...sectionProducts, newSectionProduct];
    localStorage.setItem('sectionProducts', JSON.stringify(updated));
    setSectionProducts(updated);
    toast.success('Producto agregado a la sección');
    setIsProductModalOpen(false);
    setSelectedProductId('');
  };

  // Remove product from section
  const handleRemoveFromSection = (id: string) => {
    const updated = sectionProducts.filter(sp => sp.id !== id);
    localStorage.setItem('sectionProducts', JSON.stringify(updated));
    setSectionProducts(updated);
    toast.success('Producto removido de la sección');
  };

  // Toggle featured
  const toggleFeatured = (id: string) => {
    const updated = sectionProducts.map(sp =>
      sp.id === id ? { ...sp, featured: !sp.featured } : sp
    );
    localStorage.setItem('sectionProducts', JSON.stringify(updated));
    setSectionProducts(updated);
    toast.success('Producto actualizado');
  };

  // Blog post functions
  const handleSaveBlogPost = () => {
    if (!blogForm.title || !blogForm.description || !blogForm.image) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (editingBlogPost) {
      const updated = blogPosts.map(post =>
        post.id === editingBlogPost.id
          ? { ...post, ...blogForm }
          : post
      );
      localStorage.setItem('blogPosts', JSON.stringify(updated));
      setBlogPosts(updated);
      toast.success('Post actualizado exitosamente');
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...blogForm,
        date: new Date().toISOString(),
      };
      const updated = [...blogPosts, newPost];
      localStorage.setItem('blogPosts', JSON.stringify(updated));
      setBlogPosts(updated);
      toast.success('Post creado exitosamente');
    }

    setBlogForm({ title: '', description: '', image: '', category: '' });
    setEditingBlogPost(null);
    setIsBlogModalOpen(false);
  };

  const handleEditBlogPost = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogForm({
      title: post.title,
      description: post.description,
      image: post.image,
      category: post.category,
    });
    setBlogImagePreview(post.image);
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlogPost = (id: string) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este post?')) {
      const updated = blogPosts.filter(post => post.id !== id);
      localStorage.setItem('blogPosts', JSON.stringify(updated));
      setBlogPosts(updated);
      toast.success('Post eliminado exitosamente');
    }
  };

  // Instagram post functions
  const handleSaveInstagramPost = () => {
    if (!instagramForm.image) {
      toast.error('Por favor agrega una imagen');
      return;
    }

    if (editingInstagramPost) {
      const updated = instagramPosts.map(post =>
        post.id === editingInstagramPost.id
          ? { ...post, ...instagramForm }
          : post
      );
      localStorage.setItem('instagramPosts', JSON.stringify(updated));
      setInstagramPosts(updated);
      toast.success('Post de Instagram actualizado');
    } else {
      const newPost: InstagramPost = {
        id: Date.now().toString(),
        ...instagramForm,
      };
      const updated = [...instagramPosts, newPost];
      localStorage.setItem('instagramPosts', JSON.stringify(updated));
      setInstagramPosts(updated);
      toast.success('Post de Instagram agregado');
    }

    setInstagramForm({ image: '', caption: '', link: '' });
    setEditingInstagramPost(null);
    setIsInstagramModalOpen(false);
  };

  const handleEditInstagramPost = (post: InstagramPost) => {
    setEditingInstagramPost(post);
    setInstagramForm({
      image: post.image,
      caption: post.caption,
      link: post.link,
    });
    setIsInstagramModalOpen(true);
  };

  const handleDeleteInstagramPost = (id: string) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este post?')) {
      const updated = instagramPosts.filter(post => post.id !== id);
      localStorage.setItem('instagramPosts', JSON.stringify(updated));
      setInstagramPosts(updated);
      toast.success('Post de Instagram eliminado');
    }
  };

  // Create new product function
  const handleCreateProduct = () => {
    if (!newProductForm.name || !newProductForm.category || !newProductForm.price || !newProductForm.stock || !newProductForm.image || !newProductForm.description) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: newProductForm.name,
      category: newProductForm.category,
      price: parseFloat(newProductForm.price),
      stock: parseInt(newProductForm.stock),
      image: newProductForm.image,
      description: newProductForm.description,
      colors: newProductForm.colors ? newProductForm.colors.split(',').map(c => c.trim()) : [],
      sizes: newProductForm.sizes ? newProductForm.sizes.split(',').map(s => s.trim()) : [],
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [...products, newProduct];
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    toast.success('Producto creado exitosamente');
    setIsCreateProductModalOpen(false);
    setNewProductForm({
      name: '',
      category: '',
      price: '',
      stock: '',
      image: '',
      description: '',
      colors: '',
      sizes: '',
    });
    setProductImagePreview('');
  };

  const getProductsBySection = (section: string) => {
    return sectionProducts.filter(sp => sp.section === section);
  };

  // Blog image upload functions
  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 2MB');
      return;
    }

    setIsUploadingBlogImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBlogForm({ ...blogForm, image: base64String });
      setBlogImagePreview(base64String);
      setIsUploadingBlogImage(false);
      toast.success('Imagen cargada exitosamente');
    };

    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
      setIsUploadingBlogImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleBlogImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (blob.size > 2 * 1024 * 1024) {
          toast.error('La imagen es muy grande. Máximo 2MB');
          return;
        }

        setIsUploadingBlogImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setBlogForm({ ...blogForm, image: base64String });
          setBlogImagePreview(base64String);
          setIsUploadingBlogImage(false);
          toast.success('Imagen pegada exitosamente');
        };

        reader.onerror = () => {
          toast.error('Error al cargar la imagen');
          setIsUploadingBlogImage(false);
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Instagram image upload functions
  const handleInstagramImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 2MB');
      return;
    }

    setIsUploadingInstagramImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setInstagramForm({ ...instagramForm, image: base64String });
      setInstagramImagePreview(base64String);
      setIsUploadingInstagramImage(false);
      toast.success('Imagen cargada exitosamente');
    };

    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
      setIsUploadingInstagramImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleInstagramImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (blob.size > 2 * 1024 * 1024) {
          toast.error('La imagen es muy grande. Máximo 2MB');
          return;
        }

        setIsUploadingInstagramImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setInstagramForm({ ...instagramForm, image: base64String });
          setInstagramImagePreview(base64String);
          setIsUploadingInstagramImage(false);
          toast.success('Imagen pegada exitosamente');
        };

        reader.onerror = () => {
          toast.error('Error al cargar la imagen');
          setIsUploadingInstagramImage(false);
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  // Product image upload functions
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 2MB');
      return;
    }

    setIsUploadingProductImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewProductForm({ ...newProductForm, image: base64String });
      setProductImagePreview(base64String);
      setIsUploadingProductImage(false);
      toast.success('Imagen cargada exitosamente');
    };

    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
      setIsUploadingProductImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleProductImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (blob.size > 2 * 1024 * 1024) {
          toast.error('La imagen es muy grande. Máximo 2MB');
          return;
        }

        setIsUploadingProductImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setNewProductForm({ ...newProductForm, image: base64String });
          setProductImagePreview(base64String);
          setIsUploadingProductImage(false);
          toast.success('Imagen pegada exitosamente');
        };

        reader.onerror = () => {
          toast.error('Error al cargar la imagen');
          setIsUploadingProductImage(false);
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-serif text-gray-800">Gestión de Contenido</h3>
        <p className="text-gray-600 text-sm mt-1">Administra las secciones de tu página web</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'sections'
                ? 'bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Secciones de Productos
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Blog / Inspiración
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'instagram'
                ? 'bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Instagram
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const sectionProds = getProductsBySection(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`p-4 bg-gradient-to-r ${section.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-serif text-white">{section.name}</h4>
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                        {sectionProds.length} productos
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedSection(section.id);
                        setIsProductModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Producto
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {sectionProds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sectionProds.map((sp) => (
                        <div
                          key={sp.id}
                          className="relative bg-gray-50 rounded-lg overflow-hidden group"
                        >
                          <img
                            src={sp.productImage}
                            alt={sp.productName}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {sp.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${sp.productPrice.toLocaleString('es-CO')}
                            </p>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleFeatured(sp.id)}
                              className={`p-1.5 rounded-full ${
                                sp.featured ? 'bg-yellow-500' : 'bg-white/80'
                              } hover:bg-yellow-400 transition-colors`}
                              title={sp.featured ? 'Destacado' : 'Marcar como destacado'}
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveFromSection(sp.id)}
                              className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay productos en esta sección</p>
                      <p className="text-sm mt-1">Agrega productos para mostrarlos aquí</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{blogPosts.length} posts publicados</p>
            <button
              onClick={() => setIsBlogModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Crear Post
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBlogPost(post)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-[#F2D6E0] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlogPost(post.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-[#F2D6E0] uppercase">
                    {post.category}
                  </span>
                  <h4 className="font-serif text-lg text-gray-800 mt-1">{post.title}</h4>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.description}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(post.date).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500">No hay posts publicados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'instagram' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{instagramPosts.length} posts de Instagram</p>
            <button
              onClick={() => setIsInstagramModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              <Instagram className="w-5 h-5" />
              Agregar Post
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {instagramPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEditInstagramPost(post)}
                    className="p-2 bg-white rounded-full hover:bg-[#F2D6E0] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteInstagramPost(post.id)}
                    className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {instagramPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay posts de Instagram</p>
            </div>
          )}
        </div>
      )}

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <>
          <div
            onClick={() => setIsProductModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[102]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[103] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] p-6 flex items-center justify-between">
                <h3 className="text-2xl font-serif text-white">
                  Agregar Producto a {sections.find(s => s.id === selectedSection)?.name}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        selectedProductId === product.id
                          ? 'border-[#F2D6E0] bg-[#F2D6E0]/10'
                          : 'border-gray-200 hover:border-[#F2D6E0]/50'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price.toLocaleString('es-CO')}</p>
                    </button>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay productos disponibles</p>
                    <p className="text-sm mt-1">Crea productos primero</p>
                    <button
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setIsCreateProductModalOpen(true);
                      }}
                      className="mt-4 flex items-center gap-2 mx-auto bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Crear Nuevo Producto
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex gap-3">
                {products.length > 0 && (
                  <button
                    onClick={() => {
                      setIsProductModalOpen(false);
                      setIsCreateProductModalOpen(true);
                    }}
                    className="px-6 py-3 border-2 border-[#F2D6E0] text-[#F2D6E0] rounded-lg hover:bg-[#F2D6E0]/10 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                  </button>
                )}
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddToSection}
                  disabled={!selectedProductId}
                  className="flex-1 bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agregar a Sección
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Blog Modal */}
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => {
          setIsBlogModalOpen(false);
          setEditingBlogPost(null);
        }}
        editingPost={editingBlogPost}
        onSave={(post) => {
          if (editingBlogPost) {
            const updated = blogPosts.map(p => p.id === post.id ? post : p);
            localStorage.setItem('blogPosts', JSON.stringify(updated));
            setBlogPosts(updated);
          } else {
            const updated = [...blogPosts, post];
            localStorage.setItem('blogPosts', JSON.stringify(updated));
            setBlogPosts(updated);
          }
          setEditingBlogPost(null);
        }}
      />

      {/* Instagram Modal */}
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => {
          setIsInstagramModalOpen(false);
          setEditingInstagramPost(null);
        }}
        editingPost={editingInstagramPost}
        onSave={(post) => {
          if (editingInstagramPost) {
            const updated = instagramPosts.map(p => p.id === post.id ? post : p);
            localStorage.setItem('instagramPosts', JSON.stringify(updated));
            setInstagramPosts(updated);
          } else {
            const updated = [...instagramPosts, post];
            localStorage.setItem('instagramPosts', JSON.stringify(updated));
            setInstagramPosts(updated);
          }
          setEditingInstagramPost(null);
        }}
      />

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onProductCreated={loadData}
      />
    </div>
  );
}