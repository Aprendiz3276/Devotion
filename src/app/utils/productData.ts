export type Product = {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  colors?: string[];
  size?: string[];
  sizes?: string[];
  stock?: number;
  description?: string;
};

export const categories = [
  'Todos',
  'Jeans Urbanos',
  'Jeans Importados',
  'Busos 1.1',
  'Gorras',
  'Conjuntos',
  'Sudaderas',
  'Bolsos',
  'Pantalonetas',
  'Mochos',
  'Sacos',
];

const categoryImages: Record<string, string[]> = {
  'Jeans Urbanos': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400',
  ],
  'Jeans Importados': [
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400',
    'https://images.unsplash.com/photo-1582552938357-32b906d82c65?w=400',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
    'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400',
  ],
  'Busos 1.1': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400',
  ],
  'Gorras': [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400',
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
  ],
  'Conjuntos': [
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400',
    'https://images.unsplash.com/photo-1618453292459-a41a1e33f3c6?w=400',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
    'https://images.unsplash.com/photo-1490092732522-5618d8c7a1f3?w=400',
  ],
  'Sudaderas': [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
  ],
  'Bolsos': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
  ],
  'Pantalonetas': [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400',
    'https://images.unsplash.com/photo-1598032895407-b8164a03465c?w=400',
    'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400',
  ],
  'Mochos': [
    'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
  ],
  'Sacos': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
  ],
};

const productNames: Record<string, string[]> = {
  'Jeans Urbanos': ['Jean Skinny', 'Jean Recto', 'Jean Cargo', 'Jean Rasgado', 'Jean Clásico', 'Jean Slim Fit', 'Jean Biker', 'Jean Relaxed'],
  'Jeans Importados': ['Jean Premium', 'Jean Designer', 'Jean Luxury', 'Jean Fashion', 'Jean Elite', 'Jean Import', 'Jean Original', 'Jean Exclusive'],
  'Busos 1.1': ['Buso Básico', 'Buso Premium', 'Buso Capota', 'Buso Cuello Redondo', 'Buso Oversized', 'Buso Slim', 'Buso Estampado', 'Buso Liso'],
  'Gorras': ['Gorra Snapback', 'Gorra Trucker', 'Gorra Plana', 'Gorra Curva', 'Gorra Dad Hat', 'Gorra Beisbolera', 'Gorra Logo', 'Gorra Bordada'],
  'Conjuntos': ['Conjunto Deportivo', 'Conjunto Casual', 'Conjunto Premium', 'Conjunto Urbano', 'Conjunto Jogger', 'Conjunto Completo', 'Conjunto Set', 'Conjunto Fashion'],
  'Sudaderas': ['Sudadera Hoodie', 'Sudadera Capucha', 'Sudadera Zip', 'Sudadera Básica', 'Sudadera Premium', 'Sudadera Oversized', 'Sudadera Slim', 'Sudadera Logo'],
  'Bolsos': ['Bolso Mensajero', 'Carriel Clásico', 'Canguro Deportivo', 'Morral Urban', 'Bolso Crossbody', 'Riñonera Premium', 'Mochila Mini', 'Bolso Casual'],
  'Pantalonetas': ['Pantaloneta Deportiva', 'Pantaloneta Casual', 'Pantaloneta Jogger', 'Pantaloneta Básica', 'Pantaloneta Premium', 'Pantaloneta Gym', 'Short Urbano', 'Bermuda'],
  'Mochos': ['Mocho Básico', 'Mocho Premium', 'Mocho Oversize', 'Mocho Slim', 'Mocho Estampado', 'Mocho Liso', 'Mocho Fashion', 'Mocho Urban'],
  'Sacos': ['Saco Casual', 'Saco Formal', 'Blazer Slim', 'Saco Elegante', 'Chaqueta Sport', 'Saco Premium', 'Blazer Fashion', 'Saco Classic'],
};

const adjectives = ['Negro', 'Azul', 'Gris', 'Blanco', 'Beige', 'Verde', 'Café', 'Rojo', 'Navy', 'Camel'];

const getBasePrice = (category: string) => {
  switch (category) {
    case 'Gorras':
    case 'Bolsos':
      return 35000;
    case 'Conjuntos':
      return 150000;
    case 'Sacos':
      return 180000;
    default:
      return 70000;
  }
};

const getPrice = (base: number, index: number) => base + (index % 6) * 5000 + (index % 3) * 2000;

const getStock = (index: number) => 10 + (index % 12) * 3;

const getDiscount = (index: number) => (index % 4 === 0 ? 20 : undefined);

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  categories.slice(1).forEach((category) => {
    const basePrice = getBasePrice(category);
    for (let i = 0; i < 14; i++) {
      const price = getPrice(basePrice, i);
      const discount = getDiscount(i);
      const originalPrice = discount ? Math.floor(price / (1 - discount / 100)) : undefined;

      products.push({
        id: id++,
        name: `${productNames[category][i % productNames[category].length]} ${adjectives[i % adjectives.length]}`,
        price,
        originalPrice,
        image: categoryImages[category][i % categoryImages[category].length],
        category,
        colors: ['#3B82F6', '#000000', '#FFFFFF'].slice(0, (i % 3) + 1),
        size: ['S', 'M', 'L', 'XL', 'XXL'].slice(0, (i % 4) + 2),
        stock: getStock(i),
      });
    }
  });

  return products;
};

export const products: Product[] = generateProducts();
