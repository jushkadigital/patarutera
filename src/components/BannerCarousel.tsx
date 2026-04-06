import React from "react";

import type { Media } from "@/cms-types";

import PayloadImage from "./PayloadImage";

interface BannerProps {
  title: string;
  backgroundMedia?: Media | null;
  className?: string;
  alt: string;
}

const fallbackMedia: Media = {
  id: 0,
  alt: "",
  createdAt: "",
  updatedAt: "",
  url: "/placeholder.svg",
  width: 1920,
  height: 1080,
};

export const BannerCarousel: React.FC<BannerProps> = ({
  title,
  backgroundMedia,
  alt,
  className = "",
}) => {
  const heroMedia = backgroundMedia
    ? {
        ...backgroundMedia,
        alt: backgroundMedia.alt ?? alt,
      }
    : {
        ...fallbackMedia,
        alt,
      };

  return (
    <div
      className={`relative h-[90vh] w-full overflow-hidden text-white ${className}`}
    >
      <PayloadImage
        media={heroMedia}
        fill
        className="object-cover object-center absolute inset-0 -z-20"
        priority
      />
      <div className="absolute inset-0 -z-10 bg-black/40" />

      <div className="relative z-10 flex h-full w-full items-center justify-center text-center">
        <h1
          className="text-3xl font-black leading-tight md:text-5xl lg:text-3xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          RUTEA
          <br />
          <span className="text-7xl! font-black uppercase md:text-8xl! lg:text-9xl!">
            {title}
          </span>
        </h1>
      </div>
    </div>
  );
};
