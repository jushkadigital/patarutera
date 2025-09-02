import React from 'react';
import Image from '@/components/PayloadImage';
import { BASEURL } from '@/lib/config';
import { Media } from '@/cms-types';

interface BannerProps {
  title: string;
  backgroundUrl: Media;
  className?: string;
}

const Banner: React.FC<BannerProps> = ({ title, backgroundUrl, className = '' }) => {
  console.log(backgroundUrl)
  return (
    <div
      className={`relative w-full h-[50vh] flex items-center justify-center text-white overflow-hidden ${className}`}
    >
      {/* Imagen de fondo absoluta */}
      <Image
        media={backgroundUrl}
        fill
        className="object-cover object-center absolute inset-0 -z-20"
        priority
      />
      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 bg-black/40 -z-10" />
      <h1 className="relative z-10 text-5xl font-bold drop-shadow-lg text-center px-4">
        {title}
      </h1>
    </div>
  );
};

export default Banner; 
