import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { FilterState, FilterOptions, FilterOption, getInitialFilterState } from '../../../core/models/filter.model';
import { getColorHex, isLightColor } from '../../../core/constants/colors.constant';

declare const gsap: any;

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSidebarComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() set products(val: Product[]) {
    this._products.set(val);
  }

  private _activeFilters: FilterState = getInitialFilterState();
  
  @Input() 
  set activeFilters(val: FilterState) {
    this._activeFilters = val;
    this.cdr.markForCheck();
  }
  get activeFilters(): FilterState {
    return this._activeFilters;
  }

  @Input() showNewArrivalsOption = true;
  @Input() isMobileOpen = false;

  @Output() filtersChanged = new EventEmitter<FilterState>();
  @Output() reset = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  private _products = signal<Product[]>([]);

  // ── Derived Filter Options ─────────────────────────────────────────────
  filterOptions = computed<FilterOptions>(() => {
    const products = this._products();
    if (!products.length) {
      return {
        categories: [],
        fabrics: [],
        colors: [],
        sizes: [],
        priceRange: { min: 0, max: 100000 },
      };
    }

    // 1. Categories
    const categoryCounts = new Map<string, number>();
    products.forEach(p => {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
    });
    const categories: FilterOption[] = Array.from(categoryCounts.entries()).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => a.name.localeCompare(b.name));

    // 2. Fabrics
    const distinctFabrics = [...new Set(products.filter(p => p.fabric).map(p => p.fabric!))];
    const fabrics: FilterOption[] = distinctFabrics.map(name => ({ name })).sort((a, b) => a.name.localeCompare(b.name));

    // 3. Colors
    const distinctColors = [...new Set(products.flatMap(p => p.colors || []))];
    const colors: FilterOption[] = distinctColors.map(name => ({
      name,
      hex: getColorHex(name),
      light: isLightColor(name),
    })).sort((a, b) => a.name.localeCompare(b.name));

    // 4. Sizes
    const sizes = [...new Set(products.flatMap(p => p.sizes || []))].sort((a, b) => {
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
      return order.indexOf(a) - order.indexOf(b);
    });

    // 5. Price Range
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { categories, fabrics, colors, sizes, priceRange: { min, max } };
  });

  // ── Accordion State ────────────────────────────────────────────────────
  collapsedGroups = new Set<string>();

  ngOnInit(): void {
    // Initial animations
    this.animateFilterItems();
  }

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

  // ── Filter Actions ─────────────────────────────────────────────────────
  onFilterChange(): void {
    this.filtersChanged.emit({ ...this.activeFilters });
  }

  toggleCategory(name: string): void {
    this.toggleStringInArray(this.activeFilters.selectedCategories, name);
    this.onFilterChange();
  }

  toggleFabric(name: string): void {
    this.toggleStringInArray(this.activeFilters.selectedFabrics, name);
    this.onFilterChange();
  }

  toggleColor(name: string): void {
    this.toggleStringInArray(this.activeFilters.selectedColors, name);
    this.onFilterChange();
  }

  toggleSize(label: string): void {
    this.toggleStringInArray(this.activeFilters.selectedSizes, label);
    this.onFilterChange();
  }

  resetFilters(): void {
    this.reset.emit();
  }

  onCloseMobile(): void {
    this.closeMobile.emit();
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  private toggleStringInArray(arr: string[], value: string): void {
    const idx = arr.indexOf(value);
    idx === -1 ? arr.push(value) : arr.splice(idx, 1);
  }

  get priceMaxLabel(): string {
    if (this.activeFilters.priceMax >= 100000) return '₹1,00,000+';
    return `₹${this.activeFilters.priceMax.toLocaleString('en-IN')}`;
  }

  get sliderPct(): string {
    const max = 100000;
    return (this.activeFilters.priceMax / max * 100) + '%';
  }

  private animateFilterItems(): void {
    try {
      if (typeof gsap === 'undefined') return;
      setTimeout(() => {
        gsap.from('.filter-group, .filter-item, .size-btn, .color-swatch-btn', {
          opacity: 0,
          x: -12,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        });
      }, 100);
    } catch (e) {}
  }

  trackByName(_: number, item: FilterOption): string { return item.name; }
  trackBySize(_: number, size: string): string { return size; }
}
