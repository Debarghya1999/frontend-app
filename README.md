# Boutique Shop Frontend

This Angular application is the frontend for an online boutique shop. It includes authentication, product catalog browsing, Razorpay payment checkout, and a full admin dashboard for managing sales, inventory, orders, and delivery.

## Tech Stack

- Angular 21
- TypeScript
- PrimeNG for UI components
- primeicons for icons
- RxJS for reactive state management
- Razorpay for payment checkout
- Netlify for free static hosting

## Application Features

- Signup / Login with JWT-based authentication
- Role-based authorization with admin-only access
- Home page with featured products and shop messaging
- Product catalog page with mobile-first responsive design
- Users can browse products, add items to a cart, place orders, and provide ratings and reviews for purchased products
- Razorpay checkout integration for payments
- User order tracking details so users can follow the delivery status of their orders
- Admin dashboard with sales metrics, customer details, order management, inventory controls, and tracking details for all orders
- Modern theme with smooth animations and responsive mobile-first layouts
- Backend integration via REST API to a Spring Boot service

## Implementation Plan

1. Application shell and routing
   - Add routes for `/login`, `/signup`, `/home`, `/catalog`, `/payment`, `/admin`, and a fallback redirect
   - Provide routing configuration in `src/app/app.routes.ts` and `src/app/app.config.ts`
   - Create a responsive app shell in `src/app/app.html` with navigation and `<router-outlet>`

2. Authentication and authorization
   - Implement `src/app/auth/auth.service.ts` for signup/login and JWT storage
   - Add `src/app/auth/login.component.ts` and `src/app/auth/signup.component.ts`
   - Add route guards for authenticated users and admin-only access
   - Use `localStorage` to persist the token and user role

3. Home and product catalog pages
   - Implement `src/app/home/home.component.ts` for the landing page
   - Implement `src/app/products/catalog.component.ts` and `src/app/products/product.service.ts`
   - Display products in a responsive card grid with search and filters

4. Payment handling with Razorpay
   - Implement `src/app/payment/payment.component.ts` and `src/app/payment/payment.service.ts`
   - Build a checkout flow that sends order initiation requests to the backend
   - Integrate Razorpay Checkout in the frontend and confirm payments with the backend

5. Admin dashboard
   - Build `src/app/admin/admin-dashboard.component.ts` with overview cards
   - Add `src/app/admin/admin.service.ts` to fetch sales, customers, orders, and inventory
   - Add admin components for inventory management, order tracking, and customer details
   - Allow create/update/delete product management and order/delivery status updates

6. Modern UI and responsive design
   - Use a polished color palette, typography, and spacing in `src/app/app.css`
   - Build mobile-first responsive layouts for all pages
   - Add smooth CSS animations and interactive transitions

7. Backend integration and configuration
   - Use Angular `HttpClient` for REST API calls to the Spring Boot backend
   - Add environment-based API URLs for local and production builds
   - Ensure auth, product, payment, order, and admin endpoints are supported

8. Netlify hosting
   - Deploy the production build to Netlify
   - Publish the app from `dist/frontend-app`
   - Use Netlify environment variables to configure the backend API URL

## Development server

To start a local development server, run:

```bash
npm install
npm start
```

Open your browser and navigate to `http://localhost:4200/`.

## Building

To build the project, run:

```bash
npm run build
```

This will compile your app and place the output in `dist/frontend-app`.

## Netlify Deployment

1. Create a new site on Netlify.
2. Connect the repository or drag and drop the `dist/frontend-app` folder.
3. Set the build command to:

```bash
npm run build
```

4. Set the publish directory to:

```bash
dist/frontend-app
```

5. Configure Netlify environment variables for the backend API URL, for example:

- `NG_APP_API_URL=https://your-backend-url`

## Running unit tests

To execute unit tests with Vitest, run:

```bash
npm test
```

## Running end-to-end tests

For end-to-end testing, run:

```bash
npm e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
