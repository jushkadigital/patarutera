const config = {
  endpoints: {
    server: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    token: '/store/izipay/create-payment',
    callback: '/store/izipay/callback',
    error: '/store/izipay/error'
  },
  sdk: {
    prod: 'https://checkout.izipay.pe/payments/v1/js/index.js'
  },
  api: {
    prod: 'https://api-pw.izipay.pe'
  }
};
const typeForm = {
  POPUP: 'pop-up',
  EMBEDDED: 'embedded',
  REDIRECT: 'redirect',
};

export const render = {
  typeForm: typeForm.POPUP, //pop-up, embedded, redirect
  //layout: 'tab', //accordion,
  //autoResize: true,
  container: '#izipay-checkout',
  //container: '#your-iframe-payment',
  showButtonProcessForm: true,
  redirectUrls: {
    onSuccess: `${config.endpoints.server}${config.endpoints.callback}`,
    onError: `${config.endpoints.server}${config.endpoints.error}`,
    onCancel: `${config.endpoints.server}${config.endpoints.error}`
  },
}
