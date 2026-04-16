import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
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
} from './filter-options.service';

declare const gsap: any;
declare const ScrollTrigger: any;

// ── Product Model ──────────────────────────────────────────────────────────
export interface CollectionProduct {
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
}

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CollectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr        = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private filterSvc  = inject(FilterOptionsService);

  // ── Dynamic Filter Options (loaded from service) ───────────────────────
  filterCategories: FilterCategory[]  = [];
  filterFabrics:    FilterFabric[]    = [];
  filterColors:     FilterColor[]     = [];
  filterSizes:      FilterSize[]      = [];
  filterOptionsLoading = signal(true);

  // ── Accordion State ────────────────────────────────────────────────────
  // Groups start expanded. Keys: 'price' | 'size' | 'category' | 'fabric' | 'colors'
  collapsedGroups = new Set<string>();

  toggleGroup(group: string): void {
    if (this.collapsedGroups.has(group)) {
      this.collapsedGroups.delete(group);
    } else {
      this.collapsedGroups.add(group);
    }
  }

  isCollapsed(group: string): boolean {
    return this.collapsedGroups.has(group);
  }

  // ── UI State ───────────────────────────────────────────────────────────
  mobileFilterOpen = signal(false);
  wishlistIds      = new Set<string>();

  // ── Active Filter State ────────────────────────────────────────────────
  bestSellersOnly  = false;
  newArrivalsOnly  = false;
  priceMax         = 100000;
  selectedCategories: string[] = [];
  selectedFabrics:    string[] = [];
  selectedColors:     string[] = [];
  selectedSizes:      string[] = [];
  sortBy = 'newest';

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

  // ── Product Catalogue (static; swap with HTTP in ProductService) ────────
  readonly allProducts: CollectionProduct[] = [
    {
      id: '1', name: 'Royal Zardosi Lehenga', subtitle: 'Hand-woven Banarasi Silk',
      category: 'Saree', fabric: 'Banarasi Silk', price: 84500,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_IfUiIpe6YvOSqAfmZq2j8XLUfOLk-5Qi8Xsy0v9rdVRr70ba8P1CY2TBFhu72NBtVTd6Ya2BhtCl31kS--j_5j51gZSCSo7-yI39im2iXJ1mciWoe0-bthHg_uCzuZjfClMua50Be6i8j2zcYQ99_I0B7CzzrpQ6-kjJEG6IpS4FAgJq9ifGL92cem1gLZooQwFyABfkxj-1JuMny1JnKjAVPOUtk2wVb63wXkpqSHt2gsCyYmZMrecxunXpRk205-sf6nDtJy0A',
      accentColor: '#800020', colors: ['Crimson Red'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isBestSeller: true, isNew: false, rating: 4.9, reviewCount: 128,
    },
    {
      id: '2', name: 'Emerald Forest Heirloom', subtitle: 'Pure Kanjeevaram Silk',
      category: 'Saree', fabric: 'Banarasi Silk', price: 42200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkmW7yPn9udgyLgkLJKs9x66LPH-QE27QI9AonxHVjSfzBUVpfcg6ynhu-do7C0n-Wa0RAzIIEYdGt2YSrEV1q2ZAQHhmBRNzer6L3z-LJuZn6-bX5fP3-eyIHphy5P2Wf326UAT0KCier7LM5-3B942J9AsTnnTdc9vfJfEspy_ReR5OqYAj_Lw3dhr_cENDmqM6-jP4s17A2KONxxylmdUB47sL_SI4VVgMO5aHYV0bSSnFU-w_PBixNMBrKiL-x1hRrwhNG9ejy',
      accentColor: '#004d40', colors: ['Forest Green'],
      sizes: ['S', 'M', 'L', 'Free Size'],
      isBestSeller: true, isNew: false, rating: 4.7, reviewCount: 89,
    },
    {
      id: '3', name: 'Moonlight Chikankari Ensemble', subtitle: 'Muslin Cotton Blend',
      category: 'Kurti', fabric: 'Muslin Cotton', price: 28800,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpfIYbWe0wVu2qJ4wfuQd_rI0_WbeHOZcMj_taQkbf1uYblHLU2nmns37DgbzTTMUc7cZEzfSPoC0OoI5MtnL3eddHvQwdxu7WGy_PjzwZoyfZQTwc2KBpw1f8mam3e_440sN-llUMOHIpAdz5SILrOLd7j9OvNounpYvyfJsh-KTzhNFj2pumjdSILWZUiYIxS90e0W1zP5vautl53hk6r3dPF58IVJ1r8Jl3Idy2BperfQIVvqPkuy-oJ9zoHQ3LUPyOC4420_iz',
      accentColor: '#b8860b', colors: ['Ivory White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false, isNew: true, rating: 4.8, reviewCount: 64,
    },
    {
      id: '4', name: 'Indigo Handloom Saree', subtitle: 'Pure Bengal Cotton Weave',
      category: 'Saree', fabric: 'Cotton', price: 18500,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970', colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: false, isNew: true, rating: 4.5, reviewCount: 42,
    },
    {
      id: '5', name: 'Saffron Handloom Kurti', subtitle: 'Heritage Bengal Cotton',
      category: 'Kurti', fabric: 'Cotton', price: 12400,
      image: 'https://images.unsplash.com/photo-1583391733975-5408b7f1b2b9?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b', colors: ['Antique Gold'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      isBestSeller: true, isNew: false, rating: 4.6, reviewCount: 97,
    },
    {
      id: '6', name: 'Crimson Silk Panjabi', subtitle: 'Artisan Banarasi Weave',
      category: 'Panjabi', fabric: 'Banarasi Silk', price: 22000,
      image: 'https://images.unsplash.com/photo-1614386998042-39a8c2fe3a04?w=600&h=800&fit=crop&q=80',
      accentColor: '#800020', colors: ['Crimson Red'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: true, isNew: false, rating: 4.8, reviewCount: 73,
    },
    {
      id: '7', name: 'Forest Muga Kurta Set', subtitle: 'Pure Muga Silk Blend',
      category: 'Kurtan', fabric: 'Cotton', price: 16800,
      image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=600&h=800&fit=crop&q=80',
      accentColor: '#004d40', colors: ['Forest Green'],
      sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false, isNew: true, rating: 4.4, reviewCount: 31,
    },
    {
      id: '8', name: 'Ivory Organza Drape', subtitle: 'Hand-finished Organza',
      category: 'Saree', fabric: 'Organza', price: 35600,
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b', colors: ['Ivory White'],
      sizes: ['Free Size'],
      isBestSeller: false, isNew: false, rating: 4.7, reviewCount: 55,
    },
    {
      id: '9', name: 'Midnight Chiffon Drape', subtitle: 'Featherweight Chiffon',
      category: 'Saree', fabric: 'Chiffon', price: 24900,
      image: 'https://images.unsplash.com/photo-1596993100471-c3905ddebd7e?w=600&h=800&fit=crop&q=80',
      accentColor: '#191970', colors: ['Midnight Blue'],
      sizes: ['Free Size'],
      isBestSeller: true, isNew: false, rating: 4.9, reviewCount: 111,
    },
    {
      id: '10', name: 'Gold Zari Panjabi', subtitle: 'Zari-threaded Muslin Cotton',
      category: 'Panjabi', fabric: 'Muslin Cotton', price: 19200,
      image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=800&fit=crop&q=80',
      accentColor: '#b8860b', colors: ['Antique Gold'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: false, isNew: true, rating: 4.3, reviewCount: 28,
    },
    {
      id: '11', name: 'Bengal Jamdani Kurti', subtitle: 'UNESCO Heritage Jamdani',
      category: 'Kurti', fabric: 'Cotton', price: 8900,
      image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=800&fit=crop&q=80',
      accentColor: '#004d40', colors: ['Ivory White', 'Forest Green'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'Free Size'],
      isBestSeller: false, isNew: false, rating: 4.6, reviewCount: 148,
    },
    {
      id: '12', name: 'Heritage Silk Sherwani', subtitle: 'Hand-embroidered Banarasi',
      category: 'Kurtan', fabric: 'Banarasi Silk', price: 31400,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=80',
      accentColor: '#800020', colors: ['Crimson Red', 'Antique Gold'],
      sizes: ['S', 'M', 'L', 'XL'],
      isBestSeller: true, isNew: false, rating: 4.8, reviewCount: 86,
    },
  ];

  // ── Derived Getters ────────────────────────────────────────────────────
  get filteredProducts(): CollectionProduct[] {
    let products = [...this.allProducts];

    if (this.bestSellersOnly) {
      products = products.filter(p => p.isBestSeller);
    }
    if (this.newArrivalsOnly) {
      products = products.filter(p => p.isNew);
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

    switch (this.sortBy) {
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'price-low':  products.sort((a, b) => a.price - b.price); break;
      case 'popularity': products.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default:           products.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
    }

    return products;
  }

  get paginatedProducts(): CollectionProduct[] {
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
      (this.newArrivalsOnly ? 1 : 0) +
      (this.priceMax < 100000 ? 1 : 0) +
      this.selectedCategories.length +
      this.selectedFabrics.length +
      this.selectedColors.length +
      this.selectedSizes.length
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
        // Animate filter items in once data arrives
        this.animateFilterItems();
      },
      error: (err) => {
        console.error('[CollectionsComponent] Failed to load filter options:', err);
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

        // ① Header sequence
        gsap.timeline({ defaults: { ease } })
          .from('.collections-breadcrumb', { opacity: 0, y: -14, duration: 0.5 })
          .from('.collections-headline',   { opacity: 0, y: 36, duration: 0.75 }, '-=0.2')
          .from('.collections-meta',       { opacity: 0, y: 16, duration: 0.45 }, '-=0.3');

        // ② Sidebar entrance
        gsap.from('.filter-sidebar', {
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

  private animateFilterItems(): void {
    try {
      if (typeof gsap === 'undefined') return;
      setTimeout(() => {
        gsap.from('.filter-group-body .filter-item, .filter-group-body .color-swatch-btn, .filter-group-body .size-btn', {
          opacity: 0, x: -12, duration: 0.35,
          stagger: { amount: 0.4, from: 'start' },
          ease: 'power2.out',
        });
      }, 50);
    } catch (e) {}
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
    window.scrollTo({ top: 260, behavior: 'smooth' });
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

  toggleWishlist(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistIds.has(id) ? this.wishlistIds.delete(id) : this.wishlistIds.add(id);
    this.cdr.markForCheck();
  }

  resetFilters(): void {
    this.bestSellersOnly    = false;
    this.newArrivalsOnly    = false;
    this.priceMax           = 100000;
    this.selectedCategories = [];
    this.selectedFabrics    = [];
    this.selectedColors     = [];
    this.selectedSizes      = [];
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

  trackByProductId(_: number, p: CollectionProduct): string { return p.id; }
  trackById(_: number, item: { id: string }): string   { return item.id; }

  ngOnDestroy(): void {
    if (this.gsapCtx) this.gsapCtx.revert();
  }
}
