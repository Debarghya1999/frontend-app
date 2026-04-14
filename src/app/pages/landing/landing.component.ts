import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSectionComponent } from './sections/hero-section/hero-section.component';
import { FeaturedProductsComponent } from './sections/featured-products/featured-products.component';
import { TestimonialsComponent } from './sections/testimonials/testimonials.component';
import { TrustIndicatorsComponent } from './sections/trust-indicators/trust-indicators.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    FeaturedProductsComponent,
    TestimonialsComponent,
    TrustIndicatorsComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  showScrollButton = signal(false);

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollButton.set(scrollTop > 300);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
