// Utility to load products from localStorage with fallback to defaults

export interface Product {
  id: string;
  name: string;
  category: string;
  section: 'catalog' | 'collections' | 'offers';
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  description: string;
  colors: string[];
  sizes?: string[];
  discount?: number;
  createdAt: string;
}

export function loadProductsBySection(section: 'catalog' | 'collections' | 'offers'): Product[] {
  try {
    const savedProducts = localStorage.getItem('allProducts');
    if (savedProducts) {
      const allProducts: Product[] = JSON.parse(savedProducts);
      return allProducts.filter(p => p.section === section);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  return [];
}

export function loadAllProducts(): Product[] {
  try {
    const savedProducts = localStorage.getItem('allProducts');
    if (savedProducts) {
      return JSON.parse(savedProducts);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
  return [];
}
