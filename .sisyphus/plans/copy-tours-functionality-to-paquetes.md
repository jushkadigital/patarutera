# Plan: Copy Tours Functionality to Paquetes

## Goal

Replicate the functionality and structure of `tours/` in `paquetes/`, specifically ensuring `CardPaquete` matches `CardTour` logic, `PaquetesComponent` matches `ToursComponent` logic, and integrating with Medusa products correctly using `package.id`.

## Context

The `tours` section has a robust implementation with `CardTour` handling various fallbacks, price display logic (Medusa vs Payload), and responsive modes. `CardPaquete` is currently a rough copy and needs to be standardized. The `PaquetesComponent` also lacks some logic present in `ToursComponent`.

## Tasks

### 1. Refactor `CardPaquete.tsx`

- **Goal**: Standardize `CardPaquete` to match `CardTour` structure and logic.
- **Files**: `src/components/cardPaquete.tsx`
// Refactor CardPaquete.tsx - Completed
- [x] Implement helper functions similar to `CardTour`.
- [x] Define `STATIC_FALLBACK` constants.
- [x] Refactor component JSX.

// Update PaquetesComponent.tsx - Completed
- [x] Implement `getComparablePrice` helper in `PaquetesComponent.tsx`.
- [x] Update filtering logic.
- [x] Match container classes.
- [x] Verify `mode` prop.
### 3. Verify Product List Integration

- **Goal**: Ensure `paquetes` pages fetch Medusa products correctly using `package.id` (mapped to `medusaId`).
- **Files**: `src/app/[countryCode]/(marketing)/paquetes/page.tsx`, `src/app/[countryCode]/(marketing)/paquetes/[slug]/page.tsx`
- **Steps**:
  - Review `GridPaquetes` (already refactored in previous step, but verify integration).
  - Ensure `listProducts` or `listProductsWithSort` is used correctly if needed for pricing on the listing page (note: `GridPaquetes` now uses Meilisearch, so ensure Meilisearch index has `medusa_id` and pricing if needed, or if it fetches fresh prices). _Correction_: `GridPaquetes` using Meilisearch might need to client-side fetch prices or rely on indexed prices. `CardTour` handles `priceMedusa` passed from parent.
  // Verify Product List Integration - Completed
- [x] Verify `paquetes` pages fetch Medusa products correctly.
- [x] `GridPaquetes` updated to fetch real-time prices.
- [x] `paquetes/page.tsx` and `paquetes/[slug]/page.tsx` updated.
// Verify Hero Rendering - Completed
- [x] Ensure `renderPaqueteHero` works as expected.
  - [x] Confirm it correctly maps to `TourHero` (or `PaqueteHero`).
- [x] `src/blocks/renderPaqueteHero.tsx` updated to use proper types.
## Technical Details

### CardPaquete Data Interface

Ensure `CardPaqueteData` interface in `src/components/cardPaquete.tsx` aligns with `CardTourData` in `src/components/CardTour.tsx`, specifically:

```typescript
export interface CardPaqueteData {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  miniDescription?: Paquete["miniDescription"] | null;
  descriptionText?: string | null;
  featuredImage?: Paquete["featuredImage"] | null;
  meiliImage?: string | null;
  destinationName?: string | null;
  destinos?: Paquete["destinos"] | null;
  Desde?: string | null;
  price?: number | null;
  "Person desc"?: string | null;
  iconMaxPassengers?: Paquete["iconMaxPassengers"] | null;
  maxPassengers?: number | null;
  iconDifficulty?: Paquete["iconDifficulty"] | null;
  difficulty?: Paquete["difficulty"] | null;
  medusaId?: string | null;
  priceMedusa?: {
    amount: number;
    currency: string;
  } | null;
}
```

### Fallback Constants

```typescript
const STATIC_FALLBACK = {
  image: "/backgroundDestinoPage.png",
  difficultyIcon: "/difficultyData.svg",
  passengersIcon: "/groupSizeData.svg",
  from: "Desde",
  destination: "Destino",
  personDesc: "Por persona",
  maxPassengers: 18,
  difficulty: "easy" as const,
  price: 299,
  description: "Vive una experiencia unica con Patarutera.",
};
```
