"use client";

import { useEffect, useRef } from "react";

type Props = {
  url: string;
};

export default function TiktokEmbed({ url }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo cargar el script si no existe aún
    const existingScript = document.querySelector(`script[src="https://www.tiktok.com/embed.js"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Si ya existe, llamar a la función de carga de nuevo
      (window as any).tiktok?.widgets?.load?.();
    }
  }, [url]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={getVideoId(url)}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section>Loading...</section>
      </blockquote>
    </div>
  );
}

// Extrae el ID del video del URL
function getVideoId(url: string): string | undefined {
  try {
    const match = url.match(/\/video\/(\d+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
}
