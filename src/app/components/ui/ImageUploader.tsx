import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  value: string;
  onChange: (base64OrUrl: string, publicId?: string) => void;
  onPreview?: (url: string) => void;
  className?: string;
  maxSize?: number; // in MB
  // If provided, the image will be uploaded to this endpoint and the response URL will be used.
  uploadUrl?: string;
  // If true, always attempt upload even if uploadUrl is not provided (will fallback to base64).
  forceBackendUpload?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  onPreview,
  className = '',
  maxSize = 5,
  uploadUrl,
  forceBackendUpload = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Use JPG, PNG, GIF o WEBP');
      return false;
    }

    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`El archivo es muy grande. Máximo ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsProcessing(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const backendUrl =
        uploadUrl ??
        (forceBackendUpload ? `${baseUrl}/api/upload`.replace(/\/\/+/, '/') : undefined);

      if (backendUrl) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(backendUrl, {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Upload failed: ${res.status}`);
          }

          const data = await res.json();
          if (data?.url) {
            onChange(data.url, data.public_id);
            if (onPreview) {
              onPreview(data.url);
            }
            toast.success('Imagen cargada exitosamente');
            return;
          }
        } catch (uploadError) {
          console.warn('Error uploading image to backend, falling back to base64:', uploadError);
          toast.error('No se pudo subir la imagen al servidor, se usará base64 (local)');
        }
      }

      const base64 = await convertToBase64(file);
      onChange(base64);
      if (onPreview) {
        onPreview(base64);
      }
      toast.success('Imagen cargada exitosamente');
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast.error('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (onPreview) {
      onPreview('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
          >
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => {
                  toast.error('Error al cargar la imagen');
                }}
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleClick}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Cambiar imagen"
              >
                <Upload className="w-5 h-5 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Eliminar imagen"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative aspect-video rounded-lg border-2 border-dashed
              cursor-pointer transition-all
              ${isDragging
                ? 'border-[#3B82F6] bg-blue-50 scale-105'
                : 'border-gray-300 bg-gray-50 hover:border-[#3B82F6] hover:bg-blue-50/50'
              }
              ${isProcessing ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-colors
                ${isDragging ? 'bg-[#3B82F6] text-white' : 'bg-gray-200 text-gray-400'}
              `}>
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-1">
                <p className={`font-medium ${isDragging ? 'text-[#3B82F6]' : 'text-gray-700'}`}>
                  {isProcessing ? 'Procesando imagen...' : isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra y suelta una imagen'}
                </p>
                <p className="text-sm text-gray-500">
                  o haz clic para seleccionar
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>JPG, PNG, GIF o WEBP</span>
                <span>•</span>
                <span>Máx {maxSize}MB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-2">
        También puedes usar URLs externas de Unsplash o Imgur
      </p>
    </div>
  );
}
