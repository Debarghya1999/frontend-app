import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    data: {
      title: 'Sign In | The Artisan Boutique',
      description: 'Login or create an account to access our heritage collections.',
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
  {
    path: 'landing',
    component: LandingComponent,
    data: {
      title: 'Premium Boutique Fashion | Exclusive Collections',
      description: 'Discover premium boutique fashion with exclusive, high-quality pieces. Curated collections for the modern individual.',
    },
  },
];
