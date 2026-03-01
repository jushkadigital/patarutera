# AGENTS.md

This document provides essential information for agentic coding agents working on the Patarutera project.

## Project Overview

Patarutera is an ecommerce storefront built on Next.js that uses a microservices architecture:

- **CMS Microservice**: Payload CMS for managing content (paquetes, destinos, tours, etc.)
- **Ecommerce Microservice**: Medusa.js for product catalog, cart, orders, checkout
- **Frontend**: Next.js storefront forked from official Medusa storefront with custom features

The architecture synchronizes user authentication between NextAuth (frontend) and Medusa (backend).

## Build, Lint, and Test Commands

### Development

- **Dev Server**: `pnpm dev` (Next.js dev with Turbopack on port 4000)
- **Build**: `pnpm build` (Production build)
- **Start**: `pnpm start` (Production server)
- **Lint**: `pnpm lint` (ESLint check)

### Testing

- **Run All Tests**: `pnpm vitest`
- **Test Files**: Look for `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files
- **Test Setup**: Vitest configured in `vitest.config.ts`

### Documentation

- No Storybook setup in this repository.

## Directory Structure

```
src/
├── app/              # Next.js app directory (routes, layouts)
├── components/       # UI components (shadcn/ui, Radix UI, custom components)
├── modules/          # Feature-based modules (cart, checkout, products, etc.)
├── hooks/            # Custom React hooks (useMobile, auth sync, etc.)
├── lib/              # Shared utilities and configs
├── lib2/             # Additional utilities (auth, config, utils, SDK)
├── types/            # TypeScript type definitions
├── stories/          # Storybook stories and documentation
└── middleware.ts     # Next.js middleware for auth/sync logic
```

## Code Style Guidelines

### Imports and Formatting

**Path Aliases**: Use these aliases in imports:

- `@/*` → `./src/*`
- `@lib/*` → `./src/lib/*`
- `@modules/*` → `./src/modules/*`
- `@blocks/*` → `./src/blocks/*`

**Import Order**: Relative imports first, then alias imports, then library imports

### TypeScript

- **Compiler**: TypeScript with strict mode enabled (noImplicitAny: false, but other strict checks active)
- **TypeScript Config**: Located in `tsconfig.json`
- **Type Generation**: Use `payload generate:types` for CMS type generation (file: `src/cms-types.ts`)
- **Naming**: Interfaces and types use PascalCase, functions use camelCase

**Type Safety**:

- Enforce `noUnusedLocals` and `noUnusedParameters` in production
- Use specific types instead of `any` where possible (warn-only rule)
- Ignore unused variables prefixed with `_` (e.g., `const _ = ...`)

### React Components

**Client Components**: All interactive components must have `"use client"` directive at the top

- Mark component files with `.tsx` extension
- Default export function components
- Use named exports for sub-components if needed

**Component Structure**:

- Keep components focused and small
- Extract complex logic into custom hooks or utilities
- Use functional components with TypeScript interfaces
- Props interfaces should be named `ComponentNameProps`

**UI Components**:

- Prioritize **shadcn/ui** and **Medusa UI** for UI building
- Use Radix UI primitives (@radix-ui/\* packages)
- Create custom components only when no suitable pre-built component exists

**Responsive Design**:

- Always use the `useMobile` hook from `@/hooks/useMobile` for responsive logic
- Use Tailwind CSS with clamped values: `text-[clamp(0px,2.8vw,15.36px)]`
- Handle different breakpoints with SM, MD, LG prefixes

### Naming Conventions

**Files**: Use kebab-case (e.g., `card-paquete.tsx`, `use-mobile.tsx`)
**Components**: Use PascalCase (e.g., `CardPaquete`, `useMobile`)
**Types**: Use PascalCase (e.g., `User`, `CardPaqueteData`)
**Variables/Functions**: Use camelCase (e.g., `getUserById`, `isLoggedIn`)
**Constants**: Use UPPER_SNAKE_CASE (e.g., `MEDUSA_BACKEND_URL`, `DEFAULT_BREAKPOINT`)

### Styling

**CSS Framework**: Tailwind CSS v4 with PostCSS
**Utility Functions**: Use `cn()` from `@/lib2/utils` to merge Tailwind classes
**Animations**: Use `motion` library for animations (version 12.10.0)
**Image Handling**: Use custom `PayloadImage` component for images

### Error Handling

**Authentication**: Use NextAuth v5.0.0-beta.30 with Medusa backend sync

- Middleware handles user sync between NextAuth and Medusa
- Check `req.auth` in middleware for authentication state
- Use `@/lib2/auth` for authentication utilities

**TypeScript Errors**: Use ESLint for catching type errors

- ESLint config extends `next/core-web-vitals`
- Run `pnpm lint` before committing
- ESLint rule: `@typescript-eslint/no-explicit-any` is set to warn (not error)

**Async/Await**: Always handle promises appropriately

- Use `try/catch` for error boundaries
- Provide fallback values for optional data

## Cursor Rules (External Rules)

The project has Cursor rules in `.cursor/rules/` directory:

1. **enforce-english.mdc**: All code, comments, and documentation must be in English
2. **use-mobile-hook-for-responsive-clients.mdc**: Use `useMobile` hook for responsive logic in client components
3. **use-shadcdn-acertenity-libraries.mdc**: Prioritize shadcn/ui and Medusa UI for UI components
4. **context7.mdc**: Use Context7 tool first for library/framework documentation searches
5. **cursor-rules.mdc**: Guidelines for adding/editing Cursor rules
6. **index.mdc**: Master index of all Cursor rules

## Development Workflow

### Adding New Features

1. Create feature in `src/modules/` following feature-based organization
2. Build components in `src/components/` using shadcn/ui/Medusa UI
3. Create TypeScript types in `src/types/` or inline in component files
4. Add or update Vitest tests when behavior changes
5. Update middleware if authentication/session logic is needed
6. Run `pnpm lint` to check for issues
7. Run tests: `pnpm vitest`

### Module Examples

**Checkout Module** (`src/modules/checkout/`):

- Components: payment-container, shipping-address, discount-code, submit-button, addresses
- Templates: checkout-form, checkout-summary
- Integrates Medusa checkout flow with Stripe and iZiPayout payments
- Features: address management, discount codes, payment processing, order review

**Checkout Components**:

- `payment-container`: Wrapper for payment methods with Stripe/iZiPayout support
- `shipping-address`: Form for collecting shipping address information
- `discount-code`: Component for applying and removing promo codes
- `submit-button`: React form status button with loading states
- `payment-wrapper`: Handles Stripe context and payment method selection
- `addresses`: Manages address list for billing/shipping

**Checkout Templates**:

- `checkout-form`: Main checkout form container
- `checkout-summary`: Order summary with totals and cart items

**Payment Providers**:

- Stripe: Credit card payments via Stripe.js
- iZiPayout: Alternative payment gateway (configured with multiple config files)

### Working with CMS

- CMS types are auto-generated in `src/cms-types.ts`
- Use `payload generate:types` command to regenerate types
- Access content via SDK configuration in `src/lib/config.ts`
- Use Medusa SDK for data fetching in modules
- CMS manages paquetes, destinos, tours, and other content
- Medusa.js manages products, cart, orders, and checkout flow

### API Routes

- API routes are in `src/app/api/`
- Use Next.js App Router conventions
- Handle authentication middleware in `src/middleware.ts`

### Middleware Auth Sync

The middleware synchronizes user authentication between NextAuth and Medusa:

- User sessions are synced from NextAuth to Medusa backend
- If user is logged into NextAuth but not Medusa, middleware redirects to `/api/auth/medusa-sync`
- Prevents infinite loops on sync routes and static files
- Debug logging enabled to track sync status (disable in production)

### Environment Variables

Required env vars (see `.env.example`):

- `MEDUSA_BACKEND_URL`: Medusa API endpoint
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: Medusa publishable key
- NextAuth configuration (see `src/lib2/auth.ts`)

### Working with Microservices

**CMS Integration**:

- CMS manages content (paquetes, destinos, tours)
- Content types are defined in Payload CMS configuration
- Data is synced with Medusa for product pricing and availability

**Medusa Integration**:

- Manages products, cart, orders, checkout flow
- Uses Medusa SDK (`@medusajs/js-sdk`) for API calls
- Cart, orders, and checkout functionality powered by Medusa backend
- Product catalog synchronization with CMS content

## Common Patterns

### Creating a New Component

```typescript
"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib2/utils"

interface ComponentNameProps {
  // Props definition
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // Component implementation
  return <div>...</div>
}
```

### Using Custom Hook

```typescript
import { useMobile } from "@/hooks/useMobile";

export default function MyComponent() {
  const isMobile = useMobile({ breakpoint: 768 });

  if (isMobile) {
    // Mobile-specific logic
  }
}
```

### Styling with Tailwind

```typescript
<div className={cn(
  "base-classes",
  isMobile && "mobile-classes",
  isActive && "active-classes"
)}>
```

## Testing

- Use Vitest for unit/integration tests
- Keep tests near the modules/components they validate
- Run tests with `pnpm vitest`

## Important Notes

- Always add `"use client"` directive for interactive components
- Use English for all code, comments, and documentation
- Prioritize shadcn/ui and Medusa UI components over custom builds
- Use `useMobile` hook for responsive logic in client components
- Run `pnpm lint` before committing changes
- Follow TypeScript strict mode guidelines
- Use path aliases (`@/*`, `@lib/*`, etc.) for imports
- Integrate CMS content with Medusa product catalog
- Handle authentication sync between NextAuth and Medusa backend
- Use feature-based module organization in `src/modules/`
