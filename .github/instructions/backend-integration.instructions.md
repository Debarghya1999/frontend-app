# GitHub Copilot Instructions: Backend Integration & API

## Priority Guidelines

When generating backend integration and API code for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, RxJS 7.8+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established API service and HTTP interceptor patterns
4. **Architectural Consistency**: Maintain centralized API integration layer
5. **Code Quality**: Prioritize type safety, error handling, and maintainability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0
- **HttpClient**: Angular's built-in HTTP client
- **Backend**: Spring Boot (external service)

### Key Constraints
- Use Angular HttpClient for all API calls
- Use HTTP interceptors for cross-cutting concerns
- Implement environment-based configuration
- Use typed DTOs for request/response models
- RxJS Observables for async operations

## Codebase Pattern Analysis

### HTTP Client Configuration
- Configured in `src/app/app.config.ts`
- HTTP interceptors injected globally
- Timeout handling implemented
- Base URL from environment configuration

### Service Patterns
- Services use dependency injection
- Services provide typed observable streams
- Error handling with catchError operator
- Request/response transformation

### Module Organization
```
src/app/services/
├── api.service.ts (Base API service)
├── http.interceptor.ts (Request/response intercept)
├── product.service.ts
├── order.service.ts
├── payment.service.ts
├── auth.service.ts
├── admin.service.ts
├── review.service.ts
└── models/
    ├── product.dto.ts
    ├── order.dto.ts
    ├── api-response.model.ts
    └── api-error.model.ts

src/environments/
├── environment.ts (dev)
└── environment.prod.ts (prod)
```

## Base API Service Pattern

### 1. API Service Setup
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = inject(EnvironmentService).apiUrl;
  private http = inject(HttpClient);

  // Generic methods for CRUD operations
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> { }
  post<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> { }
  put<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> { }
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> { }
  patch<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> { }
}
```

### 2. Environment Configuration
```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  razorpayKey: 'test_key_123'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.boutique.com',
  razorpayKey: 'live_key_123'
};
```

### 3. Typed DTOs
```typescript
// Product DTO
export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating?: number;
  reviews?: ReviewDTO[];
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: Date;
}

// Pagination DTO
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
```

## HTTP Interceptor Pattern

### 1. Request Interceptor
```typescript
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone request to add headers
    let modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      modifiedReq = modifiedReq.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    return next.handle(modifiedReq);
  }
}
```

### 2. Response Interceptor
```typescript
@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  private errorService = inject(ErrorService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let message = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = error.error.message;
    } else {
      // Server-side error
      message = error.error?.message || `Error: ${error.status}`;
    }

    this.errorService.handleError(message);
  }
}
```

## Feature Service Pattern

### 1. Product Service
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private cache$ = new Map<string, Observable<ProductDTO[]>>();

  getProducts(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProductDTO>> {
    return this.api.get<PaginatedResponse<ProductDTO>>(
      `/api/products?page=${page}&size=${size}`
    );
  }

  getProductById(id: string): Observable<ProductDTO> {
    return this.api.get<ProductDTO>(`/api/products/${id}`);
  }

  searchProducts(query: string): Observable<ProductDTO[]> {
    return this.api.get<ProductDTO[]>(
      `/api/products/search?q=${encodeURIComponent(query)}`
    ).pipe(
      debounceTime(300),
      distinctUntilChanged()
    );
  }

  filterProducts(filters: ProductFilter): Observable<ProductDTO[]> {
    const params = this.buildQueryParams(filters);
    return this.api.get<ProductDTO[]>(`/api/products/filter?${params}`);
  }
}
```

### 2. Order Service
```typescript
@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);

  getOrders(): Observable<OrderDTO[]> {
    return this.api.get<OrderDTO[]>('/api/orders');
  }

  getOrderById(id: string): Observable<OrderDTO> {
    return this.api.get<OrderDTO>(`/api/orders/${id}`);
  }

  createOrder(orderData: CreateOrderRequest): Observable<OrderDTO> {
    return this.api.post<OrderDTO>('/api/orders', orderData);
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<OrderDTO> {
    return this.api.put<OrderDTO>(`/api/orders/${id}/status`, { status });
  }
}
```

## Error Handling Pattern

### 1. Global Error Service
```typescript
@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new Subject<string>();
  public error$ = this.errorSubject.asObservable();

  handleError(message: string, error?: any): void {
    console.error('API Error:', error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next('');
  }
}
```

### 2. Error Handling in Components
```typescript
this.productService.getProducts().subscribe({
  next: (products) => {
    this.products = products;
  },
  error: (error) => {
    this.errorService.handleError('Failed to load products');
  }
});
```

### 3. RxJS Error Operators
```typescript
// Retry logic
return this.http.get('/api/endpoint').pipe(
  retry({ count: 3, delay: 1000 }),
  catchError(error => {
    return throwError(() => new ApiError(error.message));
  })
);

// Timeout handling
return this.http.get('/api/endpoint').pipe(
  timeout(5000),
  catchError(error => {
    if (error.name === 'TimeoutError') {
      return throwError(() => new Error('Request timeout'));
    }
    return throwError(() => error);
  })
);
```

