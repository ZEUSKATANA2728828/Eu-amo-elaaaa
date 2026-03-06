/* ===========================
   TREINO AMALDIÇOADO — JS
   =========================== */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor-trail');
let mouseX = -100, mouseY = -100;
let curX = -100, curY = -100;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  curX += (mouseX - curX) * 0.15;
  curY += (mouseY - curY) * 0.15;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
    cursor.style.borderColor = '#e74c3c';
    cursor.style.background = 'rgba(231, 76, 60, 0.15)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = 'transparent';
  });
});

/* ── PARTICLES ── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6
      ? `rgba(192, 57, 43, ${this.opacity})`
      : `rgba(108, 52, 131, ${this.opacity})`;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity * (1 - this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) {
  const p = new Particle();
  p.y = Math.random() * canvas.height;
  p.life = Math.random() * p.maxLife;
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── HEADER SCROLL ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

/* ── ACTIVE NAV ── */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ── MOBILE MENU ── */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── START BUTTON ── */
document.getElementById('start-btn').addEventListener('click', () => {
  const resistencia = document.getElementById('resistencia');
  if (resistencia) {
    resistencia.scrollIntoView({ behavior: 'smooth' });
    // Energy burst effect
    createEnergyBurst(mouseX, mouseY);
  }
});

function createEnergyBurst(x, y) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:fixed; left:${x}px; top:${y}px;
    width:6px; height:6px;
    background:var(--red-bright);
    border-radius:50%;
    pointer-events:none;
    z-index:9998;
    transform:translate(-50%,-50%);
    box-shadow: 0 0 20px var(--red-glow);
  `;
  document.body.appendChild(burst);

  const rings = [40, 80, 120];
  rings.forEach((size, i) => {
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:fixed;
      left:${x}px; top:${y}px;
      width:${size}px; height:${size}px;
      border:1px solid rgba(192,57,43,0.7);
      border-radius:50%;
      pointer-events:none;
      z-index:9997;
      transform:translate(-50%,-50%) scale(0);
      animation: burstRing 0.6s ease-out ${i * 0.1}s forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 800 + i * 100);
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes burstRing{to{transform:translate(-50%,-50%) scale(1);opacity:0}}`;
  document.head.appendChild(style);

  setTimeout(() => burst.remove(), 600);
}

/* ── TIMER ── */
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 0;
let seriesCount = 1;

const timerDisplay = document.getElementById('timer-display');
const timerStart = document.getElementById('timer-start');
const timerReset = document.getElementById('timer-reset');
const seriesCountEl = document.getElementById('series-count');
const seriesPlus = document.getElementById('series-plus');
const seriesMinus = document.getElementById('series-minus');

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

timerStart.addEventListener('click', () => {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerStart.textContent = 'CONTINUAR';
    timerStart.style.background = 'rgba(192,57,43,0.5)';
  } else {
    timerRunning = true;
    timerStart.textContent = 'PAUSAR';
    timerStart.style.background = '';
    timerInterval = setInterval(() => {
      timerSeconds++;
      timerDisplay.textContent = formatTime(timerSeconds);
      // pulse every 10 seconds
      if (timerSeconds % 10 === 0) {
        timerDisplay.style.textShadow = '0 0 30px var(--red-glow), 0 0 60px rgba(192,57,43,0.5)';
        setTimeout(() => timerDisplay.style.textShadow = '', 300);
      }
    }, 1000);
  }
});

timerReset.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  timerDisplay.textContent = '00:00';
  timerStart.textContent = 'INICIAR';
  timerStart.style.background = '';
});

seriesPlus.addEventListener('click', () => {
  if (seriesCount < 9) {
    seriesCount++;
    seriesCountEl.textContent = seriesCount;
    seriesCountEl.style.textShadow = '0 0 20px var(--red-glow)';
    setTimeout(() => seriesCountEl.style.textShadow = '', 300);
  }
});

