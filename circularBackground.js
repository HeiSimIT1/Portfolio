/**
 * USAGE: Place this HTML snippet inside your webpage:
 *
 * <div id="circle-background" style="position:fixed; inset:0; z-index:-1; overflow:hidden;">
 *   <canvas id="orbit-canvas"></canvas>
 * </div>
 * <script src="circularBackground.js"></script>
 */

(function () {
    const canvas = document.getElementById('orbit-canvas');
    const parent = document.getElementById('circle-background');
    const ctx = canvas.getContext('2d');
  
    // === GLOBAL SPEED CONTROL ===
    const SPEED_MULTIPLIER = 0.1250; // Change this value to control speed
  
    function resize() {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  
    const orbs = [];
    const orbCount = 40;
  
    // Initialize orbs
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        radius: Math.random() * 80 + 30,
        size: Math.random() * 4 + 2,
        baseSpeed: 0.001 + Math.random() * 0.002,
        angle: Math.random() * Math.PI * 2,
        color: 'orange', // All squares are orange
        x: 0,
        y: 0,
        connections: []
      });
    }
  
    // Precompute permanent connections (3 nearest neighbors)
    function initializeConnections() {
      for (let i = 0; i < orbs.length; i++) {
        const a = orbs[i];
        const distances = orbs.map((b, j) => {
          if (i === j) return { j, dist: Infinity };
          const dx = Math.cos(a.angle) * a.radius - Math.cos(b.angle) * b.radius;
          const dy = Math.sin(a.angle) * a.radius - Math.sin(b.angle) * b.radius;
          return { j, dist: dx * dx + dy * dy };
        });
        distances.sort((a, b) => a.dist - b.dist);
        a.connections = distances.slice(0, 3).map(d => d.j);
      }
    }
  
    initializeConnections();
  
    function draw(time) {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
  
      // Clear background
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, w, h);
  
      // Update orb positions and draw square "dots"
      for (const orb of orbs) {
        const angle = orb.angle + time * orb.baseSpeed * SPEED_MULTIPLIER;
        orb.x = cx + Math.cos(angle) * orb.radius * 2;
        orb.y = cy + Math.sin(angle) * orb.radius * 2;
  
        ctx.fillStyle = orb.color;
        ctx.fillRect(orb.x - orb.size / 2, orb.y - orb.size / 2, orb.size, orb.size);
      }
  
      // Draw permanent connections
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < orbs.length; i++) {
        const a = orbs[i];
        for (const j of a.connections) {
          const b = orbs[j];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
  
      requestAnimationFrame(draw);
    }
  
    requestAnimationFrame(draw);
  })();
  