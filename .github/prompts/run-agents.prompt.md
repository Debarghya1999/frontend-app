# E-Commerce Boutique Website - Agent Selection Guide

## Overview

This project includes specialized agents designed to help you implement specific features and functionality. Each agent has deep expertise in its domain and can be invoked when you need to work on that particular area.

## Available Agents

### 1. **Admin Dashboard**
- **Purpose**: Building admin features, managing inventory, tracking orders, viewing sales metrics, managing customers, updating delivery status, creating admin reports, and handling product management (CRUD)
- **When to use**: You need to create admin panels, manage store inventory, view order analytics, handle customer management, or update product information
- **Example tasks**: 
  - "Set up the admin dashboard to display sales metrics"
  - "Create an inventory management page for admins"
  - "Implement customer management features in admin panel"

### 2. **Authentication & Authorization**
- **Purpose**: Implementing JWT-based authentication, creating login/signup components, managing user roles, setting up route guards, storing tokens in localStorage, and handling user session management
- **When to use**: You need to handle user authentication, implement role-based access control, or manage user sessions
- **Example tasks**:
  - "Build a login and signup form with JWT authentication"
  - "Create role-based access guards for admin routes"
  - "Implement user session persistence"

### 3. **Backend Integration & API**
- **Purpose**: Configuring API endpoints, implementing HTTP calls, managing environment variables, handling API errors, creating interceptors, setting up CORS, and integrating with the Spring Boot backend
- **When to use**: You need to connect the frontend to the backend, call APIs, or manage HTTP communication
- **Example tasks**:
  - "Configure API endpoints for product data"
  - "Create HTTP interceptors for authentication tokens"
  - "Set up error handling for API responses"

### 4. **Deployment & Hosting**
- **Purpose**: Deploying to Netlify, configuring build processes, setting up environment variables, optimizing production builds, and managing deployment configurations
- **When to use**: You need to prepare the application for production or deploy to hosting platforms
- **Example tasks**:
  - "Configure the application for Netlify deployment"
  - "Set up production environment variables"
  - "Optimize the build for performance"

### 5. **Order Tracking & User Orders**
- **Purpose**: Building order tracking pages, displaying user order history, showing delivery status, creating order detail views, and managing order timelines
- **When to use**: You need to implement user-facing order management and tracking features
- **Example tasks**:
  - "Create an order tracking page showing delivery status"
  - "Build order history view for user profile"
  - "Implement order timeline display"

### 6. **Payment & Checkout**
- **Purpose**: Integrating Razorpay, building checkout flow, handling payment confirmation, managing order initiation, and processing payment responses
- **When to use**: You need to implement the payment and checkout process
- **Example tasks**:
  - "Integrate Razorpay payment gateway"
  - "Create checkout flow with payment confirmation"
  - "Handle payment success/failure scenarios"

### 7. **Product Catalog**
- **Purpose**: Displaying products, building product catalog pages, implementing product search and filters, managing product cards, setting up responsive grids, and creating product details views
- **When to use**: You need to build the product browsing experience
- **Example tasks**:
  - "Create a responsive product grid with filtering"
  - "Implement product search functionality"
  - "Build product detail pages"

### 8. **Ratings & Reviews**
- **Purpose**: Implementing product reviews, handling user ratings, displaying review lists, creating review forms, and managing review moderation
- **When to use**: You need to implement user review and rating functionality
- **Example tasks**:
  - "Create a review submission form"
  - "Display product ratings and reviews"
  - "Implement review moderation features"

### 9. **Shopping Cart**
- **Purpose**: Managing cart items, building cart UI, handling add/remove/update quantity operations, calculating cart totals, persisting cart state, and implementing checkout flow preparation
- **When to use**: You need to implement shopping cart functionality
- **Example tasks**:
  - "Build the shopping cart component"
  - "Implement cart item management (add/remove/update)"
  - "Create cart persistence with localStorage"

