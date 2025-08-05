import React, {useEffect, useState} from "react";

// export const useMobile = () => {
//     const [width, setWidth] = useState(window.innerWidth);
//     const handleWindowSizeChange = () => {
//             setWidth(window.innerWidth);
//     }

//     useEffect(() => {
//         window.addEventListener('resize', handleWindowSizeChange);
//         return () => {
//             window.removeEventListener('resize', handleWindowSizeChange);
//         }
//     }, []);

//     return (width <= 768);
// }


interface Props {
  breakpoint:number
}

export const useMobile = ({breakpoint}:Props = { breakpoint: 768 }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para actualizar el estado de isMobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Llamar a handleResize una vez al montar el componente
    handleResize();

    // Agregar un event listener para manejar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};