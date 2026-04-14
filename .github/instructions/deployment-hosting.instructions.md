# GitHub Copilot Instructions: Deployment & Hosting

## Priority Guidelines

When generating deployment, build, and hosting configurations for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, and Node 18+ versions
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established build and deployment patterns
4. **Architectural Consistency**: Maintain Netlify-based static hosting setup
5. **Code Quality**: Prioritize production optimization, security, and reliability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0
- **TypeScript**: 5.9.2
- **Node.js**: 18+ (from package.json constraints)
- **npm**: 11.12.1
- **Build Tool**: Angular CLI 21.2.7

### Key Constraints
- Production build output: `dist/frontend-app/`
- Build optimization enabled for prod
- Environment-specific configuration
- Static hosting (no server-side rendering)

## Codebase Pattern Analysis

### Build Configuration
```
Configuration Files:
- angular.json: Build configuration and scripts
- tsconfig.json: TypeScript compilation settings
- tsconfig.app.json: App-specific TS config
- package.json: Dependencies and scripts
- tsconfig.spec.json: Test-specific TS config

Build Output:
- dist/frontend-app/ (production build)
```

### Build Scripts (from package.json)
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",          // Dev server on localhost:4200
    "build": "ng build",          // Production build
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  }
}
```

## Build Configuration Pattern

### 1. Angular Build Options
```typescript
// From angular.json
{
  "build": {
    "builder": "@angular/build:application",
    "options": {
      "browser": "src/main.ts",
      "tsConfig": "tsconfig.app.json",
      "assets": [{
        "glob": "**/*",
        "input": "public"
      }],
      "styles": ["src/styles.css"],
      "scripts": []
    },
    "configurations": {
      "development": {
        "optimization": false,
        "namedChunks": true,
        "sourceMap": true
      },
      "production": {
        "optimization": true,
        "namedChunks": false,
        "sourceMap": false,
        "budgets": [
          {
            "type": "bundle",
            "maximumWarning": "2mb",
            "maximumError": "5mb"
          }
        ]
      }
    }
  }
}
```

### 2. TypeScript Compiler Options
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

## Build Process Pattern

### 1. Development Build
```bash
# Development build with source maps and optimization disabled
npm run build -- --configuration development

# Output includes:
# - Unminified code for debugging
# - Source maps for stack traces
# - No tree-shaking or dead code elimination
# - Larger bundle size (for dev testing)
```

### 2. Production Build
```bash
# Optimized production build
npm run build

# Output includes:
# - Minified and tree-shaken code
# - No source maps (reduced file size)
# - Code splitting by default
# - Bundle optimization
# - Output in dist/frontend-app/
```

### 3. Build Command Structure
```typescript
// Command format
ng build [--configuration production]

// With custom options
ng build --configuration production --output-hashing all --build-optimizer

// With polyfills for older browsers
ng build --polyfills "src/polyfills.ts"
```

## Netlify Deployment Configuration

### 1. netlify.toml Setup
```toml
[build]
  command = "npm run build"
  publish = "dist/frontend-app"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
  NG_APP_API_URL = "https://api.boutique.com"
  NG_APP_RAZORPAY_KEY = "rzp_live_your_key"
  NG_APP_ENV = "production"

# Redirect all API calls to backend
[[redirects]]
  from = "/api/*"
  to = "https://api.boutique.com/api/:splat"
  status = 200
  force = false

# SPA - Redirect 404s to index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

    # Content Security Policy
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.razorpay.com https://api.boutique.com"

# Cache control for static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/dist/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Cache control for index.html
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

### 2. Environment Variables in Netlify
Set via Netlify Dashboard or CLI:
```bash
netlify env:set NG_APP_API_URL "https://api.boutique.com"
netlify env:set NG_APP_RAZORPAY_KEY "rzp_live_key"
netlify env:set NG_APP_ENV "production"
```

Variables available to build process:
```typescript
// Access in environment.ts
export const environment = {
  apiUrl: process.env['NG_APP_API_URL'],
  razorpayKey: process.env['NG_APP_RAZORPAY_KEY'],
  production: process.env['NG_APP_ENV'] === 'production'
};
```

## Environment Management Pattern

### 1. Development Environment
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  razorpayKey: 'rzp_test_your_test_key',
  timeout: 30000
};
```

### 2. Production Environment
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.boutique.com',
  razorpayKey: 'rzp_live_your_live_key',
  timeout: 30000
};
```

### 3. Accessing Environment in App
```typescript
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  get apiUrl(): string {
    return environment.apiUrl;
  }

  get isProd(): boolean {
    return environment.production;
  }
}
```

## Code Splitting & Lazy Loading Pattern

### 1. Lazy-Loaded Routes
```typescript
// Define lazy routes in app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard]
  }
];
```

