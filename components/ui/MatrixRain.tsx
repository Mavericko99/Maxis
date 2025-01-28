"use client";
import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const rainCanvas = rainCanvasRef.current;
    const bgCanvas = bgCanvasRef.current;

    if (!rainCanvas || !bgCanvas) return;

    const ctx = rainCanvas.getContext('2d');
    const bgCtx = bgCanvas.getContext('2d');

    if (!ctx || !bgCtx) return;

    const chars = "MATRIX01";
    const fontSize = 18;
    let isFullyRevealed = false;
    const maxDelay = 10;
    let frameCount = 0;
    const img = new Image();
    img.src = './gorilla.jpg'; // Make sure the image exists in the public folder

    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    const columns = rainCanvas.width / fontSize;
    const drops: number[] = new Array(Math.floor(columns)).fill(0);
    const dropDelays: number[] = new Array(Math.floor(columns)).fill(0);

    img.onload = () => {
      bgCtx.drawImage(img, 0, 0, rainCanvas.width, rainCanvas.height);
    };

    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);

      // Draw the revealed background
      if (isFullyRevealed) {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(img, 0, 0, rainCanvas.width, rainCanvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Draw matrix characters
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      for (let i = 0; i < drops.length; i++) {
        if (frameCount >= dropDelays[i]) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(char, x, y);

          // Reset drop when it reaches bottom
          if (y > rainCanvas.height) {
            drops[i] = 0;
          } else {
            drops[i]++;
          }

          // Re-randomize delay for the next drop
          dropDelays[i] = Math.floor(Math.random() * maxDelay);
        }
      }

      // Increment the frame count to manage delay timing
      frameCount++;
      if (frameCount > maxDelay) {
        frameCount = 0; // Reset the frame count
      }

      // Check if we should reveal the background
      if (!isFullyRevealed && drops.every((d) => d * fontSize > rainCanvas.height)) {
        isFullyRevealed = true;
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      // Cleanup function to stop the animation when the component is unmounted
      cancelAnimationFrame(draw as any);
    };
  }, []);

  return (
    <>
      <canvas ref={bgCanvasRef} className="absolute top-0 left-0 z-0" />
      <canvas ref={rainCanvasRef} className="absolute top-0 left-0 z-10" />
    </>
  );
};

export default MatrixRain;
