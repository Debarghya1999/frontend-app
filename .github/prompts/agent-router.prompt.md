---
description: "Dynamic agent router and custom prompt framework for the E-Commerce Boutique application"
keywords: ["agents", "routing", "automation", "custom prompts"]
---

# Dynamic Agent Router & Custom Prompt Framework

## Purpose

This prompt provides a flexible framework for:
1. **Dynamically discovering and running available agents** based on user requests
2. **Routing tasks to the most appropriate agent** in the `.github/agents` directory
3. **Allowing custom prompts** to be combined with agent invocation
4. **Automating complex multi-agent workflows** seamlessly

## How It Works

### 1. Agent Discovery System

The system automatically scans the `.github/agents/` directory for available agents:

```
Available Agents In: .github/agents/
├── admin-dashboard.agent.md
├── authentication.agent.md
├── backend-integration.agent.md
├── deployment-hosting.agent.md
├── order-tracking.agent.md
├── payment-checkout.agent.md
├── product-catalog.agent.md
├── ratings-reviews.agent.md
├── shopping-cart.agent.md
├── ui-responsive-design.agent.md
└── explore.agent.md
```

Each agent has:
- **Front matter** with `name`, `description`, and `tools` available
- **Guidelines** and **Key Responsibilities** in the markdown body
- **Corresponding instructions** in `.github/instructions/` directory

### 2. Agent Routing Logic

When you describe a task, the router:

1. **Analyzes your request** for keywords and intent
2. **Matches against agent descriptions** to find the best fit
3. **Optionally combines multiple agents** for complex tasks
4. **Executes the workflow** with appropriate instructions

### 3. Agent Selection Matrix

| User Request Keywords | Primary Agent | Supporting Agents |
|---|---|---|
| `auth`, `login`, `signup`, `JWT`, `role`, `guard` | Authentication & Authorization | Backend Integration |
| `product`, `catalog`, `filter`, `search`, `grid` | Product Catalog | UI & Responsive Design |
| `cart`, `add to cart`, `quantity`, `checkout ready` | Shopping Cart | Payment & Checkout |
| `review`, `rating`, `feedback` | Ratings & Reviews | Product Catalog |
| `payment`, `razorpay`, `checkout`, `transaction` | Payment & Checkout | Shopping Cart |
| `order`, `tracking`, `delivery`, `status` | Order Tracking & User Orders | Backend Integration |
| `admin`, `inventory`, `dashboard`, `analytics`, `customer` | Admin Dashboard | Backend Integration |
| `API`, `endpoint`, `HTTP`, `interceptor`, `CORS` | Backend Integration & API | Authentication |
| `deploy`, `netlify`, `build`, `production`, `env` | Deployment & Hosting | Backend Integration |
| `style`, `layout`, `responsive`, `design`, `theme`, `animation` | UI & Responsive Design | All agents |
| `explore`, `structure`, `understand`, `find` | Explore | N/A |

## Usage Patterns

### Pattern 1: Simple Agent Invocation
```
"Run the Shopping Cart agent to build the cart UI"
```
**Router Action**: 
- Identifies "Shopping Cart" agent
- Loads `.github/agents/shopping-cart.agent.md`
- Reads `.github/instructions/shopping-cart.instructions.md`
- Invokes agent with your task

### Pattern 2: Keyword-Based Routing
```
"I need to integrate Razorpay for payment processing"
```
**Router Action**:
- Detects keywords: `Razorpay`, `payment`, `integration`
- Routes to: Payment & Checkout agent
- Automatically loads relevant instructions
- Executes with appropriate context

### Pattern 3: Multi-Step Workflow
```
"Build the complete purchase flow: product browsing, cart, and checkout"
```
**Router Action**:
1. Routes to Product Catalog agent → completes task
2. Routes to Shopping Cart agent → completes task
3. Routes to Payment & Checkout agent → completes task
4. Coordinates between agents for seamless integration

