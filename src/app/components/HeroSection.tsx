import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import heroDefaultImage from '@/assets/f073528f5eb1a9d86f3d2821d4098d60a8051f64.png';

export function HeroSection() {
  const [heroImage, setHeroImage] = useState(heroDefaultImage);

  const loadHeroImage = () => {
    const savedImages = localStorage.getItem('siteImages');
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        const heroImg = images.find((img: any) => img.id === 'hero-main');
        if (heroImg) {
          setHeroImage(heroImg.currentImage);
        }
      } catch (error) {
        console.error('Error loading hero image:', error);
      }
    }
  };

  useEffect(() => {
    loadHeroImage();
    
    // Listen for image updates
    const handleImagesUpdated = () => {
      loadHeroImage();
    };
    
    window.addEventListener('imagesUpdated', handleImagesUpdated);
    
    return () => {
      window.removeEventListener('imagesUpdated', handleImagesUpdated);
    };
  }, []);

  return (
    <section id="inicio" className="relative h-[50vh] min-h-[400px] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] max-h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroImage}
          alt="Devotion Tienda Masculina"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4 leading-tight font-black"
            style={{ fontFamily: 'Cormorant, serif' }}
          >
            <span className="text-white drop-shadow-lg">DEVOTION</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg mb-4 md:mb-5 font-light text-white/95"
          >
            Estilo y distinción masculina. Descubre nuestra exclusiva colección diseñada para el hombre moderno.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3"
          >
            <a
              href="#catalogo"
              className="bg-gray-800 hover:bg-gray-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base font-bold shadow-lg"
            >
              Explora la colección
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#ofertas"
              className="bg-white hover:bg-gray-100 text-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base text-center font-medium shadow-lg"
            >
              Ver ofertas
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}