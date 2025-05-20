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
      className={`relative w-full h-[80vh]  flex items-center justify-center text-white overflow-hidden ${className}`}
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
      <h1 className="relative z-10 text-3xl font-bold drop-shadow-lg text-center px-4">
        RUTEA
        {title}
      </h1>
    </div>
  );
};
