# Landing Page - Quick Start Guide

## Getting Started

### Prerequisites
- Node.js 18+ (v25.9.0 tested)
- npm 11.12.1
- Angular CLI 21.2.7

### Installation

```bash
# Navigate to project directory
cd frontend-service/frontend-app

# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

## Project Structure

```
src/app/
├── pages/
│   ├── landing/
│   │   ├── landing.component.ts          # Main landing page container
│   │   └── sections/
│   │       ├── hero-section/
│   │       │   └── hero-section.component.ts
│   │       ├── featured-products/
│   │       │   └── featured-products.component.ts
│   │       ├── testimonials/
│   │       │   └── testimonials.component.ts
│   │       ├── trust-indicators/
│   │       │   └── trust-indicators.component.ts
│   │       └── newsletter/
│   │           └── newsletter.component.ts
│   └── shop/
│       └── shop.component.ts             # Placeholder shop page
├── app.ts                                # Root component
├── app.html                              # App shell (header, footer)
├── app.css                               # Global app styles
├── app.routes.ts                         # Route configuration
└── app.config.ts                         # App configuration

src/
├── styles.css                            # Global styles & variables
├── main.ts                               # Bootstrap file
└── index.html                            # HTML entry point
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/styles.css` | Global CSS variables, color system, accessibility styles |
| `src/app/app.css` | Header, footer, layout styles |
| `src/app/app.html` | App shell with navigation and footer |
| `src/app/app.routes.ts` | Route definitions for landing and shop pages |
| `LANDING_PAGE.md` | Comprehensive landing page documentation |

## Common Tasks

### View Landing Page
Already the default route (`/`). Just run:
```bash
npm start
```

### Navigate to Shop Page
- Click "Shop" in the navigation menu
- Or visit: http://localhost:4200/shop

### Modify Products
Edit `src/app/pages/landing/sections/featured-products/featured-products.component.ts`:

```typescript
products = signal<Product[]>([
  {
    id: 1,
    name: 'Your Product',
    category: 'Category',
    price: 199.99,
    image: 'https://images.unsplash.com/...',
    rating: 5,
    reviews: 45,
  },
]);
```

### Modify Testimonials
Edit `src/app/pages/landing/sections/testimonials/testimonials.component.ts`:

```typescript
testimonials = signal<Testimonial[]>([
  {
    id: 1,
    name: 'Customer Name',
    role: 'Customer Title',
    image: 'https://images.unsplash.com/...',
    text: 'Testimonial text here',
    rating: 5,
  },
]);
```

### Change Color Scheme
Edit `src/styles.css` CSS variables:

```css
:root {
  --color-primary: #YOUR_COLOR;
  --color-primary-light: #YOUR_LIGHT_COLOR;
  --color-secondary: #YOUR_COLOR;
  /* Update all colors as needed */
}
```

### Add Newsletter Functionality
The newsletter component detects valid emails and shows success/error messages. To integrate with backend:

Edit `src/app/pages/landing/sections/newsletter/newsletter.component.ts`:

```typescript
onSubmit(): void {
  if (!this.userEmail || !this.isValidEmail(this.userEmail)) {
    this.errorMessage.set('Please enter a valid email address');
    return;
  }

  this.isSubmitting.set(true);
  
  // Replace this timeout with actual API call
  this.http.post('/api/newsletter/subscribe', { email: this.userEmail })
    .subscribe({
      next: (response) => {
        this.successMessage.set('Thank you for subscribing!');
        this.isSubmitting.set(false);
        this.userEmail = '';
      },
      error: (err) => {
        this.errorMessage.set(err.error.message || 'Subscription failed');
        this.isSubmitting.set(false);
      }
    });
}
```

## Development Workflow

### 1. **Local Development**
```bash
npm start
# Open http://localhost:4200
# Edit files and see changes automatically
```

### 2. **Build for Production**
```bash
npm run build
# Creates optimized build in dist/
```

### 3. **Run Tests**
```bash
npm test
# Runs unit and integration tests
```

### 4. **Watch Mode**
```bash
npm run watch
# Watches for changes and rebuilds
```

## Component Communication

### Using Signals for State
```typescript
// In any component
import { signal, computed } from '@angular/core';

// Simple state
count = signal(0);

// Computed derived state
isLoading = computed(() => this.count() > 0);

// Update state
increment() {
  this.count.update(c => c + 1);
}

// Bind in template
{{ count() }}  <!-- Must call as function -->
```

### Routing Between Pages
```typescript
// In template
<a routerLink="/">Home</a>
<a routerLink="/shop">Shop</a>

// In component
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigate() {
  this.router.navigate(['/shop']);
}
```

## API Integration Patterns

### HttpClient Injection
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getProducts() {
  return this.http.get<Product[]>('/api/products');
}
```

### Error Handling
```typescript
getProducts().subscribe({
  next: (data) => {
    this.products.set(data);
  },
  error: (error) => {
    this.errorMessage.set('Failed to load products');
    console.error(error);
  },
  complete: () => {
    this.isLoading.set(false);
  }
});
```

## Debugging

### Browser DevTools
1. Open DevTools with F12
2. Go to Console tab
3. Check for any errors
4. Use Sources tab to set breakpoints

### Angular DevTools Extension
1. Install [Angular DevTools](https://angular.io/guide/devtools)
2. Signals Inspector → View signal values
3. Component Tree → Navigate component hierarchy
4. Check change detection timing

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
# Then restart
npm start
```

**Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Build without serving
npm run build
```

## Performance Tips

### Image Optimization
- Images use lazy loading (`loading="lazy"`)
- Async decoding (`decoding="async"`)
- Appropriate aspect ratios set
- Use WebP with fallbacks for production

### CSS Optimization
- Scoped component styles reduce CSS
- Use CSS variables for theming
- Minimal animations on mobile devices
- Enable gzip compression

### Change Detection
- Angular 21 defaults to OnPush for standalone
- Signals reduce unnecessary re-renders
- Use computed() for derived state

## Accessibility Testing

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys in menus
- Escape to close modals

### Screen Reader Testing
- Use NVDA (Windows) or VoiceOver (Mac)
- Verify semantic HTML structure
- Check ARIA labels are meaningful

### Visual Testing
- Use WAVE browser extension
- Lighthouse accessibility audit
- axe DevTools
- Manual color contrast checking

## Building for Production

### Optimization Checklist
- [ ] Run `npm run build`
- [ ] Check bundle size with `npm run build -- --stats-json`
- [ ] Test in production build locally
- [ ] Enable gzip compression
- [ ] Set up caching headers
- [ ] Use CDN for static assets
- [ ] Enable HTTPS
- [ ] Add security headers

### Build Output
```bash
npm run build
# Outputs to: dist/frontend-app/

# Gzipped bundle size
du -h dist/frontend-app/
```

## Deployment Options

### Vercel (Recommended)
```bash
npm i -g vercel
vercel deploy
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist/frontend-app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Resources

- **[Angular Documentation](https://angular.dev)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[MDN Web Docs](https://developer.mozilla.org/)**
- **[Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)**
- **[PrimeNG Components](https://primeng.org/)**

## Getting Help

1. Check [LANDING_PAGE.md](./LANDING_PAGE.md) for detailed documentation
2. Review component comments and JSDoc
3. Check Angular console for error messages
4. Run tests to identify issues
5. Use Chrome DevTools for debugging

---

**Happy coding! 🚀**
