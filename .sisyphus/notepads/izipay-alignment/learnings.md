- IzipayWrapper created and context exposed. The LoadForm method and setupEventHandlers were left out to be invoked by the downstream container component since they depend on the DOM container and the handleSubmit action which are not available in the wrapper level.
- Restored the Review component in checkout-form template, which was previously removed. The Review component displays the order summary below the Payment block.

## ESLint Unused Variables Fix (2026-03-01)

Fixed ESLint errors in checkout payment and checkout-form components:

### `src/modules/checkout/components/payment/index.tsx`
- Removed `RadioGroupOption` from `@headlessui/react` import (only `RadioGroup` needed)
- Removed `isStripeLike` import from `@lib/constants` (unused)
- Removed `Radio` import from `@modules/common/components/radio` (unused)
- Removed `Spinner` import from `@modules/common/icons/spinner` (unused)

### `src/modules/checkout/templates/checkout-form/index.tsx`
- Removed `listCartShippingMethods` import from `@lib/data/fulfillment` (unused)
- Removed `Addresses` import from `@modules/checkout/components/addresses` (unused)
- Removed `Shipping` import from `@modules/checkout/components/shipping` (unused)
- Removed `customer` parameter entirely from function signature and type (unused)

**Key lesson**: When removing unused parameters from React/TypeScript functions, remove them from BOTH the destructured parameters AND the type definition to avoid syntax errors.
- `PaymentWrapper` acts as a generic wrapper for payment components. Added `isIzipay` logic alongside `isStripeLike` by checking `paymentSession?.provider_id`.


## Izipay Payment Button Component
- Created `IzipayPaymentButton` component which consumes `IzipayContext`.
- Used `useRef` to track `isFormLoaded` to prevent multiple `LoadForm` calls, which can break the Izipay SDK integration.
- Implemented `LoadForm` with `authorization: sessionToken` and `keyRSA: "RSA"` as required.
- Handled `SUCCESS` callback by calling `placeOrder()` from `@lib/data/cart`.
- Handled failure cases by setting local `errorMessage`.
- Added UI states for loading (Spinner) and error messages.
- Updated PaymentButton switch statement to route to IzipayPaymentButton when provider_id matches isIzipay. The isIzipay function is imported from @lib/constants.
