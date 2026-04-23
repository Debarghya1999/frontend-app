import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy,
  signal, computed, HostListener, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger, state, keyframes } from '@angular/animations';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  isHelpful: boolean;
  helpfulCount: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, TooltipModule, BreadcrumbComponent, GalleriaModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(32px)' }),
        animate('650ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('80ms', [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    // 3D Carousel flip animation
    trigger('carousel3D', [
      transition('* => next', [
        animate('420ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', keyframes([
          style({ opacity: 1, transform: 'rotateY(0deg) scale(1)', offset: 0 }),
          style({ opacity: 0.4, transform: 'rotateY(-15deg) scale(0.95)', offset: 0.4 }),
          style({ opacity: 0, transform: 'rotateY(-30deg) scale(0.9) translateX(-40px)', offset: 0.5 }),
          style({ opacity: 0, transform: 'rotateY(30deg) scale(0.9) translateX(40px)', offset: 0.51 }),
          style({ opacity: 0.4, transform: 'rotateY(10deg) scale(0.97)', offset: 0.75 }),
          style({ opacity: 1, transform: 'rotateY(0deg) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => prev', [
        animate('420ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', keyframes([
          style({ opacity: 1, transform: 'rotateY(0deg) scale(1)', offset: 0 }),
          style({ opacity: 0.4, transform: 'rotateY(15deg) scale(0.95)', offset: 0.4 }),
          style({ opacity: 0, transform: 'rotateY(30deg) scale(0.9) translateX(40px)', offset: 0.5 }),
          style({ opacity: 0, transform: 'rotateY(-30deg) scale(0.9) translateX(-40px)', offset: 0.51 }),
          style({ opacity: 0.4, transform: 'rotateY(-10deg) scale(0.97)', offset: 0.75 }),
          style({ opacity: 1, transform: 'rotateY(0deg) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => thumb', [
        animate('380ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
          style({ opacity: 0.3, transform: 'scale(0.92)', offset: 0.35 }),
          style({ opacity: 0.3, transform: 'scale(0.92)', offset: 0.55 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('tabSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'))
    ]),
    // Custom Modal Animations
    trigger('modalFade', [
      transition(':enter', [
        style({ opacity: 0, backdropFilter: 'blur(0px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, backdropFilter: 'blur(24px)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 0, backdropFilter: 'blur(0px)' }))
      ])
    ]),
    // 3D Scroll Effect for Modal
    trigger('modal3D', [
      transition('* => next', [
        animate('700ms cubic-bezier(0.23, 1, 0.32, 1)', keyframes([
          style({ opacity: 1, transform: 'translateZ(0px) rotateY(0deg)', offset: 0 }),
          style({ opacity: 0, transform: 'translateZ(-800px) rotateY(-60deg) translateX(-100vw)', offset: 0.49 }),
          style({ opacity: 0, transform: 'translateZ(-800px) rotateY(60deg) translateX(100vw)', offset: 0.51 }),
          style({ opacity: 1, transform: 'translateZ(0px) rotateY(0deg)', offset: 1 })
        ]))
      ]),
      transition('* => prev', [
        animate('700ms cubic-bezier(0.23, 1, 0.32, 1)', keyframes([
          style({ opacity: 1, transform: 'translateZ(0px) rotateY(0deg)', offset: 0 }),
          style({ opacity: 0, transform: 'translateZ(-800px) rotateY(60deg) translateX(100vw)', offset: 0.49 }),
          style({ opacity: 0, transform: 'translateZ(-800px) rotateY(-60deg) translateX(-100vw)', offset: 0.51 }),
          style({ opacity: 1, transform: 'translateZ(0px) rotateY(0deg)', offset: 1 })
        ]))
      ]),
      transition('* => thumb', [
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({ opacity: 1, transform: 'scale(1)', offset: 0 }),
          style({ opacity: 0, transform: 'scale(0.8) translateY(100px)', offset: 0.49 }),
          style({ opacity: 0, transform: 'scale(0.8) translateY(-100px)', offset: 0.51 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Core state
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  isLoading = signal(true);

  // Gallery / carousel state
  activeImageIndex = signal(0);
  displayGalleria = signal(false);
  modalActiveIndex = signal(0);
  modalCarouselState = signal<string>('idle');
  carouselState = signal<string>('idle');
  isZoomed = false;

  // Selection state
  selectedColor = signal<string | null>(null);
  selectedSize = signal<string | null>(null);
  quantity = signal(1);
  isWishlisted = signal(false);

  // UI state
  addedToBag = signal(false);
  activeTab = signal<string>('details');

  // Reviews state
  customerReviews = signal<Review[]>([
    {
      id: 'rev_1',
      userName: 'Aanya Sharma',
      rating: 5,
      date: 'October 12, 2025',
      title: 'Absolutely breathtaking craftsmanship',
      content: 'The attention to detail on this piece is phenomenal. I wore it to a wedding and received compliments all night. The fabric feels luxurious and the fit is incredibly flattering. Highly recommend the heritage packaging as well!',
      verifiedPurchase: true,
      isHelpful: false,
      helpfulCount: 24
    },
    {
      id: 'rev_2',
      userName: 'Meera Patel',
      rating: 4,
      date: 'September 28, 2025',
      title: 'Beautiful but sizing runs slightly small',
      content: 'I love the color and the intricate design. It looks exactly like the pictures. My only minor issue is that it feels a bit snug around the shoulders compared to other brands. I would suggest sizing up if you prefer a looser fit.',
      verifiedPurchase: true,
      isHelpful: false,
      helpfulCount: 8
    },
    {
      id: 'rev_3',
      userName: 'Kavita Singh',
      rating: 5,
      date: 'September 15, 2025',
      title: 'A timeless addition to my wardrobe',
      content: 'Everything about this shopping experience was perfect. The product arrived beautifully packaged and the quality exceeded my expectations. You can really tell this is a premium, artisanal item.',
      verifiedPurchase: false,
      isHelpful: false,
      helpfulCount: 12
    }
  ]);

  // 3D tilt state
  imageTiltTransform = '';
  private tiltTimeout: ReturnType<typeof setTimeout> | null = null;

  // Computed
  gallery = computed(() => this.product()?.gallery ?? [this.product()?.image ?? '']);
  activeImage = computed(() => this.gallery()[this.activeImageIndex()] ?? '');
  activeModalImage = computed(() => this.gallery()[this.modalActiveIndex()] ?? '');
  hasDiscount = computed(() => {
    const p = this.product();
    return p?.originalPrice && p.originalPrice > p.price;
  });
  canGoPrev = computed(() => this.activeImageIndex() > 0);
  canGoNext = computed(() => this.activeImageIndex() < this.gallery().length - 1);

  canGoPrevModal = computed(() => this.modalActiveIndex() > 0);
  canGoNextModal = computed(() => this.modalActiveIndex() < this.gallery().length - 1);

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const p = this.product();
    if (!p) return [];
    return [
      { label: 'Home', url: '/home' },
      { label: 'Collections', url: '/collections' },
      { label: p.productDescription }
    ];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(params => {
        const id = params.get('productId') ?? '';
        return this.productService.getProductById(id);
      }),
      takeUntil(this.destroy$)
    ).subscribe(product => {
      if (!product) {
        this.router.navigate(['/collections']);
        return;
      }
      this.product.set(product);
      this.selectedColor.set(product.colors?.[0] ?? null);
      this.selectedSize.set(null);
      this.activeImageIndex.set(0);
      this.quantity.set(1);
      this.isLoading.set(false);

      this.productService.getRelatedProducts(product.productId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(related => this.relatedProducts.set(related));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.tiltTimeout) clearTimeout(this.tiltTimeout);
  }

  // Carousel navigation — with 3D animation direction
  prevImage(): void {
    if (this.canGoPrev()) {
      this.carouselState.set('prev');
      this.activeImageIndex.update(i => i - 1);
    }
  }

  nextImage(): void {
    if (this.canGoNext()) {
      this.carouselState.set('next');
      this.activeImageIndex.update(i => i + 1);
    }
  }

  goToImage(index: number): void {
    if (index === this.activeImageIndex()) return;
    this.carouselState.set('thumb');
    this.activeImageIndex.set(index);
  }

  onCarouselDone(): void {
    this.carouselState.set('idle');
  }

  // Custom Modal Logic
  openGalleria(): void {
    this.modalActiveIndex.set(this.activeImageIndex());
    this.displayGalleria.set(true);
  }

  closeGalleria(): void {
    this.displayGalleria.set(false);
  }

  prevModalImage(): void {
    if (this.canGoPrevModal()) {
      this.modalCarouselState.set('prev');
      this.modalActiveIndex.update(i => i - 1);
    }
  }

  nextModalImage(): void {
    if (this.canGoNextModal()) {
      this.modalCarouselState.set('next');
      this.modalActiveIndex.update(i => i + 1);
    }
  }

  goToModalImage(index: number): void {
    if (index === this.modalActiveIndex()) return;
    this.modalCarouselState.set('thumb');
    this.modalActiveIndex.set(index);
  }

  onModalCarouselDone(): void {
    this.modalCarouselState.set('idle');
  }

  // 3D Tilt on mouse move
  onImageMouseMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -6;
    const tiltY = ((x - centerX) / centerX) * 8;
    this.imageTiltTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  onImageMouseLeave(): void {
    this.imageTiltTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  onImageMouseEnter(): void {
    this.imageTiltTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1.01, 1.01, 1.01)';
  }

  // Selectors
  selectColor(color: string): void { this.selectedColor.set(color); }
  selectSize(size: string): void { this.selectedSize.set(size); }

  isSizeUnavailable(size: string): boolean {
    return size === 'L'; // Demo mock
  }

  // Quantity
  incrementQty(): void {
    if (this.quantity() < 10) this.quantity.update(q => q + 1);
  }

  decrementQty(): void {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  // Actions
  addToBag(): void {
    this.addedToBag.set(true);
    setTimeout(() => this.addedToBag.set(false), 2500);
  }

  buyNow(): void { this.addToBag(); }

  toggleWishlist(): void { this.isWishlisted.update(v => !v); }

  // Tabs
  setTab(tab: string): void { this.activeTab.set(tab); }

  // Helpers
  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  getColorHex(colorName: string): string {
    const map: Record<string, string> = {
      'Crimson Red': '#83232f', 'Forest Green': '#2e5c4a',
      'Ivory White': '#f7f0e7', 'Midnight Blue': '#191970',
      'Antique Gold': '#b8860b', 'Obsidian': '#1e1b16',
    };
    return map[colorName] ?? '#888';
  }

  markHelpful(reviewId: string): void {
    this.customerReviews.update(reviews => 
      reviews.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            isHelpful: !r.isHelpful,
            helpfulCount: r.isHelpful ? r.helpfulCount - 1 : r.helpfulCount + 1
          };
        }
        return r;
      })
    );
  }

  trackByProductId(_: number, product: Product): string {
    return product.productId;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.displayGalleria()) {
      if (event.key === 'ArrowRight') this.nextModalImage();
      else if (event.key === 'ArrowLeft') this.prevModalImage();
      else if (event.key === 'Escape') this.closeGalleria();
    } else {
      if (event.key === 'ArrowRight') this.nextImage();
      else if (event.key === 'ArrowLeft') this.prevImage();
    }
  }
}