### Pattern 4: Custom Prompt + Agent
```
"[Custom instruction: use Tailwind CSS only]
Now build a responsive product grid"
```
**Router Action**:
- Preserves custom instruction context
- Routes to: Product Catalog + UI & Responsive Design agents
- Applies custom CSS framework throughout
- Ensures consistency with custom constraints

### Pattern 5: Guidance without Full Execution
```
"Which agent should I use for implementing dark mode?"
```
**Router Action**:
- Analyzes request
- Recommends: UI & Responsive Design agent
- Provides brief description of agent capabilities
- Offers to run the agent if needed

## Custom Prompt Framework

### Adding Your Own Custom Prompts

You can combine this router with your own custom constraints:

#### Example 1: Technology Stack Constraint
```
[CUSTOM PROMPT]
Use TypeScript strict mode, Angular best practices, and BehaviorSubject for state management.
Avoid deprecated APIs.

[END CUSTOM PROMPT]

"Build the authentication service and login component"
```

#### Example 2: Design System Constraint
```
[CUSTOM PROMPT]
Follow the design system in src/assets/design-system.ts:
- Primary color: #6366f1
- Font family: Inter
- Border radius: 8px
- All buttons use rounded corners with shadow

[END CUSTOM PROMPT]

"Create the product card component"
```

#### Example 3: Performance Constraint
```
[CUSTOM PROMPT]
Optimize for bundle size:
- Use standalone components
- Tree-shake unused code
- Lazy load routes
- Implement OnPush change detection

[END CUSTOM PROMPT]

"Build the product catalog with filtering"
```

### Structure for Custom Prompts

Place custom prompts in this format before your main request:

```
[CUSTOM PROMPT]
<Your custom constraints, standards, or preferences>
[END CUSTOM PROMPT]

Your main task/request here...
```

## Advanced Workflows

### Workflow 1: Complete Feature Development
```
[CUSTOM PROMPT]
- Use Angular 18+ syntax
- Implement comprehensive error handling
- Add loading states for all async operations
[END CUSTOM PROMPT]

"Build the complete order tracking feature, starting with the backend API integration, 
then the order tracking component, and finally the order history in the user dashboard"
```

**Execution Plan**:
1. Backend Integration & API agent → Setup order endpoints
2. Order Tracking & User Orders agent → Build tracking UI
3. Admin Dashboard agent → Add admin order management

### Workflow 2: Performance Optimization Sprint
```
[CUSTOM PROMPT]
Focus on:
- Bundle size reduction
- Initial load time
- Component rendering performance
- API call optimization
[END CUSTOM PROMPT]

"Optimize the product catalog page"
```

**Execution Plan**:
1. Backend Integration → Pagination/filtering at API level
2. Product Catalog → Component optimization
3. UI & Responsive Design → CSS optimization
4. Deployment & Hosting → Build optimization

### Workflow 3: Mobile-First Redesign
```
[CUSTOM PROMPT]
Mobile-first approach:
- Start with mobile layouts
- Progressive enhancement to desktop
- Touch-friendly interactions (44px minimum touch targets)
- Minimize network requests
[END CUSTOM PROMPT]

"Rebuild the shopping cart and checkout flow for mobile"
```

**Execution Plan**:
1. UI & Responsive Design agent → Mobile layouts
2. Shopping Cart agent → Mobile-optimized cart
3. Payment & Checkout agent → Mobile payment flow

## File References

Each agent has associated documentation:

- **Agent Definition**: `.github/agents/{name}.agent.md`
- **Detailed Instructions**: `.github/instructions/{name}.instructions.md`
- **This Router Prompt**: `.github/prompts/agent-router.prompt.md`
- **Agent Overview**: `.github/prompts/run-agents.prompt.md`

## Command Syntax Quick Reference

| Command | Effect |
|---------|--------|
| `"[Agent Name] agent, [task]"` | Directly invoke specific agent |
| `"[keyword]: [task]"` | Router auto-selects agent |
| `"[Custom Prompt] + [task]"` | Apply constraints then route |
| `"Multi-step: 1. [task] 2. [task] 3. [task]"` | Sequential agent execution |
| `"What agent for [task]?"` | Get agent recommendation |
| `"List all agents"` | Show available agents |
| `"Show me agent capabilities"` | Display agent reference |

