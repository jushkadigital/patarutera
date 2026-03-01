## Plan Generated: copy-tours-functionality-to-paquetes

**Key Decisions**:

- **Refactor `CardPaquete.tsx`**: Standardize to match `CardTour` logic, using helper functions and fallback constants.
- **Update `PaquetesComponent.tsx`**: Align with `ToursComponent` logic, including price comparison for filtering.
- **Update Schema**: Add `PaqueteSchema` to `src/components/Schema/index.tsx`.
- **Verify Hero**: Confirm `renderPaqueteHero` works as expected.

**Scope**:

- **IN**: `src/components/cardPaquete.tsx`, `src/components/PaquetesComponent.tsx`, `src/components/Schema/index.tsx`, `src/app/[countryCode]/(marketing)/paquetes/`.
- **OUT**: `src/app/[countryCode]/(marketing)/tours/` (except for reference).

**Guardrails**:

- Ensure `medusaId` is correctly mapped from `package.id` or similar field if available (currently `medusaId` is in `CardPaqueteData`).
- Maintain `grid` vs `list` mode consistency.

**Auto-Resolved**:

- `GridPaquetes` uses Meilisearch, so `CardPaquete` will receive data from it. Ensure `CardPaquete` handles potential missing fields gracefully with fallbacks.

Plan saved to: `.sisyphus/plans/copy-tours-functionality-to-paquetes.md`
