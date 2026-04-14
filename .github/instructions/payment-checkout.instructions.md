# GitHub Copilot Instructions: Payment & Checkout

## Priority Guidelines

When generating payment checkout and Razorpay integration code for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, RxJS 7.8+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular component and service patterns
4. **Architectural Consistency**: Maintain Razorpay checkout integration
5. **Code Quality**: Prioritize security, error handling, and transaction management

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0
- **Razorpay**: Latest CDN-loaded SDK

### Key Constraints
- Use standalone components (no NgModules)
- Razorpay SDK loaded dynamically in component
- Server-side payment verification required
- Test and live keys via environment configuration

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Dynamic Script Loading**: Razorpay SDK loaded at runtime
- **Template**: Use templateUrl and styleUrl

### Service Patterns
- Services handle payment initialization and verification
- RxJS Observables for async payment flow
- Error handling with typed error responses
- Backend communication for payment confirmation

### Module Organization
```
src/app/payment/
├── payment.component.ts
├── payment.service.ts
├── razorpay.service.ts
├── models/
│   ├── payment.model.ts
│   ├── order.model.ts
│   ├── razorpay-options.model.ts
│   └── payment-response.model.ts
└── interceptors/
    └── payment-error.handler.ts
```

## Payment Models & Types

### 1. Payment Data Models
```typescript
export interface PaymentInitRequest {
  amount: number;
  currency: string;
  orderId: string;
  cartItems: CartItem[];
  shippingAddress: Address;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentResponse {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message?: string;
  transactionId?: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  customer_notification: number;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, any>;
  theme: {
    color: string;
  };
  modal?: {
    confirm_close: boolean;
    ondismiss?: () => void;
    escape?: boolean;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

## Razorpay Service Pattern

### 1. Razorpay Wrapper Service
```typescript
@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private scriptLoaded = false;
  private scriptLoadedSubject = new Subject<boolean>();

  loadRazorpayScript(): Observable<boolean> {
    if (this.scriptLoaded) {
      return of(true);
    }

    return new Observable(observer => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoadedSubject.next(true);
        observer.next(true);
        observer.complete();
      };

      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        observer.error(new Error('Failed to load Razorpay'));
      };

      document.body.appendChild(script);
    });
  }

  openCheckout(options: RazorpayOptions): Observable<RazorpayResponse> {
    return new Observable(observer => {
      if (!window.Razorpay) {
        observer.error(new Error('Razorpay SDK not loaded'));
        return;
      }

      const rzp = new window.Razorpay(options);

      // Handle payment success
      const successHandler = (response: RazorpayResponse) => {
        observer.next(response);
        observer.complete();
      };

      // Handle payment failure
      const errorHandler = (error: any) => {
        console.error('Razorpay error:', error);
        observer.error(new Error(error.description || 'Payment failed'));
      };

      rzp.on('payment.success', successHandler);
      rzp.on('payment.error', errorHandler);

      rzp.open();
    });
  }

  // Validate Razorpay response
  isResponseValid(response: RazorpayResponse): boolean {
    return !!(
      response.razorpay_payment_id &&
      response.razorpay_order_id &&
      response.razorpay_signature
    );
  }
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
```

## Payment Service Pattern

### 1. Payment Management Service
```typescript
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private api = inject(ApiService);
  private razorpayService = inject(RazorpayService);
  private environment = inject(EnvironmentService);

  // Initiate payment - create Razorpay order on backend
  initiatePayment(request: PaymentInitRequest): Observable<PaymentResponse> {
    return this.api.post<any>(
      '/api/payments/initiate',
      request
    ).pipe(
      map(response => {
        console.log('Order created:', response);
        return {
          razorpayOrderId: response.orderId,
          amount: response.amount,
          currency: response.currency,
          keyId: this.environment.razorpayKey
        };
      }),
      catchError(error => {
        console.error('Failed to initiate payment:', error);
        return throwError(() => new Error('Failed to initiate payment'));
      })
    );
  }

  // Open Razorpay checkout
  openRazorpayCheckout(
    orderId: string,
    amount: number,
    customerEmail: string,
    customerPhone: string
  ): Observable<RazorpayResponse> {
    return this.razorpayService.loadRazorpayScript().pipe(
      switchMap(() => {
        const options: RazorpayOptions = {
          key: this.environment.razorpayKey,
          amount: amount * 100, // Amount in paisa
          currency: 'INR',
          order_id: orderId,
          customer_notification: 1,
          prefill: {
            name: '',
            email: customerEmail,
            contact: customerPhone
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            confirm_close: true,
            escape: true
          },
          handler: () => {} // Handled by observable
        };

        return this.razorpayService.openCheckout(options);
      }),
      catchError(error => {
        console.error('Checkout error:', error);
        return throwError(() => error);
      })
    );
  }

  // Verify payment on backend
  verifyPayment(paymentId: string, response: RazorpayResponse): Observable<PaymentResponse> {
    const verificationData = {
      razorpayPaymentId: response.razorpay_payment_id,
      razorpayOrderId: response.razorpay_order_id,
      razorpaySignature: response.razorpay_signature
    };

    return this.api.post<PaymentResponse>(
      `/api/payments/${paymentId}/verify`,
      verificationData
    ).pipe(
      tap(result => {
        if (result.status === 'SUCCESS') {
          console.log('Payment verified successfully');
        }
      }),
      catchError(error => {
        console.error('Payment verification failed:', error);
        return throwError(() => new Error('Payment verification failed'));
      })
    );
  }

  // Handle payment completion
  handlePaymentSuccess(response: RazorpayResponse, amount: number): Observable<any> {
    return this.verifyPayment(response.razorpay_payment_id, response).pipe(
      switchMap(paymentResult => {
        if (paymentResult.status === 'SUCCESS') {
          // Create order after successful payment
          return of(paymentResult);
        }
        return throwError(() => new Error('Payment verification failed'));
      })
    );
  }

  // Handle payment failure
  handlePaymentFailure(error: any): void {
    console.error('Payment failed:', error);
    // Show user-friendly error message
    if (error.code === 'RAZORPAY_POPUP_CLOSED') {
      console.log('User closed payment popup');
    } else if (error.code === 'NETWORK_ERROR') {
      console.log('Network error occurred');
    }
  }
}
```

## Payment Component Pattern

### 1. Checkout Page Component
```typescript
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgModules
  ],
  template: `
    <div class="payment-container" *ngIf="!paymentComplete">
      <!-- Order Summary -->
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-items">
          <div *ngFor="let item of cartItems; trackBy: trackByItemId" class="item">
            <span>{{ item.name }} x{{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity) | number: '1.2-2' }}</span>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${{ subtotal | number: '1.2-2' }}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>${{ taxAmount | number: '1.2-2' }}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>${{ shippingCost | number: '1.2-2' }}</span>
          </div>
          <div class="total-row grand-total">
            <span>Total:</span>
            <span>${{ totalAmount | number: '1.2-2' }}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Address Form -->
      <p-card class="shipping-section" title="Shipping Address">
        <form [formGroup]="addressForm">
          <div class="form-row">
            <input pInputText formControlName="street" placeholder="Street Address">
            <input pInputText formControlName="city" placeholder="City">
          </div>
          <div class="form-row">
            <input pInputText formControlName="state" placeholder="State">
            <input pInputText formControlName="zipCode" placeholder="ZIP Code">
          </div>
        </form>
      </p-card>

      <!-- Customer Info -->
      <p-card class="customer-section" title="Contact Information">
        <div class="form-row">
          <input pInputText 
                 [(ngModel)]="customerEmail" 
                 type="email"
                 placeholder="Email">
          <input pInputText 
                 [(ngModel)]="customerPhone"
                 type="tel"
                 placeholder="Phone">
        </div>
      </p-card>

      <!-- Loading State -->
      <div *ngIf="processing$ | async" class="loading-overlay">
        <p-progressSpinner></p-progressSpinner>
        <p>Processing payment...</p>
      </div>

      <!-- Error Message -->
      <p-message 
        *ngIf="error$ | async as error"
        severity="error"
        [text]="error"
        (close)="clearError()">
      </p-message>

      <!-- Proceed to Payment Button -->
      <button pButton 
              type="button" 
              label="Proceed to Payment"
              (click)="proceedToPayment()"
              [disabled]="!(processing$ | async) === false"
              class="payment-button">
      </button>
    </div>

    <!-- Payment Success State -->
    <div *ngIf="paymentComplete" class="payment-success">
      <p-card>
        <ng-template pTemplate="header">
          <i class="pi pi-check-circle" style="font-size: 3em; color: #4caf50;"></i>
        </ng-template>
        
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully.</p>
        <p>Order ID: {{ orderId }}</p>
        
        <button pButton 
                type="button"
                label="View Order"
                (click)="viewOrder()"
                class="success-button">
        </button>
      </p-card>
    </div>
  `,
  styles: [`
    .payment-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      display: grid;
      gap: 20px;
    }

    .order-summary {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .summary-items {
      margin: 16px 0;
      border-bottom: 1px solid #ddd;
      padding-bottom: 16px;
    }

    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .summary-totals {
      margin-top: 16px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }

    .grand-total {
      font-weight: bold;
      font-size: 1.1em;
      border-top: 2px solid #ddd;
      margin-top: 12px;
      padding-top: 12px;
    }

    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .form-row input {
      flex: 1;
    }

    .payment-button {
      width: 100%;
      padding: 12px;
      font-size: 1em;
      margin-top: 20px;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .payment-success {
      max-width: 500px;
      margin: 100px auto;
      text-align: center;
    }

    .success-button {
      margin-top: 20px;
    }
  `]
})
export class PaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(MessageService);

  cartItems: CartItem[] = [];
  subtotal = 0;
  taxAmount = 0;
  shippingCost = 0;
  totalAmount = 0;

  customerEmail = '';
  customerPhone = '';
  orderId = '';
  paymentComplete = false;

  processing$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  addressForm = inject(FormBuilder).group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadCartItems();
    this.loadCustomerInfo();
  }

  loadCartItems(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  loadCustomerInfo(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.customerEmail = user.email;
      this.customerPhone = user.phone || '';
    }
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    this.taxAmount = this.subtotal * 0.1; // 10% tax
    this.shippingCost = 50; // Fixed shipping
    this.totalAmount = this.subtotal + this.taxAmount + this.shippingCost;
  }

  proceedToPayment(): void {
    if (!this.validateForm()) {
      this.error$.next('Please fill in all required fields');
      return;
    }

    this.processing$.next(true);
    this.error$.next(null);

    // Step 1: Initiate payment
    const paymentRequest: PaymentInitRequest = {
      amount: this.totalAmount,
      currency: 'INR',
      orderId: '', // Will be generated by backend
      cartItems: this.cartItems,
      shippingAddress: this.addressForm.value as Address,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone
    };

    this.paymentService.initiatePayment(paymentRequest).subscribe({
      next: (response) => {
        // Step 2: Open Razorpay checkout
        this.paymentService.openRazorpayCheckout(
          response.razorpayOrderId,
          this.totalAmount,
          this.customerEmail,
          this.customerPhone
        ).subscribe({
          next: (razorpayResponse) => {
            // Step 3: Verify payment
            this.paymentService.handlePaymentSuccess(razorpayResponse, this.totalAmount)
              .subscribe({
                next: () => {
                  this.paymentComplete = true;
                  this.orderId = razorpayResponse.razorpay_order_id;
                  this.cartService.clearCart();
                  this.toastr.add({
                    severity: 'success',
                    summary: 'Payment Successful',
                    detail: 'Your order has been placed'
                  });
                },
                error: (error) => {
                  this.processing$.next(false);
                  this.error$.next('Payment verification failed. Please contact support.');
                  console.error('Payment verification error:', error);
                }
              });
          },
          error: (error) => {
            this.processing$.next(false);
            this.paymentService.handlePaymentFailure(error);
            this.error$.next('Payment failed. Please try again.');
          }
        });
      },
      error: (error) => {
        this.processing$.next(false);
        this.error$.next('Failed to initiate payment. Please try again.');
        console.error('Payment initiation error:', error);
      }
    });
  }

  validateForm(): boolean {
    return (
      this.addressForm.valid &&
      this.customerEmail.trim() !== '' &&
      this.customerPhone.trim() !== ''
    );
  }

  viewOrder(): void {
    this.router.navigate(['/orders', this.orderId]);
  }

  clearError(): void {
    this.error$.next(null);
  }

  trackByItemId(_index: number, item: CartItem): string {
    return item.productId;
  }
}
```

## API Endpoints

### Payment Endpoints
- `POST /api/payments/initiate` - Create Razorpay order
- `POST /api/payments/:id/verify` - Verify payment signature
- `POST /api/payments/:id/webhook` - Razorpay webhook (backend)

### Request/Response Examples
```typescript
// POST /api/payments/initiate
Request: PaymentInitRequest
Response: {
  orderId: "order_123",
  amount: 15000,
  currency: "INR"
}

