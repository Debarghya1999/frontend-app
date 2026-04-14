# GitHub Copilot Instructions: Shopping Cart

## Priority Guidelines

When generating shopping cart functionality for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, RxJS 7.8+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established service and component patterns
4. **Architectural Consistency**: Maintain client-side cart state with localStorage persistence
5. **Code Quality**: Prioritize state management, validation, and real-time updates

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0
- **Storage**: Browser localStorage

### Key Constraints
- Use standalone components (no NgModules)
- Use BehaviorSubject for cart state management
- Cart persists in localStorage
- Real-time totals calculation
- Stock availability validation

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **State Management**: BehaviorSubject for reactive updates
- **Template**: Use templateUrl and styleUrl
- **Change Detection**: OnPush for performance

### Service Patterns
- Services manage cart state as BehaviorSubject
- Services validate stock and quantities
- localStorage for persistence
- Observable streams for reactive components

### Module Organization
```
src/app/cart/
├── cart.service.ts
├── cart.component.ts
├── cart-item.component.ts
├── cart-summary.component.ts
├── models/
│   ├── cart.model.ts
│   ├── cart-item.model.ts
│   └── cart-calculations.model.ts
└── validators/
    └── cart.validators.ts
```

## Cart Models & Types

### 1. Core Cart Models
```typescript
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  discountPrice?: number;
  stock: number;
  maxQuantity?: number; // Optional limit per item
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  discountCode?: string;
  updatedAt: Date;
}

export interface CartCalculations {
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  stock: number;
  discountPrice?: number;
}
```

## Cart Service Pattern

