# GitHub Copilot Instructions: Product Catalog

## Priority Guidelines

When generating product catalog and browsing functionality for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular component and service patterns
4. **Architectural Consistency**: Maintain responsive product browsing design
5. **Code Quality**: Prioritize performance, UX, and maintainability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **PrimeNG**: 21.1.6
- **RxJS**: 7.8.0

### Key Constraints
- Use standalone components (no NgModules)
- Use signal-based reactivity for UI state
- Use RxJS Observables for data streams
- Leverage PrimeNG DataTable, Paginator, Dropdown components
- Mobile-first responsive design

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Imports**: Explicitly import required modules
- **Template**: Use templateUrl and styleUrl
- **Change Detection**: OnPush for performance

### Service Patterns
- Services use dependency injection
- Services provide typed observable streams
- Caching with shareReplay for performance
- Debounced search operations
- Error handling pattern

### Module Organization
```
src/app/products/
├── catalog.component.ts
├── product-card.component.ts
├── product-detail.component.ts
├── product.service.ts
├── models/
│   ├── product.model.ts
│   ├── product-filter.model.ts
│   └── catalog-response.model.ts
└── components/
    ├── filter-panel.component.ts
    └── search-bar.component.ts
```

## Product Models & Types

### 1. Core Product Models
```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProducts {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  count: number;
}
```

## Product Service Pattern

