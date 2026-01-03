import React, { useEffect, useRef } from 'react';

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

  
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

   
    const chars = '0123456789ABCDEFAES256RSA01';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }


    const colors = [
      'rgba(0, 255, 0, ',     
      'rgba(0, 200, 255, ',    
      'rgba(100, 255, 100, ',  
    ];

    const draw = () => {
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        
        const text = chars[Math.floor(Math.random() * chars.length)];
        
      
        const colorIndex = i % colors.length;
        const baseColor = colors[colorIndex];
        
       
        const y = drops[i] * fontSize;
        const opacity = Math.min(1, Math.max(0.1, 1 - (y / canvas.height) * 0.5));
        
        ctx.fillStyle = baseColor + opacity + ')';
        ctx.fillText(text, i * fontSize, y);

       
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

     
        drops[i] += 0.3 + Math.random() * 0.3;
      }
    };

   
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.15,
          zIndex: 1
      }}
    />
  );
}