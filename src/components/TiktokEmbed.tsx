"use client";

import { useEffect } from "react"; // Ya no necesitas useRef si no lo usas

type Props = {
  url: string;
};

function getVideoId(url: string): string | undefined {
  try {
    const match = url.match(/\/video\/(\d+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export default function TiktokEmbed({ url }: Props) {
  const videoId = getVideoId(url);

  useEffect(() => {
    // Asumimos que el script se carga globalmente
    // Solo necesitamos llamar a la función de carga de TikTok
    if (typeof (window as any).tiktok?.widgets?.load === 'function') {
      (window as any).tiktok.widgets.load();
    }
    // Opcional: Si quieres tener un fallback por si el script global falla
    // else {
    //   console.warn("TikTok script not loaded, attempting to load now.");
    //   const script = document.createElement("script");
    //   script.src = "https://www.tiktok.com/embed.js";
    //   script.async = true;
    //   document.body.appendChild(script);
    //   script.onload = () => {
    //     (window as any).tiktok?.widgets?.load?.();
    //   };
    // }
  }, [url]); // Se ejecuta si la URL cambia para cargar un nuevo video

  if (!videoId) {
    return <p style={{color: "red"}}>URL de TikTok inválida o ID de video no encontrado.</p>;
  }

  return (
    // Usar `key={videoId}` puede ayudar a React a manejar cambios si la URL
    // del mismo componente cambia, forzando un re-montaje completo del blockquote.
    <div key={videoId}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px", margin: "10px auto" }}
      >
        {/* Cambia "Loading..." por un placeholder más visual */}
        <section style={{ padding: "20px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
          <p>Cargando video de TikTok...</p>
          {/* Podrías añadir un spinner o un esqueleto aquí */}
        </section>
      </blockquote>
    </div>
  );
}