import { deleteLineItem, deleteMultipleLineItem } from "@lib/data/cart";
import { Spinner, Trash } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLineItem(id);
      startTransition(() => {
        router.refresh();
      });
      window.dispatchEvent(new CustomEvent("cart:item-removed"));
    } catch (_err) {
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
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      await deleteMultipleLineItem(ids);
      startTransition(() => {
        router.refresh();
      });
      window.dispatchEvent(new CustomEvent("cart:item-removed"));
    } catch (_err) {
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
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(ids)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  );
};

export default DeleteButton;
