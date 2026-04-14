# GitHub Copilot Instructions: UI & Responsive Design

## Priority Guidelines

When generating UI components and styling for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, CSS3, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established component styling and layout patterns
4. **Architectural Consistency**: Maintain mobile-first responsive design approach
5. **Code Quality**: Prioritize accessibility, performance, and maintainability

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components with inline styles)
- **TypeScript**: 5.9.2
- **CSS3**: Grid, Flexbox, Media Queries
- **PrimeNG**: 21.1.6 (component library)
- **PrimeIcons**: 7.0.0 (icon library)

### Key Constraints
- CSS3 Grid and Flexbox for layouts
- Mobile-first approach (520px → tablet → desktop)
- Responsive images with lazy loading
- Accessible color contrast ratios
- CSS variables for theming
- No CSS frameworks except PrimeNG

## Design System

### 1. Color Palette - Modern Sleek Themes

#### Theme 1: Modern Minimalist (Recommended for E-Commerce)
```css
/* Primary Colors - Cool Blue Gradient */
--color-primary: #0f6fc6;           /* Deep Professional Blue */
--color-primary-light: #3b82f6;     /* Bright Accent Blue */
--color-primary-dark: #0a47a1;      /* Deep Blue for hover */
--color-primary-ultra-light: #e0f2fe; /* Ultra light background */

/* Secondary Colors - Teal Accent */
--color-secondary: #00d4aa;         /* Fresh Teal */
--color-secondary-light: #5eead4;   /* Soft Teal */
--color-secondary-dark: #0d9488;    /* Deep Teal */

/* Tertiary Accent - Purple for highlights */
--color-accent: #8b5cf6;            /* Vibrant Purple */
--color-accent-light: #c4b5fd;      /* Light Purple */

/* Status Colors - High Contrast */
--color-success: #10b981;           /* Emerald Green - vibrant */
--color-warning: #f59e0b;           /* Amber - refined orange */
--color-danger: #ef4444;            /* Red - bold but professional */
--color-info: #0ea5e9;              /* Sky Blue */

/* Neutral Colors - Clean & Modern */
--color-light: #f8fafc;             /* Almost white with cool tone */
--color-light-gray: #f1f5f9;        /* Very light neutral */
--color-medium-gray: #cbd5e1;       /* Medium neutral */
--color-dark-gray: #475569;         /* Dark but not black */
--color-dark: #1e293b;              /* Deep navy-black */
--color-white: #ffffff;             /* Pure white */

/* Text Colors */
--text-primary: #1e293b;            /* Deep blue-black */
--text-secondary: #64748b;          /* Muted slate */
--text-light: #94a3b8;              /* Light gray-blue */
--text-white: #ffffff;              /* Pure white */

/* Background Gradients */
--gradient-primary: linear-gradient(135deg, #0f6fc6 0%, #3b82f6 100%);
--gradient-accent: linear-gradient(135deg, #00d4aa 0%, #0f6fc6 100%);
--gradient-subtle: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
```

#### Theme 2: Dark Mode (Premium Alternative)
```css
/* Dark Mode - Sophisticated */
--dark-bg-primary: #0f172a;         /* Deep dark background */
--dark-bg-secondary: #1e293b;       /* Slightly lighter for cards */
--dark-bg-tertiary: #334155;        /* Lighter for hover states */
--dark-primary: #00d4aa;            /* Vibrant teal on dark */
--dark-primary-light: #5eead4;      /* Accent teal */
--dark-accent: #8b5cf6;             /* Purple accent */
--dark-text-primary: #f8fafc;       /* Near white text */
--dark-text-secondary: #cbd5e1;     /* Muted text */

/* Dark Mode Status */
--dark-success: #10b981;
--dark-warning: #f59e0b;
--dark-danger: #ef4444;
--dark-info: #0ea5e9;
```

#### Theme 3: Gradient Accent (Modern & Eye-catching)
```css
/* Vibrant with Gradients */
--color-vibrant-primary: #5B4EFF;   /* Vivid Purple */
--color-vibrant-secondary: #FF006E; /* Hot Pink */
--color-vibrant-accent: #00D9FF;    /* Cyan */
--gradient-vibrant: linear-gradient(135deg, #5B4EFF 0%, #FF006E 50%, #00D9FF 100%);
--gradient-popular: linear-gradient(135deg, #FF006E 0%, #5B4EFF 100%);
```

### 2. Theme Selection Guidelines

**For E-Commerce Product Catalog**: Use Theme 1 (Modern Minimalist)
- Professional, trustworthy appearance
- High contrast for product images
- Cool blues with teal accents feel modern and refreshing

