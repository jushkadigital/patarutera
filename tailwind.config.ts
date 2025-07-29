import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ✅ 'screens' debe estar directamente dentro de 'theme', no en 'extend'.
    screens: {
      xs: '414px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
    },
    extend: {
      // ✅ Todas las extensiones deben estar en un único objeto 'extend'.
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"], // Es bueno tener un fallback
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
      // 1. Define los valores MÁXIMOS para cada escala de 'prose'.
      
    },
  },
  plugins: [
  ],
};
export default config; 