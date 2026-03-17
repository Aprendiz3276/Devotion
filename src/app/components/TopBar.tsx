import { Truck, Info, Phone, Mail } from 'lucide-react';

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-medium">Envío gratis en compras superiores a $150.000</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>+57 302 4527378</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>contacto@devotion.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}