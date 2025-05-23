import React, { useEffect, useState, useCallback } from 'react';

// Extend the Window interface to include TikTok's global object
declare global {
  interface Window {
    tiktok?: {
      EmbedService?: {
        init: () => void;
      };
    };
  }
}

// Define props type for _VideoEmbedContent
interface VideoEmbedContentProps {
  videoUrl: string;
}

// Helper function to extract video ID from YouTube URL
const getYouTubeVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

// Helper function to extract video ID from Vimeo URL
const getVimeoVideoId = (url: string): string | null => {
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return match ? match[1] : null;
};

const _VideoEmbedContent: React.FC<VideoEmbedContentProps> = ({ videoUrl }) => {
  const [embedHtml, setEmbedHtml] = useState<string>('');
  const [isTikTok, setIsTikTok] = useState<boolean>(false);

  const generateEmbedCode = useCallback(async (): Promise<void> => {
    if (videoUrl.includes('tiktok.com')) {
      setIsTikTok(true);
      try {
        // Use TikTok's oEmbed endpoint to get the embed HTML
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { html: string } = await response.json();
        setEmbedHtml(data.html); // This contains the <blockquote class="tiktok-embed">...</blockquote>

        // Load TikTok embed script dynamically
        const loadTikTokScript = (): void => {
          if (!document.getElementById('tiktok-embed-script')) {
            const script = document.createElement('script');
            script.id = 'tiktok-embed-script';
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            script.onload = () => {
              // Ensure the script is ready before trying to init
              if (window.tiktok && window.tiktok.EmbedService) {
                window.tiktok.EmbedService.init();
              }
            };
            document.body.appendChild(script);
          } else if (window.tiktok && window.tiktok.EmbedService) {
            // If script already loaded, re-initialize if needed
            window.tiktok.EmbedService.init();
          }
        };
        // Ensure the blockquote is in the DOM before attempting to load/init script
        setTimeout(loadTikTokScript, 0);

      } catch (error) {
        console.error('Error fetching TikTok embed code:', error);
        setEmbedHtml('<p>Error al cargar el video de TikTok.</p>');
      }
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setIsTikTok(false);
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        setEmbedHtml(`
          <iframe
            src="https://www.youtube.com/embed/$${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="YouTube video player"
          ></iframe>
        `);
      } else {
        setEmbedHtml('<p>URL de YouTube inválida o no compatible.</p>');
      }
    } else if (videoUrl.includes('vimeo.com')) {
      setIsTikTok(false);
      const videoId = getVimeoVideoId(videoUrl);
      if (videoId) {
        setEmbedHtml(`
          <iframe
            src="https://player.vimeo.com/video/${videoId}?autoplay=0&loop=0&byline=0&portrait=0"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            title="Vimeo video player"
          ></iframe>
        `);
      } else {
        setEmbedHtml('<p>URL de Vimeo inválida o no compatible.</p>');
      }
    } else {
      setIsTikTok(false);
      setEmbedHtml('<p>Formato de URL de video no compatible.</p>');
    }
  }, [videoUrl]);

  useEffect(() => {
    generateEmbedCode();
  }, [generateEmbedCode]);

  // The outer div ensures the content fills the parent responsive container
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
};

export default _VideoEmbedContent;