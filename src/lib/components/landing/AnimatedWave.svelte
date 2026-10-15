<script lang="ts">
  import { onMount } from 'svelte';

  let canvasRef: HTMLCanvasElement;

  onMount(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const chars = '·∘○◯◌●◉';
    let time = 0;
    let animId: number = 0;
    let isVisible = false;
    let lastFrameTime = 0;
    const targetIntervalMs = 1000 / 30;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const drawFrame = (currentTime: number) => {
      if (!canvasRef || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvasRef.width / dpr;
      const height = canvasRef.height / dpr;
      if (width === 0 || height === 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cols = Math.max(Math.floor(width / 22), 10);
      const rows = Math.max(Math.floor(height / 22), 5);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const posX = (x + 0.5) * (width / cols);
          const posY = (y + 0.5) * (height / rows);

          const wave1 = Math.sin(x * 0.2 + currentTime * 2) * Math.cos(y * 0.15 + currentTime);
          const wave2 = Math.sin((x + y) * 0.1 + currentTime * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + currentTime * 0.8);
          const combined = (wave1 + wave2 + wave3) / 3;

          const normalized = (combined + 1) / 2;
          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = 0.15 + normalized * 0.5;

          ctx.fillStyle = `rgba(15, 98, 254, ${alpha})`;
          ctx.fillText(chars[charIndex], posX, posY);
        }
      }

      ctx.restore();
    };

    const render = (now: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      if (now - lastFrameTime >= targetIntervalMs) {
        drawFrame(time);
        time += 0.03;
        lastFrameTime = now;
      }

      animId = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasRef.width = Math.floor(width * dpr);
      canvasRef.height = Math.floor(height * dpr);
      drawFrame(time);
    });

    resizeObserver.observe(canvasRef);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : false;

        if (isVisible && !prefersReducedMotion && animId === 0) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    intersectionObserver.observe(canvasRef);
    drawFrame(0);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  });
</script>

<canvas bind:this={canvasRef} class="block size-full"></canvas>