### 1. Product Data Service
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  
  private productsCache$ = new Map<string, Observable<PaginatedProducts>>();
  private categoriesCache$: Observable<Category[]> | null = null;

  // Get all products with pagination
  getProducts(page: number = 0, pageSize: number = 10): Observable<PaginatedProducts> {
    const cacheKey = `page_${page}_size_${pageSize}`;
    
    if (!this.productsCache$.has(cacheKey)) {
      const products$ = this.api.get<PaginatedProducts>(
        `/api/products?page=${page}&size=${pageSize}`
      ).pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Failed to load products:', error);
          return throwError(() => new Error('Failed to load products'));
        })
      );
      
      this.productsCache$.set(cacheKey, products$);
    }

    return this.productsCache$.get(cacheKey)!;
  }

  // Get single product
  getProductById(id: string): Observable<Product> {
    return this.api.get<Product>(`/api/products/${id}`).pipe(
      shareReplay(1),
      catchError(error => {
        console.error(`Failed to load product ${id}:`, error);
        return throwError(() => new Error('Product not found'));
      })
    );
  }

  // Search products with debouncing
  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }

    return this.api.get<Product[]>(
      `/api/products/search?q=${encodeURIComponent(query)}`
    ).pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      ),
      catchError(error => {
        console.error('Search failed:', error);
        return of([]);
      })
    );
  }

  // Filter products
  filterProducts(filter: ProductFilter): Observable<Product[]> {
    const params = this.buildFilterParams(filter);
    return this.api.get<Product[]>(`/api/products/filter?${params}`).pipe(
      catchError(error => {
        console.error('Filter failed:', error);
        return of([]);
      })
    );
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.api.get<Category[]>('/api/products/categories').pipe(
        shareReplay(1),
        catchError(error => {
          console.error('Failed to load categories:', error);
          return of([]);
        })
      );
    }

    return this.categoriesCache$;
  }

  // Get related products
  getRelatedProducts(productId: string, limit: number = 4): Observable<Product[]> {
    return this.api.get<Product[]>(
      `/api/products/${productId}/related?limit=${limit}`
    );
  }

  // Invalidate cache
  invalidateCache(): void {
    this.productsCache$.clear();
    this.categoriesCache$ = null;
  }

  private buildFilterParams(filter: ProductFilter): string {
    const params = new URLSearchParams();

    if (filter.search) params.append('search', filter.search);
    if (filter.category) params.append('category', filter.category);
    if (filter.priceMin) params.append('priceMin', filter.priceMin.toString());
    if (filter.priceMax) params.append('priceMax', filter.priceMax.toString());
    if (filter.rating) params.append('rating', filter.rating.toString());
    if (filter.inStock !== undefined) params.append('inStock', filter.inStock.toString());
    if (filter.sortBy) params.append('sort', filter.sortBy);
    if (filter.sortOrder) params.append('order', filter.sortOrder);

    return params.toString();
  }
}
```

## Catalog Component Pattern

### 1. Main Catalog Page
```typescript
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="catalog-container">
      <!-- Header -->
      <div class="catalog-header">
        <h1>Product Catalog</h1>
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
      </div>

      <div class="catalog-content">
        <!-- Filter Panel -->
        <aside class="filter-sidebar">
          <app-filter-panel 
            (filterChange)="onFilterChange($event)">
          </app-filter-panel>
        </aside>

        <!-- Products Grid -->
        <main class="products-main">
          <!-- Loading State -->
          <div *ngIf="loading$ | async; else productsGrid">
            <div class="products-skeleton">
              <p-skeleton *ngFor="let i of [1,2,3,4,5,6]" 
                          [rows]="3"
                          class="product-skeleton">
              </p-skeleton>
            </div>
          </div>

          <!-- Products Grid -->
          <ng-template #productsGrid>
            <div *ngIf="(products$ | async) as products; else noProducts">
              <div class="products-grid">
                <app-product-card
                  *ngFor="let product of products; trackBy: trackByProductId"
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                  (viewDetail)="onViewDetail($event)">
                </app-product-card>
              </div>
            </div>

            <ng-template #noProducts>
              <div class="no-products">
                <p>No products found</p>
              </div>
            </ng-template>
          </ng-template>

          <!-- Pagination -->
          <p-paginator
            [rows]="pageSize"
            [totalRecords]="(totalRecords$ | async) || 0"
            [pageLinkSize]="5"
            (onPageChange)="onPageChange($event)">
          </p-paginator>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .catalog-header {
      margin-bottom: 30px;
    }

    .catalog-header h1 {
      margin: 0 0 20px 0;
      font-size: 2em;
    }

    .catalog-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 30px;
      align-items: start;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .products-skeleton {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    @media (max-width: 768px) {
      .catalog-content {
        grid-template-columns: 1fr;
      }

      .filter-sidebar {
        display: none;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private cartService = inject(CartService);

  loading$ = signal(false);
  products$ = new Observable<Product[]>();
  totalRecords$ = new Observable<number>();

  currentPage = 0;
  pageSize = 12;
  currentFilter: ProductFilter = {};

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading$.set(true);

    if (Object.keys(this.currentFilter).length > 0) {
      this.products$ = this.productService.filterProducts(this.currentFilter).pipe(
        finalize(() => this.loading$.set(false))
      );
    } else {
      this.products$ = this.productService.getProducts(this.currentPage, this.pageSize).pipe(
        tap(response => {
          this.totalRecords$ = of(response.totalElements);
        }),
        map(response => response.content),
        finalize(() => this.loading$.set(false))
      );
    }
  }

  onSearch(query: string): void {
    if (query.trim()) {
      this.loading$.set(true);
      this.products$ = this.productService.searchProducts(query).pipe(
        finalize(() => this.loading$.set(false))
      );
    } else {
      this.loadProducts();
    }
  }

  onFilterChange(filter: ProductFilter): void {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        console.log('Product added to cart');
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
      }
    });
  }

  onViewDetail(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  trackByProductId(_index: number, product: Product): string {
    return product.id;
  }
}
```

## Product Card Component Pattern

### 1. Reusable Product Card
```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, PrimeNgModules],
  template: `
    <p-card class="product-card">
      <!-- Product Image -->
      <ng-template pTemplate="header">
        <div class="product-image-container">
          <img [src]="product.image" 
               [alt]="product.name"
               class="product-image"
               (click)="viewDetail()"
               style="cursor: pointer;">
          <div class="discount-badge" *ngIf="discountPercent > 0">
            -{{ discountPercent }}%
          </div>
        </div>
      </ng-template>

      <!-- Product Info -->
      <div class="product-info">
        <!-- Name -->
        <h3 class="product-name" (click)="viewDetail()" style="cursor: pointer;">
          {{ product.name }}
        </h3>

        <!-- Rating -->
        <div class="product-rating">
          <p-rating 
            [value]="product.rating"
            [readonly]="true"
            iconCancelClass="hidden">
          </p-rating>
          <span class="review-count">({{ product.reviewCount }})</span>
        </div>

        <!-- Price -->
        <div class="product-price">
          <span *ngIf="product.discountPrice" class="original-price">
            ${{ product.price | number: '1.2-2' }}
          </span>
          <span class="current-price">
            ${{ (product.discountPrice || product.price) | number: '1.2-2' }}
          </span>
        </div>

        <!-- Stock Status -->
        <div class="stock-status">
          <p-tag 
            *ngIf="product.stock > 0; else outOfStock"
            value="In Stock"
            severity="success">
          </p-tag>
          
          <ng-template #outOfStock>
            <p-tag 
              value="Out of Stock"
              severity="danger">
            </p-tag>
          </ng-template>
        </div>
      </div>

      <!-- Actions -->
      <ng-template pTemplate="footer">
        <button pButton
                type="button"
                label="Add to Cart"
                icon="pi pi-shopping-cart"
                [disabled]="product.stock === 0"
                (click)="addToCart()"
                class="w-full">
        </button>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .product-image-container {
      position: relative;
      width: 100%;
      height: 200px;
      background: #f5f5f5;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .discount-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #ff6b6b;
      color: white;
      padding: 6px 10px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.85em;
    }

    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .product-name {
      margin: 0;
      font-size: 0.95em;
      color: #333;
      max-height: 3ex;
      overflow: hidden;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .review-count {
      font-size: 0.85em;
      color: #999;
    }

    .product-price {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .original-price {
      text-decoration: line-through;
      color: #999;
      font-size: 0.9em;
    }

    .current-price {
      font-size: 1.2em;
      font-weight: bold;
      color: #ff6b6b;
    }

    .stock-status {
      margin-top: 8px;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetail = new EventEmitter<Product>();

  get discountPercent(): number {
    if (!this.product.discountPrice) return 0;
    return Math.round(
      ((this.product.price - this.product.discountPrice) / this.product.price) * 100
    );
  }

  addToCartClick(): void {
    this.addToCart.emit(this.product);
  }

  viewDetailClick(): void {
    this.viewDetail.emit(this.product);
  }
}
```

