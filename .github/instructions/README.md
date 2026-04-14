# GitHub Copilot Instructions - Summary

This directory contains specialized Copilot instructions for each agent in the e-commerce boutique frontend application. Each file corresponds to a specific domain/agent and provides comprehensive guidance for code generation within that domain.

## Files Created

### 1. **admin-dashboard.instructions.md**
   - **Purpose**: Admin dashboard, KPI metrics, sales analytics, inventory management, product CRUD, order tracking, customer management
   - **Key Topics**: Role-based access control, PrimeNG DataTable/Chart components, bulk operations, audit logging, real-time updates
   - **Technologies**: Angular 21, PrimeNG 21.1, RxJS 7.8

### 2. **authentication.instructions.md**
   - **Purpose**: JWT-based authentication, user registration, login, session management, role-based authorization
   - **Key Topics**: BehaviorSubject state management, token refresh, route guards, HTTP interceptors, localStorage persistence
   - **Technologies**: Angular 21, RxJS 7.8, localStorage API

### 3. **backend-integration.instructions.md**
   - **Purpose**: REST API integration, HTTP communication, environment configuration, error handling, request/response transformation
   - **Key Topics**: HttpClient setup, typed DTOs, interceptors, pagination, caching, environment variables
   - **Technologies**: Angular 21, HttpClient, RxJS operators

### 4. **deployment-hosting.instructions.md**
   - **Purpose**: Production build, Netlify deployment, build optimization, environment management, security headers
   - **Key Topics**: Build configuration, code splitting, lazy loading, asset optimization, performance monitoring, CI/CD
   - **Technologies**: Angular CLI 21, Netlify, GitHub Actions

### 5. **order-tracking.instructions.md**
   - **Purpose**: User order history, order details, order tracking, delivery timeline, order status updates
   - **Key Topics**: Observable subscriptions, real-time updates, order status visualization, delivery timeline component
   - **Technologies**: Angular 21, PrimeNG 21.1, RxJS

### 6. **payment-checkout.instructions.md**
   - **Purpose**: Razorpay payment integration, checkout flow, payment confirmation, order initiation
   - **Key Topics**: Dynamic script loading, payment modal, signature verification, error handling
   - **Technologies**: Angular 21, Razorpay SDK, RxJS

### 7. **product-catalog.instructions.md**
   - **Purpose**: Product browsing, catalog display, product search and filtering, responsive product grids
   - **Key Topics**: Lazy loading, pagination, search debouncing, responsive layouts, product cards
   - **Technologies**: Angular 21, PrimeNG 21.1, CSS Grid/Flexbox

### 8. **ratings-reviews.instructions.md**
   - **Purpose**: Product reviews, star ratings, review moderation, helpful/unhelpful voting, verified purchase validation
   - **Key Topics**: Reactive forms validation, rating distribution, review moderation status, user-generated content
   - **Technologies**: Angular 21, Reactive Forms, RxJS

### 9. **shopping-cart.instructions.md**
   - **Purpose**: Cart state management, item management, quantity updates, totals calculation, localStorage persistence
   - **Key Topics**: BehaviorSubject cart state, localStorage persistence, stock validation, discount application
   - **Technologies**: Angular 21, BehaviorSubject, localStorage

### 10. **ui-responsive-design.instructions.md**
   - **Purpose**: Component styling, responsive layouts, design system, accessibility, animations
   - **Key Topics**: Mobile-first approach, CSS Grid/Flexbox, design tokens, color palette, typography, breakpoints
   - **Technologies**: CSS3, PrimeNG, WCAG accessibility standards

## How to Use These Instructions

Each instructions file follows the same comprehensive structure:

1. **Priority Guidelines** - Core principles for code generation
2. **Technology Version Detection** - Exact versions and constraints
3. **Codebase Pattern Analysis** - Component/service organization patterns
4. **Models & Types** - TypeScript interfaces and types
5. **Service Patterns** - Angular service implementations
6. **Component Patterns** - Component structure and examples
7. **API Endpoints** - Backend integration points
8. **Testing Patterns** - Unit and E2E test approaches
9. **Code Quality Standards** - Naming conventions and documentation
10. **Related Guidelines** - Cross-references to other areas

## Key Principles Across All Instructions

- **Angular 21**: All code uses standalone components (no NgModules)
- **TypeScript 5.9+**: Strict typing with interfaces and types
- **PrimeNG 21.1+**: Component library for UI
- **RxJS 7.8+**: Reactive programming patterns
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Type Safety**: Strong typing throughout
- **Error Handling**: Graceful error management
- **Performance**: Caching, lazy loading, OnPush change detection
- **Accessibility**: WCAG compliance, semantic HTML
- **Testing**: Unit, integration, and E2E test patterns

## Technology Stack Summary

```
Frontend: Angular 21 (standalone components)
Language: TypeScript 5.9+
UI Library: PrimeNG 21.1 + primeicons 7.0
State Management: RxJS 7.8 (Observables + BehaviorSubject)
Build Tool: Angular CLI 21.2
Styling: CSS3 (Grid, Flexbox, Media Queries)
Storage: localStorage (browser)
Payment: Razorpay SDK
Hosting: Netlify
```

## Version Specifications

| Technology | Version |
|-----------|---------|
| Angular | 21.2.0 |
| TypeScript | 5.9.2 |
| PrimeNG | 21.1.6 |
| primeicons | 7.0.0 |
| RxJS | 7.8.0 |
| Node.js | 18+ |
| npm | 11.12.1 |

## File Organization

All instructions follow this directory structure:

```
.github/
├── agents/ (agent definitions)
│   ├── admin-dashboard.agent.md
│   ├── authentication.agent.md
│   └── ... (other agents)
└── instructions/ (copilot guidance)
    ├── admin-dashboard.instructions.md
    ├── authentication.instructions.md
    └── ... (other instructions)
```

## Usage Tips

1. **When to Use**: Reference the appropriate instructions file when working with Copilot on tasks related to that domain
2. **Consistency**: Follow the patterns defined in the corresponding instructions file
3. **Cross-Reference**: Check "Related Guidelines" for connected functionality
4. **Type Safety**: Use the models and types defined to maintain consistency
5. **Code Examples**: Study the provided patterns and component examples
6. **Best Practices**: Follow the code quality standards defined in each file

## Maintenance

These instructions are technology-specific and version-pinned. Update when:
- Angular/RxJS/PrimeNG versions change
- New architectural patterns are introduced
- New components or services are created
- Code organization changes
- Performance optimization techniques evolve