### 1. Cart State Management Service
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'shopping_cart';
  private readonly TAX_RATE = 0.1; // 10%
  private readonly SHIPPING_COST = 50; // Fixed shipping

  private cartSubject = new BehaviorSubject<Cart>(this.loadCartFromStorage());
  public cart$ = this.cartSubject.asObservable();

  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage().items);
  public items$ = this.itemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.updateCartCount();
  }

  // Get current cart
  getCart(): Observable<CartItem[]> {
    return this.items$.asObservable();
  }

  // Get cart item count
  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  // Get current cart synchronously
  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  // Add item to cart
  addToCart(request: AddToCartRequest): Observable<Cart> {
    return new Observable(observer => {
      try {
        // Validate stock
        if (request.quantity > request.stock) {
          observer.error(new Error('Quantity exceeds available stock'));
          return;
        }

        const currentCart = this.cartSubject.value;
        const existingItemIndex = currentCart.items.findIndex(
          item => item.productId === request.productId
        );

        if (existingItemIndex > -1) {
          // Item exists - update quantity
          const existingItem = currentCart.items[existingItemIndex];
          const newQuantity = existingItem.quantity + request.quantity;

          if (newQuantity > request.stock) {
            observer.error(new Error('Total quantity exceeds available stock'));
            return;
          }

          currentCart.items[existingItemIndex].quantity = newQuantity;
        } else {
          // Add new item
          const newItem: CartItem = {
            productId: request.productId,
            name: request.name,
            price: request.price,
            quantity: request.quantity,
            image: request.image,
            category: request.category,
            stock: request.stock,
            discountPrice: request.discountPrice
          };

          currentCart.items.push(newItem);
        }

        this.updateCart(currentCart);
        observer.next(currentCart);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to add item to cart'));
      }
    });
  }

  // Remove item from cart
  removeFromCart(productId: string): Observable<Cart> {
    return new Observable(observer => {
      try {
        const currentCart = this.cartSubject.value;
        const filteredItems = currentCart.items.filter(
          item => item.productId !== productId
        );

        if (filteredItems.length === currentCart.items.length) {
          observer.error(new Error('Item not found in cart'));
          return;
        }

        currentCart.items = filteredItems;
        this.updateCart(currentCart);
        observer.next(currentCart);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to remove item'));
      }
    });
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    return new Observable(observer => {
      try {
        if (quantity < 1) {
          observer.error(new Error('Quantity must be at least 1'));
          return;
        }

        const currentCart = this.cartSubject.value;
        const itemIndex = currentCart.items.findIndex(
          item => item.productId === productId
        );

        if (itemIndex === -1) {
          observer.error(new Error('Item not found in cart'));
          return;
        }

        const item = currentCart.items[itemIndex];
        
        // Validate stock
        if (quantity > item.stock) {
          observer.error(new Error('Quantity exceeds available stock'));
          return;
        }

        item.quantity = quantity;
        this.updateCart(currentCart);
        observer.next(currentCart);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to update quantity'));
      }
    });
  }

  // Clear entire cart
  clearCart(): Observable<void> {
    return new Observable(observer => {
      try {
        const emptyCart: Cart = {
          items: [],
          subtotal: 0,
          taxAmount: 0,
          shippingCost: 0,
          discountAmount: 0,
          totalAmount: 0,
          updatedAt: new Date()
        };

        this.updateCart(emptyCart);
        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to clear cart'));
      }
    });
  }

  // Apply discount/promo code
  applyDiscountCode(code: string): Observable<Cart> {
    return new Observable(observer => {
      try {
        // In real app, validate code with backend
        const currentCart = this.cartSubject.value;
        
        // Example: 10% discount for code "SAVE10"
        let discountAmount = 0;
        if (code === 'SAVE10') {
          discountAmount = currentCart.subtotal * 0.1;
        }

        currentCart.discountCode = code;
        currentCart.discountAmount = discountAmount;

        this.updateCart(currentCart);
        observer.next(currentCart);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Invalid discount code'));
      }
    });
  }

  // Remove discount
  removeDiscount(): Observable<Cart> {
    return new Observable(observer => {
      try {
        const currentCart = this.cartSubject.value;
        currentCart.discountCode = undefined;
        currentCart.discountAmount = 0;

        this.updateCart(currentCart);
        observer.next(currentCart);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to remove discount'));
      }
    });
  }

  // Get cart calculations
  getCartCalculations(): CartCalculations {
    const currentCart = this.cartSubject.value;
    return {
      subtotal: currentCart.subtotal,
      taxAmount: currentCart.taxAmount,
      shippingCost: currentCart.shippingCost,
      discountAmount: currentCart.discountAmount,
      totalAmount: currentCart.totalAmount
    };
  }

  // Private methods
  private updateCart(cart: Cart): void {
    // Calculate totals
    cart.subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = item.discountPrice || item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    cart.taxAmount = cart.subtotal * this.TAX_RATE;
    cart.shippingCost = cart.items.length > 0 ? this.SHIPPING_COST : 0;
    cart.totalAmount = cart.subtotal + cart.taxAmount + cart.shippingCost - (cart.discountAmount || 0);
    cart.updatedAt = new Date();

    // Update subjects
    this.cartSubject.next(cart);
    this.itemsSubject.next(cart.items);
    this.updateCartCount();

    // Persist to storage
    this.saveCartToStorage(cart);
  }

  private updateCartCount(): void {
    const count = this.cartSubject.value.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.cartCountSubject.next(count);
  }

  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): Cart {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }

    return {
      items: [],
      subtotal: 0,
      taxAmount: 0,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: 0,
      updatedAt: new Date()
    };
  }
}
```

## Cart Component Pattern

### 1. Main Cart Page
```typescript
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cart-container" *ngIf="cartItems$ | async as items">
      <h1>Shopping Cart</h1>

      <div *ngIf="items.length > 0; else emptyCart" class="cart-content">
        <!-- Items List -->
        <div class="cart-items">
          <app-cart-item
            *ngFor="let item of items; trackBy: trackByProductId"
            [item]="item"
            (remove)="onRemoveItem($event)"
            (quantityChange)="onQuantityChange($event)"
            (viewProduct)="onViewProduct($event)">
          </app-cart-item>
        </div>

        <!-- Cart Summary -->
        <aside class="cart-summary-sidebar">
          <app-cart-summary
            [cart]="cartCalculations$ | async"
            [discountForm]="discountForm"
            (applyCoupon)="onApplyCoupon($event)"
            (removeCoupon)="onRemoveCoupon()"
            (checkout)="onCheckout()">
          </app-cart-summary>
        </aside>
      </div>

      <!-- Empty Cart State -->
      <ng-template #emptyCart>
        <div class="empty-cart">
          <i class="pi pi-shopping-cart" style="font-size: 3em; color: #ccc;"></i>
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <button pButton 
                  type="button"
                  label="Continue Shopping"
                  (click)="continueShopping()">
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
      margin-top: 20px;
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-summary-sidebar {
      position: sticky;
      top: 20px;
      height: fit-content;
    }

    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .cart-summary-sidebar {
        position: static;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  cartItems$ = this.cartService.cart$;
  cartCalculations$ = this.cartService.cart$.pipe(
    map(cart => this.cartService.getCartCalculations())
  );

  discountForm = this.fb.group({
    couponCode: ['', Validators.required]
  });

  ngOnInit(): void {
    // Cart auto-loads from service
  }

  onRemoveItem(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      error: (error) => console.error('Failed to remove item:', error)
    });
  }

  onQuantityChange(event: { productId: string; quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity).subscribe({
      error: (error) => console.error('Failed to update quantity:', error)
    });
  }

  onViewProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  onApplyCoupon(code: string): void {
    this.cartService.applyDiscountCode(code).subscribe({
      error: (error) => console.error('Failed to apply coupon:', error)
    });
  }

  onRemoveCoupon(): void {
    this.cartService.removeDiscount().subscribe();
  }

  onCheckout(): void {
    this.router.navigate(['/payment']);
  }

  continueShopping(): void {
    this.router.navigate(['/catalog']);
  }

  trackByProductId(_index: number, item: CartItem): string {
    return item.productId;
  }
}
```

### 2. Cart Item Component
```typescript
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, ReactiveFormsModule],
  template: `
    <p-card class="cart-item">
      <div class="item-container">
        <!-- Product Image -->
        <div class="item-image">
          <img [src]="item.image" [alt]="item.name" (click)="viewProduct()">
        </div>

        <!-- Product Info -->
        <div class="item-info">
          <h4 class="item-name" (click)="viewProduct()" style="cursor: pointer;">
            {{ item.name }}
          </h4>
          <p class="item-category">{{ item.category }}</p>
          <p class="item-sku">SKU: {{ item.productId }}</p>
        </div>

        <!-- Price & Controls -->
        <div class="item-details">
          <div class="price-section">
            <span *ngIf="item.discountPrice" class="original">
              ${{ item.price | number: '1.2-2' }}
            </span>
            <span class="current-price">
              ${{ (item.discountPrice || item.price) | number: '1.2-2' }}
            </span>
          </div>

          <!-- Quantity Control -->
          <div class="quantity-control">
            <button pButton 
                    type="button"
                    icon="pi pi-minus"
                    class="p-button-sm"
                    (click)="decreaseQuantity()"
                    [disabled]="item.quantity <= 1">
            </button>
            <input type="number" 
                   [(ngModel)]="quantity"
                   (change)="updateQuantity()"
                   class="quantity-input">
            <button pButton 
                    type="button"
                    icon="pi pi-plus"
                    class="p-button-sm"
                    (click)="increaseQuantity()"
                    [disabled]="item.quantity >= item.stock">
            </button>
          </div>

          <!-- Subtotal -->
          <div class="subtotal">
            Subtotal: <strong>${{ getSubtotal() | number: '1.2-2' }}</strong>
          </div>

          <!-- Remove Button -->
          <button pButton 
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-danger p-button-text"
                  (click)="removeItem()">
            Remove
          </button>
        </div>
      </div>

      <!-- Stock Warning -->
      <p-message 
        *ngIf="item.quantity >= item.stock"
        severity="warn"
        text="You've reached the maximum available quantity">
      </p-message>
    </p-card>
  `,
  styles: [`
    .item-container {
      display: grid;
      grid-template-columns: 80px 1fr 100px 1fr;
      gap: 20px;
      align-items: center;
    }

    .item-image {
      width: 80px;
      height: 80px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }

    .item-info h4 {
      margin: 0 0 4px 0;
    }

    .item-category, .item-sku {
      font-size: 0.85em;
      color: #666;
      margin: 2px 0;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }

    .price-section {
      text-align: right;
    }

    .original {
      text-decoration: line-through;
      color: #999;
      font-size: 0.9em;
      margin-right: 8px;
    }

    .current-price {
      font-weight: bold;
      font-size: 1.1em;
      color: #ff6b6b;
    }

    .quantity-control {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .quantity-input {
      width: 40px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px;
    }

    .subtotal {
      font-weight: 500;
      min-width: 120px;
      text-align: right;
    }

    @media (max-width: 768px) {
      .item-container {
        grid-template-columns: 60px 1fr;
        gap: 12px;
      }

      .item-details {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: space-between;
      }
    }
  `]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() viewProduct = new EventEmitter<string>();

  quantity = 1;

  ngOnInit(): void {
    this.quantity = this.item.quantity;
  }

  increaseQuantity(): void {
    if (this.quantity < this.item.stock) {
      this.quantity++;
      this.updateQuantity();
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantity();
    }
  }

  updateQuantity(): void {
    this.quantityChange.emit({
      productId: this.item.productId,
      quantity: this.quantity
    });
  }

  getSubtotal(): number {
    const price = this.item.discountPrice || this.item.price;
    return price * this.item.quantity;
  }

  removeItem(): void {
    this.remove.emit(this.item.productId);
  }

  viewProductDetail(): void {
    this.viewProduct.emit(this.item.productId);
  }
}
```

### 3. Cart Summary Component
```typescript
@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, ReactiveFormsModule],
  template: `
    <p-card class="cart-summary">
      <ng-template pTemplate="header">
        <div class="summary-header">
          <h3>Order Summary</h3>
        </div>
      </ng-template>

      <div class="summary-content">
        <!-- Totals -->
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ cart?.subtotal | number: '1.2-2' }}</span>
        </div>

        <div class="summary-row" *ngIf="cart?.discountAmount > 0">
          <span>Discount:</span>
          <span class="discount">-${{ cart.discountAmount | number: '1.2-2' }}</span>
        </div>

        <div class="summary-row">
          <span>Tax (10%):</span>
          <span>${{ cart?.taxAmount | number: '1.2-2' }}</span>
        </div>

        <div class="summary-row">
          <span>Shipping:</span>
          <span>${{ cart?.shippingCost | number: '1.2-2' }}</span>
        </div>

        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ cart?.totalAmount | number: '1.2-2' }}</span>
        </div>

        <!-- Coupon -->
        <form [formGroup]="discountForm" class="coupon-section">
          <input pInputText 
                 formControlName="couponCode"
                 placeholder="Enter coupon code">
          <button pButton
                  type="button"
                  label="Apply"
                  (click)="applyCoupon()"
                  [disabled]="!discountForm.valid">
          </button>
        </form>

        <!-- Checkout Button -->
        <button pButton
                type="button"
                label="Proceed to Checkout"
                (click)="checkout()"
                class="checkout-btn">
        </button>

        <!-- Continue Shopping -->
        <button pButton
                type="button"
                label="Continue Shopping"
                severity="secondary"
                class="continue-btn">
        </button>
      </div>
    </p-card>
  `,
  styles: [`
    .summary-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95em;
    }

    .summary-row.total {
      border-top: 2px solid #eee;
      padding-top: 12px;
      font-weight: bold;
      font-size: 1.1em;
    }

    .discount {
      color: #4caf50;
    }

    .coupon-section {
      display: flex;
      gap: 8px;
      margin: 12px 0;
    }

    .coupon-section input {
      flex: 1;
    }

    .checkout-btn {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
    }

    .continue-btn {
      width: 100%;
    }
  `]
})
export class CartSummaryComponent {
  @Input() cart: CartCalculations | null = null;
  @Input() discountForm!: FormGroup;
  @Output() applyCoupon = new EventEmitter<string>();
  @Output() removeCoupon = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();

  applyCouponClick(): void {
    const code = this.discountForm.get('couponCode')?.value;
    if (code) {
      this.applyCoupon.emit(code);
      this.discountForm.reset();
    }
  }

  checkoutClick(): void {
    this.checkout.emit();
  }
}
```

## Route Configuration

### Cart Routes
```typescript
export const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [publicGuard] // Allow non-authenticated users
  }
];
```

## Code Quality Standards

### Naming Conventions
- Services: `CartService`
- Components: `CartComponent`, `CartItemComponent`, `CartSummaryComponent`
- Models: `Cart`, `CartItem`, `CartCalculations`
- Methods: `addToCart()`, `removeFromCart()`, `updateQuantity()`

### Best Practices
- Use `trackBy` in *ngFor for lists
- Store cart in localStorage for persistence
- Validate stock before operations
- Use BehaviorSubject for real-time updates
- Handle errors gracefully
- Maintain state consistency

## Related Guidelines
- See: src/app/services/api.service.ts for API calls
- See: src/app/products/product.service.ts for product data
- See: src/app/payment/payment.component.ts for checkout
