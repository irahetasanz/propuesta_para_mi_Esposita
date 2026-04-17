/* ══════════════════════════════════════
   script.js — Propuesta para Rebeca 💖
   Animaciones de nivel profesional
══════════════════════════════════════ */

// ─── ESTRELLAS ANIMADAS EN CAP0 ─────
(function initStars() {
  const layer = document.getElementById('starsLayer');
  if (!layer) return;

  const COUNT = 120;
  for (let i = 0; i < COUNT; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);
    const bright = Math.random() > 0.85;

    star.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bright ? '#D4AF7A' : '#FAF5F0'};
      opacity: 0;
      animation: starTwinkle ${dur}s ${delay}s ease-in-out infinite;
      box-shadow: 0 0 ${bright ? '6px' : '2px'} currentColor;
      color: ${bright ? '#D4AF7A' : 'rgba(250,245,240,0.6)'};
    `;
    layer.appendChild(star);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes starTwinkle {
      0%,100% { opacity: 0; transform: scale(0.8); }
      40%,60% { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
})();

// ─── PARTÍCULAS GLOBALES (canvas fijo) ─
(function initGlobalParticles() {
  const canvas = document.getElementById('globalParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const COUNT = 55;

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial
        ? Math.random() * canvas.height
        : canvas.height + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.15);
      this.alpha = 0;
      this.targetAlpha = Math.random() * 0.35 + 0.05;
      this.r = Math.random() * 1.5 + 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.isGold = Math.random() > 0.7;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const progress = this.life / this.maxLife;
      if (progress < 0.15) {
        this.alpha = (progress / 0.15) * this.targetAlpha;
      } else if (progress > 0.75) {
        this.alpha = ((1 - progress) / 0.25) * this.targetAlpha;
      } else {
        this.alpha = this.targetAlpha;
      }
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold
        ? `rgba(212,175,122,${this.alpha})`
        : `rgba(232,160,180,${this.alpha * 0.8})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── NAVEGACIÓN ENTRE CAPÍTULOS ───────
function goTo(id) {
  const current = document.querySelector('.chapter.active');
  const next = document.getElementById(id);
  if (!next || next === current) return;

  // Fade out suave con blur
  current.style.transition = 'opacity 0.7s ease, filter 0.7s ease';
  current.style.opacity = '0';
  current.style.filter = 'blur(4px)';
  current.style.pointerEvents = 'none';

  setTimeout(() => {
    current.classList.remove('active');
    current.style.opacity = '';
    current.style.filter = '';
    current.style.transition = '';

    next.classList.add('active');

    // Activar animaciones del capítulo
    if (id === 'cap3') startTypewriter();
    if (id === 'cap4') startPetalRain();
    if (id === 'cap5') {
      startConfetti();
      startHeartsRain();
    }
  }, 700);
}

// ─── FLIP CARDS ───────────────────────
function flipCard(el) {
  el.classList.toggle('flipped');
}

// ─── TYPEWRITER ───────────────────────
const MESSAGE = `Mi amor, a veces las palabras se me quedan cortas para expresarte todo lo que siento por usted. Todo lo que le expreso siempre no es ni una cuarta parte del amor que tengo, mi princesita.

Usted que estudia la psicología y conoce a la perfección mi comportamiento, sabe todo lo que a veces expreso sin palabras — mis acciones, mi manera de reaccionar, amor.

Desde que me dio la oportunidad de robarme su corazón, de tener su confianza, de ser parte de su ser... mi vida ha cambiado. Veo las cosas de diferente forma, mi vida tomó un rumbo increíble.

He pensado mucho en cómo decirte esto — cuándo será el momento, cuándo ❤️ y dónde — y creo que hoy es EL DÍA, MI AMOR.`;

let typewriterStarted = false;

function startTypewriter() {
  if (typewriterStarted) return;
  typewriterStarted = true;

  const el = document.getElementById('typewriterText');
  const btn = document.getElementById('btnCap4');
  if (!el) return;

  let i = 0;
  let paused = false;

  function type() {
    if (i < MESSAGE.length) {
      const ch = MESSAGE[i];

      if (ch === '\n') {
        el.innerHTML += '<br><br>';
      } else {
        el.innerHTML += ch;
      }

      i++;

      // Pausa dramática en puntos suspensivos y puntos
      const pauseChars = ['.', '!', '?', '…'];
      const isEndOfSentence = pauseChars.includes(ch) && MESSAGE[i] === ' ';
      const delay = isEndOfSentence ? 300 : (ch === ',' ? 150 : 28);

      setTimeout(type, delay);
    } else {
      // Mostrar botón con animación
      setTimeout(() => {
        if (btn) {
          btn.classList.remove('hidden');
          btn.classList.add('show');
        }
      }, 600);
    }
  }

  // Pequeño retraso antes de empezar
  setTimeout(type, 400);
}

// ─── LLUVIA DE PÉTALOS ───────────────
let petalInterval = null;

function startPetalRain() {
  const container = document.getElementById('petalRain');
  if (!container) return;

  // Limpiar si ya había pétalos
  container.innerHTML = '';
  if (petalInterval) clearInterval(petalInterval);

  const symbols = ['🌸', '🌺', '🌷', '💮', '✿', '🌹', '💖', '💕'];
  let count = 0;

  function spawnPetal() {
    if (count > 70) return;
    const p = document.createElement('div');
    p.className = 'petal';

    const dur   = (Math.random() * 5 + 5).toFixed(1);
    const left  = Math.random() * 105 - 2.5;
    const delay = (Math.random() * 4).toFixed(1);
    const size  = (Math.random() * 0.7 + 0.7).toFixed(2);

    // Mezcla emojis y formas SVG para más variedad
    if (Math.random() > 0.4) {
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.fontSize = size + 'rem';
    } else {
      // Pétalo SVG sutil
      const colors = ['rgba(232,160,180,0.6)', 'rgba(212,175,122,0.5)', 'rgba(194,96,122,0.5)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      p.innerHTML = `<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="7" cy="9" rx="5" ry="8" fill="${color}" transform="rotate(${Math.random()*40-20} 7 9)"/>
      </svg>`;
    }

    p.style.cssText += `
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      will-change: transform;
    `;
    container.appendChild(p);
    count++;
  }

  // Lluvia inicial escalonada
  for (let i = 0; i < 35; i++) {
    setTimeout(spawnPetal, i * 120);
  }

  // Continúa generando
  petalInterval = setInterval(() => {
    if (count < 70) spawnPetal();
  }, 600);
}

// ─── BOTÓN "NO" QUE HUYE ────────────
let noClickCount = 0;

function runAway(btn) {
  noClickCount++;
  const row = document.getElementById('btnRow');
  if (!row) return;

  const rowRect = row.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = rowRect.width - btnRect.width;
  const maxY = 70;

  // Se vuelve más pequeño y transparente con cada intento
  const opacity = Math.max(0.05, 0.25 - noClickCount * 0.04);
  const scale   = Math.max(0.6, 1 - noClickCount * 0.06);

  btn.style.position   = 'absolute';
  btn.style.transition = 'left 0.2s cubic-bezier(0.4,0,0.2,1), top 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.3s, transform 0.3s';
  btn.style.left       = Math.max(0, Math.random() * maxX) + 'px';
  btn.style.top        = ((Math.random() - 0.5) * maxY) + 'px';
  btn.style.opacity    = opacity.toString();
  btn.style.transform  = `scale(${scale})`;

  // Después de muchos intentos desaparece del todo
  if (noClickCount >= 6) {
    setTimeout(() => {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }, 300);
  }
}

// ─── RESPUESTA SÍ ─────────────────────
function yesAnswer() {
  goTo('cap5');
}

// ─── CONFETI (canvas) ─────────────────
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Paleta romántica
  const colors = [
    '#E8A0B4', '#C2607A', '#D4AF7A', '#F0D4A0',
    '#A594D4', '#C8BCEC', '#FAF5F0', '#9DC4B5',
    '#F08080', '#FFB6C1', '#DDA0DD'
  ];

  const particles = [];

  class Piece {
    constructor(initial) {
      this.reset(initial);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial
        ? (Math.random() * canvas.height - canvas.height)
        : -12;
      this.w = Math.random() * 9 + 3;
      this.h = this.w * (Math.random() * 0.5 + 0.3);
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vy = Math.random() * 2.5 + 1.5;
      this.vx = (Math.random() - 0.5) * 2;
      this.rot = Math.random() * 360;
      this.rotV = (Math.random() - 0.5) * 6;
      this.alpha = Math.random() * 0.4 + 0.5;
      this.type = Math.random() < 0.3 ? 'circle' : (Math.random() < 0.5 ? 'rect' : 'heart');
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    }
    update() {
      this.y  += this.vy;
      this.x  += this.vx + Math.sin(this.wobble) * 0.5;
      this.rot += this.rotV;
      this.wobble += this.wobbleSpeed;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;

      if (this.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'rect') {
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      } else {
        // Pequeño corazón
        const s = this.w / 14;
        ctx.beginPath();
        ctx.moveTo(0, s * 3);
        ctx.bezierCurveTo(-s*7, -s*2, -s*14, s*4, 0, s*12);
        ctx.bezierCurveTo(s*14, s*4, s*7, -s*2, 0, s*3);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Explotar confeti desde el centro al inicio
  for (let i = 0; i < 140; i++) {
    const p = new Piece(true);
    particles.push(p);
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Añadir más confeti al principio
    if (frame < 60 && frame % 3 === 0) {
      particles.push(new Piece());
    }
    particles.forEach(p => { p.update(); p.draw(); });
    frame++;
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── LLUVIA DE CORAZONES (cap5) ───────
function startHeartsRain() {
  const container = document.getElementById('heartsRain');
  if (!container) return;
  container.innerHTML = '';

  const hearts = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞'];
  let count = 0;

  function spawnHeart() {
    if (count > 40) return;
    const h = document.createElement('div');
    h.className = 'heart-drop';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const dur   = (Math.random() * 4 + 3).toFixed(1);
    const left  = Math.random() * 100;
    const delay = (Math.random() * 3).toFixed(1);
    const size  = (Math.random() * 0.6 + 0.6).toFixed(2);

    h.style.cssText = `
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      font-size: ${size}rem;
    `;
    container.appendChild(h);
    count++;
  }

  for (let i = 0; i < 25; i++) setTimeout(spawnHeart, i * 150);
  setInterval(() => { if (count < 40) spawnHeart(); }, 500);
}

// ─── EFECTO HOVER EN NOMBRE (cap0) ───
document.addEventListener('DOMContentLoaded', () => {
  const letters = document.querySelectorAll('.name-letter');
  letters.forEach(l => {
    l.addEventListener('mouseenter', () => {
      l.style.transition = 'transform 0.3s, color 0.3s, text-shadow 0.3s';
      l.style.transform = 'translateY(-8px) scale(1.1)';
      l.style.color = 'var(--rose)';
      l.style.textShadow = '0 0 40px rgba(232,160,180,0.7)';
    });
    l.addEventListener('mouseleave', () => {
      l.style.transform = '';
      l.style.color = '';
      l.style.textShadow = '';
    });
  });

  // Click en toda la pantalla de inicio también navega
  const cap0 = document.getElementById('cap0');
  if (cap0) {
    cap0.addEventListener('click', (e) => {
      // Solo si no clickeó el botón
      if (!e.target.closest('.btn-start')) {
        // no hacer nada extra, el botón ya tiene su onclick
      }
    });
  }
});