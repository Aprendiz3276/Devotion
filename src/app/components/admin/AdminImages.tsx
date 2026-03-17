import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Upload, Trash2, RefreshCw, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '../ui/ImageUploader';
import heroDefaultImage from '@/assets/f073528f5eb1a9d86f3d2821d4098d60a8051f64.png';

interface ImageSlot {
  id: string;
  name: string;
  description: string;
  currentImage: string;
  category: 'hero' | 'collections' | 'catalog' | 'offers';
  publicId?: string; // Para Cloudinary
}

const defaultImages: ImageSlot[] = [
  // Hero Section
  {
    id: 'hero-main',
    name: 'Hero Principal',
    description: 'Imagen principal de portada (1920x800px recomendado)',
    currentImage: heroDefaultImage,
    category: 'hero'
  },
  // Collections
  {
    id: 'collection-1',
    name: 'Colección 1',
    description: 'Primera imagen de colecciones (800x800px)',
    currentImage: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400',
    category: 'collections'
  },
  {
    id: 'collection-2',
    name: 'Colección 2',
    description: 'Segunda imagen de colecciones (800x800px)',
    currentImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    category: 'collections'
  },
  {
    id: 'collection-3',
    name: 'Colección 3',
    description: 'Tercera imagen de colecciones (800x800px)',
    currentImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'collections'
  },
  {
    id: 'collection-4',
    name: 'Colección 4',
    description: 'Cuarta imagen de colecciones (800x800px)',
    currentImage: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400',
    category: 'collections'
  },
  {
    id: 'collection-5',
    name: 'Colección 5',
    description: 'Quinta imagen de colecciones (800x800px)',
    currentImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400',
    category: 'collections'
  }
];

export function AdminImages() {
  const [images, setImages] = useState<ImageSlot[]>(defaultImages);
  const [editingImage, setEditingImage] = useState<ImageSlot | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImagePublicId, setNewImagePublicId] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'hero' | 'collections' | 'catalog' | 'offers'>('all');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const savedImages = localStorage.getItem('siteImages');
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Error loading images:', error);
        setImages(defaultImages);
      }
    }
  };

  const saveImages = (updatedImages: ImageSlot[]) => {
    localStorage.setItem('siteImages', JSON.stringify(updatedImages));
    setImages(updatedImages);
    toast.success('Imágenes guardadas exitosamente');
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('imagesUpdated'));
  };

  const handleEditImage = (image: ImageSlot) => {
    setEditingImage(image);
    setNewImageUrl(image.currentImage);
    setPreviewUrl(image.currentImage);
  };

  const handleUpdateImage = () => {
    if (!editingImage || !newImageUrl.trim()) {
      toast.error('Por favor ingresa una URL válida');
      return;
    }

    const updatedImages = images.map(img =>
      img.id === editingImage.id
        ? { ...img, currentImage: newImageUrl, publicId: newImagePublicId || img.publicId }
        : img
    );

    saveImages(updatedImages);
    setEditingImage(null);
    setNewImageUrl('');
    setNewImagePublicId('');
    setPreviewUrl('');
  };

  const handleResetImage = async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    // Si hay publicId, borrar de Cloudinary
    if (image.publicId) {
      try {
        const response = await fetch(`/api/delete/${image.publicId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          console.warn('Error borrando imagen de Cloudinary:', await response.text());
        }
      } catch (error) {
        console.warn('Error borrando imagen de Cloudinary:', error);
      }
    }

    const defaultImage = defaultImages.find(img => img.id === imageId);
    if (!defaultImage) return;

    const updatedImages = images.map(img =>
      img.id === imageId
        ? { ...img, currentImage: defaultImage.currentImage, publicId: undefined }
        : img
    );

    saveImages(updatedImages);
  };

  const handlePreviewUrl = () => {
    if (newImageUrl.trim()) {
      setPreviewUrl(newImageUrl);
    }
  };

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const categories = [
    { id: 'all', label: 'Todas', count: images.length },
    { id: 'hero', label: 'Hero', count: images.filter(img => img.category === 'hero').length },
    { id: 'collections', label: 'Colecciones', count: images.filter(img => img.category === 'collections').length },
    { id: 'catalog', label: 'Catálogo', count: images.filter(img => img.category === 'catalog').length },
    { id: 'offers', label: 'Ofertas', count: images.filter(img => img.category === 'offers').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-serif text-gray-800">Gestión de Imágenes</h3>
        <p className="text-gray-600 text-sm mt-1">
          Administra y actualiza las imágenes de la página web
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Cómo usar imágenes
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Unsplash:</strong> Busca imágenes en <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">unsplash.com</a>, haz clic derecho en la imagen y selecciona "Copiar dirección de imagen"</li>
          <li>• <strong>Imgur:</strong> Sube tus propias imágenes a <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">imgur.com</a> y copia el enlace directo</li>
          <li>• <strong>Tamaños recomendados:</strong> Hero (1920x800px), Colecciones (800x800px)</li>
          <li>• Las imágenes se actualizan automáticamente en toda la página</li>
        </ul>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Image Preview */}
            <div className="aspect-video bg-gray-100 relative group">
              <img
                src={image.currentImage}
                alt={image.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEditImage(image)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Editar imagen"
                >
                  <Upload className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleResetImage(image.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Restaurar imagen por defecto"
                >
                  <RefreshCw className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{image.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{image.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  image.category === 'hero' ? 'bg-purple-100 text-purple-700' :
                  image.category === 'collections' ? 'bg-blue-100 text-blue-700' :
                  image.category === 'catalog' ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {image.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Editar Imagen</h3>
                <p className="text-sm text-white/80 mt-1">{editingImage.name}</p>
              </div>
              <button
                onClick={() => {
                  setEditingImage(null);
                  setNewImageUrl('');
                  setPreviewUrl('');
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Current Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen Actual
                </label>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={editingImage.currentImage}
                    alt="Actual"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargar Imagen desde PC
                </label>
                <ImageUploader
                  value={previewUrl}
                  uploadUrl="/api/upload"
                  onChange={(base64OrUrl, publicId) => {
                    setNewImageUrl(base64OrUrl);
                    setNewImagePublicId(publicId || '');
                    setPreviewUrl(base64OrUrl);
                  }}
                  onPreview={setPreviewUrl}
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
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handlePreviewUrl}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Vista Previa
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateImage}
                  className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    setEditingImage(null);
                    setNewImageUrl('');
                    setPreviewUrl('');
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}