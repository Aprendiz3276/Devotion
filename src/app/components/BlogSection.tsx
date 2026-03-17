import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: '5 Tendencias en Moda Masculina para 2026',
    excerpt: 'Descubre las tendencias que están revolucionando el mundo de la moda masculina de lujo.',
    image: 'https://images.unsplash.com/photo-1645318800862-0d343ebd4e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZmFzaGlvbiUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3Njc1NDQ3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '5 Ene 2026',
    category: 'Tendencias',
  },
  {
    id: 2,
    title: 'Cómo Elegir el Traje Perfecto para Cada Ocasión',
    excerpt: 'Consejos prácticos para combinar estilo y elegancia en tu vestuario ejecutivo.',
    image: 'https://images.unsplash.com/photo-1617185719150-06b4f4cfbbea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGd5bSUyMG91dGZpdHxlbnwxfHx8fDE3Njc1NDQ3Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '3 Ene 2026',
    category: 'Estilo',
  },
  {
    id: 3,
    title: 'Los Mejores Materiales para Vestir con Clase',
    excerpt: 'Conoce las telas premium que te mantendrán elegante en cualquier situación.',
    image: 'https://images.unsplash.com/photo-1767303595123-c624497afb18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHlvZ2ElMjBvdXRmaXR8ZW58MXx8fHwxNzY3NTQ0NzgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '1 Ene 2026',
    category: 'Guías',
  },
  {
    id: 4,
    title: 'Estilo Ejecutivo: El Poder del Buen Vestir',
    excerpt: 'Descubre cómo proyectar confianza y autoridad a través de tu imagen.',
    image: 'https://images.unsplash.com/photo-1649789248266-ef1c7f744f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZpdG5lc3MlMjBtb3RpdmF0aW9ufGVufDF8fHx8MTc2NzU0NzIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    date: '30 Dic 2025',
    category: 'Negocios',
  },
  {
    id: 5,
    title: 'Moda Casual Elegante: Looks Versátiles',
    excerpt: 'Aprende a crear outfits sofisticados que puedes usar en cualquier ocasión.',
    image: 'https://images.unsplash.com/flagged/photo-1595559786009-a696d446ad4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHdvbWFuJTIwc3BvcnRzJTIwb3V0Zml0fGVufDF8fHx8MTc2NzU1MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    date: '28 Dic 2025',
    category: 'Estilo',
  },
  {
    id: 6,
    title: 'Trajes con Estilo',
    excerpt: 'Descubre los mejores looks para el caballero moderno.',
    image: 'https://images.unsplash.com/photo-1767128890948-0e3f70016b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdvcmtvdXQlMjBzcG9ydHMlMjBmYXNoaW9ufGVufDF8fHx8MTc2NzU2Mzc3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    date: '26 Dic 2025',
    category: 'Moda',
  },
  {
    id: 7,
    title: 'Elegancia Atemporal: Clásicos Renovados',
    excerpt: 'El negro y dorado dominan la moda masculina de lujo esta temporada.',
    image: 'https://images.unsplash.com/photo-1720590460224-d00c7c3e361d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHdvbWFuJTIwcGluayUyMG91dGZpdHxlbnwxfHx8fDE3Njc1NjM3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    date: '24 Dic 2025',
    category: 'Tendencias',
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 lg:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4" style={{ fontFamily: 'Cormorant, serif' }}>
            Blog & Inspiración
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Tips, tendencias y todo sobre moda masculina de lujo
          </p>
        </motion.div>

        {/* Blog Posts Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {posts.slice(0, 4).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="bg-[#C9A961] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg mb-2 group-hover:text-[#C9A961] transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                <button className="flex items-center gap-1 text-xs sm:text-sm text-[#C9A961] hover:gap-2 transition-all">
                  Leer más
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Instagram Feed - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6"
        >
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2" style={{ fontFamily: 'Cormorant, serif' }}>
              Síguenos en Instagram
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">@prestige.moda.lujo</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-md overflow-hidden cursor-pointer group"
                >
                  <ImageWithFallback
                    src={posts[(i - 1) % posts.length].image}
                    alt={`Instagram post ${i}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}