### 2. Build Output Structure
```
dist/frontend-app/
├── index.html (main entry point)
├── main.[hash].js (main bundle)
├── polyfills.[hash].js
├── runtime.[hash].js
├── chunk-[hash].js (lazy-loaded chunks)
├── styles.[hash].css
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## Asset Optimization Pattern

### 1. Image Optimization
```html
<!-- Use responsive images -->
<img 
  [src]="image" 
  alt="Product"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  srcset="image-sm.jpg 480w, image-md.jpg 768w, image-lg.jpg 1024w"
/>

<!-- Or use picture element -->
<picture>
  <source media="(max-width: 768px)" srcset="image-sm.jpg">
  <source media="(max-width: 1024px)" srcset="image-md.jpg">
  <img src="image-lg.jpg" alt="Product">
</picture>
```

### 2. Lazy Loading Components
```typescript
// Use dynamic imports for route-based code splitting
const AdminComponent = lazy(() => import('./admin/admin.component'));

// Use trackBy in lists to prevent re-renders
<ng-container *ngFor="let item of items; trackBy: trackById">
  <!-- item template -->
</ng-container>

trackById(_index: number, item: any): any {
  return item.id;
}
```

## Production Optimization Checklist

### 1. Bundle Size Optimization
```bash
# Analyze bundle size
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/frontend-app/stats.json

# Check production build size
ls -lh dist/frontend-app/

# Review budgets in angular.json
```

### 2. Performance Metrics
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Main bundle size: < 250KB
- Total bundle size: < 500KB

### 3. Lighthouse Optimization
```
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95
```

## Deployment Process Pattern

### 1. Pre-Deployment Checklist
```bash
# 1. Verify build succeeds
npm run build

# 2. Run tests
npm test

# 3. Check for console errors
npm start

# 4. Verify environment variables are correct in .env

# 5. Check bundle analysis
npm run build -- --stats-json
```

### 2. Netlify Deployment
```bash
# Manual deployment
netlify deploy --prod

# Via GitHub Actions (if configured)
# Commits to main branch auto-deploy to production
```

### 3. Rollback Procedure
```bash
# Netlify automatically maintains deployments
# Access via Netlify Dashboard > Deploys > Redeploy

# Or via CLI
netlify deploy --prod --dir=dist/frontend-app
```

## Continuous Integration/Deployment Pattern

### 1. GitHub Actions (Example)
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --watch=false
      
      - name: Build
        run: npm run build
        env:
          NG_APP_API_URL: ${{ secrets.PROD_API_URL }}
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist/frontend-app
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Security Headers & Configuration

### 1. HTTP Security Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 2. Content Security Policy
```
Allows:
- default-src: 'self'
- script-src: 'self', Razorpay CDN
- style-src: 'self', 'unsafe-inline'
- img-src: 'self', data URIs
- font-src: 'self'
- connect-src: 'self', API URL, Razorpay
```

## Troubleshooting Deployment Issues

### 1. Build Failures
```bash
# Clear build cache
rm -rf dist
rm -rf .angular

# Reinstall dependencies
rm -rf node_modules
npm ci

# Rebuild
npm run build
```

### 2. 404 Errors on SPA Routes
Ensure netlify.toml includes SPA redirect:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. API Connection Issues
- Verify NG_APP_API_URL environment variable
- Check CORS configuration on backend
- Verify API proxy rules in netlify.toml

### 4. Asset Loading Issues
- Check asset paths in angular.json
- Verify public/ folder is deployed
- Check asset cache headers

## Performance Monitoring

### 1. Monitor Deployment
```bash
# View live deployment logs
netlify logs

# Check function logs (if using serverless functions)
netlify functions:invoke
```

### 2. Key Metrics to Track
- Page load time
- Bundle size
- API response times
- Error rates
- User session duration

## Code Quality Standards

### Naming Conventions
- Build configuration: `angular.json`
- Environment files: `environment.ts`, `environment.prod.ts`
- Build output: `dist/frontend-app/`

### Documentation Template
```bash
# Build for production with optimization
npm run build

# Analyze bundle size
npm run build -- --stats-json

# Deploy to Netlify
netlify deploy --prod
```

### Best Practices
1. Always test production build locally
2. Use environment variables for secrets
3. Enable security headers
4. Implement proper caching strategies
5. Monitor performance metrics
6. Maintain deployment logs
7. Test 404 redirects for SPA
8. Verify API endpoints are correct
9. Use lazy loading for routes
10. Optimize images and assets

## Related Guidelines
- See: angular.json for build configuration
- See: package.json for build scripts
- See: src/environments/ for environment configuration
- See: netlify.toml for Netlify deployment setup
