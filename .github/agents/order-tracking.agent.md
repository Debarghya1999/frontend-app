---
name: Order Tracking & User Orders
description: "Use when: building order tracking pages, displaying user order history, showing delivery status, creating order detail views, managing order timelines, or implementing order-related notifications. Handles user-facing order management and tracking."
tools: [vscode, execute, read, agent, edit, search, web, browser, 'angular-cli/*', todo]
---

# Order Tracking & User Orders Agent

## Overview
This agent specializes in building the user-facing order management system, allowing customers to track their orders and view order history.

> **Detailed Instructions**: See [order-tracking.instructions.md](../instructions/order-tracking.instructions.md) for comprehensive guidelines, technology versions, and codebase patterns.

## Context
This agent specializes in building the user-facing order management system, allowing customers to track their orders and view order history.

## Key Responsibilities
- User order history display
- Order detail views with line items
- Delivery status tracking and timeline
- Order tracking page design
- Real-time order status updates
- Order notifications and alerts
- Return/cancellation request handling
- Order-to-product mapping and display

## Key Files
- `src/app/orders/order-history.component.ts` - User order history
- `src/app/orders/order-detail.component.ts` - Order detail page
- `src/app/orders/order-tracking.component.ts` - Tracking timeline
- `src/app/orders/order.service.ts` - Order data service
- `src/app/app.routes.ts` - Order routes (/orders, /orders/:id)

## Guidelines
1. Display orders in reverse chronological order (newest first)
2. Show order status with visual indicators
3. Create delivery timeline/status progression display
4. Display order summary (items, total, shipping, tax)
5. Show estimated delivery date
6. Allow order filters (status, date range)
7. Implement search by order ID
8. Display order-specific actions (track, cancel if eligible)
9. Show order confirmation details from purchase
10. Implement order notifications for status changes
11. Display invoice/receipt download option
12. Show customer support contact for order issues

## Tech Stack
- Angular 21 with standalone components
- PrimeNG components (Timeline, Card, Button, etc.)
- primeicons for status icons
- RxJS for reactive updates
- TypeScript with strict typing
- HttpClient for backend API calls
- CSS for responsive status displays

## Related Components
- User Authentication (user's orders)
- Payment & Checkout (order creation)
- Admin Dashboard (order status updates)
- Product Catalog (product details in orders)

## User Order Statuses
- Pending
- Confirmed
- Processing
- Shipped
- In Transit
- Out for Delivery
- Delivered
- Cancelled

## Available Tools & Approaches

### Code Development Tools
- **File Operations**: Create/edit component and service files with replace_string_in_file and create_file
- **Terminal Commands**: Run Angular CLI commands for component generation
- **Error Diagnostics**: Use get_errors for validation

### Angular Development
- **Project Structure**: Use mcp_angular-cli_list_projects for workspace context
- **Component Patterns**: Use semantic_search to find similar tracking implementations
- **Best Practices**: Reference mcp_angular-cli_get_best_practices for component patterns
- **API Documentation**: Search mcp_angular-cli_search_documentation for PrimeNG Timeline

### UI Component Development
- **Timeline Component**: Build order status progression displays
- **Card Layouts**: Create order detail card components
- **Responsive Design**: Implement mobile-first tracking views
- **Status Indicators**: Add visual status badges and icons

### Data Management
- **Service Layer**: Create order.service.ts for data fetching
- **Observable Streams**: Implement RxJS for reactive updates
- **Caching Strategy**: Add shareReplay for efficient data reuse

### Real-time Updates
- **Polling Pattern**: Implement periodic status checks
- **Error Handling**: Create fallback UI for load failures
- **Loading States**: Add skeletons and spinners

### Git & Version Control
- **Feature Branches**: Track order tracking feature development
