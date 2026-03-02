# Izipay Medusa Storefront Alignment Plan

## Context
The custom Izipay integration currently initializes and completes the payment directly inside the "Payment" step during checkout. This bypasses the standard Medusa storefront architecture (which uses a "Review" step to finalize the order). 
The goal is to align Izipay with the standard wrapper pattern (used by Stripe) and restore the "Select Payment -> Review -> Pay" flow, while maintaining Izipay's native "Pagar" button within its embedded iframe.

## Core Architectural Changes
- **Payment Step**: Becomes a lightweight selection step (calling `initiatePaymentSession`), matching other providers. The Izipay embedded form is removed from here.
- **Payment Wrapper**: `IzipayWrapper` handles global SDK loading and provides `IzipayContext`.
- **Review Step**: Restored to the checkout form. `PaymentButton` renders `IzipayPaymentButton`, which houses the Izipay iframe and its native button. Upon success, it triggers `placeOrder()`.

---

## Task Dependency Graph

| Task | Description | Dependency |
|------|-------------|------------|
| 1 | Refactor `Payment` selection & clean up old container | None |
| 2 | Create `IzipayWrapper` & `IzipayContext` | None |
| 3 | Update `PaymentWrapper` to conditionally render `IzipayWrapper` | Task 2 |
| 4 | Restore `Review` step to `CheckoutForm` | None |
| 5 | Create `IzipayPaymentButton` component | Task 2, 4 |
| 6 | Update `PaymentButton` index to route to Izipay button | Task 5 |

---

## Parallel Execution Graph

**Wave 1: Cleanup & Foundation**
├── Task 1: Refactor Payment selection component
├── Task 2: Create IzipayWrapper and Context
└── Task 4: Restore Review step

**Wave 2: Integration & Wiring**
├── Task 3: Update global PaymentWrapper
└── Task 5: Create IzipayPaymentButton

**Wave 3: Final Execution Hook**
└── Task 6: Update PaymentButton index

---

## Task Details

- [x] Task 1: Refactor Payment Selection & Cleanup
**Description**: 
1. In `src/modules/checkout/components/payment/index.tsx`, find the `isIzipay(paymentMethod.id)` conditional. 
2. Remove the inline rendering of `<IzipayContainer>` inside the active radio button. Instead, when Izipay is selected, it should just behave like standard providers (render `<PaymentContainer>` or just the radio group option without the embedded iframe). The generic `handleSubmit` already calls `initiatePaymentSession` correctly.
3. **Delete** `src/modules/checkout/components/payment-container/izipay-container.tsx`. Its logic is being moved.

**Acceptance Criteria**:
- [ ] Selecting Izipay in the UI no longer displays an iframe or spinner.
- [ ] Clicking "Continue to review" successfully proceeds to the next step.

- [x] Task 2: Create IzipayWrapper and Context
**Description**: 
1. Create `src/modules/checkout/components/payment-wrapper/izipay-wrapper.tsx`.
2. Extract the `useIzipaySDK` hook and the session initialization logic (`createIzipayPayment` with `transactionId`) from the old container into this wrapper.
3. This wrapper should wrap `{children}` and provide an `IzipayContext`. The context must expose: `isLoaded`, `isInitialized`, `checkout` (the Izipay class instance), and the generated `sessionToken`.
*Note*: `isIzipay` is already defined in `src/lib/constants.tsx`.

**Acceptance Criteria**:
- [x] `izipay-wrapper.tsx` correctly creates `IzipayContext`.
- [x] SDK loads globally without breaking other checkout steps.

- [x] Task 3: Update Global PaymentWrapper
**Description**: 
Modify `src/modules/checkout/components/payment-wrapper/index.tsx` to conditionally wrap children with `IzipayWrapper`.
- Check if `isIzipay(paymentSession?.provider_id)`.
- If true, return `<IzipayWrapper cart={cart} paymentSession={paymentSession}>{children}</IzipayWrapper>`.

**Acceptance Criteria**:
- [ ] When Izipay is the active payment session, the React tree is wrapped by `IzipayWrapper`.

- [x] Task 4: Restore Review Step
**Description**: 
In `src/modules/checkout/templates/checkout-form/index.tsx`, the user previously deleted the `<Review />` component. 
- Restore `<Review cart={cart} />` below the `<Payment />` block. Ensure the layout remains coherent.

**Acceptance Criteria**:
- [ ] The Review step is visible in the UI after completing the Payment step.

- [x] Task 5: Create IzipayPaymentButton
**Description**: 
1. Create `src/modules/checkout/components/payment-button/izipay-payment-button.tsx`.
2. This component should consume `IzipayContext`.
3. If not ready, render a loading state (e.g. `Spinner`).
4. If ready, render `<div id="izipay-checkout-container" />` and call `checkout.LoadForm({...})` exactly as it was done in the old container. 
5. Important: In the `callbackResponse`, handle `status === "SUCCESS"` by calling Medusa's `placeOrder()` function (imported from `@lib/data/cart`). This correctly completes the order.

**Acceptance Criteria**:
- [ ] The component correctly renders the Izipay iframe.
- [ ] Clicking the native "Pagar" button processes the payment and calls `placeOrder()`.

- [x] Task 6: Update PaymentButton Index
**Description**: 
Modify `src/modules/checkout/components/payment-button/index.tsx`.
- Add a new `case isIzipay(paymentSession?.provider_id):` in the switch statement.
- Return `<IzipayPaymentButton cart={cart} data-testid={dataTestId} />`.

**Acceptance Criteria**:
- [ ] In the Review step, standard methods still show "Place order" button, but Izipay correctly shows the Izipay embedded form instead.

---

## Final Verification Wave
- [x] Verify no TypeScript or ESLint errors (`pnpm lint`).
- [x] Verify standard Medusa UI is structurally identical (Stripe/Manual paths still function perfectly).
- [x] Verify Izipay iframe correctly consumes `min-h-[300px]` in the Review step without breaking layout.
