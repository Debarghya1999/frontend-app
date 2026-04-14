---
name: Ratings & Reviews
description: "Use when: implementing product reviews, handling user ratings, displaying review lists, creating review forms, managing review moderation, or calculating product ratings. Handles user-generated review content and rating system."
tools: [vscode, execute, read, agent, edit, search, web, browser, 'angular-cli/*', todo]
---

# Ratings & Reviews Agent

## Overview
This agent specializes in building the ratings and review system, allowing customers to provide feedback on purchased products.

> **Detailed Instructions**: See [ratings-reviews.instructions.md](../instructions/ratings-reviews.instructions.md) for comprehensive guidelines, technology versions, and codebase patterns.

## Context
This agent specializes in building the ratings and review system, allowing customers to provide feedback on purchased products.

## Key Responsibilities
- Review form component for rating and text
- Review display and listing
- Star rating system (1-5 stars)
- Review sorting and filtering
- Review moderation capabilities
- Helpful/unhelpful voting on reviews
- Average rating calculation
- Review validation (verified purchases only)
- Review editing and deletion

## Key Files
- `src/app/reviews/review-form.component.ts` - Add/edit reviews
- `src/app/reviews/review-list.component.ts` - Display reviews
- `src/app/reviews/star-rating.component.ts` - Star rating widget
- `src/app/reviews/review.service.ts` - Review API service
- `src/app/products/product-detail.component.ts` - Reviews section

## Guidelines
1. Require verified purchase to post reviews
2. Implement star rating (1-5) with visual feedback
3. Allow optional review text with character limit
4. Display review author name and purchase date
5. Show "verified purchase" badge
6. Implement review sorting (newest, helpful, rating)
7. Add helpful/unhelpful voting system
8. Show review moderation status (pending, approved, rejected)
9. Prevent duplicate reviews from same user
10. Calculate and display weighted average rating
11. Show rating distribution histogram
12. Allow review editing/deletion by author
13. Implement spam detection

## Tech Stack
- Angular 21 with standalone components
- PrimeNG components (Rating, Card, Button, etc.)
- primeicons for icons
- RxJS for reactive review updates
- TypeScript with strict typing
- HttpClient for backend API calls
- Angular Forms for review form validation

## Related Components
- Product Catalog (product ratings display)
- Order Tracking (only allow reviews for completed orders)
- User Authentication (identity verification)

## Review Fields
- Rating: 1-5 stars (required)
- Title: Short review headline (optional)
- Text: Full review content (optional, max 1000 chars)
- Author: User name (auto-filled)
- Date: Review timestamp
- Verified Purchase badge
- Helpful votes

## Available Tools & Approaches

### Code Development Tools
- **File Operations**: Create/edit review components with replace_string_in_file and create_file
- **Terminal Commands**: Run Angular CLI for component generation
- **Error Diagnostics**: Use get_errors for form validation issues

### Angular Development
- **Project Exploration**: Use mcp_angular-cli_list_projects for workspace context
- **Pattern Analysis**: Use semantic_search for form implementation patterns
- **Best Practices**: Reference mcp_angular-cli_get_best_practices for reactive forms
- **Form Documentation**: Search mcp_angular-cli_search_documentation for ReactiveFormsModule

### Form Development
- **Reactive Forms**: Build review form with FormBuilder
- **Validation**: Implement custom validators for review text
- **Form Control**: Manage star rating and text input
- **Error Display**: Show validation error messages

### UI Components
- **Star Rating Widget**: Create reusable star rating component
- **Review Cards**: Build review display cards with metadata
- **Author Information**: Display reviewer name and purchase status
- **Action Buttons**: Implement edit/delete functionality

### Data Management
- **Review Service**: Create service for CRUD operations
- **Observable Streams**: Implement RxJS for reactive reviews list
- **Sorting/Filtering**: Add review sorting capabilities
- **Caching**: Implement efficient review data caching

### Validation & Moderation
- **Verified Purchase Check**: Validate purchase history
- **Duplicate Prevention**: Prevent multiple reviews from same user
- **Spam Detection**: Implement basic spam checks
- **Form Validation**: Custom validators for text length

### Accessibility
- **ARIA Labels**: Add accessibility attributes
- **Keyboard Navigation**: Ensure keyboard usability
- **Screen Reader Support**: Implement proper semantic HTML

### Git & Version Control
- **Review Feature Tracking**: Commit review functionality changes
