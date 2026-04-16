export type CartRefreshSyncDetail = {
  registerPendingUpdate: (promise: Promise<unknown>) => void;
};

export const createCartRefreshSyncEvent = (eventName: string) => {
  const pendingUpdates: Promise<unknown>[] = [];

  return {
    event: new CustomEvent<CartRefreshSyncDetail>(eventName, {
      detail: {
        registerPendingUpdate: (promise: Promise<unknown>) => {
          pendingUpdates.push(promise);
        },
      },
    }),
    waitForPendingUpdates: async () => {
      await Promise.allSettled(pendingUpdates);
    },
  };
};

export const registerCartRefresh = (
  event: Event,
  refreshPromise: Promise<unknown>,
) => {
  const customEvent = event as CustomEvent<CartRefreshSyncDetail | undefined>;

  customEvent.detail?.registerPendingUpdate(refreshPromise);
};

export const waitForNextPaint = async () => {
  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
};
