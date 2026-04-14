import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {
      title: 'Premium Boutique Fashion | Exclusive Collections',
      description: 'Discover premium boutique fashion with exclusive, high-quality pieces. Curated collections for the modern individual.',
    },
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent),
    data: {
      title: 'Shop | Premium Boutique',
      description: 'Browse our exclusive collection of designer fashion pieces.',
    },
  },
];
