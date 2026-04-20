import {
  Component,
  signal,
  AfterViewInit,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollRevealDirective } from '../../../../shared/directives/scroll-reveal.directive';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective, ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.css',
})
export class FeaturedProductsComponent implements OnInit, AfterViewInit {
  Math = Math;
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private productService = inject(ProductService);

  @ViewChild('carousel', { static: false }) carouselRef!: ElementRef<HTMLElement>;

  /** ─── Drag state ─── */
  private isDragging = false;
  private momentumTween: gsap.core.Tween | null = null;

  products = signal<Product[]>([]);
  wishlistIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      this.initSectionHeaderStagger();
      this.initCardCascade();
      this.initCardTilt();
      this.initDragScroll();
      this.updateProgress();
    }, 500); // Increased delay to ensure data is loaded and DOM rendered
  }

  private loadProducts(): void {
    this.productService.getFeaturedProducts().subscribe((data) => {
      this.products.set(data);
    });
  }

  /**
   * Framer Motion-style stagger on section header children:
   * eyebrow → title → subtitle enter sequentially.
   */
  private initSectionHeaderStagger(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const headerEl = this.el.nativeElement.querySelector('.section-header');
    if (!headerEl) return;
    const children = [
      headerEl.querySelector('.section-eyebrow'),
      headerEl.querySelector('.section-title'),
      headerEl.querySelector('.section-subtitle'),
    ].filter(Boolean);

    gsap.set(children, { opacity: 0, y: 32, scale: 0.97 });

    ScrollTrigger.create({
      trigger: headerEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'back.out(1.5)',
        });
      },
    });
  }

  /**
   * Card stagger cascade: each product card enters with spring-scale physics,
   * staggered 60ms apart — the GSAP equivalent of Framer Motion `whileInView`
   * + `staggerChildren: 0.06`.
   */
  private initCardCascade(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    if (!track) return;
    const cards: HTMLElement[] = Array.from(track.querySelectorAll('.product-card'));

    // Set initial state — cards hidden below and compressed
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.88 });

    ScrollTrigger.create({
      trigger: track,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.06,         // 60ms offset — Framer staggerChildren rhythm
          ease: 'back.out(1.6)', // Spring pop — Framer Motion default spring feel
          clearProps: 'scale',
        });
      },
    });
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

  toggleWishlist(productId: string): void {
    const next = new Set(this.wishlistIds());
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    this.wishlistIds.set(next);
  }
}
