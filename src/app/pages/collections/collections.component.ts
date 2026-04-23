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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { FilterSidebarComponent } from '../../shared/components/filter-sidebar/filter-sidebar.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb.component';
import { FilterState, getInitialFilterState } from '../../core/models/filter.model';

declare const gsap: any;
declare const ScrollTrigger: any;

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterSidebarComponent, ProductCardComponent, BreadcrumbComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CollectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr        = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private productSvc = inject(ProductService);

  // ── UI State ───────────────────────────────────────────────────────────
  mobileFilterOpen = signal(false);
  wishlistIds      = new Set<string>();

  // ── Active Filter State ────────────────────────────────────────────────
  activeFilters: FilterState = getInitialFilterState();
  sortBy = 'newest';

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/home' },
    { label: 'Collections' }
  ];

  // ── Pagination ─────────────────────────────────────────────────────────
  currentPage    = 0;
  readonly pageSize = 9;

  // ── Sort Options ───────────────────────────────────────────────────────
  readonly sortOptions = [
    { value: 'newest',     label: 'Heritage (Newest First)' },
    { value: 'price-high', label: 'Price: High to Low'      },
    { value: 'price-low',  label: 'Price: Low to High'      },
    { value: 'popularity', label: 'Popularity'              },
  ];

  // ── Product Catalogue ──────────────────────────────────────────────────
  allProducts: Product[] = [];
  productsLoading = signal(true);

  // ── Derived Getters ────────────────────────────────────────────────────
  get filteredProducts(): Product[] {
    let products = [...this.allProducts];

    const { 
      bestSellersOnly, 
      newArrivalsOnly, 
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
    if (newArrivalsOnly) {
      products = products.filter(p => p.isNew);
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

    switch (this.sortBy) {
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'popularity': products.sort((a, b) => b.reviews - a.reviews); break;
      default:           products.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
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
      (f.newArrivalsOnly ? 1 : 0) +
      (f.discountedOnly ? 1 : 0) +
      (f.priceMax < 100000 ? 1 : 0) +
      f.selectedCategories.length +
      f.selectedFabrics.length +
      f.selectedColors.length +
      f.selectedSizes.length
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.allProducts = products;
          this.productsLoading.set(false);
          this.animateCards();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[CollectionsComponent] Failed to load products:', err);
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

        // ① Header sequence
        gsap.timeline({ defaults: { ease } })
          .from('app-breadcrumb', { opacity: 0, y: -14, duration: 0.5 })
          .from('.collections-headline',   { opacity: 0, y: 36, duration: 0.75 }, '-=0.2')
          .from('.collections-meta',       { opacity: 0, y: 16, duration: 0.45 }, '-=0.3');

        // ② Sidebar entrance
        gsap.from('app-filter-sidebar', {
          opacity: 0, x: -36, duration: 0.7, ease, delay: 0.3,
        });

        // ③ Toolbar + grid cards stagger
        gsap.from('.collections-toolbar', { opacity: 0, y: 14, duration: 0.4, ease, delay: 0.45 });
        gsap.from('.product-card', {
          opacity: 0, y: 50, scale: 0.94,
          duration: 0.6, ease,
          stagger: { amount: 0.7, from: 'start' },
          delay: 0.35,
        });

        // ④ Pagination reveal on scroll
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.from('.collections-pagination', {
            opacity: 0, y: 28, duration: 0.6, ease,
            scrollTrigger: { trigger: '.collections-pagination', start: 'top 92%' },
          });
        }
      });
    } catch (e) {
      console.warn('[CollectionsComponent] GSAP not available:', e);
    }
  }

  animateCards(): void {
    try {
      if (typeof gsap === 'undefined') return;
      setTimeout(() => {
        gsap.fromTo(
          '.product-card',
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: { amount: 0.45 }, ease: 'power2.out' }
        );
      }, 30);
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
    window.scrollTo({ top: 260, behavior: 'smooth' });
    this.animateCards();
  }

  toggleWishlist(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.wishlistIds.has(id) ? this.wishlistIds.delete(id) : this.wishlistIds.add(id);
    this.cdr.markForCheck();
  }

  resetFilters(): void {
    this.activeFilters = getInitialFilterState();
    this.currentPage = 0;
    this.animateCards();
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  trackByProductId(_: number, p: Product): string { return p.productId; }


  ngOnDestroy(): void {
    if (this.gsapCtx) this.gsapCtx.revert();
  }
}
