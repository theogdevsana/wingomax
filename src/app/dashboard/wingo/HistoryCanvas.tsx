"use client";

import { useEffect, useRef } from "react";

interface HistoryItem {
  issueNumber: string;
  number: string;
  colour: string;
  premium: string;
}

interface HistoryCanvasProps {
  data: HistoryItem[];
  loading?: boolean;
}

export default function HistoryCanvas({ data, loading }: HistoryCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const shimmerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const items = data.length > 0 ? data.slice(0, 10) : Array(10).fill(null);
    const rowCount = items.length;
    const headerHeight = 50;
    const rowHeight = 55;
    const totalHeight = headerHeight + (rowCount * rowHeight);

    // Set canvas dimensions with high DPI support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    
    canvas.width = width * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);

    const colors = {
      red: "#ef4444",
      green: "#22c55e",
      violet: "#a855f7",
      big: "#f97316",
      bigBg: "rgba(249, 115, 22, 0.1)",
      small: "#007AFF",
      smallBg: "rgba(0, 122, 255, 0.1)",
      headerText: "#94a3b8",
      bodyText: "#334155",
      border: "#f1f5f9",
      skeleton: "#f1f5f9",
      shimmer: "#ffffff"
    };

    const cols = [
      { label: "Period", width: 0.25 },
      { label: "Number", width: 0.25 },
      { label: "Size", width: 0.25 },
      { label: "Color", width: 0.25 },
    ];

    const draw = (shimmerPos: number) => {
      ctx.clearRect(0, 0, width, totalHeight);
      
      // Draw Header
      ctx.font = "bold 13px Nunito, sans-serif";
      ctx.fillStyle = colors.headerText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let xOffset = 0;
      cols.forEach((col) => {
        const colWidth = width * col.width;
        ctx.fillText(col.label.toUpperCase(), xOffset + colWidth / 2, headerHeight / 2);
        xOffset += colWidth;
      });

      // Draw Border below header
      ctx.beginPath();
      ctx.moveTo(0, headerHeight);
      ctx.lineTo(width, headerHeight);
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Rows
      items.forEach((item, index) => {
        const y = headerHeight + index * rowHeight;

        // Row background border
        ctx.beginPath();
        ctx.moveTo(0, y + rowHeight);
        ctx.lineTo(width, y + rowHeight);
        ctx.strokeStyle = colors.border;
        ctx.stroke();

        let rowXOffset = 0;

        if (loading || !item) {
          // Skeleton Loader
          const drawSkeleton = (x: number, w: number, h: number) => {
            const grad = ctx.createLinearGradient(shimmerPos - 100, 0, shimmerPos + 100, 0);
            grad.addColorStop(0, colors.skeleton);
            grad.addColorStop(0.5, colors.shimmer);
            grad.addColorStop(1, colors.skeleton);
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y + (rowHeight - h) / 2, w, h, 0);
            ctx.fill();
          };

          // Period skeleton
          drawSkeleton(rowXOffset + (width * 0.25) / 2 - 25, 50, 16);
          rowXOffset += width * 0.25;

          // Number skeleton
          drawSkeleton(rowXOffset + (width * 0.25) / 2 - 12, 24, 24);
          rowXOffset += width * 0.25;

          // Size skeleton
          drawSkeleton(rowXOffset + (width * 0.25) / 2 - 25, 50, 24);
          rowXOffset += width * 0.25;

          // Color skeleton
          drawSkeleton(rowXOffset + (width * 0.25) / 2 - 6, 12, 12);
        } else {
          const num = parseInt(item.number);
          const isBig = num >= 5;

          // 1. Period
          const pWidth = width * 0.25;
          ctx.font = "600 15px Nunito, sans-serif";
          ctx.fillStyle = colors.bodyText;
          ctx.fillText(item.issueNumber.slice(-5), rowXOffset + pWidth / 2, y + rowHeight / 2);
          rowXOffset += pWidth;

          // 2. Number
          const nWidth = width * 0.25;
          ctx.font = "800 18px Nunito, sans-serif";
          
          const drawNumber = (text: string, x: number, y: number, colorStyle: string) => {
            if (colorStyle === "gradient") {
              const grad = ctx.createLinearGradient(x, y - 10, x, y + 10);
              if (num === 0) {
                grad.addColorStop(0.5, colors.red);
                grad.addColorStop(0.5, colors.violet);
              } else {
                grad.addColorStop(0.5, colors.green);
                grad.addColorStop(0.5, colors.violet);
              }
              ctx.fillStyle = grad;
            } else {
              ctx.fillStyle = colorStyle;
            }
            ctx.fillText(text, x, y);
          };

          let numColor = colors.violet;
          if (num === 0 || num === 5) numColor = "gradient";
          else if ([1, 3, 7, 9].includes(num)) numColor = colors.green;
          else if ([2, 4, 6, 8].includes(num)) numColor = colors.red;

          drawNumber(num.toString(), rowXOffset + nWidth / 2, y + rowHeight / 2, numColor);
          rowXOffset += nWidth;

          // 3. Size
          const sWidth = width * 0.25;
          const sizeText = isBig ? "Big" : "Small";
          const tagColor = isBig ? colors.big : colors.small;
          const tagBg = isBig ? colors.bigBg : colors.smallBg;
          
          const tagW = 50;
          const tagH = 24;
          const tagX = rowXOffset + sWidth / 2 - tagW / 2;
          const tagY = y + rowHeight / 2 - tagH / 2;

          // Tag Background
          ctx.fillStyle = tagBg;
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, tagW, tagH, 6);
          ctx.fill();

          // Tag Text
          ctx.font = "700 12px Nunito, sans-serif";
          ctx.fillStyle = tagColor;
          ctx.fillText(sizeText, rowXOffset + sWidth / 2, y + rowHeight / 2);
          rowXOffset += sWidth;

          // 4. Color
          const cWidth = width * 0.25;
          const dotR = 6;
          const dotX = rowXOffset + cWidth / 2;
          const dotY = y + rowHeight / 2;

          if (num === 0 || num === 5) {
            const color1 = num === 0 ? colors.red : colors.green;
            const color2 = colors.violet;
            const spacing = 4;
            
            // Left Dot
            ctx.beginPath();
            ctx.arc(dotX - (dotR + spacing / 2), dotY, dotR, 0, Math.PI * 2);
            ctx.fillStyle = color1;
            ctx.fill();

            // Right Dot
            ctx.beginPath();
            ctx.arc(dotX + (dotR + spacing / 2), dotY, dotR, 0, Math.PI * 2);
            ctx.fillStyle = color2;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
            let dotColor = colors.violet;
            if ([1, 3, 7, 9].includes(num)) dotColor = colors.green;
            else if ([2, 4, 6, 8].includes(num)) dotColor = colors.red;
            ctx.fillStyle = dotColor;
            ctx.fill();
          }
        }
      });
    };

    const animate = () => {
      shimmerRef.current = (shimmerRef.current + 5) % (width + 200);
      draw(shimmerRef.current);
      if (loading || data.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (loading || data.length === 0) {
      animate();
    } else {
      draw(0);
    }

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const newWidth = rect.width;
      canvas.width = newWidth * dpr;
      canvas.height = totalHeight * dpr;
      ctx.scale(dpr, dpr);
      draw(shimmerRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [data, loading]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: "100%", 
        display: "block",
        background: "#fff" 
      }} 
    />
  );
}
