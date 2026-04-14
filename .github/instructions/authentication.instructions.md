# GitHub Copilot Instructions: Authentication & Authorization

## Priority Guidelines

When generating authentication and authorization code for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, RxJS 7.8+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established Angular standalone component patterns
4. **Architectural Consistency**: Maintain JWT-based auth with role-based access control
5. **Code Quality**: Prioritize security, maintainability, and testability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components)
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0
- **HTTP Client**: Angular HttpClient with interceptors

### Key Constraints
- Use standalone components (no NgModules)
- Use signal-based reactivity for auth state
- Use RxJS Observables and BehaviorSubject for state management
- JWT tokens stored in localStorage

## Codebase Pattern Analysis

### Component Structure
- **Selector Pattern**: `app-` prefix (from angular.json)
- **Standalone Components**: All components must have `standalone: true`
- **Imports**: Explicitly import required modules
- **Template**: Use templateUrl and styleUrl
- **Signals**: Use Angular signals for reactive state

### Service Patterns
- Services manage auth state using BehaviorSubject
- Services provide typed observable streams
- Error handling with try-catch and error transformation
- Token management with expiration logic

### Module Organization
```
src/app/auth/
├── auth.service.ts
├── auth.guard.ts
├── login.component.ts
├── signup.component.ts
├── models/
│   ├── auth.model.ts
│   ├── user.model.ts
│   └── auth-response.model.ts
└── interceptors/
    └── auth.interceptor.ts
```

## Authentication Service Patterns

### 1. Token Management
- Store JWT token in localStorage with key: 'auth_token'
- Store user info in localStorage with key: 'user_info'
- Token refresh endpoint: POST /auth/refresh
- Token expiration check before API calls
- Clear tokens on logout

### 2. Auth State Management
```typescript
// Use BehaviorSubject for auth state
private authSubject = new BehaviorSubject<User | null>(null);
public auth$ = this.authSubject.asObservable();

// Expose current user getter
get currentUser(): User | null {
  return this.authSubject.value;
}
```

### 3. User Model & Roles
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
}

interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}
```

### 4. Login Flow
```typescript
login(email: string, password: string): Observable<AuthResponse> {
  // POST /auth/login with email/password
  // Store token and user
  // Emit auth state update
  // Return observable
}
```

### 5. Signup Flow
```typescript
signup(userData: SignupForm): Observable<AuthResponse> {
  // POST /auth/signup
  // Create user account
  // Return auth response
  // Auto-login after signup
}
```

### 6. Token Refresh Logic
```typescript
// Check token expiration
isTokenExpired(): boolean {
  // Decode JWT and check exp claim
}

// Refresh expired token
refreshToken(): Observable<AuthResponse> {
  // POST /auth/refresh
  // Get new token
  // Update localStorage
}
```

## Route Guard Patterns

### 1. Auth Guard (LoggedIn Guard)
```typescript
// Allow only authenticated users
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
```

### 2. Admin Guard
```typescript
// Allow only admin users
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.currentUser?.role === 'ADMIN') {
    return true;
  }
  router.navigate(['/unauthorized']);
  return false;
};
```

### 3. Public Guard (Redirect if logged in)
```typescript
// Redirect logged-in users away from auth pages
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
```

## HTTP Interceptor Pattern

### 1. Auth Interceptor
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Handle unauthorized - redirect to login
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
```

## Component Patterns

### 1. Login Component
```typescript
// Reactive forms with validation
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});

// Submit with error handling
onLogin() {
  if (this.form.valid) {
    this.authService.login(this.form.value).subscribe({
      next: (response) => this.router.navigate(['/']),
      error: (err) => this.showError(err.message)
    });
  }
}
```

### 2. Signup Component
```typescript
// Include password confirmation
form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: ['', Validators.required]
}, { 
  validators: this.passwordMatchValidator 
});

// Custom validator for password match
passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
```

### 3. Session Persistence
```typescript
// Auto-load user session on app init
ngOnInit() {
  const storedUser = localStorage.getItem('user_info');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    this.authService.setCurrentUser(user);
  }
}
```

## TypeScript Patterns

### Typed Models
```typescript
// Auth models with proper types
type UserRole = 'CUSTOMER' | 'ADMIN';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest extends LoginRequest {
  name: string;
}
```

