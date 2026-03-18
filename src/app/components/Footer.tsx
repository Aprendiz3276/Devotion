import { motion } from 'motion/react';
import { Facebook, Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2" style={{ fontFamily: 'Cormorant, serif' }}>
                Suscríbete al Newsletter
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                Recibe 10% de descuento en tu primera compra y mantente al día con nuestras novedades
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-[#3B82F6] transition-colors text-sm sm:text-base"
              />
              <button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#3B82F6] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap text-white font-medium">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="relative flex flex-col">
                <div className="relative mb-1">
                  <div className="inline-block">
                    <h3 className="font-serif text-lg sm:text-xl tracking-tight leading-tight font-black" style={{ fontFamily: 'Cormorant, serif' }}>
                      <span className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent">
                        DEVOTION
                      </span>
                    </h3>
                    <div className="h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] mt-0.5" />
                  </div>
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 tracking-[0.25em] uppercase mt-2">Ropa Masculina</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-xs sm:text-sm">
              Ropa masculina con estilo y distinción. Diseñada para el hombre moderno.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="mailto:devotionstore8@gmail.com"
                className="p-2 bg-white/10 hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#2563EB] rounded-full transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="mailto:devotionstore8@gmail.com"
                className="p-2 bg-white/10 hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#2563EB] rounded-full transition-all"
                aria-label="Email"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://wa.me/573024527378"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#2563EB] rounded-full transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
            <p className="text-gray-400 mt-3 text-xs">
              Correo: <a href="mailto:devotionstore8@gmail.com" className="text-[#3B82F6] hover:underline">devotionstore8@gmail.com</a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <a href="#inicio" className="hover:text-[#3B82F6] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-[#3B82F6] transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#colecciones" className="hover:text-[#3B82F6] transition-colors">
                  Colecciones
                </a>
              </li>
              <li>
                <a href="#ofertas" className="hover:text-[#3B82F6] transition-colors">
                  Ofertas
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Servicio al Cliente</h4>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-[#3B82F6] transition-colors">
                  Políticas de Devolución
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#3B82F6] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#3B82F6] transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#3B82F6] transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#3B82F6] transition-colors">
                  Guía de Tallas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 font-semibold">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <span className="break-all">contacto@devotion.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <span>+57 302 4527378</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <span>C.C la herradura local J-09 Tuluá-Valle</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment & Security */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              Métodos de pago: Bancolombia, Nequi, Daviplata, Efectivo
            </div>
            <div className="text-gray-400 text-sm">
              Compra segura - Pago contraentrega disponible
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          © 2026 DEVOTION. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}