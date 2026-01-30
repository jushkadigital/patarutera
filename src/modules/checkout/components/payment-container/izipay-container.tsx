"use client"

import { Text } from "@medusajs/ui"
import React, { JSX, useEffect, useRef, useState } from "react"
import PaymentContainer from "./index"
import Spinner from "@modules/common/icons/spinner" // Asegúrate de tener un spinner o usa texto
import { defaultPaymentConfig, getDataOrderDynamic, setupEventHandlers } from "../izipay/config"
import { generateSignature } from "../izipay/signature"
import {
  language,
  token,
  render,
  appearance,
  customFields,
  billing,
  shipping,
  getOrder
} from "../izipay/config/"
import { error } from "console"
import { myConvertToLocale } from "@lib/util/money"

type IzipayContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  disabled?: boolean
  paymentSessionData?: Record<string, any> // Aquí viene merchantCode, publicKey, etc.
  handleSubmitAction: () => Promise<void>
}

export const IzipayContainer: React.FC<IzipayContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  paymentSessionData,
  handleSubmitAction
}) => {
  const isSelected = selectedPaymentOptionId === paymentProviderId
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)

  // Referencia para evitar cargar el script dos veces
  const containerRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<any>(null);




  // 2. Crear el script dinámicamente

  // 3. Manejar la carga del script




  // 4. INICIALIZAR IZIPAY
  // Dependiendo de la versión del SDK, la inicialización cambia.
  // Basado en tus parámetros (merchantCode, publicKey), suele ser así:

  useEffect(() => {
    if (!isSelected || !paymentSessionData?.sdkUrl) {
      return
    }
    const { sdkUrl, merchantCode, publicKey, apiEndpoint, amount, currency } = paymentSessionData

    const hashKey = "Xom5Hlt9eSWoylYuBrenIbOsTljEdefR"

    const config = {
      endpoints: {
        server: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
        token: '/store/izipay/create-payment',
        callback: '/store/izipay/callback',
        error: '/store/izipay/error'
      },
      sdk: {
        test: sdkUrl,
        prod: 'https://checkout.izipay.pe/payments/v1/js/index.js'
      },
      api: {
        test: apiEndpoint,
        prod: 'https://api-pw.izipay.pe'
      }
    };
    if (typeof window === "undefined") return;
    const createPayment = async () => {
      const { transactionId, orderNumber, currentTimeUnix } = getDataOrderDynamic();

      const { requestSource, orderTemplate: { } } = defaultPaymentConfig;


      const paymentData = {
        requestSource,
        orderNumber: orderNumber,
        merchantCode: "4004353",
        publicKey,
        "amount": myConvertToLocale({ amount: Number(amount), currency_code: "PEN", locale: "es-PE" }),
      };
      try {


        const response = await fetch(`${config.endpoints.server}${config.endpoints.token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'transactionId': transactionId,
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify(paymentData)
        });
        if (!response.ok) {
        }

        const data = await response.json();

        if (!data.response?.token) {
          throw new Error('Invalid token response');
        }

        return {
          sessionToken: data.response.token,
          transactionId,
          orderNumber,
          dateTimeTransaction: currentTimeUnix,
        };

      } catch (error) {
        console.error('Failed to create payment:', error);
        throw error;
      }
    }

    const loadCheckoutForm = async ({
      sessionToken,
      transactionId,
      orderNumber,
      dateTimeTransaction,
      onPaymentComplete = () => { }
    }) => {
      // Validate required session token
      if (!sessionToken) throw new Error('sessionToken is required');

      // Extract payment configuration from defaults
      const { action, currency, orderTemplate: { } } = defaultPaymentConfig;

      // Initialize signature for card selector authentication
      let signature;
      const { currentTimeUnix } = getDataOrderDynamic();

      // Prepare default data for order and signature
      const defaultData = {
        currency,           // Moneda de la transacción
        amount: amount,            // Monto de la transacción
        merchantBuyerId: merchantCode,   // ID del comprador
        dateTimeTransaction // Timestamp de la transacción
      };

      const iziConfig =
      {
        "config": {
          "transactionId": transactionId,
          "action": "pay",
          "merchantCode": "4004353",
          "facilitatorCode": "",
          "order": {
            "orderNumber": orderNumber,
            "showAmount": true,
            "currency": "PEN",
            "amount": myConvertToLocale({ amount: Number(amount), currency_code: "PEN", locale: "es-PE" }),
            "installments": "",
            "deferred": "",
            "payMethod": "all",
            "channel": "web",
            "processType": "AT",
            "merchantBuyerId": "mc1993",
            "dateTimeTransaction": currentTimeUnix
          },
          "card": {
            "brand": "",
            "pan": "",
            "expirationMonth": "",
            "expirationYear": "",
            "cvc": ""
          },
          "token": {
            "cardToken": ""
          },
          "billing": {
            "firstName": "Lucho",
            "lastName": "Torres",
            "email": "luchotorres@izipay.pe",
            "phoneNumber": "989897960",
            "street": "Av. Jorge Chávez 275",
            "city": "Lima",
            "state": "Lima",
            "country": "PE",
            "postalCode": "15000",
            "document": "12345678",
            "documentType": "DNI",
            "companyName": ""
          },
          "shipping": {
            "firstName": "",
            "lastName": "",
            "email": "",
            "phoneNumber": "",
            "street": "",
            "city": "",
            "state": "",
            "country": "",
            "postalCode": "",
            "document": "",
            "documentType": ""
          },
          "language": {
            "init": "ESP",
            "showControlMultiLang": false
          },
          "render": {
            "typeForm": "embedded",
            "container": "#izipay-checkout-container",
            "showButtonProcessForm": true,

          },
          "urlIPN": "https://testapi-pw.izipay.pe/ipnclient/NotificationPublic/requests",
          "appearance": {
            "styleInput": "normal",
            "logo": "https://logowik.com/content/uploads/images/shopping-cart5929.jpg",
            "theme": "green",
            "customize": {
              "visibility": {
                "hideOrderNumber": false,
                "hideResultScreen": false,
                "hideLogo": false,
                "hideMessageActivateOnlinePurchases": false,
                "hideTestCards": false,
                "hideShakeValidation": false,
                "hideGlobalErrors": false
              },
              "elements": [
                {
                  "paymentMethod": "CARD",
                  "order": 1,
                  "fields": [
                    {
                      "name": "cardNumber",
                      "order": 1,
                      "visible": true,
                      "groupName": ""
                    }
                  ],
                  "changeButtonText": {
                    "actionPay": "Pagar"
                  }
                }
              ]
            }
          },
          "customFields": [],

        }
      }

      try {
        // Initialize Izipay checkout instance with configuration
        const Izipay = (window as any).Izipay;

        const checkout = new Izipay({ config: iziConfig.config });
        checkoutRef.current = checkout;
        // Load and render the checkout form with authorization
        checkout.LoadForm({
          authorization: sessionToken,    // Token de autorización de la sesión
          keyRSA: 'RSA',                // Tipo de encriptación
          callbackResponse: onPaymentComplete // Callback para el resultado del pago
        });

        // Configure event listeners for form interactions
        setupEventHandlers(checkout, { handle: handleSubmitAction });

        // Return checkout instance for external reference
        return checkout;
      } catch (error) {
        console.error('Failed to load checkout form:', error);
        throw error;
      }
    }

    const loadData = async () => {
      const paymentInfo = await createPayment()
      console.log(paymentInfo)
      const checkout = await loadCheckoutForm({
        ...paymentInfo,
        onPaymentComplete: (response) => {
          if (response.status === 'SUCCESS') {
          } else {
          }
        }
      })

    }
    loadData()

  }, [isSelected, paymentSessionData])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >

      <div
        id="izipay-checkout-container"
        ref={containerRef}
        className="min-h-[200px] w-full" // Altura mínima para evitar saltos de layout
      />

    </PaymentContainer>
  )
}
