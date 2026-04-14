import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';

interface TrustIndicator {
  id: number;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-trust-indicators',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './trust-indicators.component.html',
  styleUrl: './trust-indicators.component.css',
})
export class TrustIndicatorsComponent {
  indicators = signal<TrustIndicator[]>([
    {
      id: 1,
      icon: 'pi-sparkles',
      title: 'Premium Quality',
      description: 'Curated cotton pieces handcrafted by authentic Bengal weavers',
    },
    {
      id: 2,
      icon: 'pi-truck',
      title: 'Fast Delivery',
      description: 'Free shipping on orders over ₹1000, typically delivered in 3-5 days',
    },
    {
      id: 3,
      icon: 'pi-sync',
      title: 'Easy Returns',
      description: '30-day hassle-free returns and exchanges',
    },
    {
      id: 4,
      icon: 'pi-lock',
      title: 'Secure',
      description: 'Protected checkout and secure payment processing',
    },
  ]);
}
