// Este archivo contiene las funciones para enviar eventos al Meta Pixel.

/**
 * Dispara el evento estándar 'PageView'.
 * Esta función se llama automáticamente en cada cambio de ruta.
 */
export const pageview = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

/**
 * Dispara un evento personalizado con datos adicionales.
 * @param {string} name - El nombre del evento (ej. 'AddToCart', 'Lead').
 * @param {object} options - Un objeto con los datos del evento.
 */
export const event = (name, options = {}) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', name, options);
  }
};