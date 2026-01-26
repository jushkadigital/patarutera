import { placeOrder } from "@lib/data/cart"
/**
 * @fileoverview Core configuration module for izipay SDK integration
 */


export const setupEventHandlers = (checkout: any, { handle }) => {
  checkout.onReady((event: any) => {
  });

  checkout.onFormValid((event: any) => {
  });

  checkout.onSubmit((event: any) => {

  });

  checkout.onClick((event: any) => {
  });

  checkout.onError((event: any) => {
  });

  checkout.onCancel((event: any) => {
  });

  checkout.onSessionTimeout((event: any) => {
  });

  checkout.onAuthorizationSuccess((responseCheckout: any) => {
    placeOrder().catch((err) => {
    })
  });

  checkout.onAuthorizationFailure((event: any) => {
  });

  checkout.on3DSecureVerification((event: any) => {
  });

  checkout.onPaymentMethodSelected((event: any) => {
  });

  checkout.onToggleSaveCard((event: any) => {
  });
};


export const getDataOrderDynamic = () => {
  const currentTimeUnix = Math.floor(Date.now()) * 1000;
  const transactionId = currentTimeUnix.toString().slice(0, 14);
  const orderNumber = currentTimeUnix.toString().slice(0, 10);

  return {
    currentTimeUnix,
    transactionId,
    orderNumber
  };
};


/**
 * Configuración de pago por defecto para inicializar el SDK de izipay.
 *
 * @typedef {Object} DefaultPaymentConfig
 * @property {('pay'|'pay_register'|'pay_token'|'register'|'pay_card_selector')} action
 *   Acción principal del flujo de pago. Ejemplo: 'pay_card_selector' para mostrar selector de métodos.
 * @property {('USD'|'PEN')} currency
 *   Moneda de la transacción. Solo se permiten 'USD' o 'PEN'.
 * @property {string} requestSource
 *   Origen de la solicitud. Usualmente 'ECOMMERCE' para integraciones web.
 * @property {Object} orderTemplate
 *   Plantilla base para la orden de pago.
 * @property {string} orderTemplate.amount
 *   Monto de la transacción en formato string decimal. Ejemplo: '5.99'.
 * @property {('ALL'|'CARD'|'PAGO_PUSH'|'YAPE_CODE'|'CLICK_TO_PAY'|'QR')} orderTemplate.payMethod
 *   Método de pago preferido. 'ALL' para mostrar todos, 'CARD' solo tarjetas, etc.
 * @property {('AT'|'PA')} orderTemplate.processType
 *   Tipo de proceso: 'AT' (autorización) o 'PA' (pago directo).
 * @property {string} orderTemplate.merchantBuyerId
 *   Identificador único del comprador asignado por el comercio.
 *
 * @example
 * import { defaultPaymentConfig } from './config.js';
 *
 * const config = {
 *   ...defaultPaymentConfig,
 *   orderTemplate: {
 *     ...defaultPaymentConfig.orderTemplate,
 *     amount: '10.00',
 *     payMethod: 'YAPE_CODE'
 *   }
 * };
 */
export const defaultPaymentConfig = {
  /**
   * Acción principal del flujo de pago.
   * @type {'pay'|'pay_register'|'pay_token'|'register'|'pay_card_selector'}
   */
  action: 'pay_card_selector',
  /**
   * Moneda de la transacción ('USD' o 'PEN').
   * @type {'USD'|'PEN'}
   */
  currency: 'PEN',
  /**
   * Origen de la solicitud (usualmente 'ECOMMERCE').
   * @type {string}
   */
  requestSource: 'ECOMMERCE',
  /**
   * Plantilla base para la orden de pago.
   * @type {{amount: string, payMethod: 'ALL'|'CARD'|'PAGO_PUSH'|'YAPE_CODE'|'CLICK_TO_PAY'|'QR', processType: 'AT'|'PA', merchantBuyerId: string}}
   */
  orderTemplate: {
    amount: '5.99',
    payMethod: 'all',
    processType: 'AT',
  }
};