// POST /api/payments/payment_123/verify
Request: {
  razorpayPaymentId: "pay_123",
  razorpayOrderId: "order_123",
  razorpaySignature: "signature_hash"
}
Response: PaymentResponse {
  status: 'SUCCESS',
  razorpayPaymentId: 'pay_123',
  transactionId: 'txn_123'
}
```

## Error Handling Pattern

### Common Error Scenarios
```typescript
// Network error
RAZORPAY_NETWORK_ERROR: 'Network connection failed'

// Payment failure
RAZORPAY_PAYMENT_FAILED: 'Payment processing failed'

// User cancelled
RAZORPAY_POPUP_CLOSED: 'Payment cancelled by user'

// Verification failed
PAYMENT_VERIFICATION_FAILED: 'Backend verification failed'

// Invalid amount
INVALID_PAYMENT_AMOUNT: 'Amount must be greater than zero'
```

## Security Guidelines

### 1. Signature Verification
- Always verify Razorpay signature on backend
- Use HMAC SHA256 with API secret
- Never trust client-side payment confirmation

### 2. Amount Validation
- Verify amount matches order on backend
- Prevent client-side manipulation
- Use server-side calculation

### 3. Environmental Variables
```typescript
// Never hardcode keys
NG_APP_RAZORPAY_KEY = 'rzp_test_...' (test mode)
NG_APP_RAZORPAY_KEY = 'rzp_live_...' (production)
```

### 4. HTTPS Enforcement
- Always use HTTPS for payment
- Set secure cookie flags
- Implement CSP headers

## Testing Environment

### Test Credentials (Razorpay)
```
Test Cards:
4111 1111 1111 1111 - Visa
5555 5555 5555 4444 - Mastercard
OTP: 123456
```

## Code Quality Standards

### Naming Conventions
- Components: `PaymentComponent`, `CheckoutComponent`
- Services: `PaymentService`, `RazorpayService`
- Models: `PaymentResponse`, `RazorpayOptions`

### Documentation Template
```typescript
/**
 * Opens Razorpay checkout modal
 * @param orderId - Razorpay order ID
 * @param amount - Payment amount in INR
 * @param customerEmail - Customer email
 * @param customerPhone - Customer phone
 * @returns Observable of Razorpay payment response
 */
openRazorpayCheckout(...): Observable<RazorpayResponse> { }
```

## Related Guidelines
- See: src/app/services/api.service.ts for HTTP calls
- See: src/app/auth/auth.guard.ts for authentication
- See: src/environments/ for Razorpay key configuration
