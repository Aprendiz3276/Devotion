import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings as SettingsIcon,
  Save,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Clock,
  CreditCard,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    // Store Info
    storeName: 'DEVOTION',
    storeDescription: 'Boutique de ropa masculina con estilo y distinción',
    email: 'contacto@devotion.com',
    phone: '+57 302 4527378',
    whatsapp: '+57 302 4527378',
    address: 'C.C la herradura local J-09 Tuluá-Valle',
    
    // Social Media
    instagram: '@devotion_boutique',
    facebook: 'DEVOTION Boutique',
    website: 'www.devotion.com',
    
    // Business Hours
    mondayFriday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Cerrado',
    
    // Shipping
    shippingCost: '15000',
    freeShippingMinimum: '150000',
    deliveryTime: '3-5 días hábiles',
    
    // Payment
    acceptedPayments: 'Efectivo, Transferencia, Tarjetas',
    bankAccount: 'Bancolombia - 1234567890',
    
    // Notifications
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    userRegistrationAlerts: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simular guardado
    setTimeout(() => {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setIsSaving(false);
      toast.success('Configuración guardada exitosamente');
    }, 1000);
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-2xl font-serif text-gray-800">Configuración</h3>
          <p className="text-gray-600 text-sm mt-1">Administra la configuración de tu tienda</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Store Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Información de la Tienda</h4>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={settings.storeDescription}
              onChange={(e) => handleChange('storeDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Teléfono
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Dirección
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Redes Sociales</h4>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Instagram className="w-4 h-4 inline mr-2" />
              Instagram
            </label>
            <input
              type="text"
              value={settings.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Facebook className="w-4 h-4 inline mr-2" />
              Facebook
            </label>
            <input
              type="text"
              value={settings.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Sitio Web
            </label>
            <input
              type="text"
              value={settings.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Horario de Atención</h4>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lunes - Viernes
            </label>
            <input
              type="text"
              value={settings.mondayFriday}
              onChange={(e) => handleChange('mondayFriday', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sábado
            </label>
            <input
              type="text"
              value={settings.saturday}
              onChange={(e) => handleChange('saturday', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domingo
            </label>
            <input
              type="text"
              value={settings.sunday}
              onChange={(e) => handleChange('sunday', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Shipping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Envíos</h4>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo de Envío (COP)
            </label>
            <input
              type="number"
              value={settings.shippingCost}
              onChange={(e) => handleChange('shippingCost', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Envío Gratis Desde (COP)
            </label>
            <input
              type="number"
              value={settings.freeShippingMinimum}
              onChange={(e) => handleChange('freeShippingMinimum', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de Entrega
            </label>
            <input
              type="text"
              value={settings.deliveryTime}
              onChange={(e) => handleChange('deliveryTime', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Payment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Métodos de Pago</h4>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Métodos Aceptados
            </label>
            <input
              type="text"
              value={settings.acceptedPayments}
              onChange={(e) => handleChange('acceptedPayments', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuenta Bancaria
            </label>
            <input
              type="text"
              value={settings.bankAccount}
              onChange={(e) => handleChange('bankAccount', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-[#3B82F6]" />
            <h4 className="text-lg font-serif text-gray-800">Preferencias de Notificaciones</h4>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'emailNotifications', label: 'Notificaciones por Email' },
            { key: 'orderAlerts', label: 'Alertas de Nuevas Órdenes' },
            { key: 'lowStockAlerts', label: 'Alertas de Stock Bajo' },
            { key: 'userRegistrationAlerts', label: 'Alertas de Nuevos Usuarios' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="w-5 h-5 text-[#3B82F6] border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6]"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </motion.div>
    </div>
  );
}