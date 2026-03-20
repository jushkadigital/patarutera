import { HttpTypes } from "@medusajs/types";

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const formatSolesAmount = (amount?: number | null) => {
    if (amount === null || amount === undefined) {
      return "S./ 0.00";
    }

    return `S./ ${new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  return (
    <div>
      <h2 className="text-base-semi">Resumen del pedido</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>Total</span>
          <span>{formatSolesAmount(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
