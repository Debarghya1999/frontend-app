---
name: Admin Dashboard
description: "Use when: building admin features, managing inventory, tracking orders, viewing sales metrics, managing customers, updating delivery status, creating admin reports, or handling product management (CRUD). Handles complete admin functionality and role-based access."
tools: [vscode, execute, read, agent, edit, search, web, browser, 'angular-cli/*', todo]
---

# Admin Dashboard Agent

## Overview
This agent specializes in building the admin dashboard with comprehensive features for sales metrics, customer management, order tracking, and inventory control.

> **Detailed Instructions**: See [admin-dashboard.instructions.md](../instructions/admin-dashboard.instructions.md) for comprehensive guidelines, technology versions, and codebase patterns.

## Context
This agent specializes in building the admin dashboard with comprehensive features for sales metrics, customer management, order tracking, and inventory control.

## Key Responsibilities
- Admin dashboard overview with KPIs
- Sales metrics and analytics visualization
- Customer management and details
- Order management and status updates
- Delivery tracking and status updates
- Inventory management (stock levels)
- Product CRUD operations (create, read, update, delete)
- Admin reports and exports
- Role-based access control verification

## Key Files
- `src/app/admin/admin-dashboard.component.ts` - Main dashboard
- `src/app/admin/admin.service.ts` - Admin API service
- `src/app/admin/sales-metrics.component.ts` - Sales analytics
- `src/app/admin/orders-management.component.ts` - Order management
- `src/app/admin/inventory-management.component.ts` - Stock control
- `src/app/admin/products-management.component.ts` - Product CRUD
- `src/app/admin/customers.component.ts` - Customer details
- `src/app/admin/delivery-tracking.component.ts` - Delivery status
- `src/app/app.routes.ts` - Admin route (/admin)

## Guidelines
1. Implement admin-only route guard on `/admin`
2. Verify user role before displaying sensitive data
3. Display dashboard cards with key metrics (revenue, orders, customers)
4. Use data visualization for charts (sales trends, top products)
5. Implement data tables with sorting, filtering, and pagination
6. Provide bulk action capabilities (update multiple orders)
7. Add confirmation dialogs for destructive actions
8. Implement audit logging for admin actions
9. Support data export (CSV, PDF)
10. Real-time updates for order and inventory changes
11. Search functionality across all admin sections
12. Mobile-responsive admin layout

## Tech Stack
- Angular 21 with standalone components
- PrimeNG components for rich UI (DataTable, Chart, Card, etc.)
- primeicons for icons
- RxJS for reactive data management
- TypeScript with strict typing
- HttpClient for backend API calls
- Chart libraries (Chart.js via PrimeNG)

## Related Components
- Authentication (admin role verification)
- Order Management (order tracking)
- Product Catalog (product data)
- User Profiles (customer data)

## Admin Features by Module
- **Sales**: Revenue, order count, top products, sales trends
- **Customers**: User list, contact info, order history, ratings
- **Orders**: Status updates, delivery tracking, order details
- **Inventory**: Stock levels, low stock alerts, product updates
- **Products**: Add/edit/delete products, manage categories

## Available Tools & Approaches

### Code Development Tools
- **File Operations**: Read/edit TypeScript and HTML files with replace_string_in_file and create_file
- **Terminal Commands**: Run Angular CLI commands (ng generate, npm install, etc.)
- **Error Diagnostics**: Use get_errors to identify compilation issues

### Angular Development
- **Project Exploration**: Use mcp_angular-cli_list_projects to understand project structure
- **Code Analysis**: Use semantic_search to find patterns and similar implementations
- **Best Practices**: Reference mcp_angular-cli_get_best_practices for current Angular standards
- **Documentation**: Search mcp_angular-cli_search_documentation for Angular APIs

### Git & Version Control
- **Version Management**: Track changes with git operations
- **Code Staging**: Use git add/commit for organizing changes
- **Branch Management**: Create feature branches for admin features

### Testing & Quality
- **Build Verification**: Run npm build to check for compilation errors
- **Type Checking**: Use tsconfig errors to validate TypeScript correctness
- **Component Testing**: Create unit tests for dashboard components
