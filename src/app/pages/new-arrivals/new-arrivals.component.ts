import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { FilterSidebarComponent } from '../../shared/components/filter-sidebar/filter-sidebar.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FilterState, getInitialFilterState } from '../../core/models/filter.model';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterSidebarComponent, ProductCardComponent],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NewArrivalsComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr        = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private productSvc = inject(ProductService);

  // ── UI State ───────────────────────────────────────────────────────────
  mobileFilterOpen = signal(false);
  wishlistIds      = new Set<string>();

  // ── Active Filter State ────────────────────────────────────────────────
  activeFilters: FilterState = getInitialFilterState();
  selectedTimelines:  string[] = [];
  sortBy = 'newest';

  // ── Pagination ─────────────────────────────────────────────────────────
  currentPage    = 0;
  readonly pageSize = 9;

  // ── Sort Options ───────────────────────────────────────────────────────
  readonly sortOptions = [
    { value: 'newest',     label: 'Newest Arrivals'    },
    { value: 'price-low',  label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Best Selling'       },
  ];

  readonly timelineOptions = [
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'earlier',   label: 'Earlier This Year' },
  ];

  // ── NEW Arrivals Catalogue ─────────────────────────────────────────────
  allProducts: Product[] = [];
  productsLoading = signal(true);

  // ── Derived Getters ────────────────────────────────────────────────────
  get filteredProducts(): Product[] {
    let products = [...this.allProducts];

    const { 
      bestSellersOnly, 
      discountedOnly,
      priceMax, 
      selectedCategories, 
      selectedFabrics, 
      selectedColors, 
      selectedSizes 
    } = this.activeFilters;

    if (bestSellersOnly) {
      products = products.filter(p => p.isBestSeller);
    }
    if (discountedOnly) {
      products = products.filter(p => p.isOnSale);
    }
    if (priceMax < 100000) {
      products = products.filter(p => p.price <= priceMax);
    }
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedFabrics.length > 0) {
      products = products.filter(p => p.fabric && selectedFabrics.includes(p.fabric));
    }
    if (selectedColors.length > 0) {
      products = products.filter(p => p.colors && p.colors.some(c => selectedColors.includes(c)));
    }
    if (selectedSizes.length > 0) {
      products = products.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (this.selectedTimelines.length > 0) {
      products = products.filter(p => {
        if (!p.arrivedOn) return false;
        const month = p.arrivedOn.split('-')[1]; // Expected date format YYYY-MM-DD
        if (this.selectedTimelines.includes('thisMonth') && month === '04') return true;
        if (this.selectedTimelines.includes('lastMonth') && month === '03') return true;
        if (this.selectedTimelines.includes('earlier')   && (month === '02' || month === '01')) return true;
        return false;
      });
    }

    switch (this.sortBy) {
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'popularity': products.sort((a, b) => b.reviews - a.reviews); break;
      default:           products.sort((a, b) => {
        const dateA = a.arrivedOn ? new Date(a.arrivedOn).getTime() : 0;
        const dateB = b.arrivedOn ? new Date(b.arrivedOn).getTime() : 0;
        return dateB - dateA;
      }); break;
    }

    return products;
  }

  get paginatedProducts(): Product[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get activeFilterCount(): number {
    const f = this.activeFilters;
    return (
      (f.bestSellersOnly ? 1 : 0) +
      (f.discountedOnly ? 1 : 0) +
      (f.priceMax < 100000 ? 1 : 0) +
      f.selectedCategories.length +
      f.selectedFabrics.length +
      f.selectedColors.length +
      f.selectedSizes.length +
      this.selectedTimelines.length
    );
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  // ── Service Data Loading ───────────────────────────────────────────────
  private loadProducts(): void {
    this.productsLoading.set(true);
    this.productSvc.getProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((products: Product[]) => products.filter(p => p.isNew))
      )
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          this.productsLoading.set(false);
          this.animateCards(0.4);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[NewArrivalsComponent] Failed to load products:', err);
          this.productsLoading.set(false);
        }
      });
  }

  // ── GSAP Animations ────────────────────────────────────────────────────
  private gsapCtx: any;

  private initAnimations(): void {
    try {
      if (typeof gsap === 'undefined') return;
      if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

      this.gsapCtx = gsap.context(() => {
        const ease = 'power3.out';

        // ① Header Entrance
        gsap.timeline({ defaults: { ease } })
          .from('.collections-breadcrumb', { opacity: 0, y: -10, duration: 0.5 })
          .from('.collections-headline',   { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
          .from('.headline-rule',   { scaleX: 0, transformOrigin: 'left', duration: 0.8 }, '-=0.4')
          .from('.collections-meta',       { opacity: 0, y: 15, duration: 0.5 }, '-=0.5');

        // ② Sidebar & Grid
        gsap.from('app-filter-sidebar', {
          opacity: 0, x: -30,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.4
        });

        gsap.from('.collections-toolbar', { opacity: 0, y: 20, duration: 0.5, ease, delay: 0.7 });
        
        this.animateCards(0.8);

        // ⑤ Pagination
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.from('.collections-pagination', {
            opacity: 0, y: 30,
            duration: 0.8,
            ease,
            scrollTrigger: {
              trigger: '.collections-pagination',
              start: 'top 95%',
            }
          });
        }
      });
    } catch (e) {
      console.warn('[NewArrivalsComponent] Animation error:', e);
    }
  }

  animateCards(delay: number = 0): void {
    try {
      if (typeof gsap === 'undefined') return;
      setTimeout(() => {
        gsap.fromTo('.product-card', 
          { opacity: 0, y: 40, scale: 0.98 },
          { 
            opacity: 1, y: 0, scale: 1, 
            duration: 0.6, 
            stagger: { amount: 0.6, from: 'start' },
            ease: 'power3.out',
            delay: delay
          }
        );
      }, 50);
    } catch (e) {}
  }

  // ── Filter Actions ─────────────────────────────────────────────────────
  onFilterChange(newState: FilterState): void {
    this.activeFilters = newState;
    this.currentPage = 0;
    this.animateCards();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.animateCards();
  }

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.animateCards();
  }

  toggleTimeline(id: string): void {
    const idx = this.selectedTimelines.indexOf(id);
    idx === -1 ? this.selectedTimelines.push(id) : this.selectedTimelines.splice(idx, 1);
    this.currentPage = 0;
    this.animateCards();
  }

  toggleWishlist(productId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.wishlistIds.has(productId) ? this.wishlistIds.delete(productId) : this.wishlistIds.add(productId);
    this.cdr.markForCheck();
  }

  resetFilters(): void {
    this.activeFilters = getInitialFilterState();
    this.selectedTimelines = [];
    this.currentPage = 0;
    this.animateCards();
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  trackByProductId(_: number, p: Product): string { return p.productId; }


  ngOnDestroy(): void {
    if (this.gsapCtx) this.gsapCtx.revert();
  }
}
