# GitHub Copilot Instructions: Admin Dashboard

## Priority Guidelines

When generating code for admin dashboard features in this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular standalone component patterns
4. **Architectural Consistency**: Maintain modular feature-based architecture
5. **Code Quality**: Prioritize maintainability, security, and testability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **PrimeNG**: 21.1.6
- **RxJS**: 7.8.0

### Key Constraints
- Use standalone components (no NgModules)
- Use signal-based reactivity for component state
- Use RxJS Observables for service layer
- Leverage PrimeNG DataTable, Chart, Card components

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Imports**: Explicitly import required modules
- **Template**: Use templateUrl and styleUrl (not inline)
- **Signals**: Use Angular signals for local component state

### Service Patterns
- Services use dependency injection in component/service constructors
- Services provide typed observable streams for data
- Error handling with try-catch in service methods
- Use typed DTOs for backend responses

### Module Organization
```
src/app/admin/
├── admin-dashboard.component.ts
├── sales-metrics.component.ts
├── orders-management.component.ts
├── inventory-management.component.ts
├── products-management.component.ts
├── customers.component.ts
├── delivery-tracking.component.ts
├── admin.service.ts
└── models/
    ├── dashboard.model.ts
    ├── product.model.ts
    ├── order.model.ts
```

## Admin Dashboard Specific Guidelines

### 1. Route Protection & Access Control
- Use route guards from `src/app/auth/auth.guard.ts`
- Verify admin role before displaying dashboard
- Pattern: Check user role from auth service before rendering admin content
- Implement role-based visibility: Only show admin features if user.role === 'ADMIN'

### 2. Dashboard Components
- **Main Dashboard**: Display KPI cards with metrics
- **Sales Metrics**: Use PrimeNG Chart for visualizations
- **Orders Management**: Use PrimeNG DataTable for sortable/filterable tables
- **Inventory Management**: Display stock levels with status indicators
- **Products Management**: CRUD operations with forms
- **Customers**: Customer list with details and contact info
- **Delivery Tracking**: Real-time delivery status updates

### 3. Data Visualization & Tables
- Use PrimeNG DataTable for: pagination, sorting, filtering
- Use PrimeNG Chart for: sales trends, revenue, top products
- Use PrimeNG Card for: KPI displays, summaries
- Implement lazy loading for large datasets
- Add loading skeletons during data fetch

### 4. Forms & Validation
- Use Angular reactive forms with FormGroup/FormControl
- Implement validation feedback with error messages
- Use PrimeNG InputText, InputNumber, Dropdown components
- Save changes with confirmation dialogs

### 5. Bulk Actions & Destructive Operations
- Implement confirmation dialogs before delete/update operations
- Use PrimeNG ConfirmDialog component
- Disable buttons during API calls
- Show success/error toasts after operations

### 6. Real-time Updates
- Subscribe to order updates via observables
- Unsubscribe on component destroy to prevent memory leaks
- Use takeUntilDestroyed() or UnsubscribeOnDestroy pattern

### 7. Audit Logging
- Log all admin actions (create, update, delete)
- Include: action type, user, timestamp, affected resource
- Send to backend logging service

### 8. Data Export
- Implement CSV export for admin reports
- Use pattern: Convert table data to CSV format
- Trigger download using blob/anchor element

## TypeScript Patterns

### Typed Models
```typescript
// Define interfaces for all admin entities
interface Dashboard {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  topProducts: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}
```

### Observable Patterns
```typescript
// Services expose typed observables
getMetrics$(): Observable<Dashboard> { }
getProducts$(): Observable<Product[]> { }

// Components use async pipe
{{ metrics$ | async | json }}
```

### Error Handling
```typescript
.pipe(
  catchError(error => {
    console.error('Error loading metrics:', error);
    return of(null);
  })
)
```

## Component Template Patterns

### PrimeNG DataTable Example
```html
<p-dataTable 
  [value]="items"
  [rows]="10"
  [paginator]="true"
  [globalFilterFields]="['name','category']">
  <p-column field="name" header="Product Name"></p-column>
  <p-column field="price" header="Price"></p-column>
  <p-column header="Actions">
    <ng-template let-item="rowData">
      <button (click)="editItem(item)">Edit</button>
      <button (click)="deleteItem(item)">Delete</button>
    </ng-template>
  </p-column>
</p-dataTable>
```

### Loading State Pattern
```html
<div *ngIf="loading$ | async; else loaded">
  <p-skeleton [rows]="5"></p-skeleton>
</div>
<ng-template #loaded>
  <!-- Main content -->
</ng-template>
```

## API Integration

### Environment Variables
- `NG_APP_API_URL`: Backend service base URL
- Access via: `environment.apiUrl`

### Admin API Endpoints
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/products` - Product list
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Order list
- `PUT /api/orders/:id/status` - Update order status

## Testing Patterns

### Unit Test Structure
- Mock services using jasmine.SpyObj
- Test component behavior with fixture/debugElement
- Test observable subscriptions
- Verify form validation

### E2E Test Structure
- Test complete admin workflows
- Verify role-based access restrictions
- Test CRUD operations end-to-end

## Code Quality Standards

### Naming Conventions
- Components: `AdminDashboardComponent`, `SalesMetricsComponent`
- Services: `AdminService`, `ProductService`
- Models: `Dashboard`, `Product`, `Order`
- Variables/methods: camelCase
- Private members: prefix with `_`

### Organization
- Keep components focused on single responsibility
- Extract reusable components (e.g., KPI card, status badge)
- Group related services in feature modules
- Use descriptive selector names

### Documentation
- Add JSDoc comments for public methods
- Document complex business logic
- Add comments for non-obvious algorithms
- Example:
```typescript
/**
 * Calculates total revenue for given period
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Total revenue as number
 */
calculateRevenue(startDate: Date, endDate: Date): Observable<number> { }
```

## Performance Optimization

### Data Management
- Implement lazy loading for large datasets
- Cache frequently accessed data
- Use pagination to limit payload size
- Implement smart invalidation strategies

### Change Detection
- Use OnPush change detection strategy where applicable
- Use trackBy functions in *ngFor
- Leverage signals for better default change detection

### Memory Management
- Always unsubscribe from observables
- Use takeUntilDestroyed() operator
- Clean up subscriptions in ngOnDestroy

## Security Patterns

### Authorization
- Always verify admin role on client AND server
- Check permissions before displaying sensitive data
- Never trust client-side role checks for security

### Input Validation
- Validate user inputs on client
- Server-side validation is authoritative
- Sanitize any user-provided content

### API Communication
- Use HttpClient with interceptors
- Authentication headers injected by interceptor
- HTTPS for all API calls in production

## Related Guidelines
- See: src/app/auth/auth.guard.ts for route protection patterns
- See: src/app/services/api.service.ts for API communication patterns
- See: src/app/app.routes.ts for routing configuration
