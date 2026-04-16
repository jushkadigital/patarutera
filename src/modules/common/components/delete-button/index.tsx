"use client";

import { deleteLineItem, deleteMultipleLineItem } from "@lib/data/cart";
import { createCartRefreshSyncEvent } from "@lib/util/cart-sync";
import { Spinner, Trash } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import { useState } from "react";

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLineItem(id);
      const { event, waitForPendingUpdates } =
        createCartRefreshSyncEvent("cart:item-removed");

      window.dispatchEvent(event);
      await waitForPendingUpdates();
    } catch (error) {
      console.error("Failed to remove cart item", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className,
      )}
    >
      <button
        type="button"
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        {children ? <span>{children}</span> : null}
      </button>
    </div>
  );
};

export const CustomDeleteButton = ({
  ids,
  children,
  className,
}: {
  ids: string[];
  children?: React.ReactNode;
  className?: string;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      await deleteMultipleLineItem(ids);
      const { event, waitForPendingUpdates } =
        createCartRefreshSyncEvent("cart:item-removed");

      window.dispatchEvent(event);
      await waitForPendingUpdates();
    } catch (error) {
      console.error("Failed to remove grouped cart items", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className,
      )}
    >
      <button
        type="button"
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(ids)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        {children ? <span>{children}</span> : null}
      </button>
    </div>
  );
};

export default DeleteButton;
