import {
  Component,
  signal,
  AfterViewInit,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import gsap from 'gsap';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  fallbackBg: string;
  badge?: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements AfterViewInit {
  Math = Math;
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef<HTMLElement>;

  /** ─── Drag state ─── */
  private isDragging = false;
  private momentumTween: gsap.core.Tween | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Delay to ensure DOM is painted
    setTimeout(() => {
      this.initCardTilt();
      this.initDragScroll();
      this.updateProgress();
    }, 200);
  }

  /** Holographic card tilt — each product card tracks the mouse cursor in 3D. */
  private initCardTilt(): void {
    const cards: NodeListOf<HTMLElement> =
      this.el.nativeElement.querySelectorAll('.product-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        if (this.isDragging) return;
        const rect = card.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        gsap.to(card, {
          rotateY: nx * 14,
          rotateX: -ny * 10,
          z: 30,
          transformPerspective: 900,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          z: 0,
          duration: 1.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  /** Drag-to-scroll + smooth inertia momentum on the carousel track. */
  private initDragScroll(): void {
    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    if (!track) return;

    // Time-based velocity — px per millisecond, stable regardless of pointermove rate
    let velX = 0;
    let lastClientX = 0;
    let lastTime = 0;
    let startScrollLeft = 0;
    let startClientX = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      this.isDragging = true;
      startClientX = e.clientX;
      startScrollLeft = track.scrollLeft;
      lastClientX = e.clientX;
      lastTime = performance.now();
      velX = 0;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
      if (this.momentumTween) this.momentumTween.kill();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;
      const now = performance.now();
      const dt = now - lastTime;
      // Smooth rolling velocity (px / ms)
      if (dt > 0) {
        const raw = (e.clientX - lastClientX) / dt;
        velX = velX * 0.6 + raw * 0.4;   // exponential moving average
      }
      lastClientX = e.clientX;
      lastTime = now;

      const walk = e.clientX - startClientX;
      track.scrollLeft = startScrollLeft - walk;
      this.updateProgress();
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      track.classList.remove('is-dragging');
      this.applyMomentum(track, velX);
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);
    track.addEventListener('dragstart', (e) => e.preventDefault());
  }

  private applyMomentum(track: HTMLElement, velX: number): void {
    // velX is px/ms; scale to full deceleration distance
    const momentum = velX * 700;
    const target = track.scrollLeft - momentum;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const clamped = Math.max(0, Math.min(target, maxScroll));

    this.momentumTween = gsap.to(track, {
      scrollLeft: clamped,
      duration: 1.6,
      ease: 'power4.out',
      overwrite: 'auto',    // kill any competing arrow tween first
      onUpdate: () => this.updateProgress(),
    });
  }

  /** Scroll carousel by N cards (one card per click, smooth power3.inOut). */
  scrollBy(direction: -1 | 1): void {
    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    if (!track) return;
    const card = track.querySelector('.product-card') as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 40 : 320; // card + gap (matches CSS gap: 40px)
    // One card per click — predictable and deliberate
    const targetScroll = track.scrollLeft + direction * cardWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const clamped = Math.max(0, Math.min(targetScroll, maxScroll));

    gsap.to(track, {
      scrollLeft: clamped,
      duration: 0.85,
      ease: 'power3.inOut',   // symmetrical ease-in/out feels smooth on button press
      overwrite: 'auto',      // auto-kills any in-flight momentum or previous arrow tween
      onUpdate: () => this.updateProgress(),
    });
  }

  /** Update the CSS variable driving the progress bar width. */
  updateProgress(): void {
    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    const bar = this.el.nativeElement.querySelector('.progress-bar-fill') as HTMLElement;
    if (!track || !bar) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pct = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
    bar.style.width = `${pct}%`;

    // Enable/disable arrow buttons
    const prevBtn = this.el.nativeElement.querySelector('.carousel-arrow.prev') as HTMLButtonElement;
    const nextBtn = this.el.nativeElement.querySelector('.carousel-arrow.next') as HTMLButtonElement;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 0;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    const btn = event.currentTarget as HTMLButtonElement;
    btn.classList.toggle('active');
  }

  onImageError(event: Event, fallbackBg: string): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const wrapper = img.closest('.product-image') as HTMLElement;
    if (wrapper) {
      wrapper.style.background = fallbackBg;
      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder';
      placeholder.innerHTML = '<i class="pi pi-image"></i>';
      wrapper.appendChild(placeholder);
    }
  }

  products = signal<Product[]>([
    {
      id: 1,
      name: 'Handwoven Jamdani Saree',
      category: 'Sarees',
      price: 3499,
      originalPrice: 4599,
      image: 'images/products/jamdani_cotton_saree.png',
      fallbackBg: '#8b1a2e',
      badge: 'Bestseller',
      rating: 5,
      reviews: 214,
    },
    {
      id: 2,
      name: 'Cotton Ethnic Kurti',
      category: 'Kurtis',
      price: 1299,
      image: 'images/products/cotton_kurti.png',
      fallbackBg: '#6b3d6e',
      badge: 'New',
      rating: 4.9,
      reviews: 132,
    },
    {
      id: 3,
      name: 'Classic Bengal Panjabi',
      category: 'Menswear',
      price: 2199,
      originalPrice: 2999,
      image: 'images/products/bengal_panjabi.png',
      fallbackBg: '#2e5c4a',
      badge: 'Sale',
      rating: 4.8,
      reviews: 89,
    },
    {
      id: 4,
      name: 'Handcrafted Cotton Kurta',
      category: 'Kurtas',
      price: 1850,
      image: 'images/products/cotton_kurta.png',
      fallbackBg: '#1e3a5f',
      rating: 4.9,
      reviews: 67,
    },
    {
      id: 5,
      name: 'Tant Saree — Indigo Weave',
      category: 'Sarees',
      price: 2699,
      originalPrice: 3200,
      image: 'images/products/tant_saree_indigo.png',
      fallbackBg: '#1b3458',
      badge: 'Sale',
      rating: 4.7,
      reviews: 98,
    },
    {
      id: 6,
      name: 'Muslin Embroidered Kurta',
      category: 'Kurtas',
      price: 2450,
      image: 'images/products/muslin_kurta.png',
      fallbackBg: '#4a3322',
      badge: 'New',
      rating: 4.8,
      reviews: 55,
    },
    {
      id: 7,
      name: 'Kantha Stitch Dupatta',
      category: 'Accessories',
      price: 999,
      originalPrice: 1350,
      image: 'images/products/kantha_dupatta.png',
      fallbackBg: '#5c2b4a',
      badge: 'Sale',
      rating: 4.6,
      reviews: 171,
    },
    {
      id: 8,
      name: 'Dhakai Jamdani Kurti',
      category: 'Kurtis',
      price: 1799,
      image: 'images/products/dhakai_jamdani_kurti.png',
      fallbackBg: '#3b4a2e',
      badge: 'New',
      rating: 5,
      reviews: 43,
    },
    {
      id: 9,
      name: 'Silk Blend Lehenga',
      category: 'Lehengas',
      price: 5999,
      originalPrice: 7500,
      image: 'images/products/silk_lehenga.png',
      fallbackBg: '#6e1a1a',
      badge: 'Bestseller',
      rating: 4.9,
      reviews: 302,
    },
    {
      id: 10,
      name: 'Linen Kurta Pyjama Set',
      category: 'Menswear',
      price: 2999,
      image: 'images/products/linen_kurta_pyjama.png',
      fallbackBg: '#2c3e35',
      rating: 4.7,
      reviews: 78,
    },
  ]);
}
