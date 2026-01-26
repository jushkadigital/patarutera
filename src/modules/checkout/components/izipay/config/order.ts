export const getOrder = ({ orderNumber, currency, amount, payMethod, processType, merchantBuyerId, dateTimeTransaction }) => ({
  orderNumber,
  currency,
  amount,
  payMethod,
  processType,
  merchantBuyerId,
  dateTimeTransaction,
});