**For Admin Dashboard**: Use Theme 1 or 2 (Dark Mode)
- Reduces eye strain during extended use
- Professional appearance
- Clear visual hierarchy with vibrant accents

**For Premium/Luxury Products**: Use Theme 2 (Dark Mode)
- Sophisticated and elegant
- Draws attention to product imagery
- Teal accents create premium feel

**For Dynamic/Fashion Products**: Use Theme 3 (Gradient Accent)
- Modern and eye-catching
- Vibrant, energetic feel
- Perfect for trendy e-commerce

### 3. Typography
```css
/* Font Family */
--font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
--font-mono: 'Monaco', 'Courier New', monospace;

/* Font Sizes */
--text-h1: 2.5rem;   /* 40px */
--text-h2: 2rem;     /* 32px */
--text-h3: 1.5rem;   /* 24px */
--text-h4: 1.25rem;  /* 20px */
--text-h5: 1.125rem; /* 18px */
--text-h6: 1rem;     /* 16px */
--text-base: 1rem;   /* 16px */
--text-sm: 0.875rem; /* 14px */
--text-xs: 0.75rem;  /* 12px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 4. Spacing System (8px base unit)
```css
--spacing-xs: 4px;    /* 0.5 unit */
--spacing-sm: 8px;    /* 1 unit */
--spacing-md: 16px;   /* 2 units */
--spacing-lg: 24px;   /* 3 units */
--spacing-xl: 32px;   /* 4 units */
--spacing-2xl: 48px;  /* 6 units */
--spacing-3xl: 64px;  /* 8 units */
```

### 5. Elevation (Shadow System)
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.15);

/* Hover elevation */
--shadow-hover: 0 8px 16px rgba(0, 0, 0, 0.15);
```

### 6. Border Radius
```css
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

## Motion Design & Animation Libraries

### Recommended Free Libraries for Angular 21

#### 1. **Animate.css** (Pure CSS, 100% Free)
- **Installation**: `npm install animate.css`
- **Best For**: Quick, modern animations with minimal setup
- **Animations Included**: Attention seekers, entrances, exits, bouncing, fading, flipping, rotating, sliding, zooming, specials
- **Usage**:
```html
<!-- In component template -->
<div [ngClass]="{'animate__animated': isAnimating, 'animate__fadeInUp': isAnimating}">
  Content
</div>

<!-- In component CSS -->
<style>
  .animate__animated {
    --animate-duration: 0.5s;
  }
</style>
```
- **Pros**: Easy to use, well-documented, lightweight
- **Cons**: CSS-based only (not for JS control)

#### 2. **AOS (Animate On Scroll)** (100% Free)
- **Installation**: `npm install aos`
- **Best For**: Element animations triggered by scroll position
- **Features**: Smooth scroll-triggered animations, intersection observer API
- **Usage**:
```typescript
// In component TypeScript
import AOS from 'aos';
import 'aos/dist/aos.css';

ngOnInit() {
  AOS.init();
}

// In component template
<div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
  Animates when scrolling into view
</div>
```
- **Pros**: Lightweight, performant with intersection observer, great for lazy loading
- **Cons**: Limited customization for complex animations

#### 3. **Angular Animations** (Built-in, No Installation Needed)
- **Best For**: Component lifecycle animations, state transitions
- **Features**: Native Angular animation API, TypeScript-based
- **Usage**:
```typescript
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-fade-demo',
  template: `<div [@fadeInOut]="isVisible ? 'visible' : 'hidden'">Content</div>`,
  animations: [
    trigger('fadeInOut', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible <=> hidden', animate('500ms ease-in-out'))
    ])
  ]
})
export class FadeDemoComponent {
  isVisible = true;
}
```
- **Pros**: Built into Angular, type-safe, performance optimized
- **Cons**: Steeper learning curve for complex animations

#### 4. **GSAP (GreenSock) - Community Edition** (Free Tier)
- **Installation**: `npm install gsap`
- **Best For**: Advanced, complex animations and timelines
- **Features**: Timeline control, easing, morphing, staggering effects
- **Usage**:
```typescript
import gsap from 'gsap';

ngAfterViewInit() {
  gsap.to('.element', {
    duration: 1,
    x: 100,
    rotation: 360,
    ease: 'back.out'
  });
}
```
- **Pros**: Powerful, smooth animations, excellent easing functions
- **Cons**: Larger bundle size compared to alternatives

#### 5. **Lottie-Web** (100% Free, Perfect for Complex Animations)
- **Installation**: `npm install lottie-web`
- **Best For**: Complex vector animations from design tools (Figma, Adobe XD, After Effects)
- **Features**: Play animations created in Figma or Lottie Editor
- **Usage**:
```typescript
import lottie from 'lottie-web';

