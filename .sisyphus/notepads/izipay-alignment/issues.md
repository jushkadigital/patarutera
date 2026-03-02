
## Izipay Selector Bug

**Issue**: 'selector no existe' bug during Izipay SDK initialization.
**Root Cause**: The `new Izipay({ config })` instantiation was happening in the `IzipayWrapper` component *before* the `#izipay-checkout-container` DOM element (rendered by `IzipayPaymentButton`) was available in the DOM, causing the SDK to fail to find the container.
**Solution**: Moved the `new Izipay()` instantiation into the `useEffect` of `IzipayPaymentButton` which renders the container. The wrapper now only prepares and provides the `izipayConfig`.


## Izipay Form Render Issue

- **Issue**: Izipay form doesn't render even after moving `new Izipay(...)` inside `izipay-payment-button.tsx`.
- **Cause**: React hydration/timing bug where `useEffect` runs before the `div#izipay-checkout-container` is fully painted by the browser, causing the SDK to silently fail or not mount properly.
- **Resolution**: Added a 100ms `setTimeout` before instantiating `Izipay` and calling `checkout.LoadForm(...)` to guarantee the DOM is painted. Ensured `isFormLoadedRef` correctly guards against double initialization during the timeout.
\n- **IziPay Mounting Issue**: Discovered that an early return `if (cart && (!cart.billing_address || !cart.email)) return null;` in `izipay-payment-button.tsx` was preventing the  from mounting when the user skipped checkout steps. This caused the Izipay form SDK to fail as it couldn't find the target container. Removing this block allows the container to mount and correctly display the form or loading states.
- Added extensive debug console logs to izipay-wrapper.tsx to trace initializePayment and createSession execution paths.