## Request/Response Transformation

### 1. Transform Responses
```typescript
getProducts(): Observable<ProductDTO[]> {
  return this.http.get<any>('/api/products').pipe(
    map(response => response.data),  // Extract data from wrapper
    map(products => products.map(p => this.transformProduct(p)))
  );
}

private transformProduct(raw: any): ProductDTO {
  return {
    id: raw.id,
    name: raw.productName,  // Field name mapping
    price: parseFloat(raw.productPrice),
    // ... other fields
  };
}
```

### 2. Request Transformation
```typescript
createOrder(cart: CartItem[]): Observable<OrderDTO> {
  const request = {
    items: cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    })),
    shippingAddress: this.addressService.getAddress(),
    totalAmount: this.calculateTotal(cart)
  };

  return this.api.post<OrderDTO>('/api/orders', request);
}
```

## Pagination Pattern

### 1. Paginated Requests
```typescript
getProducts(page: number, pageSize: number): Observable<PaginatedResponse<ProductDTO>> {
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdAt,desc');

  return this.api.get<PaginatedResponse<ProductDTO>>('/api/products', { params });
}
```

### 2. Pagination in Component
```typescript
currentPage = 0;
pageSize = 10;
totalPages = 0;

loadProducts(): void {
  this.productService.getProducts(this.currentPage, this.pageSize).subscribe(
    response => {
      this.products = response.content;
      this.totalPages = response.totalPages;
    }
  );
}

nextPage(): void {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.loadProducts();
  }
}
```

## Caching Strategy

### 1. Simple Cache with shareReplay
```typescript
private productsCache$ = this.api.get<ProductDTO[]>('/api/products').pipe(
  shareReplay(1)  // Cache last value for all subscribers
);

getProducts(): Observable<ProductDTO[]> {
  return this.productsCache$;
}

invalidateCache(): void {
  // Force refetch by recreating observable
  this.productsCache$ = this.api.get<ProductDTO[]>('/api/products').pipe(
    shareReplay(1)
  );
}
```

### 2. Cache with TTL (Time To Live)
```typescript
private cache = new Map<string, { data: any; expiry: number }>();
private cacheTime = 5 * 60 * 1000; // 5 minutes

getProducts(): Observable<ProductDTO[]> {
  const cacheKey = '/api/products';
  const cached = this.cache.get(cacheKey);

  if (cached && cached.expiry > Date.now()) {
    return of(cached.data);
  }

  return this.api.get<ProductDTO[]>('/api/products').pipe(
    tap(data => {
      this.cache.set(cacheKey, { data, expiry: Date.now() + this.cacheTime });
    })
  );
}
```

## API Endpoints Reference

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/search?q=:query` - Search products
- `GET /api/products/filter?category=:category&price=:price` - Filter products

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/:id/for-admin` - Get all orders (admin)

### Payments
- `POST /api/payments/initiate` - Initiate Razorpay payment
- `POST /api/payments/:id/verify` - Verify payment

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/inventory` - Inventory list
- `PUT /api/inventory/:id` - Update inventory
- `GET /api/customers` - Customer list

## Testing Patterns

### 1. HttpTestingController for API Tests
```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch products', () => {
    const mockProducts = [{ id: '1', name: 'Product' }];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Product');
    });

    const req = httpMock.expectOne('/api/products?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush({ content: mockProducts });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

## Environment Management

### 1. Accessing Environment Variables
```typescript
import { environment } from '../environments/environment';

apiUrl = environment.apiUrl;
razorpayKey = environment.razorpayKey;
```

### 2. Type-Safe Environment
```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
  razorpayKey: string;
  timeout: number;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  razorpayKey: 'test_key',
  timeout: 30000
};
```

## Code Quality Standards

### Naming Conventions
- Services: `ProductService`, `OrderService`, `PaymentService`
- DTOs: `ProductDTO`, `OrderDTO`, `ApiResponse`
- Methods: `getProducts()`, `createOrder()`, `updateOrderStatus()`

### Documentation Template
```typescript
/**
 * Retrieves products with pagination
 * 
 * @param page - Page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Paginated product response
 * @example
 * this.productService.getProducts(0, 10).subscribe(response => {
 *   console.log(response.content);
 * });
 */
getProducts(page: number, pageSize: number): Observable<PaginatedResponse<ProductDTO>> { }
```

### Best Practices
- Always return Observables from services
- Use strong typing with DTOs
- Handle errors gracefully
- Implement retry logic for critical operations
- Cache frequently accessed data
- Use environment configuration for URLs
- Always test API integrations
- Document API contracts

## Related Guidelines
- See: src/app/app.config.ts for HTTP client configuration
- See: src/app/auth/auth.interceptor.ts for authentication header injection
- See: src/environments/ for environment configuration
