'use client';

import React, { useRef } from 'react';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})` | string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(59, 130, 246, 0.08)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || !spotlightRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`;
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0.7';
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
  };

  const handleFocus = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0.7';
  };

  const handleBlur = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-black/[0.08] bg-white overflow-hidden p-6 ${className}`}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out"
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
