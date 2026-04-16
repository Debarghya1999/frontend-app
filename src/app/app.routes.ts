import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Sign In | The Artisan Boutique',
      description: 'Login or create an account to access our heritage collections.',
    },
  },
  {
    path: 'collections',
    loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent),
    data: {
      title: 'Collections | The Artisan Boutique',
      description: 'Browse our exclusive collection of designer fashion pieces.',
    },
  },
  {
    path: 'new-arrivals',
    loadComponent: () => import('./pages/new-arrivals/new-arrivals.component').then(m => m.NewArrivalsComponent),
    data: {
      title: 'New Arrivals | The Artisan Boutique',
      description: 'Discover the freshest Bengali ethnic wear — curated drop releases of sarees, kurtis, kurtas, and panjabis.',
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'The Artisan Boutique | Premium Bengali Ethnic Wear',
      description: 'Discover premium boutique fashion with exclusive, high-quality pieces. Curated collections for the modern individual.',
    },
  },
];
