# Decisions made for copy-tours-functionality-to-paquetes

## Price Prioritization

- Decided to prioritize Medusa `priceMedusa` over static/CMS `price` in `CardPaquete` component because Medusa has real-time inventory and pricing logic (taxes, region based).
- This aligns with the business requirement to use Medusa as the source of truth for product pricing.

## Country Code Handling

- Defaulted `countryCode` to "pe" if not provided, assuming Peru as primary market for these packages, while still supporting dynamic route params.
- This ensures the app doesn't break if `countryCode` is missing in some context (though it should always be there in localized routes).

## RenderBlocks Update

- Updated `RenderBlocks` to propagate `countryCode` context down to blocks, enabling `GridPaquetes` to fetch region-specific prices.
- This is a pattern used for other context variables like `medusaId` (which was confusingly named `medusaId` but held the product object).
