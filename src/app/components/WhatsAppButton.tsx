import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/573024527378?text=Hola!%20Estoy%20interesado%20en%20sus%20productos', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <motion.button
        onClick={handleWhatsAppClick}
        className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl transition-colors duration-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        aria-label="Chat en WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Tooltip mejorado */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[200px] border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Necesitas ayuda</p>
              <p className="text-xs text-gray-500">Estamos en línea</p>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Chatea con nosotros ahora
          </div>
          <div className="flex items-center gap-1 text-xs text-[#25D366]">
            <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></div>
            <span className="font-medium">Respuesta inmediata</span>
          </div>
          
          {/* Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}