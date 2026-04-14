# GitHub Copilot Instructions: Order Tracking & User Orders

## Priority Guidelines

When generating order tracking and user order management code for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular component and service patterns
4. **Architectural Consistency**: Maintain user-facing order management design
5. **Code Quality**: Prioritize maintainability, UX clarity, and real-time updates

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
- Leverage PrimeNG Timeline, Card, Button components

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Data Binding**: Use async pipe for observables
- **Template**: Use templateUrl and styleUrl

### Service Patterns
- Services use dependency injection
- Services provide typed observable streams
- Error handling with catchError operator
- Real-time updates via polling or WebSockets

### Module Organization
```
src/app/orders/
├── order-history.component.ts
├── order-detail.component.ts
├── order-tracking.component.ts
├── order.service.ts
├── models/
│   ├── order.model.ts
│   ├── order-item.model.ts
│   ├── order-status.model.ts
│   └── delivery-status.model.ts
└── components/
    ├── order-card.component.ts
    ├── delivery-timeline.component.ts
    └── order-summary.component.ts
```

## Order Models & Types

### 1. Core Order Models
```typescript
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryStatus {
  NOT_SHIPPED = 'NOT_SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED_DELIVERY = 'FAILED_DELIVERY'
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryStatus: DeliveryStatus;
  totalAmount: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryDate?: Date;
  deliveredAt?: Date;
  cancelReason?: string;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

### 2. API Response Models
```typescript
export interface OrderResponse extends Order {
  invoiceUrl?: string;
  supportContact?: string;
}

export interface OrderHistoryResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Order Service Pattern

### 1. Order Data Service
```typescript
@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private cache$ = new Map<string, Observable<Order>>();

  // Get all user orders
  getUserOrders(page: number = 0, pageSize: number = 10): Observable<OrderHistoryResponse> {
    return this.api.get<OrderHistoryResponse>(
      `/api/orders?page=${page}&pageSize=${pageSize}`
    ).pipe(
      tap(response => console.log('Orders loaded:', response)),
      catchError(error => {
        console.error('Failed to load orders:', error);
        return throwError(() => new Error('Failed to load orders'));
      })
    );
  }

  // Get specific order by ID
  getOrderDetail(orderId: string): Observable<Order> {
    // Check cache first
    if (this.cache$.has(orderId)) {
      return this.cache$.get(orderId)!;
    }

    const order$ = this.api.get<Order>(`/api/orders/${orderId}`).pipe(
      shareReplay(1),
      tapError(error => {
        console.error(`Failed to load order ${orderId}:`, error);
      })
    );

    this.cache$.set(orderId, order$);
    return order$;
  }

  // Get orders by status filter
  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.api.get<Order[]>(
      `/api/orders?status=${status}`
    );
  }

  // Get real-time order status updates
  subscribeToOrderUpdates(orderId: string): Observable<Order> {
    // Polling approach (alternative: WebSocket)
    return interval(5000).pipe(
      switchMap(() => this.getOrderDetail(orderId)),
      startWith(this.cache$.get(orderId) || null),
      filterNotNull()
    );
  }

  // Cancel order (if eligible)
  cancelOrder(orderId: string, reason: string): Observable<Order> {
    return this.api.put<Order>(
      `/api/orders/${orderId}/cancel`,
      { reason }
    ).pipe(
      tap(() => this.invalidateCache(orderId)),
      catchError(error => {
        console.error('Failed to cancel order:', error);
        return throwError(() => new Error('Cannot cancel this order'));
      })
    );
  }

  // Invalidate cache
  private invalidateCache(orderId: string): void {
    this.cache$.delete(orderId);
  }
}
```

## Order History Component Pattern

