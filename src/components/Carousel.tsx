import React, { PropsWithChildren } from 'react';
import {
  Carousel as ShadCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface CarouselProps extends PropsWithChildren<object> {
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, className = '' }) => {
  return (
    <ShadCarousel className={`w-full ${className}`}>
      <CarouselContent>
        {React.Children.map(children, (child, idx) => (
          <CarouselItem key={idx} className="w-full flex flex-row justify-center items-center">
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </ShadCarousel>
  );
};
