// Este archivo extiende el objeto 'Window' con la nueva propiedad 'fbq'
declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      loaded?: boolean
    }
  }
}

// Puedes añadir export {} para asegurarte de que el archivo se trate como un módulo
// Esto es una buena práctica, aunque en un .d.ts no siempre es estrictamente necesario
export {};