### Error Handling
```typescript
// Transform API errors to user-friendly messages
private handleAuthError(error: any): Observable<never> {
  let errorMessage = 'An error occurred';
  
  if (error.error instanceof ErrorEvent) {
    errorMessage = error.error.message;
  } else if (error.status === 401) {
    errorMessage = 'Invalid email or password';
  } else if (error.status === 409) {
    errorMessage = 'Email already registered';
  }
  
  return throwError(() => new Error(errorMessage));
}
```

## Form Validation Patterns

### 1. Built-in Validators
```typescript
Validators.required
Validators.email
Validators.minLength(8)
Validators.pattern(/[A-Z]/) // uppercase letter
Validators.pattern(/[0-9]/) // number
```

### 2. Custom Validators
```typescript
// Email uniqueness validation
export function emailTakenValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return authService.checkEmailAvailability(control.value).pipe(
      map(available => available ? null : { emailTaken: true }),
      catchError(() => of(null))
    );
  };
}
```

## State Management Pattern

### BehaviorSubject for Auth State
```typescript
private authSubject = new BehaviorSubject<User | null>(null);
public auth$ = this.authSubject.asObservable();

private loggedInSubject = new BehaviorSubject<boolean>(false);
public loggedIn$ = this.loggedInSubject.asObservable();

// Get current state synchronously
get isLoggedIn(): boolean {
  return this.loggedInSubject.value;
}

// Update state
private setAuthState(user: User): void {
  this.authSubject.next(user);
  this.loggedInSubject.next(true);
}
```

## Session & Token Lifecycle

### Token Expiration Handling
```typescript
// Check expiration on app initialization
checkTokenValidity(): void {
  const token = localStorage.getItem('auth_token');
  if (token && this.isTokenExpired()) {
    this.refreshToken().subscribe({
      error: () => this.logout()
    });
  }
}

// Decode JWT to get expiration
private decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
}
```

### Logout Implementation
```typescript
logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  this.authSubject.next(null);
  this.loggedInSubject.next(false);
  this.router.navigate(['/login']);
}
```

## Remember Me Pattern

### Optional Implementation
```typescript
// Store "remember me" preference
login(email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
  return this.apiService.post<AuthResponse>('/auth/login', { email, password }).pipe(
    tap(response => {
      this.storeToken(response.token);
      this.storeUser(response.user);
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      }
    })
  );
}

// Pre-fill email on login form
ngOnInit() {
  const rememberedEmail = localStorage.getItem('remember_email');
  if (rememberedEmail) {
    this.form.get('email')?.setValue(rememberedEmail);
  }
}
```

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - Login with email/password
- `POST /auth/signup` - Register new account
- `POST /auth/logout` - Logout (optional backend call)
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/me` - Get current user info
- `POST /auth/check-email` - Verify email availability

## Testing Patterns

### Unit Test Template
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should store token on login', () => {
    service.login('test@test.com', 'password').subscribe();
    
    const req = httpMock.expectOne('/auth/login');
    req.flush({ token: 'jwt-token', user: { id: '1', role: 'CUSTOMER' } });
    
    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
  });
});
```

## Code Quality Standards

### Naming Conventions
- Services: `AuthService`, `TokenService`
- Guards: `authGuard`, `adminGuard`, `publicGuard`
- Models: `User`, `AuthResponse`, `LoginRequest`
- Methods: `login()`, `logout()`, `refreshToken()`, `isTokenExpired()`

### Principles
- Single Responsibility (one concern per service)
- Dependency Injection for testability
- Strong typing with TypeScript interfaces
- Never expose sensitive data in observables
- Always unsubscribe to prevent memory leaks

## Documentation Template

```typescript
/**
 * Authenticates user with email and password
 * Stores JWT token and user info in localStorage
 * 
 * @param email - User email address
 * @param password - User password
 * @returns Observable of AuthResponse with token and user
 * @throws Error with message for invalid credentials
 */
login(email: string, password: string): Observable<AuthResponse> { }
```

## Security Considerations

### Best Practices
1. Never log tokens or sensitive data
2. Use HTTPS in production
3. Set HttpOnly flag on JWT cookies if available
4. Validate token signature on server
5. Implement token expiration and refresh
6. Clear tokens on logout
7. Never store passwords
8. Validate email format
9. Require strong passwords
10. Implement rate limiting on login attempts

## Related Guidelines
- See: src/app/services/api.service.ts for HTTP communication
- See: src/app/app.routes.ts for route configuration with guards
- See: src/app/app.config.ts for HTTP interceptor setup
