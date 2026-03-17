import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contacto" className="-mt-4 sm:-mt-6 md:-mt-8 pb-6 sm:pb-8 md:pb-10 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3" style={{ fontFamily: 'Cormorant, serif' }}>
            Contáctanos
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            Estamos aquí para ayudarte. Escríbenos y resolveremos tus dudas
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-xs sm:text-sm mb-1 sm:mb-1.5 text-gray-700 font-medium">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-xs sm:text-sm"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm mb-1 sm:mb-1.5 text-gray-700 font-medium">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all text-xs sm:text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm mb-1 sm:mb-1.5 text-gray-700 font-medium">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all resize-none text-xs sm:text-sm"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Enviar mensaje
              </button>
            </form>
          </motion.div>

          {/* Contact Info - Compact Layout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Contact Details Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 sm:p-2 bg-[#3B82F6] text-white rounded-lg">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Email</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed break-all">@moda.devotion</p>
                <p className="text-[10px] sm:text-xs text-gray-600 break-all">contacto@devotion.com</p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 sm:p-2 bg-[#3B82F6] text-white rounded-lg">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Teléfono</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">WhatsApp</p>
                <p className="text-[10px] sm:text-xs text-gray-600">+57 302 4527378</p>
              </div>

              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 sm:p-2 bg-[#3B82F6] text-white rounded-lg">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold">Ubicación</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600">C.C la herradura</p>
                <p className="text-[10px] sm:text-xs text-gray-600">local J-09 Tuluá-Valle</p>
              </div>

              <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-3 sm:p-4 shadow-md text-white">
                <h3 className="text-xs sm:text-sm font-semibold mb-2">Horario</h3>
                <div className="space-y-1 text-[10px] sm:text-xs">
                  <div className="flex justify-between gap-1">
                    <span>Lun - Vie:</span>
                    <span>9AM-6PM</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span>Sábado:</span>
                    <span>10AM-4PM</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span>Domingo:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map - More compact and responsive */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 sm:h-40 md:h-48 shadow-md overflow-hidden relative">
              <iframe
                title="Ubicación Tuluá"
                src="https://www.google.com/maps?q=Tulu%C3%A1+Valle+del+Cauca&output=embed"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
              <div className="absolute bottom-2 left-2 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded-lg shadow-sm">
                Tuluá, Valle del Cauca
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}