ngAfterViewInit() {
  lottie.loadAnimation({
    container: this.animationContainer.nativeElement,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/animations/loading.json'
  });
}
```
- **Pros**: Designer-friendly, complex animations, small file sizes
- **Cons**: Requires JSON animation files from design tools
- **Free Resources**: https://lottiefiles.com (thousands of free animations)

#### 6. **Motion** (Angular-specific, Alternative to Framer Motion)
- **Installation**: `npm install @angular/animations`
- **Best For**: Staggered list animations, complex sequences
- **Usage with GSAP for Stagger**:
```typescript
gsap.to('.list-item', {
  duration: 0.5,
  opacity: 1,
  y: 0,
  stagger: 0.1,
  ease: 'power2.out'
});
```

### Recommended Combinations for E-Commerce

**For Product Catalog Page**:
- **Animate.css** for entry animations
- **AOS** for scroll-triggered fade-ins
- **Angular Animations** for product hover states

**For Checkout Page**:
- **Angular Animations** for form step transitions
- **GSAP** for complex checkout flow animations

**For Loading States**:
- **Lottie-Web** with animations from https://lottiefiles.com
- **Skeletons with Animate.css shimmer effect**

**For Micro-interactions**:
- **Angular Animations** for button clicks
- **CSS Transitions** (native, no library needed) for hover states

### Performance-Optimized Animation Pattern

```typescript
// animations.config.ts
export const ANIMATIONS = {
  fadeIn: {
    duration: 300,
    easing: 'ease-in-out'
  },
  slideUp: {
    duration: 500,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  },
  scaleHover: {
    duration: 200,
    easing: 'ease-out'
  }
};

// Use with Animate.css
<div 
  class="animate__animated animate__fadeInUp"
  style="--animate-duration: 0.5s">
  Optimized animation
</div>
```

### Free Resources & Libraries
- **Animate.css**: https://animate.style/
- **Lottie Files**: https://lottiefiles.com/ (thousands of free animations)
- **AOS Documentation**: https://michalsnik.github.io/aos/
- **GSAP Free Docs**: https://greensock.com/
- **SVG Animation Tool**: https://www.svgator.com/ (free tier available)

## Responsive Breakpoints

### Breakpoint Strategy (Mobile-First)
```css
/* Mobile First */
@media (min-width: 520px) { /* Early mobile fixes */ }
@media (min-width: 640px) { /* Tablets - landscape phone */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
@media (min-width: 1536px) { /* Extra large desktop */ }
```

### Device Breakpoints Map
```css
--breakpoint-xs: 320px;   /* Small phone */
--breakpoint-sm: 520px;   /* Large phone */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large desktop */

/* Usage */
@media (min-width: var(--breakpoint-md)) { }
```

## Global Styles Pattern

### 1. Base CSS Setup
```css
/* styles.css */
:root {
  /* Colors */
  --color-primary: #3399cc;
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-danger: #f44336;
  
  /* Typography */
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --text-base: 1rem;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  
  /* Effects */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius-md: 8px;
}

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  font-size: var(--text-base);
  color: var(--text-primary);
  background-color: var(--color-white);
  line-height: 1.6;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Component Styling Pattern

### 1. Card Component
```css
/* Card styling */
.card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

/* Responsive card padding */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
}
```

### 2. Button Styling
```css
/* Base button */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 12px 24px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

/* Primary button */
.button.primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.button.primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.button.primary:active {
  transform: scale(0.98);
}

.button.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Size variants */
.button.sm {
  padding: 8px 16px;
  font-size: var(--text-sm);
}

.button.lg {
  padding: 16px 32px;
  font-size: var(--text-h6);
}
```

### 3. Grid Layout
```css
/* Responsive grid */
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

/* Mobile first - 1 column */
.grid-cols-1 {
  grid-template-columns: 1fr;
}

/* Tablet - 2 columns */
@media (min-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop - 3+ columns */
@media (min-width: 1024px) {
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Auto fit pattern for flexible grids */
.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

### 4. Flexbox Layout
```css
/* Flex utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gap-md {
  gap: var(--spacing-md);
}

/* Responsive flex */
@media (max-width: 768px) {
  .flex-row-to-col {
    flex-direction: column;
  }
}
```

## Form Styling Pattern

### 1. Input Fields
```css
/* Input base */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 12px;
  font-family: inherit;
  font-size: var(--text-base);
  border: 1px solid var(--color-medium-gray);
  border-radius: var(--radius-md);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Focus state */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(51, 153, 204, 0.1);
}

