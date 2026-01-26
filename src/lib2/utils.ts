import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// utils/merge-tours.ts (o dentro de tu servicio BFF)

export function mergeToursWithPrices(toursFromCMS: any[], productsFromMedusa: any[]) {

  // PASO 1: Crear el Mapa de Búsqueda (Indexación)
  // Convertimos la lista de productos en un Diccionario para acceso instantáneo O(1).
  // Clave: ID del producto (que es tu sku), Valor: El producto entero.
  const productsMap = new Map(
    productsFromMedusa.map((product) => [product.id, product])
  );

  // PASO 2: Recorrer los tours y "enriquecerlos"
  return toursFromCMS.map((tour) => {
    // Buscamos si existe el producto en el mapa
    const matchedProduct = productsMap.get(tour.medusaId);

    // PASO 3: Validación de Nulos
    // Si NO existe producto (es null o undefined), devolvemos el tour tal cual
    // o con un flag de 'no disponible'.
    if (!matchedProduct) {
      return {
        ...tour,
        priceMedusa: null,
      };
    }

    // PASO 4: Extracción del Precio (Lógica de Medusa)
    // En Medusa, el precio vive en la variante, no en el producto raíz.
    // Tomamos la primera variante o la más barata según tu lógica.
    const priceData = matchedProduct.variants[0]?.calculated_price;

    return {
      ...tour,
      // Solo inyectamos el precio si existe
      priceMedusa: priceData ? {
        amount: priceData.calculated_amount,
        currency: priceData.currency_code,
        formatted: priceData.original_amount // O como lo formatee Medusa
      } : null,
      // Opcional: También puedes traer el stock real
    };
  });
}