## Filter Panel Component Pattern

### 1. Product Filtering
```typescript
@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, ReactiveFormsModule],
  template: `
    <p-card class="filter-panel">
      <ng-template pTemplate="header">
        <h3>Filters</h3>
        <button pButton 
                type="button" 
                icon="pi pi-times"
                class="p-button-text"
                (click)="resetFilters()">
          Clear All
        </button>
      </ng-template>

      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">Category</label>
        <p-dropdown 
          [options]="categories$ | async"
          optionLabel="name"
          optionValue="id"
          [(ngModel)]="selectedCategory"
          (onChange)="onCategoryChange()"
          placeholder="All Categories">
        </p-dropdown>
      </div>

      <!-- Price Range Filter -->
      <div class="filter-group">
        <label class="filter-label">Price Range</label>
        <p-slider 
          [(ngModel)]="priceRange"
          [range]="true"
          [min]="0"
          [max]="1000"
          (onSlideEnd)="onPriceChange()"
          styleClass="price-slider">
        </p-slider>
        <div class="price-display">
          ${{ priceRange[0] }} - ${{ priceRange[1] }}
        </div>
      </div>

      <!-- Rating Filter -->
      <div class="filter-group">
        <label class="filter-label">Rating</label>
        <div class="rating-options">
          <div *ngFor="let rating of [5,4,3,2,1]" class="rating-option">
            <p-checkbox 
              [(ngModel)]="selectedRatings"
              [value]="rating"
              (onChange)="onRatingChange()">
            </p-checkbox>
            <p-rating [value]="rating" [readonly]="true"></p-rating>
            <span>& up</span>
          </div>
        </div>
      </div>

      <!-- Stock Filter -->
      <div class="filter-group">
        <p-checkbox 
          [(ngModel)]="inStockOnly"
          label="In Stock Only"
          (onChange)="onStockChange()">
        </p-checkbox>
      </div>
    </p-card>
  `,
  styles: [`
    .filter-panel {
      position: sticky;
      top: 20px;
    }

    .filter-group {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .filter-group:last-child {
      border-bottom: none;
    }

    .filter-label {
      display: block;
      font-weight: bold;
      margin-bottom: 12px;
      font-size: 0.95em;
    }

    .price-display {
      text-align: center;
      margin-top: 12px;
      color: #666;
      font-size: 0.9em;
    }

    .rating-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class FilterPanelComponent implements OnInit {
  @Output() filterChange = new EventEmitter<ProductFilter>();

  private productService = inject(ProductService);

  categories$ = this.productService.getCategories();

  selectedCategory: string | null = null;
  priceRange: number[] = [0, 1000];
  selectedRatings: number[] = [];
  inStockOnly = false;

  onCategoryChange(): void {
    this.emitFilter();
  }

  onPriceChange(): void {
    this.emitFilter();
  }

  onRatingChange(): void {
    this.emitFilter();
  }

  onStockChange(): void {
    this.emitFilter();
  }

  resetFilters(): void {
    this.selectedCategory = null;
    this.priceRange = [0, 1000];
    this.selectedRatings = [];
    this.inStockOnly = false;
    this.emitFilter();
  }

  private emitFilter(): void {
    const filter: ProductFilter = {
      category: this.selectedCategory || undefined,
      priceMin: this.priceRange[0],
      priceMax: this.priceRange[1],
      rating: this.selectedRatings[0],
      inStock: this.inStockOnly || undefined
    };

    this.filterChange.emit(filter);
  }
}
```

## API Endpoints

### Product Endpoints
- `GET /api/products?page=0&size=12` - Get paginated products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?q=query` - Search products
- `GET /api/products/filter?category=X&priceMin=0&priceMax=1000` - Filter products
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id/related?limit=4` - Get related products

## Route Configuration

### Catalog Routes
```typescript
export const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent
  },
  {
    path: 'product/:id',
    component: ProductDetailComponent
  }
];
```

## Code Quality Standards

### Naming Conventions
- Components: `CatalogComponent`, `ProductCardComponent`
- Services: `ProductService`
- Models: `Product`, `ProductFilter`, `Category`
- Methods: `getProducts()`, `filterProducts()`, `searchProducts()`

### Performance Optimization
- Use `trackBy` in *ngFor for large lists
- Implement lazy loading for images
- Cache product data with `shareReplay(1)`
- Debounce search input
- Use `OnPush` change detection strategy

## Related Guidelines
- See: src/app/services/api.service.ts for API calls
- See: src/app/cart/cart.service.ts for cart operations
- See: src/app/app.routes.ts for routing
