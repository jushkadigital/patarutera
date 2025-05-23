'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Define props type for OptimizedVideoPlayer
interface OptimizedVideoPlayerProps {
  videoUrl: string;
}

// Dynamically import the core video content component
const DynamicVideoContent = dynamic(() => import('./_VideoEmbedContent'), {
  ssr: false, // Ensure this component only renders on the client-side
  loading: () => <div className="video-player-placeholder">Cargando video...</div>,
});

const OptimizedVideoPlayer: React.FC<OptimizedVideoPlayerProps> = ({ videoUrl }) => {
  const [loadVideo, setLoadVideo] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use Intersection Observer to load the video when it's near or in the viewport.
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadVideo) {
            setLoadVideo(true);
            observer.unobserve(entry.target); // Stop observing once loaded
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before entering the viewport
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [loadVideo]);

  return (
    <div ref={containerRef} className="responsive-video-container">
      {/* Use Suspense for a smoother loading experience */}
      <Suspense fallback={<div className="video-player-placeholder">Cargando...</div>}>
        {loadVideo ? (
          <DynamicVideoContent videoUrl={videoUrl} />
        ) : (
          <div className="video-player-placeholder">
            Haz scroll para ver el video
          </div>
        )}
      </Suspense>

      <style jsx>{`
        .responsive-video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
          background-color: #f0f0f0; /* Placeholder background */
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          color: #555;
        }

        .video-player-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          color: #777;
          font-size: 1.2em;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }

        /* Global styles for iframes to ensure they fill the container */
        .responsive-video-container :global(iframe) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        /* Specific global styles for TikTok blockquotes */
        .responsive-video-container :global(blockquote.tiktok-embed) {
          margin: 0 !important;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default OptimizedVideoPlayer;