/* Input error state */
input.error,
textarea.error {
  border-color: var(--color-danger);
}

input.error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

/* Disabled state */
input:disabled,
textarea:disabled {
  background-color: var(--color-light);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### 2. Form Layout
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.form-group label {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.form-group small {
  font-size: var(--text-xs);
  color: var(--text-light);
}

.form-group.error small {
  color: var(--color-danger);
}

/* Two-column form on desktop */
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .form-row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Animation & Transition Pattern

### 1. Utility Animations
```css
/* Fade animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

/* Slide animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

/* Scale animations */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}

/* Loading skeleton */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-light-gray) 25%,
    var(--color-white) 50%,
    var(--color-light-gray) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

## Utility Classes Pattern

### 1. Spacing Utilities
```css
/* Margin utilities */
.m-0 { margin: 0; }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }

.mx-auto { margin-left: auto; margin-right: auto; }
.my-md { margin-top: var(--spacing-md); margin-bottom: var(--spacing-md); }

/* Padding utilities */
.p-0 { padding: 0; }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
```

### 2. Text Utilities
```css
/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Text color */
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-danger { color: var(--color-danger); }

/* Text weight */
.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-bold { font-weight: var(--font-bold); }

/* Text transform */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

/* Text overflow */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 3. Visibility Utilities
```css
/* Display utilities */
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }

/* Responsive visibility */
@media (max-width: 768px) {
  .hidden-mobile { display: none; }
}

@media (min-width: 769px) {
  .hidden-desktop { display: none; }
}
```

## Accessibility Guidelines

### 1. Color Contrast
```css
/* WCAG AA Compliance (4.5:1 for normal text, 3:1 for large text) */
--contrast-aa: 4.5;
--contrast-aa-large: 3;

/* Semantic color usage */
.success { color: var(--color-success); } /* #4caf50 on white: 4.54:1 */
.danger { color: var(--color-danger); }   /* #f44336 on white: 3.93:1 */
```

### 2. Focus States
```css
/* Visible focus indicator */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Tab key navigation */
:focus-visible {
  outline: 2px dashed var(--color-primary);
  outline-offset: 4px;
}
```

### 3. Skip Navigation
```html
<!-- Add skip to main link -->
<a href="#main-content" class="skip-to-main">
  Skip to Main Content
</a>

<style>
.skip-to-main {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-to-main:focus {
  left: 0;
  top: 0;
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-md);
}
</style>
```

## Component Styling Examples

### 1. Navigation Component
```css
.navbar {
  background: var(--color-white);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
}

.navbar-menu a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-menu a:hover {
  color: var(--color-primary);
}

.navbar-menu a.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

/* Mobile menu */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .navbar-menu.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-white);
  }
}
```

### 2. Product Grid Component
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

.product-card {
  background: var(--color-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  width: 100%;
  height: 200px;
  background: var(--color-light);
  object-fit: cover;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: var(--spacing-md);
}

/* Responsive grid */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
}
```

## Performance Optimization

### 1. Image Optimization
```html
<!-- Responsive images -->
<img 
  src="image-1024.jpg"
  alt="Product"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  srcset="image-320.jpg 320w, image-640.jpg 640w, image-1024.jpg 1024w"
  loading="lazy"
  style="max-width: 100%; height: auto;">

<!-- Picture element for art direction -->
<picture>
  <source media="(max-width: 640px)" srcset="image-mobile.jpg">
  <source media="(max-width: 1024px)" srcset="image-tablet.jpg">
  <img src="image-desktop.jpg" alt="Product">
</picture>
```

### 2. CSS Optimization
```css
/* Reduce motion for better performance */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Use CSS containment */
.card {
  contain: layout style paint;
}

/* Optimize repaints */
.animated {
  will-change: transform;
  transform: translateZ(0);
}
```

## Code Quality Standards

### Naming Conventions
- Classes: `.component-name`, `.component__element`, `.component--modifier`
- Variables: `--property-name`
- Utilities: `.text-center`, `.flex-col`, `.gap-md`

### Documentation Template
```css
/**
 * Component: Card
 * Description: Reusable card component with shadow elevation
 * 
 * Variants:
 * - .card (base)
 * - .card--elevated (with hover effect)
 * - .card--flat (no shadow)
 * 
 * Usage:
 * <div class="card card--elevated">
 *   Content here
 * </div>
 */
```

## Related Guidelines
- See: src/styles.css for global styles
- See: src/app/app.css for app shell styling
- See: Individual component CSS files for component-specific styles