### 10. **UI & Responsive Design**
- **Purpose**: Styling components, implementing responsive layouts, creating animations, building mobile-first designs, managing color palettes, and implementing dark mode
- **When to use**: You need to work on styling, responsive design, or animations
- **Example tasks**:
  - "Create a responsive mobile-first layout"
  - "Implement dark mode toggle"
  - "Add hover animations to product cards"

### 11. **Explore**
- **Purpose**: Fast read-only codebase exploration and Q&A
- **When to use**: You need to understand the codebase structure, find specific files, or get quick answers
- **Example tasks**:
  - "Explore the structure of services in the project"
  - "Find all authentication-related files"
  - "Understand how API calls are configured"

## How to Use the Agents

### Method 1: Direct Agent Invocation
Ask Copilot to run a specific agent by mentioning it by name:

```
"Run the Shopping Cart agent to help me build the cart UI"
"Use the Payment & Checkout agent to integrate Razorpay"
"Invoke the Product Catalog agent to add product filtering"
```

### Method 2: Describing Your Task
Describe what you want to accomplish, and Copilot will determine which agent to use:

```
"I need to add user authentication to the application"
"Help me set up a checkout flow with payment processing"
"Create a responsive navigation menu for all screen sizes"
```

### Method 3: Multi-Agent Workflows
For complex features, reference multiple agents in sequence:

```
"First use the Product Catalog agent to create product pages, then use the Shopping Cart agent to add cart functionality"
```

## Quick Reference

| Task Category | Agent | Key Capabilities |
|---|---|---|
| User Auth | Authentication & Authorization | JWT, Login/Signup, Role Guards, Session Management |
| Products | Product Catalog | Display, Search, Filters, Product Details |
| Shopping | Shopping Cart | Add/Remove Items, Cart Totals, State Persistence |
| Reviews | Ratings & Reviews | Review Forms, Rating Display, Moderation |
| Payments | Payment & Checkout | Razorpay Integration, Checkout Flow |
| Orders | Order Tracking & User Orders | Order History, Tracking, Delivery Status |
| Admin | Admin Dashboard | Inventory, Analytics, Customer Management |
| Backend | Backend Integration & API | API Calls, Interceptors, Error Handling |
| Styling | UI & Responsive Design | Layouts, Animations, Dark Mode |
| Deployment | Deployment & Hosting | Netlify, Build Optimization, Environment Setup |
| Exploration | Explore | Codebase Q&A, Structure Understanding |

## Best Practices

1. **Be Specific**: Clearly describe what you want to achieve for better results
2. **Use Agent Names**: Reference agents by their exact names when you know which one you need
3. **Provide Context**: Share relevant requirements, constraints, or design preferences
4. **Follow Agent Expertise**: Each agent specializes in its domain—use the right tool for the job
5. **Combine Agents**: For complex features, leverage multiple agents in sequence

## Examples

### Example 1: Building a Complete Product Page
1. Start with **Product Catalog** agent: "Create a product detail page with image gallery and specifications"
2. Then use **Ratings & Reviews** agent: "Add reviews section to the product page"
3. Then use **Shopping Cart** agent: "Add 'Add to Cart' button with size/color selection"

### Example 2: Implementing User Authentication
1. Use **Authentication & Authorization** agent: "Create login and signup forms"
2. Then use **Backend Integration & API** agent: "Connect authentication forms to the backend API"
3. Finally use **Admin Dashboard** agent: "Create user management section for admins"

### Example 3: Complete Checkout Flow
1. Use **Shopping Cart** agent: "Build and review the shopping cart"
2. Then use **Payment & Checkout** agent: "Implement Razorpay integration and checkout"
3. Then use **Order Tracking & User Orders** agent: "Add order confirmation and tracking"

## Troubleshooting

- **Not sure which agent to use?** Try the **Explore** agent for quick codebase understanding
- **Need multiple features?** Use agents in sequence, letting each complete its work before moving to the next
- **Agent not addressing your need?** Provide more specific details about your requirements

---

**Note**: These agents are specialized tools for the e-commerce boutique application. Choose the agent(s) that best match your current task for optimal results.
