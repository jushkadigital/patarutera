type DebouncedCallback<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
};

export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void | Promise<void>,
  wait: number,
): DebouncedCallback<TArgs> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      void callback(...args);
    }, wait);
  }) as DebouncedCallback<TArgs>;

  debounced.cancel = () => {
    if (!timeoutId) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}
