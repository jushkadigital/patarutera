import React from 'react';
import Image from 'next/image';
import { BASEURL } from '@/lib/config';

interface BannerProps {
  title: string;
  backgroundUrl: string;
  className?: string;
  alt: string;
}

export const BannerCarousel: React.FC<BannerProps> = ({ title, backgroundUrl,alt, className = '' }) => {
  console.log(backgroundUrl)
  return (
    <div
      className={`relative w-full h-[90vh]  flex items-center justify-center text-white overflow-hidden ${className}`}
    >
      {/* Imagen de fondo absoluta */}
      <Image
        src={backgroundUrl}
        alt={alt}
        fill
        className="object-cover object-center absolute inset-0 -z-20"
        priority
      />
      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <h1
        className={`relative z-10 text-3xl md:text-8xl lg:text-3xl font-black text-center leading-tight`}
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.1) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        RUTEA
        <br />
       <span className='text-7xl! lg:text-9xl! font-black uppercase'> {title}</span> 
      </h1>
    </div>
  );
};
