import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost: BlogPost | null;
  onSave: (post: BlogPost) => void;
}

export function BlogModal({ isOpen, onClose, editingPost, onSave }: BlogModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        description: editingPost.description,
        image: editingPost.image,
        category: editingPost.category,
      });
      setImagePreview(editingPost.image);
    } else {
      setFormData({ title: '', description: '', image: '', category: '' });
      setImagePreview('');
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.image) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const post: BlogPost = editingPost
      ? { ...editingPost, ...formData }
      : {
          id: Date.now().toString(),
          ...formData,
          date: new Date().toISOString(),
        };

    onSave(post);
    handleClose();
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', image: '', category: '' });
    setImagePreview('');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Por favor usa una imagen menor a 2MB');
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
      setIsUploadingImage(false);
      toast.success('Imagen cargada exitosamente');
    };

    reader.onerror = () => {
      toast.error('Error al cargar la imagen');
      setIsUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handlePasteImage = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (!blob) continue;

        if (blob.size > 2 * 1024 * 1024) {
          toast.error('La imagen es muy grande. Por favor usa una imagen menor a 2MB');
          return;
        }

        setIsUploadingImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData({ ...formData, image: base64String });
          setImagePreview(base64String);
          setIsUploadingImage(false);
          toast.success('Imagen pegada exitosamente');
        };

        reader.onerror = () => {
          toast.error('Error al cargar la imagen');
          setIsUploadingImage(false);
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[102]" />
      <div className="fixed inset-0 flex items-center justify-center z-[103] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] p-6 flex items-center justify-between z-10">
            <h3 className="text-2xl font-serif text-white">
              {editingPost ? 'Editar Post' : 'Crear Nuevo Post'}
            </h3>
            <button onClick={handleClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Las mejores tendencias de moda deportiva 2024"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2D6E0] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Ej: Tendencias, Consejos, Entrenamientos"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2D6E0] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Describe el contenido del post..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2D6E0] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del Post *
              </label>

              {/* Image Preview */}
              {(formData.image || imagePreview) && (
                <div className="mb-4 relative">
                  <img
                    src={formData.image || imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, image: '' });
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Area */}
              <div className="space-y-3">
                {/* Paste Area */}
                <div
                  onPaste={handlePasteImage}
                  tabIndex={0}
                  className="border-2 border-dashed border-[#F2D6E0] rounded-lg p-8 text-center cursor-pointer hover:border-[#E8C5CF] hover:bg-[#F2D6E0]/5 transition-all"
                >
                  <div className="space-y-2">
                    <div className="text-2xl">📋</div>
                    <div className="text-gray-700 font-medium">
                      <strong>Pega tu imagen aquí</strong>
                    </div>
                    <p className="text-sm text-gray-500">
                      Copia una imagen y pégala con <strong>Ctrl+V</strong> (Cmd+V en Mac)
                    </p>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm font-medium">O</div>

                {/* File Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="blog-image-upload"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="blog-image-upload"
                    className={`block w-full px-4 py-4 border-2 border-[#F2D6E0] rounded-lg text-center cursor-pointer hover:border-[#E8C5CF] hover:bg-[#F2D6E0]/5 transition-all ${
                      isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="text-2xl block mb-2">📁</span>
                    <span className="text-gray-700 font-medium">
                      {isUploadingImage ? '⏳ Cargando imagen...' : 'Seleccionar archivo desde tu computadora'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG o WEBP (máx. 2MB)</p>
                  </label>
                </div>

                <div className="text-center text-gray-500 text-sm font-medium">O</div>

                {/* URL Input */}
                <div>
                  <input
                    type="url"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="🔗 Pegar URL de imagen (https://...)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F2D6E0] focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Tip:</strong> Puedes copiar cualquier imagen de internet o tu computadora y
                  pegarla directamente haciendo clic en el área rosa y presionando Ctrl+V.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#F2D6E0] to-[#E8C5CF] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Save className="w-5 h-5" />
                {editingPost ? 'Actualizar' : 'Publicar'} Post
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
