// components/YouTubeEmbed.tsx
'use client'

import React from 'react'

type YouTubeEmbedProps = {
  url: string
  className?: string
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ url, className }) => {
  // Extrae el ID del video desde una URL como:
  // https://www.youtube.com/watch?v=VIDEO_ID o https://youtu.be/VIDEO_ID
  const getYouTubeId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const videoId = getYouTubeId(url)

  if (!videoId) {
    return <p>URL de YouTube no válida</p>
  }

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default YouTubeEmbed
