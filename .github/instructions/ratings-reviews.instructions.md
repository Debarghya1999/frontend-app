# GitHub Copilot Instructions: Ratings & Reviews

## Priority Guidelines

When generating ratings and review functionality for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular component and service patterns
4. **Architectural Consistency**: Maintain user-generated content validation patterns
5. **Code Quality**: Prioritize data validation, moderation, and UX clarity

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **PrimeNG**: 21.1.6
- **RxJS**: 7.8.0

### Key Constraints
- Use standalone components (no NgModules)
- Use reactive forms for review input
- Use RxJS Observables for data streams
- Leverage PrimeNG Rating, Card, Button components
- Verified purchase validation required

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Validation**: ReactiveForms with custom validators
- **Template**: Use templateUrl and styleUrl

### Service Patterns
- Services handle review CRUD operations
- Services validate verified purchase status
- RxJS Observables for async operations
- Error handling for moderation rules

### Module Organization
```
src/app/reviews/
├── review-form.component.ts
├── review-list.component.ts
├── star-rating.component.ts
├── review.service.ts
├── models/
│   ├── review.model.ts
│   ├── review-filter.model.ts
│   └── review-response.model.ts
└── validators/
    └── review.validators.ts
```

## Review Models & Types

### 1. Core Review Models
```typescript
export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ReviewSortBy {
  NEWEST = 'NEWEST',
  HELPFUL = 'HELPFUL',
  RATING_HIGH = 'RATING_HIGH',
  RATING_LOW = 'RATING_LOW'
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  authorImage?: string;
  rating: number; // 1-5
  title?: string;
  content: string; // 0-1000 chars
  status: ReviewStatus;
  verifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  /**
   * Current user's vote status (if logged in)
   * undefined = not voted, true = helpful, false = unhelpful
   */
  userVote?: boolean;
}

export interface ReviewFilter {
  productId: string;
  sortBy?: ReviewSortBy;
  rating?: number; // Filter by specific rating
  verifiedPurchaseOnly?: boolean;
  status?: ReviewStatus;
  page?: number;
  pageSize?: number;
}

export interface ReviewResponse {
  reviews: Review[];
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number; // 5: 100, 4: 50, etc.
  };
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  title?: string;
  content: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
}
```

## Review Service Pattern

### 1. Review Data Service
```typescript
@Injectable({ providedIn: 'root' })
export class ReviewService {
  private api = inject(ApiService);
  private authService = inject(AuthService);

  // Get reviews for a product
  getProductReviews(
    productId: string,
    filter?: ReviewFilter
  ): Observable<ReviewResponse> {
    let queryParams = `?productId=${productId}`;

    if (filter?.sortBy) queryParams += `&sortBy=${filter.sortBy}`;
    if (filter?.rating) queryParams += `&rating=${filter.rating}`;
    if (filter?.verifiedPurchaseOnly) queryParams += `&verifiedOnly=true`;
    if (filter?.page !== undefined) queryParams += `&page=${filter.page}`;
    if (filter?.pageSize) queryParams += `&pageSize=${filter.pageSize}`;

    return this.api.get<ReviewResponse>(`/api/reviews${queryParams}`).pipe(
      catchError(error => {
        console.error('Failed to load reviews:', error);
        return of({ reviews: [], totalCount: 0, averageRating: 0, ratingDistribution: {} });
      })
    );
  }

  // Get single review
  getReview(reviewId: string): Observable<Review> {
    return this.api.get<Review>(`/api/reviews/${reviewId}`);
  }

  // Create review (requires verified purchase)
  createReview(request: CreateReviewRequest): Observable<Review> {
    // Validate verified purchase on backend
    return this.api.post<Review>('/api/reviews', request).pipe(
      tap(review => console.log('Review created:', review.id)),
      catchError(error => {
        console.error('Failed to create review:', error);
        
        // Handle specific errors
        if (error.status === 409) {
          return throwError(() => new Error('You have already reviewed this product'));
        }
        if (error.status === 400) {
          return throwError(() => new Error('You cannot review products you haven\'t purchased'));
        }
        
        return throwError(() => new Error('Failed to create review'));
      })
    );
  }

  // Update review (only author or admin)
  updateReview(reviewId: string, request: UpdateReviewRequest): Observable<Review> {
    return this.api.put<Review>(`/api/reviews/${reviewId}`, request).pipe(
      tap(review => {
        review.editedAt = new Date();
        console.log('Review updated:', reviewId);
      }),
      catchError(error => {
        console.error('Failed to update review:', error);
        
        if (error.status === 403) {
          return throwError(() => new Error('You can only edit your own reviews'));
        }
        
        return throwError(() => new Error('Failed to update review'));
      })
    );
  }

  // Delete review (only author or admin)
  deleteReview(reviewId: string): Observable<void> {
    return this.api.delete<void>(`/api/reviews/${reviewId}`).pipe(
      tap(() => console.log('Review deleted:', reviewId)),
      catchError(error => {
        console.error('Failed to delete review:', error);
        return throwError(() => new Error('Failed to delete review'));
      })
    );
  }

  // Vote on review helpfulness
  voteHelpful(reviewId: string, helpful: boolean): Observable<Review> {
    return this.api.post<Review>(`/api/reviews/${reviewId}/vote`, { helpful }).pipe(
      catchError(error => {
        console.error('Failed to vote on review:', error);
        return throwError(() => new Error('Failed to register vote'));
      })
    );
  }

  // Check if user can review product (verified purchase)
  canReviewProduct(productId: string): Observable<boolean> {
    return this.api.get<{ canReview: boolean }>(
      `/api/reviews/can-review/${productId}`
    ).pipe(
      map(response => response.canReview),
      catchError(() => of(false))
    );
  }

  // Get current user's review for product
  getUserProductReview(productId: string): Observable<Review | null> {
    return this.api.get<Review>(`/api/reviews/user/${productId}`).pipe(
      catchError(() => of(null))
    );
  }
}
```

