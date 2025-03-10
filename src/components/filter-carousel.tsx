"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  value?: string | null;
  onSelect: (value: string | null) => void;
  data: { value: string; label: string }[];
}

export const FilterCarousel = ({ value, onSelect, data }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          { hidden: current === 1 }
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          <CarouselItem
            onClick={() => onSelect(null)}
            className="pl-3 basis-auto"
          >
            <Badge
              variant={!value ? "default" : "secondary"}
              className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
            >
              All
            </Badge>
          </CarouselItem>
          {data.map((item) => (
            <CarouselItem
              key={item.value}
              onClick={() => onSelect(item.value)}
              className="pl-3 basis-auto"
            >
              <Badge
                variant={value === item.value ? "default" : "secondary"}
                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
              >
                {item.label}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
        {!(current === 1) && <CarouselPrevious className="left-0 z-20" />}
        {!(current === count) && <CarouselNext className="right-0 z-20" />}
      </Carousel>
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          { hidden: current === count }
        )}
      />
    </div>
  );
};

export const FilterCarouselSkeleton = () => {
  return (
    <div className="relative w-full">
      <Carousel
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="-ml-3">
          {Array.from({ length: 14 }).map((_, index) => (
            <CarouselItem key={index} className="pl-3 basis-auto">
              <Skeleton className="rounded-lg px-3 py-1 h-full w-[100px]">
                &nbsp;
              </Skeleton>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
