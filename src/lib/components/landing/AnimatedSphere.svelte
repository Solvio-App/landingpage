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
    let isVisible = true;
    let isStarted = false;
    let lastFrameTime = 0;
    const targetIntervalMs = 1000 / 30;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Precompute unit sphere geometry once on mount
    const baseSpherePoints: Array<{ x: number; y: number; z: number }> = [];
    const sphereStep = 0.22;
    for (let theta = 0; theta < Math.PI * 2; theta += sphereStep) {
      for (let phi = 0; phi < Math.PI; phi += sphereStep) {
        baseSpherePoints.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.sin(phi) * Math.sin(theta),
          z: Math.cos(phi),
        });
      }
    }
    const totalPoints = baseSpherePoints.length;
    const renderPoints = baseSpherePoints.map(() => ({ x: 0, y: 0, z: 0, char: '' }));

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
      const radius = Math.min(width, height) * 0.4;

      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const angleZ = currentAngle * 0.5;
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const rotX = currentAngle * 0.3;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const rotY = currentAngle * 0.2;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      for (let i = 0; i < totalPoints; i++) {
        const bp = baseSpherePoints[i];

        // Rotate around Z axis (azimuth)
        const rx = bp.x * cosZ - bp.y * sinZ;
        const ry = bp.x * sinZ + bp.y * cosZ;
        const rz = bp.z;

        // Rotate around X axis
        const y1 = ry * cosX - rz * sinX;
        const z1 = ry * sinX + rz * cosX;

        // Rotate around Y axis
        const x2 = rx * cosY - z1 * sinY;
        const z2 = rx * sinY + z1 * cosY;

        const depth = (z2 + 1) / 2;
        const charIndex = Math.floor(depth * (chars.length - 1));

        const p = renderPoints[i];
        p.x = centerX + x2 * radius;
        p.y = centerY + y1 * radius;
        p.z = z2;
        p.char = chars[Math.min(charIndex, chars.length - 1)];
      }

      renderPoints.sort((a, b) => a.z - b.z);

      for (let i = 0; i < totalPoints; i++) {
        const p = renderPoints[i];
        const alpha = 0.4 + (p.z + 1) * 0.55;
        ctx.fillStyle = `rgba(15, 98, 254, ${Math.min(1, alpha)})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.restore();
    };

    const render = (now: number) => {
      if (!isVisible || !isStarted) {
        animId = 0;
        return;
      }

      if (now - lastFrameTime >= targetIntervalMs) {
        drawFrame(angle);
        angle += 0.02;
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
        isVisible = entry ? entry.isIntersecting : true;

        if (isVisible && isStarted && !prefersReducedMotion && animId === 0) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );

    intersectionObserver.observe(canvasRef);

    let startTimer: ReturnType<typeof setTimeout> | null = null;

    const startAnimation = () => {
      if (isStarted) return;
      isStarted = true;
      if (isVisible && !prefersReducedMotion && animId === 0) {
        animId = requestAnimationFrame(render);
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('scroll', startAnimation);
      window.removeEventListener('pointermove', startAnimation);
      window.removeEventListener('touchstart', startAnimation);
    };

    window.addEventListener('scroll', startAnimation, { passive: true, once: true });
    window.addEventListener('pointermove', startAnimation, { passive: true, once: true });
    window.addEventListener('touchstart', startAnimation, { passive: true, once: true });

    if (!prefersReducedMotion) {
      startTimer = setTimeout(startAnimation, 6000);
    }

    return () => {
      cleanupListeners();
      if (startTimer) clearTimeout(startTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  });
</script>

<canvas bind:this={canvasRef} class="block size-full"></canvas>
