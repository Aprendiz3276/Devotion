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

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  notes: string;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'efectivo',
    notes: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150000 ? 0 : 10000;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!checkoutForm.customerName.trim() || !checkoutForm.customerEmail.trim() || 
        !checkoutForm.customerPhone.trim() || !checkoutForm.shippingAddress.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutForm.customerEmail)) {
      toast.error('Email inválido');
      return;
    }

    setIsSubmitting(true);

    try {
      // Cargar órdenes existentes
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');

      // Crear nueva orden
      const newOrder = {
        id: `order-${Date.now()}`,
        customer: checkoutForm.customerName,
        email: checkoutForm.customerEmail,
        phone: checkoutForm.customerPhone,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        total: total,
        status: 'pending' as const,
        paymentMethod: checkoutForm.paymentMethod,
        shippingAddress: checkoutForm.shippingAddress,
        date: new Date().toISOString(),
        notes: checkoutForm.notes || '',
        customerName: checkoutForm.customerName,
        customerEmail: checkoutForm.customerEmail,
      };

      // Guardar orden
      existingOrders.push(newOrder);
      localStorage.setItem('adminOrders', JSON.stringify(existingOrders));

      // Crear notificación
      const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        type: 'order',
        title: 'Nueva orden recibida',
        message: `${checkoutForm.customerName} ha realizado una compra de $${total.toLocaleString('es-CO')}`,
        date: new Date().toISOString(),
        read: false,
        priority: 'high',
      });
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));

      // Construir mensaje de WhatsApp
      let message = '🛍️ *PEDIDO DEVOTION*\n\n';
      message += '*Cliente:* ' + checkoutForm.customerName + '\n';
      message += '*Email:* ' + checkoutForm.customerEmail + '\n';
      message += '*Teléfono:* ' + checkoutForm.customerPhone + '\n';
      message += '*Dirección:* ' + checkoutForm.shippingAddress + '\n';
      message += '*Método de pago:* ' + checkoutForm.paymentMethod + '\n\n';
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
      
      if (checkoutForm.notes) {
        message += `📝 *Notas:* ${checkoutForm.notes}\n\n`;
      }
      
      message += '✅ Pedido registrado en el sistema';

      // Enviar a WhatsApp
      const phoneNumber = '573024527378';
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Limpiar carrito
      clearCart();

      // Cerrar formulario
      setShowCheckoutForm(false);
      onClose();

      toast.success('¡Pedido enviado a WhatsApp! Se ha guardado en nuestro sistema.');
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      toast.error('Error al procesar la orden');
    } finally {
      setIsSubmitting(false);
    }
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
                  onClick={() => setShowCheckoutForm(true)}
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

            {/* Checkout Form Modal */}
            <AnimatePresence>
              {showCheckoutForm && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCheckoutForm(false)}
                    className="absolute inset-0 bg-black/60 z-50"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-serif text-gray-800">Información de Compra</h3>
                      <button
                        onClick={() => setShowCheckoutForm(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      {/* Nombre */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={checkoutForm.customerName}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, customerName: e.target.value })}
                          placeholder="Ej: María González"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={checkoutForm.customerEmail}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, customerEmail: e.target.value })}
                          placeholder="Ej: maria@ejemplo.com"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={checkoutForm.customerPhone}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, customerPhone: e.target.value })}
                          placeholder="Ej: 3001234567"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Dirección */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de Envío *
                        </label>
                        <textarea
                          value={checkoutForm.shippingAddress}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, shippingAddress: e.target.value })}
                          placeholder="Ej: C.C LA HERRADURA LOCAL J-09, Calle 10 #20-30"
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none resize-none"
                        />
                      </div>

                      {/* Método de Pago */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Método de Pago *
                        </label>
                        <select
                          value={checkoutForm.paymentMethod}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="bancolombia">Bancolombia</option>
                          <option value="nequi">Nequi</option>
                          <option value="daviplata">Daviplata</option>
                        </select>
                      </div>

                      {/* Notas */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas Adicionales (opcional)
                        </label>
                        <textarea
                          value={checkoutForm.notes}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                          placeholder="Ej: Dejar en la puerta, no tocar el timbre, etc."
                          rows={2}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none resize-none"
                        />
                      </div>

                      {/* Resumen de compra */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-3">Resumen de Compra</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${subtotal.toLocaleString('es-CO')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío:</span>
                            <span>{shipping === 0 ? 'GRATIS ✅' : `$${shipping.toLocaleString('es-CO')}`}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-[#3B82F6]">${total.toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setShowCheckoutForm(false)}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={isSubmitting}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-lg hover:from-[#2563EB] hover:to-[#1D4ED8] transition-colors font-medium disabled:opacity-50"
                        >
                          {isSubmitting ? 'Procesando...' : 'Completar Compra'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}