import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, MessageCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150000 ? 0 : 10000;
  const total = subtotal + shipping;

  const handleWhatsAppOrder = () => {
    // Construir mensaje de WhatsApp
    let message = '🛍️ *PEDIDO DEVOTION*\n\n';
    message += '📦 *Productos:*\n';
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   • Talla: ${item.size}\n`;
      message += `   • Color: ${item.color}\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio: $${(item.price * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `💰 *Subtotal:* $${subtotal.toLocaleString()}\n`;
    message += `🚚 *Envío:* ${shipping === 0 ? 'GRATIS ✅' : `$${shipping.toLocaleString()}`}\n`;
    message += `💵 *Total:* $${total.toLocaleString()}\n\n`;
    message += `📍 *Dirección:* C.C LA HERRADURA LOCAL J-09`;

    // Número de WhatsApp de la tienda
    const phoneNumber = '573024527378'; // Formato: código país + número sin +
    
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Mostrar notificación
    toast.success('¡Redirigiendo a WhatsApp! Envía el mensaje para confirmar tu pedido.');
  };

  const handleCancel = () => {
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white">
              <div>
                <h2 className="font-serif text-2xl" style={{ fontFamily: 'Cormorant, serif' }}>
                  Mi Carrito
                </h2>
                <p className="text-sm text-white/90">
                  {cartItems.length} productos
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                  <button
                    onClick={onClose}
                    className="text-[#C9A961] hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b pb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">
                            Talla: {item.size} | Color: {item.color}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-gray-100"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#3B82F6]">
                                ${(item.price * item.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Botón de cancelar compra */}
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full mt-4 text-red-500 hover:text-red-600 text-sm py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Cancelar compra
                  </button>
                </>
              )}
            </div>

            {/* Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">¡Gratis!</span>
                      ) : (
                        `$${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Envío gratis en compras superiores a $150.000
                    </p>
                  )}
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[#3B82F6]">${total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar Pedido por WhatsApp
                </button>
              </div>
            )}

            {/* Cancel Dialog */}
            {showCancelDialog && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-4">¿Estás seguro?</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Esta acción vaciará tu carrito. ¿Deseas continuar?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowCancelDialog(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}