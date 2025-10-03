export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  localImagePath?: string; // For local images in public/products
  sizes: string[];
  colors: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  type: 'clothing' | 'accessory' | 'footwear';
  tags: string[];
  material?: string;
  care_instructions?: string;
}

// Sample product data - you can modify these or add your own
export const sampleProducts: ProductData[] = [
  {
    id: '1',
    name: 'Classic Blue Denim Jacket',
    description: 'Timeless blue denim jacket perfect for casual outings. Made from high-quality cotton denim with a comfortable fit and durable construction.',
    price: 79.99,
    category: 'jackets',
    imageUrl: '/products/product-1.jpg',
    localImagePath: '/products/product-1.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Light Blue', 'Dark Blue'],
    gender: 'unisex',
    type: 'clothing',
    tags: ['casual', 'denim', 'jacket', 'everyday'],
    material: '100% Cotton Denim',
    care_instructions: 'Machine wash cold, tumble dry low'
  },
  {
    id: '2',
    name: 'Casual Knit Sweater',
    description: 'Cozy and comfortable knit sweater perfect for everyday wear. Soft fabric with excellent warmth and breathability.',
    price: 59.99,
    category: 'sweaters',
    imageUrl: '/products/product-2.jpg',
    localImagePath: '/products/product-2.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Navy', 'Beige', 'Black'],
    gender: 'unisex',
    type: 'clothing',
    tags: ['casual', 'knit', 'sweater', 'comfort'],
    material: '80% Cotton, 20% Polyester',
    care_instructions: 'Hand wash recommended, lay flat to dry'
  },
  {
    id: '3',
    name: 'Classic White Shirt',
    description: 'Timeless white button-down shirt suitable for both formal and casual occasions. Premium cotton fabric with excellent fit.',
    price: 45.99,
    category: 'shirts',
    imageUrl: '/products/product-3.avif',
    localImagePath: '/products/product-3.avif',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Pink', 'Light Gray'],
    gender: 'unisex',
    type: 'clothing',
    tags: ['formal', 'casual', 'shirt', 'classic'],
    material: '100% Premium Cotton',
    care_instructions: 'Machine wash warm, iron if needed'
  },
  {
    id: '4',
    name: 'Black Pullover Hoodie',
    description: 'Comfortable black hoodie with front pocket and adjustable drawstring. Perfect for casual wear and workouts.',
    price: 69.99,
    category: 'hoodies',
    imageUrl: '/products/product-4.jpg',
    localImagePath: '/products/product-4.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
    gender: 'unisex',
    type: 'clothing',
    tags: ['casual', 'hoodie', 'comfort', 'streetwear'],
    material: '80% Cotton, 20% Polyester Fleece',
    care_instructions: 'Machine wash cold, tumble dry low'
  },
  {
    id: '5',
    name: 'Summer Floral Dress',
    description: 'Light and breezy summer dress with beautiful floral pattern. Perfect for warm weather and special occasions.',
    price: 89.99,
    category: 'dresses',
    imageUrl: '/products/product-5.avif',
    localImagePath: '/products/product-5.avif',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Print', 'Solid Blue', 'Solid Pink', 'White'],
    gender: 'women',
    type: 'clothing',
    tags: ['summer', 'dress', 'floral', 'casual'],
    material: '100% Rayon',
    care_instructions: 'Hand wash cold, hang dry'
  }
];

// Helper functions
export const getProductsByCategory = (category: string): ProductData[] => {
  return sampleProducts.filter(product => product.category === category);
};

export const getProductsByGender = (gender: string): ProductData[] => {
  return sampleProducts.filter(product => product.gender === gender || product.gender === 'unisex');
};

export const getProductById = (id: string): ProductData | undefined => {
  return sampleProducts.find(product => product.id === id);
};