seriesMinus.addEventListener('click', () => {
  if (seriesCount > 1) {
    seriesCount--;
    seriesCountEl.textContent = seriesCount;
  }
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-20px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── STRIKE BUTTONS ── */
const strikeBtns = document.querySelectorAll('.strike-btn');
const comboDisplay = document.getElementById('combo-display');

strikeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const combo = btn.dataset.combo;
    const desc = btn.dataset.desc;

    // Animate display
    comboDisplay.style.transform = 'scale(0.95)';
    comboDisplay.innerHTML = `<span style="font-size:1.5rem;letter-spacing:0.1em;color:var(--red-bright)">${combo}</span>`;

    setTimeout(() => {
      comboDisplay.style.transform = 'scale(1)';
    }, 100);

    setTimeout(() => {
      comboDisplay.innerHTML = `<span class="combo-desc">${desc}</span>`;
    }, 1500);

    // Visual strike flash
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;
      background:rgba(192,57,43,0.04);
      pointer-events:none;z-index:9990;
      animation:flashFade 0.3s ease-out forwards;
    `;
    const flashStyle = document.createElement('style');
    flashStyle.textContent = `@keyframes flashFade{0%{opacity:1}100%{opacity:0}}`;
    document.head.appendChild(flashStyle);
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
  });
});

/* ── DEFENSE ITEMS HOVER ANIMATE ── */
document.querySelectorAll('.defense-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateX(6px)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

/* ── ROUTINE STEPS OBSERVER ── */
const routineSteps = document.querySelectorAll('.routine-step');
const routineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
    }
  });
}, { threshold: 0.2 });

routineSteps.forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateX(-30px)';
  step.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
  routineObserver.observe(step);
});

/* ── ENERGY BUTTON MOUSE TRACK ── */
document.querySelectorAll('.btn-energy').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.background = `radial-gradient(circle at ${x}% ${y}%, #e74c3c, #c0392b)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '';
  });
});

/* ── CARDS TILT EFFECT ── */
document.querySelectorAll('.exercise-card, .tip-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.3s ease';
  });
});

/* ── FIGHT BLOCK ENTRANCE ── */
document.querySelectorAll('.fight-block').forEach(block => {
  block.addEventListener('mouseenter', () => {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute;inset:0;pointer-events:none;
      background:linear-gradient(135deg,rgba(192,57,43,0.05),transparent);
      z-index:0;transition:opacity 0.3s;
    `;
    block.appendChild(glow);
    setTimeout(() => { if (glow.parentNode) glow.remove(); }, 1000);
  });
});

/* ── KANJI PARALLAX ── */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.bg-kanji').forEach(k => {
    k.style.transform = `translateY(${-scrollY * 0.05}px)`;
  });
  document.querySelectorAll('.hero-kanji span').forEach((k, i) => {
    k.style.transform = `translateY(${-scrollY * (0.03 + i * 0.01)}px)`;
  });
});

/* ── ROUTINE ACTIVE STATE ── */
const routineObserver2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const circles = document.querySelectorAll('.step-circle');
      circles.forEach((c, i) => {
        setTimeout(() => {
          c.style.borderColor = 'rgba(192,57,43,0.8)';
          c.style.boxShadow = '0 0 15px rgba(192,57,43,0.4)';
        }, i * 200);
      });
    }
  });
}, { threshold: 0.3 });

const routineSection = document.getElementById('rotina');
if (routineSection) routineObserver2.observe(routineSection);

/* ── HEADER LOGO CLICK ── */
document.querySelector('.logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── INIT LOG ── */
console.log(`
  ████████╗██████╗ ███████╗██╗███╗   ██╗ ██████╗ 
     ██╔══╝██╔══██╗██╔════╝██║████╗  ██║██╔═══██╗
     ██║   ██████╔╝█████╗  ██║██╔██╗ ██║██║   ██║
     ██║   ██╔══██╗██╔══╝  ██║██║╚██╗██║██║   ██║
     ██║   ██║  ██║███████╗██║██║ ╚████║╚██████╔╝
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
  
  TREINO AMALDIÇOADO — Sistema iniciado. Nenhuma desculpa.
`);
