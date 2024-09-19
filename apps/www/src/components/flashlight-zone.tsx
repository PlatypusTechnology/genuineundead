"use client";

import { cn } from "@genuineundead/core";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "~/styles/flashlight-zone.css";


interface SpotlightZoneProps {
  imgSrc: string;
  className?: string;
  children?: React.ReactNode;
}

export const FlashlightZone: React.FC<SpotlightZoneProps> = ({
  children,
  imgSrc,
  className,
}) => {
  const lightRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const light = lightRef.current;
    const container = containerRef.current;

    if (light && container) {
      const handleMouseMove = (e: MouseEvent) => {
        const { left, top } = container.getBoundingClientRect();

        light.style.left = `${e.clientX - left}px`;
        light.style.top = `${e.clientY - top}px`;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          const { left, top } = container.getBoundingClientRect();

          light.style.left = `${e.touches[0].clientX - left
            }px`;

          light.style.top = `${e.touches[0].clientY - top
            }px`;
        }
      };

      const handleMouseEnter = () => {
        setInside(true);
      };

      const handleMouseLeave = () => {
        setInside(false);
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden cursor-none bg-black", className)}
    >
      <Image
        src={imgSrc}
        className="h-full w-full bg-cover object-cover"
        height={1230}
        width={1920}
        alt="background"
      />

      {children}

      <div className="flashlight cursor-none">
        <div className={`flashlight_light ${inside ? 'flashlight_on' : 'flashlight_off'}`} ref={lightRef}>
          <div className="flashlight_shadow"></div>
        </div>
      </div>
    </div>
  );
};