export async function generateSignature(params, secretKey) {

  const { dateTimeTransaction, transactionId, amount, currency, merchantBuyerId, documentType, document } = params;
  const message = `${dateTimeTransaction}${transactionId}${amount}${currency}${merchantBuyerId}${documentType}${document}`;

  // Validaciones mínimas
  if (!/^\d{16}$/.test(dateTimeTransaction)) throw new Error('dateTimeTransaction formato inválido');
  if (!/^\d+\.\d{2}$/.test(amount)) throw new Error('amount debe tener 2 decimales');
  if (!/^([A-Z]{3})$/.test(currency)) throw new Error('currency inválida');
  // Importar clave

  const keyData = new TextEncoder().encode(secretKey);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return bufferToBase64(signatureBuffer);
}
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary); // Base64 estándar
}
