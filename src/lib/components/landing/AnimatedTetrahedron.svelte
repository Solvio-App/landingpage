<script lang="ts">
  import { onMount } from 'svelte';

  let canvasRef: HTMLCanvasElement;

  onMount(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const chars = '░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯';
    let angle = 0;
    let animId: number = 0;
    let isVisible = false;
    let lastFrameTime = 0;
    const targetIntervalMs = 1000 / 30;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ];

    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [2, 3],
      [3, 1],
    ];

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2],
    ];

    const rotateY = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x * Math.cos(a) - p.z * Math.sin(a),
      y: p.y,
      z: p.x * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateX = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateZ = (p: { x: number; y: number; z: number }, a: number) => ({
      x: p.x * Math.cos(a) - p.y * Math.sin(a),
      y: p.x * Math.sin(a) + p.y * Math.cos(a),
      z: p.z,
    });

    const drawFrame = (currentAngle: number) => {
      if (!canvasRef || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvasRef.width / dpr;
      const height = canvasRef.height / dpr;
      if (width === 0 || height === 0) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const size = 322;

      ctx.font = '18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const points: Array<{ x: number; y: number; z: number; char: string }> = [];

      edges.forEach(([i1, i2]) => {
        const v1 = vertices[i1];
        const v2 = vertices[i2];
        for (let t = 0; t <= 1; t += 0.05) {
          let p = {
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t,
            z: v1.z + (v2.z - v1.z) * t,
          };
          p = rotateY(p, currentAngle * 0.4);
          p = rotateX(p, currentAngle * 0.3);
          p = rotateZ(p, currentAngle * 0.2);

          const depth = (p.z + 1.5) / 3;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + p.x * size,
            y: centerY - p.y * size,
            z: p.z,
            char: chars[Math.min(charIndex, chars.length - 1)],
          });
        }
      });

      faces.forEach(([i1, i2, i3]) => {
        const v1 = vertices[i1];
        const v2 = vertices[i2];
        const v3 = vertices[i3];

        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1 - u; v += 0.12) {
            const w = 1 - u - v;
            let p = {
              x: v1.x * u + v2.x * v + v3.x * w,
              y: v1.y * u + v2.y * v + v3.y * w,
              z: v1.z * u + v2.z * v + v3.z * w,
            };
            p = rotateY(p, currentAngle * 0.4);
            p = rotateX(p, currentAngle * 0.3);
            p = rotateZ(p, currentAngle * 0.2);

            const depth = (p.z + 1.5) / 3;
            const charIndex = Math.floor(depth * (chars.length - 1));

            points.push({
              x: centerX + p.x * size,
              y: centerY - p.y * size,
              z: p.z,
              char: chars[Math.min(charIndex, chars.length - 1)],
            });
          }
        }
      });

      points.sort((a, b) => a.z - b.z);

      points.forEach((p) => {
        const alpha = 0.15 + (p.z + 1.5) * 0.25;
        ctx.fillStyle = `rgba(15, 98, 254, ${Math.min(alpha, 0.9)})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      ctx.restore();
    };

    const render = (now: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      if (now - lastFrameTime >= targetIntervalMs) {
        drawFrame(angle);
        angle += 0.015;
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
      drawFrame(angle);
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
