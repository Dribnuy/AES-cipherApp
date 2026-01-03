import { useEffect, useRef } from 'react';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Context not found!');
      return;
    }

    console.log('CursorTrail initialized!');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      alpha: number;
      size: number;
    }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        size: 20
      });

  
      if (particles.length > 20) {
        particles.shift();
      }
    };

    const draw = () => {
 
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);


      particles.forEach((particle, index) => {
        particle.alpha -= 0.02;
        particle.size += 0.5;

        if (particle.alpha > 0) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          
          gradient.addColorStop(0, `rgba(0, 255, 100, ${particle.alpha})`);
          gradient.addColorStop(1, `rgba(0, 255, 200, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

   
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}