## Best Practices for Custom Prompts

1. **Be Specific**: Clearly state constraints and expectations
2. **Use Brackets**: `[CUSTOM PROMPT]...[END CUSTOM PROMPT]` for clarity
3. **Keep It Concise**: Avoid lengthy explanations; use bullet points
4. **Order Matters**: Place custom prompts BEFORE the main task
5. **Use Standards**: Reference existing files/patterns in the codebase
6. **Think Multi-Agent**: Consider if task requires multiple agents
7. **Document Intent**: Explain WHY constraints matter (performance, brand, accessibility)

## Integration with Version Control

Custom prompts can be:
- **Committed to git**: Store in `.github/prompts/` for team access
- **Documented in README**: Link custom prompts in project documentation
- **Used in CI/CD**: Reference prompts when generating code in automation
- **Shared with team**: Ensure consistency across developers

## Example Scenarios

### Scenario 1: Onboarding New Feature
```
Developer: "New agent, I need to implement the wishlist feature"

Router Analysis:
- Similar to shopping cart (manage items)
- Display in user profile
- Frontend & backend integration needed

Recommended Approach:
1. Backend Integration: Create wishlist API endpoints
2. Product Catalog: Add wishlist button to products
3. Admin Dashboard: Add wishlist management view
4. UI & Responsive Design: Ensure responsive wishlist page
```

### Scenario 2: Performance Issues
```
Developer: "[Custom: Reduce bundle size by 30%, optimize API calls, 
use viewChild onInit for DOM access]
The app is too slow, help optimize everything"

Router Analysis:
- Multi-component optimization needed
- Deployment considerations
- Component-level performance

Execution:
1. Deployment & Hosting: Analyze build size
2. Backend Integration: Optimize API structure
3. Product Catalog: Component optimization
4. UI & Responsive Design: CSS/animation optimization
5. Report results with metrics
```

### Scenario 3: Compliance Changes
```
Developer: "[Custom: Must verify accessibility compliance (WCAG 2.1 AA), 
add mobile keyboard navigation, ensure screen reader support]
Update all user-facing components for accessibility"

Router Analysis:
- UI & Responsive Design: Primary focus
- All other agents: Secondary review

Execution:
1. UI & Responsive Design: Accessibility audit
2. Each agent: Component-level accessibility review
3. Verification: WCAG compliance check
```

## Troubleshooting

| Issue | Solution |
|---|---|
| "Wrong agent selected" | Try being more specific or use exact agent name |
| "Custom prompt ignored" | Ensure `[CUSTOM PROMPT]...[END CUSTOM PROMPT]` format |
| "Need multiple agents" | Use multi-step workflow format in request |
| "Agent not found" | Check agent name in `.github/agents/` directory |
| "Context lost between agents" | Include custom prompt in each request |

## Integration with .prompt Files in VS Code

To use this in VS Code's prompt system:

1. **Single Custom Prompt**: Reference this file directly in settings
2. **Multiple Prompts**: Chain prompts using the `[CUSTOM PROMPT]` format
3. **Per-File Prompts**: Apply different prompts to different project areas

### VS Code Example
```json
{
  "copilot.prompts": {
    "ecommerce": ".github/prompts/agent-router.prompt.md",
    "features": ".github/prompts/run-agents.prompt.md"
  }
}
```

## Next Steps

1. Load this prompt into your VS Code prompt system
2. Reference both `.github/prompts/run-agents.prompt.md` and this file
3. Create project-specific custom prompts in `.github/prompts/`
4. Document custom constraints in the codebase
5. Share prompt templates with your team

---

**Ready to Start**: 
- Ask any task and let the router select the best agent
- Add custom constraints for consistency
- Combine agents for complex features
- Reference this guide anytime you need assistance

