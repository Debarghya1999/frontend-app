export interface Product {
  productId: string;
  productDescription: string;
  subtitle?: string;
  category: string;
  fabric?: string;
  price: number;
  originalPrice?: number;
  discount?: number;      // Calculated percentage (e.g. 15)
  image: string;
  gallery?: string[];     // Array of image URLs for multi-image gallery
  accentColor?: string;   // Unified from fallbackBg and accentColor
  colors?: string[];      // Array of available colors
  sizes?: string[];       // Array of available sizes
  badge?: string;         // 'Bestseller', 'New', 'Sale', etc.
  isBestSeller?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isFeatured?: boolean;   // To identify products for the Home page carousel
  rating: number;
  reviews: number;        // Total number of reviews
  arrivedOn?: string;     // ISO date string for New Arrivals timeline
  description?: string;       // Full product description paragraph
  highlights?: string[];      // Key product feature bullets
  careInstructions?: string[];// Care/wash instructions
}