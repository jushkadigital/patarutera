'use client';

import { useEffect, useRef } from 'react';

export default function BitrixFormLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Crea un script inline
    const inlineScript = document.createElement('script');
     inlineScript.setAttribute('data-b24-form', 'inline/411/yfoidg'); // <-- tu ID de formulario
    inlineScript.setAttribute('data-skip-moving', 'true');
    inlineScript.innerHTML = `
      (function(w,d,u){
        var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
        var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
      })(window,document,'https://cdn.bitrix24.es/b15344011/crm/form/loader_411.js');
    `;

    containerRef.current.appendChild(inlineScript);
  }, []);

  return <div ref={containerRef} />;
}
