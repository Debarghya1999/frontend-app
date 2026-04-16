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
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FilterOptionsService,
  FilterCategory,
  FilterFabric,
  FilterColor,
  FilterSize,
} from '../shop/filter-options.service';

declare const gsap: any;
declare const ScrollTrigger: any;

// ── Product Model (shared shape) ───────────────────────────────────────────
export interface NewArrivalProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  fabric: string;
  price: number;
  image: string;
  accentColor: string;
  colors: string[];
  sizes: string[];
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  /** ISO date-string used to group items as "drop waves" */
  arrivedOn: string;
}

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class NewArrivalsComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr        = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private filterSvc  = inject(FilterOptionsService);

  // ── Dynamic Filter Options ─────────────────────────────────────────────
  filterCategories: FilterCategory[]  = [];
  filterFabrics:    FilterFabric[]    = [];
  filterColors:     FilterColor[]     = [];
  filterSizes:      FilterSize[]      = [];
  filterOptionsLoading = signal(true);

  // ── Accordion State ────────────────────────────────────────────────────
  collapsedGroups = new Set<string>();

  toggleGroup(group: string): void {
    this.collapsedGroups.has(group)
      ? this.collapsedGroups.delete(group)
      : this.collapsedGroups.add(group);
  }

  isCollapsed(group: string): boolean {
    return this.collapsedGroups.has(group);
  }

  // ── UI State ───────────────────────────────────────────────────────────
  mobileFilterOpen = signal(false);
  wishlistIds      = new Set<string>();

  // ── Active Filter State ────────────────────────────────────────────────
  priceMax             = 100000;
  bestSellersOnly      = false;
  selectedCategories: string[] = [];
  selectedFabrics:    string[] = [];
  selectedColors:     string[] = [];
  selectedSizes:      string[] = [];
  selectedTimelines:  string[] = [];
  sortBy = 'newest';

  // ── "Drop Wave" timeline grouping ──────────────────────────────────────
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
  // Only items with isNew: true — plus an extra `arrivedOn` date field.
  readonly allProducts: NewArrivalProduct[] = [
    {
      id: 'na-1',
      name: 'Moonlight Chikankari Ensemble',
      subtitle: 'Muslin Cotton Blend',
      category: 'Kurti', fabric: 'Muslin Cotton', price: 28800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpfIYbWe0wVu2qJ4wfuQd_rI0_WbeHOZcMj_taQkbf1uYblHLU2nmns37DgbzTTMUc7cZEzfSPoC0OoI5MtnL3eddHvQwdxu7WGy_PjzwZoyfZQTwc2KBpw1f8mam3e_440sN-llUMOHIpAdz5SILrOLd7j9OvNounpYvyfJsh-KTzhNFj2pumjdSILWZUiYIxS90e0W1zP5vautl53hk6r3dPF58IVJ1r8Jl3Idy2BperfQIVvqPkuy-oJ9zoHQ3LUPyOC4420_iz',
      accentColor: '#b8860b', colors: ['Ivory White'],
      sizes: ['XS','S','M','L','XL','Free Size'],
      isBestSeller: false, isNew: true, rating: 4.8, reviewCount: 64,
      arrivedOn: '2026-04-14',
    },
    {
      id: 'na-2',
      name: 'Indigo Handloom Saree',
      subtitle: 'Pure Bengal Cotton Weave',
      category: 'Saree', fabric: 'Cotton', price: 18500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970', colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: false, isNew: true, rating: 4.5, reviewCount: 42,
      arrivedOn: '2026-04-14',
    },
    {
      id: 'na-3',
      name: 'Forest Muga Kurta Set',
      subtitle: 'Pure Muga Silk Blend',
      category: 'Kurta', fabric: 'Cotton Silk', price: 16800,
      image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=600&h=800&fit=crop&q=80',
      accentColor: '#004d40', colors: ['Forest Green'],
      sizes: ['S','M','L','XL','Free Size'],
      isBestSeller: false, isNew: true, rating: 4.4, reviewCount: 31,
      arrivedOn: '2026-04-14',
    },
    {
      id: 'na-4',
      name: 'Gold Zari Panjabi',
      subtitle: 'Zari-threaded Muslin Cotton',
      category: 'Panjabi', fabric: 'Muslin Cotton', price: 19200,
      image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b', colors: ['Antique Gold'],
      sizes: ['S','M','L','XL'],
      isBestSeller: false, isNew: true, rating: 4.3, reviewCount: 28,
      arrivedOn: '2026-03-20',
    },
    {
      id: 'na-5',
      name: 'Crimson Ektara Kurti',
      subtitle: 'Heritage Block-print Cotton',
      category: 'Kurti', fabric: 'Pure Cotton', price: 9800,
      image: 'https://images.unsplash.com/photo-1583391733975-5408b7f1b2b9?w=600&h=800&fit=crop&q=80',
      accentColor: '#800020', colors: ['Crimson Red'],
      sizes: ['XS','S','M','L','XL','Free Size'],
      isBestSeller: false, isNew: true, rating: 4.6, reviewCount: 19,
      arrivedOn: '2026-03-20',
    },
    {
      id: 'na-6',
      name: 'Ivory Tussar Drape',
      subtitle: 'Raw Tussar Silk, Hand-finished',
      category: 'Saree', fabric: 'Tussar Silk', price: 38400,
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b', colors: ['Ivory White'],
      sizes: ['Free Size'],
      isBestSeller: false, isNew: true, rating: 4.7, reviewCount: 15,
      arrivedOn: '2026-03-20',
    },
    {
      id: 'na-7',
      name: 'Midnight Jamdani Shawl',
      subtitle: 'UNESCO Heritage Weave',
      category: 'Saree', fabric: 'Fine Cotton', price: 22600,
      image: 'https://images.unsplash.com/photo-1596993100471-c3905ddebd7e?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970', colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: false, isNew: true, rating: 4.9, reviewCount: 8,
      arrivedOn: '2026-02-10',
    },
    {
      id: 'na-8',
      name: 'Saffron Linen Kurta',
      subtitle: 'Santiniketan Linen-cotton Blend',
      category: 'Kurta', fabric: 'Linen Cotton', price: 14200,
      image: 'https://images.unsplash.com/photo-1614386998042-39a8c2fe3a04?w=600&h=800&fit=crop&q=80',
      accentColor: '#ff9800', colors: ['Saffron Orange'],
      sizes: ['S','M','L','XL'],
      isBestSeller: false, isNew: true, rating: 4.4, reviewCount: 6,
      arrivedOn: '2026-02-10',
    },
    {
      id: 'na-9',
      name: 'Emerald Dhakai Jamdani',
      subtitle: 'Floral Hand-woven Masterpiece',
      category: 'Saree', fabric: 'Cotton Muslin', price: 42500,
      image: 'https://images.unsplash.com/photo-1610030469668-93530c17b5b1?w=600&h=800&fit=crop&q=80',
      accentColor: '#2e7d32', colors: ['Emerald Green'],
      sizes: ['Free Size'],
      isBestSeller: true, isNew: true, rating: 5.0, reviewCount: 12,
      arrivedOn: '2026-04-14',
    },
  ];

  // ── Derived Getters ────────────────────────────────────────────────────
  get filteredProducts(): NewArrivalProduct[] {
    let products = [...this.allProducts];

    if (this.bestSellersOnly) {
      products = products.filter(p => p.isBestSeller);
    }
    if (this.priceMax < 100000) {
      products = products.filter(p => p.price <= this.priceMax);
    }
    if (this.selectedCategories.length > 0) {
      products = products.filter(p => this.selectedCategories.includes(p.category));
    }
    if (this.selectedFabrics.length > 0) {
      products = products.filter(p => this.selectedFabrics.includes(p.fabric));
    }
    if (this.selectedColors.length > 0) {
      products = products.filter(p => p.colors.some(c => this.selectedColors.includes(c)));
    }
    if (this.selectedSizes.length > 0) {
      products = products.filter(p => p.sizes.some(s => this.selectedSizes.includes(s)));
    }

    if (this.selectedTimelines.length > 0) {
      products = products.filter(p => {
        const month = p.arrivedOn.split('-')[1]; // Mock date format YYYY-MM-DD
        if (this.selectedTimelines.includes('thisMonth') && month === '04') return true;
        if (this.selectedTimelines.includes('lastMonth') && month === '03') return true;
        if (this.selectedTimelines.includes('earlier')   && (month === '02' || month === '01')) return true;
        return false;
      });
    }

    switch (this.sortBy) {
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'popularity': products.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default:           products.sort((a, b) => new Date(b.arrivedOn).getTime() - new Date(a.arrivedOn).getTime()); break;
    }

    return products;
  }

  get paginatedProducts(): NewArrivalProduct[] {
    const start = this.currentPage * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get priceMaxLabel(): string {
    if (this.priceMax >= 100000) return '₹1,00,000+';
    return `₹${this.priceMax.toLocaleString('en-IN')}`;
  }

  get activeFilterCount(): number {
    return (
      (this.bestSellersOnly ? 1 : 0) +
      (this.priceMax < 100000 ? 1 : 0) +
      this.selectedCategories.length +
      this.selectedFabrics.length +
      this.selectedColors.length +
      this.selectedSizes.length +
      this.selectedTimelines.length
    );
  }

  get hasActiveFilters(): boolean {
    return this.activeFilterCount > 0;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadFilterOptions();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  // ── Service Data Loading ───────────────────────────────────────────────
  private loadFilterOptions(): void {
    this.filterOptionsLoading.set(true);

    forkJoin({
      categories: this.filterSvc.getCategories(),
      fabrics:    this.filterSvc.getFabrics(),
      colors:     this.filterSvc.getColors(),
      sizes:      this.filterSvc.getSizes(),
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (opts) => {
        this.filterCategories = opts.categories;
        this.filterFabrics    = opts.fabrics;
        this.filterColors     = opts.colors;
        this.filterSizes      = opts.sizes;
        this.filterOptionsLoading.set(false);
        this.animateFilterItems();
      },
      error: (err) => {
        console.error('[NewArrivalsComponent] Failed to load filter options:', err);
        this.filterOptionsLoading.set(false);
      },
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
          .from('.shop-breadcrumb', { opacity: 0, y: -10, duration: 0.5 })
          .from('.shop-headline',   { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
          .from('.headline-rule',   { scaleX: 0, transformOrigin: 'left', duration: 0.8 }, '-=0.4')
          .from('.shop-meta',       { opacity: 0, y: 15, duration: 0.5 }, '-=0.5');

        // ② Sidebar & Grid
        gsap.from('.filter-sidebar', {
          opacity: 0, x: -30,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.4
        });

        gsap.from('.shop-toolbar', { opacity: 0, y: 20, duration: 0.5, ease, delay: 0.7 });
        
        this.animateCards(0.8);

        // ⑤ Pagination
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.from('.shop-pagination', {
            opacity: 0, y: 30,
            duration: 0.8,
            ease,
            scrollTrigger: {
              trigger: '.shop-pagination',
              start: 'top 95%',
            }
          });
        }
      });
    } catch (e) {
      console.warn('[NewArrivalsComponent] Animation error:', e);
    }
  }

  private animateFilterItems(): void {
    try {
      if (typeof gsap === 'undefined') return;
      setTimeout(() => {
        gsap.from('.filter-group, .filter-item, .size-btn, .color-swatch-btn', {
          opacity: 0, x: -10,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out'
        });
      }, 100);
    } catch (e) {}
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
  onFilterChange(): void {
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

  toggleCategory(name: string): void {
    this.toggleStringInArray(this.selectedCategories, name);
    this.onFilterChange();
  }

  toggleFabric(name: string): void {
    this.toggleStringInArray(this.selectedFabrics, name);
    this.onFilterChange();
  }

  toggleColor(name: string): void {
    this.toggleStringInArray(this.selectedColors, name);
    this.onFilterChange();
  }

  toggleSize(label: string): void {
    this.toggleStringInArray(this.selectedSizes, label);
    this.onFilterChange();
  }

  toggleTimeline(id: string): void {
    this.toggleStringInArray(this.selectedTimelines, id);
    this.onFilterChange();
  }

  toggleWishlist(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistIds.has(id) ? this.wishlistIds.delete(id) : this.wishlistIds.add(id);
    this.cdr.markForCheck();
  }

  resetFilters(): void {
    this.bestSellersOnly    = false;
    this.priceMax           = 100000;
    this.selectedCategories = [];
    this.selectedFabrics    = [];
    this.selectedColors     = [];
    this.selectedSizes      = [];
    this.selectedTimelines  = [];
    this.onFilterChange();
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  private toggleStringInArray(arr: string[], value: string): void {
    const idx = arr.indexOf(value);
    idx === -1 ? arr.push(value) : arr.splice(idx, 1);
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  starArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  trackByProductId(_: number, p: NewArrivalProduct): string { return p.id; }
  trackById(_: number, item: { id: string }): string        { return item.id; }

  ngOnDestroy(): void {
    if (this.gsapCtx) this.gsapCtx.revert();
  }
}
