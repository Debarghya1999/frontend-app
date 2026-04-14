import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent {
  Math = Math;

  products = signal<Product[]>([
    {
      id: 1,
      name: 'Silk Blend Evening Dress',
      category: 'Dresses',
      price: 245.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1515562141207-4b873f03ffe4?w=400&h=500&fit=crop&q=80',
      badge: 'Sale',
      rating: 5,
      reviews: 128,
    },
    {
      id: 2,
      name: 'Premium Wool Coat',
      category: 'Outerwear',
      price: 389.99,
      image: 'https://images.unsplash.com/photo-1539533057440-7814baea1002?w=400&h=500&fit=crop&q=80',
      rating: 4.9,
      reviews: 95,
    },
    {
      id: 3,
      name: 'Classic Linen Blazer',
      category: 'Blazers',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1505164113596-e80fcf6a9144?w=400&h=500&fit=crop&q=80',
      badge: 'New',
      rating: 4.8,
      reviews: 52,
    },
    {
      id: 4,
      name: 'Tailored Trousers',
      category: 'Bottoms',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80',
      rating: 4.7,
      reviews: 76,
    },
  ]);

  toggleWishlist(event: Event): void {
    event.preventDefault();
    const button = event.target as HTMLElement;
    button.classList.toggle('active');
  }
}
