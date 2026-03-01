# Learnings: Copy Tours to Paquetes
- When refactoring components to match another, it's crucial to copy not just the logic but also the structure and even idiosyncrasies (like the `mode` prop logic difference in `ToursComponent`).
- Using `write` to overwrite the file can be cleaner than multiple `edit` calls when the file structure gets messy or when multiple appends/deletes are needed at the end of the file.
- Always verify line numbers carefully when using `edit`.

## Patterns (Medusa Fetching)
- **Grid Components Data Fetching**: `GridPaquetes` and `GridTours` use Meilisearch for search/filtering but rely on Medusa for real-time pricing.
- **Passing Props via RenderBlocks**: `RenderBlocks` is a central dispatcher for CMS blocks. Adding props like `countryCode` requires threading it through `RenderBlocks` and updating the block components.
- **Next.js Server Components Params**: Dynamic route params (like `countryCode`) are available in `page.tsx` props but not automatically in nested server components unless passed explicitly.

## Gotchas
- **Medusa Types**: `HttpTypes.StoreProduct` properties like `calculated_price` can be nullable, requiring safe access and defaults.
- **Component Prop Interfaces**: When updating block components, ensure the `Props` interface extends the CMS block type but also includes any new runtime props (like `countryCode`).
- **Duplicate Keys in Object Literal**: Be careful with `Edit` tool when replacing lines to avoid duplicating object keys.


## Learnings from renderPaqueteHero.tsx verification
- `TourHero` component is reused for `Paquete` hero sections.
- `PaqueteHerocar` and `TourHerocarB` are structurally identical except for `blockType` literal.
- To reuse components across different Payload collections (Tours vs Paquetes) that have identical fields but different `blockType` names, we need to use union types in props (e.g. `TourHerocarB | PaqueteHerocar`) or make the component generic.
- `renderPaqueteHero.tsx` was initially using `Tour` types, which was incorrect but likely copy-pasted. It is now fixed to use `Paquete` types.