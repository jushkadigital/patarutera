/*"use client";

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
        <section style={{ padding: "20px", textAlign: "center", border: "1px dashed #ccc", borderRadius: "8px" }}>
          <p>Cargando video de TikTok...</p>
        </section>
      </blockquote>
    </div>
  );
}
*/
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  url: string;
  className: string
};

function getVideoId(url: string): string | undefined {
  try {
    const match = url.match(/\/video\/(\d+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export default function TiktokEmbed({ url,className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const videoId = getVideoId(url);

  useEffect(() => {
    if (!videoId || !containerRef.current) {
      setError("URL inválida o no se pudo extraer el ID del video.");
      return;
    }

    const embed = document.createElement("blockquote");
    embed.className = "tiktok-embed-block";
    embed.setAttribute("cite", url);
    embed.setAttribute("data-video-id", videoId);
    //embed.style.maxWidth = "655px";
    //embed.style.minWidth = "325px";

    const section = document.createElement("section");
    section.innerText = "Cargando video de TikTok...";
    embed.appendChild(section);

    containerRef.current.innerHTML = ""; // Limpieza previa
    containerRef.current.appendChild(embed);

    const loadTikTokScript = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as any).tiktok?.widgets?.load) {
          return resolve();
        }

        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject("No se pudo cargar el script de TikTok");
        document.body.appendChild(script);
      });
    };

    loadTikTokScript()
      .then(() => {
        (window as any).tiktok?.widgets?.load?.();
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar el video de TikTok.");
      });
  }, [url]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return <div className={className}>
   <div ref={containerRef} className="tiktok-embed-wrapper" />;
  </div>
}
