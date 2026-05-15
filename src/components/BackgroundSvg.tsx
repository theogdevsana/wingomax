import React, { memo } from 'react';

interface BackgroundSvgProps {
  blueColor: string;
  purpleColor: string;
}

function BackgroundSvgComponent({ blueColor, purpleColor }: BackgroundSvgProps) {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
      <svg
        className="w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mainBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8faff" />
            <stop offset="100%" stopColor="#fdfaff" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={blueColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={blueColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={purpleColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={purpleColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Unified background handled by body in globals.css */}



        <path
          d="M 0 28 Q 30 18 60 28 Q 85 33 100 23 L 100 0 L 0 0 Z"
          fill="url(#blueGrad)"
          className="drop-shadow-sm"
        />
        <path
          d="M 0 72 Q 40 82 70 72 Q 90 67 100 74 L 100 100 L 0 100 Z"
          fill="url(#purpleGrad)"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}

const BackgroundSvg = memo(BackgroundSvgComponent);
export default BackgroundSvg;


