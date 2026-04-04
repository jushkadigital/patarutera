import type { StaticImageData } from "next/image";

import { cn } from "@/lib2/utils";
import React from "react";

import type {
  Media as CmsMedia,
  MediaBlock as MediaBlockProps,
} from "@/cms-types";

import { Media } from "@/components/Media";
import PayloadImage from "@/components/PayloadImage";

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClassName?: string;
  className?: string;
  enableGutter?: boolean;
  imgClassName?: string;
  staticImage?: StaticImageData;
  disableInnerContainer?: boolean;
};

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
  } = props;

  const mediaResource =
    media && typeof media === "object" ? (media as CmsMedia) : null;

  return (
    <div
      className={cn(
        "",
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {staticImage ? (
        <Media
          imgClassName={cn(
            "border border-border rounded-[0.8rem]",
            imgClassName,
          )}
          src={staticImage}
        />
      ) : mediaResource ? (
        <PayloadImage
          media={mediaResource}
          className={cn("border border-border rounded-[0.8rem]", imgClassName)}
        />
      ) : null}
    </div>
  );
};
