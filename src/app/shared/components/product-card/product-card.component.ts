import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() isWishlisted: boolean = false;
  @Output() wishlistToggle = new EventEmitter<string>();

  imageError = false;

  onWishlistClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistToggle.emit(this.product.productId);
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  onImageError(): void {
    this.imageError = true;
  }
}