## Review List Component Pattern

### 1. Review Display Component
```typescript
@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, PrimeNgModules, FormsModule],
  template: `
    <div class="reviews-section">
      <!-- Reviews Header -->
      <div class="reviews-header">
        <div class="rating-summary">
          <div class="average-rating">
            <div class="rating-value">{{ (reviewResponse$ | async)?.averageRating | number: '1.1-1' }}</div>
            <p-rating 
              [value]="(reviewResponse$ | async)?.averageRating || 0"
              [readonly]="true"
              iconCancelClass="hidden">
            </p-rating>
            <p class="review-total">Based on {{ (reviewResponse$ | async)?.totalCount || 0 }} reviews</p>
          </div>

          <!-- Rating Distribution -->
          <div class="rating-distribution">
            <div *ngFor="let rating of [5,4,3,2,1]" class="rating-bar-row">
              <span class="rating-label">{{ rating }} stars</span>
              <div class="progress-bar">
                <div class="progress-fill" 
                     [style.width.%]="getRatingPercentage(rating, reviewResponse$ | async)">
                </div>
              </div>
              <span class="rating-count">{{ getRatingCount(rating, reviewResponse$ | async) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sort Options -->
      <div class="reviews-controls">
        <p-dropdown 
          [options]="sortOptions"
          [(ngModel)]="selectedSort"
          (onChange)="onSortChange()">
        </p-dropdown>
        
        <p-checkbox 
          [(ngModel)]="verifiedOnly"
          label="Verified Purchase Only"
          (onChange)="onFilterChange()">
        </p-checkbox>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div *ngIf="loading$ | async; else loadedReviews" class="loading">
          <p-progressSpinner></p-progressSpinner>
        </div>

        <ng-template #loadedReviews>
          <div *ngIf="(reviews$ | async) as reviews; else noReviews">
            <app-review-item
              *ngFor="let review of reviews; trackBy: trackByReviewId"
              [review]="review"
              (edit)="onEditReview($event)"
              (delete)="onDeleteReview($event)"
              (voteHelpful)="onVoteHelpful($event)">
            </app-review-item>
          </div>

          <ng-template #noReviews>
            <div class="no-reviews">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          </ng-template>
        </ng-template>
      </div>

      <!-- Pagination -->
      <div class="reviews-pagination">
        <p-paginator
          [rows]="pageSize"
          [totalRecords]="(reviewResponse$ | async)?.totalCount || 0"
          (onPageChange)="onPageChange($event)">
        </p-paginator>
      </div>
    </div>
  `,
  styles: [`
    .reviews-section {
      margin-top: 40px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .reviews-header {
      margin-bottom: 30px;
    }

    .rating-summary {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 40px;
      align-items: start;
    }

    .average-rating {
      text-align: center;
    }

    .rating-value {
      font-size: 3em;
      font-weight: bold;
      color: #ff6b6b;
    }

    .review-total {
      margin-top: 8px;
      color: #666;
      font-size: 0.9em;
    }

    .rating-distribution {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rating-bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .rating-label {
      width: 60px;
      font-size: 0.9em;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #eee;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #ff6b6b;
      transition: width 0.3s;
    }

    .rating-count {
      width: 50px;
      text-align: right;
      color: #666;
      font-size: 0.9em;
    }

    .reviews-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .no-reviews {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    @media (max-width: 768px) {
      .rating-summary {
        grid-template-columns: 1fr;
      }

      .reviews-controls {
        flex-direction: column;
      }
    }
  `]
})
export class ReviewListComponent implements OnInit {
  @Input() productId!: string;

  private reviewService = inject(ReviewService);

  loading$ = signal(false);
  reviews$ = new Observable<Review[]>();
  reviewResponse$ = new Observable<ReviewResponse>();

  selectedSort = ReviewSortBy.NEWEST;
  verifiedOnly = false;
  currentPage = 0;
  pageSize = 5;

  sortOptions = [
    { label: 'Newest', value: ReviewSortBy.NEWEST },
    { label: 'Most Helpful', value: ReviewSortBy.HELPFUL },
    { label: 'Highest Rating', value: ReviewSortBy.RATING_HIGH },
    { label: 'Lowest Rating', value: ReviewSortBy.RATING_LOW }
  ];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading$.set(true);

    const filter: ReviewFilter = {
      productId: this.productId,
      sortBy: this.selectedSort,
      verifiedPurchaseOnly: this.verifiedOnly,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.reviewResponse$ = this.reviewService.getProductReviews(this.productId, filter).pipe(
      finalize(() => this.loading$.set(false))
    );

    this.reviews$ = this.reviewResponse$.pipe(
      map(response => response.reviews)
    );
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.loadReviews();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadReviews();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.loadReviews();
  }

  onEditReview(review: Review): void {
    console.log('Edit review:', review.id);
  }

  onDeleteReview(reviewId: string): void {
    console.log('Delete review:', reviewId);
  }

  onVoteHelpful(event: { reviewId: string; helpful: boolean }): void {
    console.log('Vote on review:', event);
  }

  getRatingPercentage(rating: number, response: ReviewResponse | null): number {
    if (!response || response.totalCount === 0) return 0;
    return (response.ratingDistribution[rating] / response.totalCount) * 100;
  }

  getRatingCount(rating: number, response: ReviewResponse | null): number {
    if (!response) return 0;
    return response.ratingDistribution[rating] || 0;
  }

  trackByReviewId(_index: number, review: Review): string {
    return review.id;
  }
}
```

## Review Form Component Pattern

### 1. Review Creation/Editing Form
```typescript
@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNgModules],
  template: `
    <p-card class="review-form-card" title="Write a Review">
      <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
        <!-- Is this a verified purchase? -->
        <div class="verified-badge" *ngIf="isVerifiedPurchase">
          <p-tag icon="pi pi-check" value="Verified Purchase" severity="success"></p-tag>
        </div>

        <div *ngIf="!isVerifiedPurchase" class="warning">
          <p-message 
            severity="warn"
            text="You can only review products you have purchased">
          </p-message>
        </div>

        <!-- Rating Selection -->
        <div class="form-group">
          <label>Rating *</label>
          <p-rating 
            [(ngModel)]="selectedRating"
            [ngModelOptions]="{standalone: true}"
            iconOnClass="pi pi-star-fill"
            iconOffClass="pi pi-star"
            [cancel]="false">
          </p-rating>
          <small *ngIf="!selectedRating" class="error">Please select a rating</small>
        </div>

        <!-- Review Title -->
        <div class="form-group">
          <label for="title">Review Title (Optional)</label>
          <input 
            id="title"
            pInputText 
            formControlName="title"
            placeholder="Summarize your experience"
            maxlength="100">
          <small class="char-count">{{ reviewForm.get('title')?.value?.length || 0 }}/100</small>
          <div *ngIf="reviewForm.get('title')?.errors?.['maxlength']" class="error">
            Title must not exceed 100 characters
          </div>
        </div>

        <!-- Review Content -->
        <div class="form-group">
          <label for="content">Review Content *</label>
          <textarea 
            id="content"
            pInputTextarea
            formControlName="content"
            placeholder="Share your honest feedback..."
            rows="5"
            maxlength="1000">
          </textarea>
          <small class="char-count">{{ reviewForm.get('content')?.value?.length || 0 }}/1000</small>
          
          <div *ngIf="reviewForm.get('content')?.errors?.['required']" class="error">
            Please write your review
          </div>
          <div *ngIf="reviewForm.get('content')?.errors?.['minlength']" class="error">
            Review must be at least 20 characters long
          </div>
          <div *ngIf="reviewForm.get('content')?.errors?.['maxlength']" class="error">
            Review must not exceed 1000 characters
          </div>
        </div>

        <!-- Loading/Error State -->
        <p-message 
          *ngIf="error$ | async as error"
          severity="error"
          [text]="error">
        </p-message>

        <!-- Submit Button -->
        <div class="form-actions">
          <button pButton
                  type="submit"
                  label="Submit Review"
                  [loading]="submitting$ | async"
                  [disabled]="!isVerifiedPurchase || !reviewForm.valid">
          </button>
          <button pButton
                  type="button"
                  label="Cancel"
                  severity="secondary"
                  (click)="onCancel()">
          </button>
        </div>
      </form>
    </p-card>
  `,
  styles: [`
    .review-form-card {
      margin: 20px 0;
    }

    .verified-badge {
      margin-bottom: 16px;
    }

    .warning {
      margin-bottom: 16px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    textarea {
      display: block;
      width: 100%;
      resize: vertical;
    }

    .char-count {
      display: block;
      text-align: right;
      color: #999;
      font-size: 0.85em;
      margin-top: 4px;
    }

    .error {
      color: #d32f2f;
      font-size: 0.85em;
      margin-top: 4px;
      display: block;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .form-actions button {
      min-width: 120px;
    }
  `]
})
export class ReviewFormComponent {
  @Input() productId!: string;
  @Output() submitted = new EventEmitter<CreateReviewRequest>();
  @Output() cancelled = new EventEmitter<void>();

  private reviewService = inject(ReviewService);
  private fb = inject(FormBuilder);

  submitting$ = signal(false);
  error$ = new BehaviorSubject<string | null>(null);
  
  isVerifiedPurchase = false;
  selectedRating = 0;

  reviewForm = this.fb.group({
    title: ['', [Validators.maxLength(100)]],
    content: ['', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(1000)
    ]]
  });

  ngOnInit(): void {
    this.checkVerifiedPurchase();
  }

  checkVerifiedPurchase(): void {
    this.reviewService.canReviewProduct(this.productId).subscribe(
      canReview => {
        this.isVerifiedPurchase = canReview;
      }
    );
  }

  submitReview(): void {
    if (!this.reviewForm.valid || !this.selectedRating) {
      return;
    }

    this.submitting$.set(true);
    this.error$.next(null);

    const request: CreateReviewRequest = {
      productId: this.productId,
      rating: this.selectedRating,
      title: this.reviewForm.get('title')?.value || undefined,
      content: this.reviewForm.get('content')?.value || ''
    };

    this.reviewService.createReview(request).subscribe({
      next: () => {
        this.submitted.emit(request);
        this.reviewForm.reset();
        this.selectedRating = 0;
      },
      error: (error) => {
        this.submitting$.set(false);
        this.error$.next(error.message || 'Failed to submit review');
      }
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
```

## API Endpoints

### Review Endpoints
- `GET /api/reviews?productId=X&sortBy=NEWEST` - Get product reviews
- `GET /api/reviews/:id` - Get specific review
- `POST /api/reviews` - Create review (requires verified purchase)
- `PUT /api/reviews/:id` - Update review (author only)
- `DELETE /api/reviews/:id` - Delete review (author/admin)
- `POST /api/reviews/:id/vote` - Vote helpful/unhelpful
- `GET /api/reviews/can-review/:productId` - Check if user can review
- `GET /api/reviews/user/:productId` - Get user's review for product

## Code Quality Standards

### Naming Conventions
- Components: `ReviewListComponent`, `ReviewFormComponent`
- Services: `ReviewService`
- Models: `Review`, `ReviewFilter`, `ReviewResponse`
- Methods: `getProductReviews()`, `createReview()`, `voteHelpful()`

### Validation Rules
- Rating: Required, must be 1-5
- Content: Required, 20-1000 characters
- Title: Optional, max 100 characters
- Verified Purchase: Required (enforced on backend)

## Related Guidelines
- See: src/app/services/api.service.ts for API calls
- See: src/app/products/product-detail.component.ts for product context
- See: src/app/auth/auth.guard.ts for user authentication