### 1. Order List Component
```typescript
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, FormsModule],
  template: `
    <div class="order-history-container">
      <h2>Order History</h2>
      
      <!-- Filters -->
      <div class="filters">
        <p-dropdown 
          [options]="statusOptions"
          [(ngModel)]="selectedStatus"
          (onChange)="onStatusFilter()">
        </p-dropdown>
        
        <input 
          pInputText 
          [(ngModel)]="searchQuery"
          (keyup)="onSearch()"
          placeholder="Search by Order ID">
      </div>

      <!-- Loading state -->
      <div *ngIf="loading$ | async; else ordersList">
        <p-skeleton [rows]="5"></p-skeleton>
      </div>

      <!-- Orders list -->
      <ng-template #ordersList>
        <div *ngIf="(filteredOrders$ | async) as orders; else noOrders">
          <div *ngFor="let order of orders; trackBy: trackByOrderId" 
               class="order-card-container">
            <app-order-card [order]="order" (select)="viewOrderDetail(order)"></app-order-card>
          </div>
        </div>

        <ng-template #noOrders>
          <p-card class="no-orders">
            <p>No orders found</p>
          </p-card>
        </ng-template>
      </ng-template>

      <!-- Pagination -->
      <p-paginator 
        [rows]="pageSize"
        [totalRecords]="(totalRecords$ | async) || 0"
        (onPageChange)="onPageChange($event)">
      </p-paginator>
    </div>
  `,
  styles: [`
    .order-history-container {
      padding: 20px;
    }
    
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .order-card-container {
      margin-bottom: 16px;
    }
    
    .no-orders {
      text-align: center;
      padding: 40px;
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders$ = signal<Order[]>([]);
  loading$ = signal(false);
  filteredOrders$ = new Observable<Order[]>();
  totalRecords$ = new Observable<number>();

  selectedStatus: OrderStatus | null = null;
  searchQuery = '';
  currentPage = 0;
  pageSize = 10;

  statusOptions = Object.entries(OrderStatus).map(([key, value]) => ({
    label: key,
    value: value
  }));

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading$.set(true);
    this.orderService.getUserOrders(this.currentPage, this.pageSize)
      .pipe(
        finalize(() => this.loading$.set(false)),
        takeUntilDestroyed()
      )
      .subscribe(response => {
        this.orders$.set(response.orders);
        this.totalRecords$ = of(response.total);
      });
  }

  onStatusFilter(): void {
    if (this.selectedStatus) {
      this.orderService.getOrdersByStatus(this.selectedStatus)
        .pipe(takeUntilDestroyed())
        .subscribe(orders => this.orders$.set(orders));
    } else {
      this.loadOrders();
    }
  }

  onSearch(): void {
    const filtered = this.orders$().filter(order =>
      order.id.includes(this.searchQuery)
    );
    this.filteredOrders$ = of(filtered);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadOrders();
  }

  viewOrderDetail(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  trackByOrderId(_index: number, order: Order): string {
    return order.id;
  }
}
```

## Order Detail Component Pattern

### 1. Order Detail View
```typescript
@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, PrimeNgModules],
  template: `
    <div class="order-detail-container" *ngIf="order$ | async as order; else loading">
      <!-- Order Header -->
      <div class="order-header">
        <div class="header-info">
          <h2>Order #{{ order.id }}</h2>
          <p class="order-date">{{ order.createdAt | date: 'long' }}</p>
        </div>
        <div class="order-status">
          <p-tag 
            [value]="order.status"
            [severity]="getStatusSeverity(order.status)">
          </p-tag>
        </div>
      </div>

      <!-- Items Section -->
      <p-card class="items-section" title="Items">
        <div *ngFor="let item of order.items; trackBy: trackByItemId" 
             class="order-item">
          <img [src]="item.productImage" [alt]="item.productName" class="item-image">
          <div class="item-details">
            <h4>{{ item.productName }}</h4>
            <p>Quantity: {{ item.quantity }}</p>
          </div>
          <div class="item-price">
            <p>${{ item.price | number: '1.2-2' }}</p>
          </div>
        </div>
      </p-card>

      <!-- Delivery Timeline -->
      <app-delivery-timeline [order]="order"></app-delivery-timeline>

      <!-- Order Summary -->
      <app-order-summary [order]="order"></app-order-summary>

      <!-- Shipping Address -->
      <p-card class="shipping-section" title="Shipping Address">
        <div class="address-info">
          <p>{{ order.shippingAddress.street }}</p>
          <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
          <p>{{ order.shippingAddress.country }}</p>
        </div>
      </p-card>

      <!-- Actions -->
      <div class="actions">
        <button pButton type="button" label="Download Invoice" 
                (click)="downloadInvoice(order)"></button>
        <button pButton type="button" label="Track Package" 
                *ngIf="order.trackingNumber"
                (click)="trackPackage(order)"></button>
        <button pButton type="button" label="Cancel Order" 
                severity="danger"
                *ngIf="canCancelOrder(order)"
                (click)="confirmCancelOrder(order)"></button>
      </div>
    </div>

    <ng-template #loading>
      <p-skeleton [rows]="5"></p-skeleton>
    </ng-template>
  `,
  styles: [`
    .order-detail-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .order-item {
      display: flex;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-price {
      text-align: right;
      font-weight: bold;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 30px;
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private confirmService = inject(ConfirmationService);

  order$ = new Observable<Order>();
  orderId = '';

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.order$ = this.orderService.getOrderDetail(this.orderId);
  }

  getStatusSeverity(status: OrderStatus): string {
    const severityMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'warning',
      [OrderStatus.CONFIRMED]: 'info',
      [OrderStatus.PROCESSING]: 'info',
      [OrderStatus.SHIPPED]: 'info',
      [OrderStatus.IN_TRANSIT]: 'info',
      [OrderStatus.OUT_FOR_DELIVERY]: 'warning',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELLED]: 'danger'
    };
    return severityMap[status] || 'secondary';
  }

  canCancelOrder(order: Order): boolean {
    return order.status === OrderStatus.PENDING || 
           order.status === OrderStatus.CONFIRMED;
  }

  downloadInvoice(order: Order): void {
    // Call backend to generate and download invoice
    console.log('Downloading invoice for order:', order.id);
  }

  trackPackage(order: Order): void {
    if (order.trackingNumber) {
      window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank');
    }
  }

  confirmCancelOrder(order: Order): void {
    this.confirmService.confirm({
      message: 'Are you sure you want to cancel this order?',
      accept: () => {
        this.cancelOrder(order);
      }
    });
  }

  cancelOrder(order: Order): void {
    this.orderService.cancelOrder(order.id, 'User cancelled')
      .subscribe({
        next: () => {
          // Show success message and reload
          this.order$ = this.orderService.getOrderDetail(this.orderId);
        },
        error: (error) => {
          console.error('Failed to cancel order:', error);
        }
      });
  }

  trackByItemId(_index: number, item: OrderItem): string {
    return item.id;
  }
}
```

## Delivery Timeline Component Pattern

### 1. Timeline Display
```typescript
@Component({
  selector: 'app-delivery-timeline',
  standalone: true,
  imports: [CommonModule, PrimeNgModules],
  template: `
    <p-card class="timeline-section" title="Delivery Status">
      <p-timeline 
        [value]="timelineEvents"
        align="left"
        layout="vertical">
        <ng-template pTemplate="content" let-event>
          <div class="timeline-event">
            <h4>{{ event.status }}</h4>
            <p>{{ event.timestamp | date: 'short' }}</p>
            <p class="event-description">{{ event.description }}</p>
          </div>
        </ng-template>
      </p-timeline>

      <div class="estimated-delivery" *ngIf="estimatedDelivery">
        <p-tag 
          icon="pi pi-calendar"
          [value]="'Estimated Delivery: ' + (estimatedDelivery | date: 'short')">
        </p-tag>
      </div>
    </p-card>
  `,
  styles: [`
    .timeline-section {
      margin: 20px 0;
    }
    
    .timeline-event {
      padding: 12px;
    }
    
    .event-description {
      color: #666;
      margin-top: 8px;
    }
    
    .estimated-delivery {
      margin-top: 20px;
      text-align: center;
    }
  `]
})
export class DeliveryTimelineComponent {
  @Input() order!: Order;

  timelineEvents: Array<{ status: string; timestamp: Date; description: string }> = [];
  estimatedDelivery: Date | null = null;

  ngOnInit(): void {
    this.buildTimeline();
  }

  buildTimeline(): void {
    const events = [];

    // Map order status to timeline events
    const statusTimeline = [
      { status: OrderStatus.PENDING, label: 'Order Placed' },
      { status: OrderStatus.CONFIRMED, label: 'Order Confirmed' },
      { status: OrderStatus.PROCESSING, label: 'Processing' },
      { status: OrderStatus.SHIPPED, label: 'Shipped' },
      { status: OrderStatus.IN_TRANSIT, label: 'In Transit' },
      { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery' },
      { status: OrderStatus.DELIVERED, label: 'Delivered' }
    ];

    statusTimeline.forEach(item => {
      if (this.isStatusReached(item.status)) {
        events.push({
          status: item.label,
          timestamp: this.getStatusTimestamp(item.status),
          description: this.getStatusDescription(item.status)
        });
      }
    });

    this.timelineEvents = events;
    this.estimatedDelivery = this.order.estimatedDeliveryDate || null;
  }

  isStatusReached(status: OrderStatus): boolean {
    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.IN_TRANSIT,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED
    ];

    return statusOrder.indexOf(status) <= statusOrder.indexOf(this.order.status);
  }

  getStatusTimestamp(status: OrderStatus): Date {
    if (status === OrderStatus.PENDING) return this.order.createdAt;
    if (status === OrderStatus.DELIVERED) return this.order.deliveredAt || new Date();
    return new Date(); // Approximate for other statuses
  }

  getStatusDescription(status: OrderStatus): string {
    const descriptions: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Your order is being prepared',
      [OrderStatus.CONFIRMED]: 'Order confirmed and will be processed soon',
      [OrderStatus.PROCESSING]: 'Your order is being packed',
      [OrderStatus.SHIPPED]: 'Package shipped',
      [OrderStatus.IN_TRANSIT]: 'Package is on its way',
      [OrderStatus.OUT_FOR_DELIVERY]: 'Package out for delivery today',
      [OrderStatus.DELIVERED]: 'Package delivered',
      [OrderStatus.CANCELLED]: 'Order cancelled'
    };
    return descriptions[status] || '';
  }
}
```

## Order Summary Component Pattern

### 1. Price Breakdown
```typescript
@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, PrimeNgModules],
  template: `
    <p-card class="summary-section" title="Order Summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>${{ getSubtotal() | number: '1.2-2' }}</span>
      </div>
      <div class="summary-row" *ngIf="order.discountAmount > 0">
        <span>Discount:</span>
        <span class="discount">-${{ order.discountAmount | number: '1.2-2' }}</span>
      </div>
      <div class="summary-row">
        <span>Shipping:</span>
        <span>${{ order.shippingCost | number: '1.2-2' }}</span>
      </div>
      <div class="summary-row">
        <span>Tax:</span>
        <span>${{ order.taxAmount | number: '1.2-2' }}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>${{ order.totalAmount | number: '1.2-2' }}</span>
      </div>
    </p-card>
  `,
  styles: [`
    .summary-section {
      margin: 20px 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .summary-row.total {
      border-bottom: none;
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 12px;
    }
    
    .discount {
      color: #4caf50;
    }
  `]
})
export class OrderSummaryComponent {
  @Input() order!: Order;

  getSubtotal(): number {
    return this.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
```

## Route Configuration

### Orders Routes
```typescript
export const routes: Routes = [
  {
    path: 'orders',
    component: OrderHistoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [authGuard]
  }
];
```

## Real-Time Updates Pattern

### Observable Subscriptions
```typescript
// Subscribe to order updates in component
ngOnInit(): void {
  this.orderService.subscribeToOrderUpdates(this.orderId)
    .pipe(
      takeUntilDestroyed(),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev.status) === JSON.stringify(curr.status)
      )
    )
    .subscribe(updatedOrder => {
      console.log('Order updated:', updatedOrder);
      this.handleOrderUpdate(updatedOrder);
    });
}
```

## Code Quality Standards

### Naming Conventions
- Components: `OrderHistoryComponent`, `OrderDetailComponent`
- Services: `OrderService`
- Models: `Order`, `OrderItem`, `OrderStatus`
- Methods: `getUserOrders()`, `getOrderDetail()`, `cancelOrder()`

### Documentation Template
```typescript
/**
 * Retrieves user orders with pagination
 * @param page - Page number (0-based)
 * @param pageSize - Items per page
 * @returns Observable of order list response
 */
getUserOrders(page: number, pageSize: number): Observable<OrderHistoryResponse> { }
```

## Related Guidelines
- See: src/app/auth/auth.guard.ts for authentication
- See: src/app/services/api.service.ts for API calls
- See: src/app/app.routes.ts for route configuration
