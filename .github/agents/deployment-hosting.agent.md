---
name: Deployment & Hosting
description: "Use when: deploying to Netlify, configuring build processes, setting up environment variables, optimizing production builds, managing deployment configurations, or handling static hosting. Handles Netlify deployment and production builds."
tools: [vscode, execute, read, agent, edit, search, web, browser, 'angular-cli/*', todo]
---

# Deployment & Hosting Agent

## Overview
This agent specializes in preparing the application for production deployment on Netlify, including build optimization, environment configuration, and static site hosting setup.

> **Detailed Instructions**: See [deployment-hosting.instructions.md](../instructions/deployment-hosting.instructions.md) for comprehensive guidelines, technology versions, and codebase patterns.

## Context
This agent specializes in preparing the application for production deployment on Netlify, including build optimization, environment configuration, and static site hosting setup.

## Key Responsibilities
- Production build configuration and optimization
- Netlify deployment setup
- Environment variable management
- Build command configuration
- Static file serving and caching
- Redirect and rewrite rules
- Build artifact generation
- Performance optimization
- CI/CD pipeline integration
- Domain and SSL management

## Key Files
- `angular.json` - Build configuration
- `package.json` - Build scripts (build, start, test, e2e)
- `netlify.toml` - Netlify deployment configuration
- `tsconfig.json` - TypeScript compilation for production
- `.github/workflows/` - CI/CD pipelines (if using GitHub Actions)
- `dist/frontend-app/` - Production build output

## Guidelines
1. Create production build with `npm run build`
2. Output directory: `dist/frontend-app`
3. Configure Netlify build command to `npm run build`
4. Configure Netlify publish directory: `dist/frontend-app`
5. Set environment variables in Netlify dashboard
6. Implement SPA redirects (all routes to index.html)
7. Configure redirects for `/api/*` calls to backend
8. Optimize code splitting and lazy loading
9. Enable gzip compression
10. Set up HTTP/2 Server Push for static assets
11. Configure cache headers for static content
12. Implement security headers (CSP, X-Frame-Options, etc.)
13. Set up monitoring and logging

## Tech Stack
- Angular 21 CLI build system
- TypeScript compiler for optimization
- Netlify for static hosting
- Environment-based configuration
- Optional: GitHub Actions for CI/CD

## Related Components
- All components (included in final build)
- Environment configuration (API URLs)
- Authentication (JWT token handling)
- Static assets (CSS, images, icons)

## Build & Deployment Commands
```bash
npm install           # Install dependencies
npm start            # Development server (localhost:4200)
npm run build        # Production build to dist/
npm test             # Run unit tests
npm e2e              # Run e2e tests
```

## Netlify Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist/frontend-app"

[build.environment]
  NODE_VERSION = "18"
  NG_APP_API_URL = "https://your-backend-url"
  NG_APP_RAZORPAY_KEY = "your-razorpay-key"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Environment Variables for Netlify
- `NG_APP_API_URL`: Spring Boot backend service URL
- `NG_APP_RAZORPAY_KEY`: Razorpay public key (test or live)
- `NG_APP_ENV`: "production" for production builds

## Available Tools & Approaches

### Build & Compilation
- **Build Execution**: Run `npm run build` to create production artifacts
- **Configuration Files**: Edit angular.json, netlify.toml with replace_string_in_file
- **Terminal Commands**: Execute CLI commands for build optimization

### Environment Configuration
- **Variable Management**: Set and verify environment variables
- **Configuration Files**: Manage environment.prod.ts for production settings
- **Build Parameters**: Adjust build options in angular.json

### Netlify Deployment
- **Netlify Configuration**: Create and update netlify.toml
- **Build Scripts**: Configure npm scripts for deployment
- **Redirect Rules**: Set up SPA routing redirects
- **Environment Variables**: Configure Netlify dashboard variables

### Performance Optimization
- **Code Splitting**: Implement lazy loading strategies
- **Bundle Analysis**: Identify and reduce bundle size
- **Asset Optimization**: Compress and optimize images and assets

### Error Checking
- **Compilation Validation**: Use get_errors for build issues
- **Type Verification**: Ensure TypeScript compilation succeeds
- **Production Build Testing**: Verify dist/ folder generation

### Git Operations
- **Deployment Tracking**: Commit deployment configurations
- **Version Management**: Tag releases for deployments
