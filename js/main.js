// =============================================
//  PLH ROBOTICS — Main JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Tema claro/oscuro ──
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('theme-toggle');
  const themeIcon  = themeBtn?.querySelector('.theme-icon');
  const saved      = localStorage.getItem('plh-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  if (themeIcon) themeIcon.textContent = saved === 'dark' ? '☀' : '🌙';

  themeBtn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('plh-theme', next);
    if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀' : '🌙';
  });

  // ── Animación canvas hero (nodos conectados) ──
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx  = canvas.getContext('2d');
    let W, H, nodes, animId;
    const NUM  = 55;
    const DIST = 140;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = Array.from({ length: NUM }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const nodeColor = isDark ? 'rgba(45,111,245,' : 'rgba(26,79,216,';
      const lineColor = isDark ? 'rgba(0,212,255,'  : 'rgba(0,153,204,';

      for (let i = 0; i < NUM; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;

        for (let j = i + 1; j < NUM; j++) {
          const b    = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < DIST) {
            const alpha = (1 - dist / DIST) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lineColor + alpha + ')';
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor + '0.7)';
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();
    window.addEventListener('resize', () => { resize(); initNodes(); });
  }

  // ── Navbar scroll ──
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Hamburger ──
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  // ── Scroll reveal ──
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Cards reveal inicial ──
  function revealVisibleCards() {
    const cardObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 100);
          cardObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.project-card:not(.extra-hidden):not(.filtered-out)').forEach(c => cardObs.observe(c));
  }
  revealVisibleCards();

  // ── FILTROS ──
  const allCards     = Array.from(document.querySelectorAll('.project-card'));
  const noResults    = document.getElementById('no-results');
  const toggleWrap   = document.getElementById('projects-toggle');
  let activeFilters  = { cat: 'todos', diff: 'todos', cost: 'todos' };
  // Cards 4+ están ocultas por defecto hasta "ver más"
  const INITIAL_SHOW = 3;
  let showAll        = false;

  function applyFilters() {
    let visible = 0;
    allCards.forEach(card => {
      const matchCat  = activeFilters.cat  === 'todos' || card.dataset.cat  === activeFilters.cat;
      const matchDiff = activeFilters.diff === 'todos' || card.dataset.diff === activeFilters.diff;
      const matchCost = activeFilters.cost === 'todos' || card.dataset.cost === activeFilters.cost;
      const passes    = matchCat && matchDiff && matchCost;

      card.classList.remove('filtered-out', 'extra-hidden');
      if (!passes) {
        card.classList.add('filtered-out');
      } else {
        visible++;
        // si no está en modo "ver más" y supera el límite, ocultar
        if (!showAll && visible > INITIAL_SHOW) {
          card.classList.add('extra-hidden');
        } else {
          setTimeout(() => card.classList.add('visible'), visible * 80);
        }
      }
    });

    const anyFilter  = Object.values(activeFilters).some(v => v !== 'todos');
    noResults.style.display = visible === 0 ? 'block' : 'none';
    // Mostrar botón si: hay cards extra-hidden (ver más) O si showAll=true (para poder ver menos)
    const hiddenExtra = allCards.filter(c => c.classList.contains('extra-hidden')).length;
    if (anyFilter) {
      toggleWrap.style.display = 'none';
    } else if (showAll) {
      toggleWrap.style.display = 'block'; // siempre visible para poder colapsar
    } else {
      toggleWrap.style.display = hiddenExtra > 0 ? 'block' : 'none';
    }
  }

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const filterType = chip.dataset.filter;
      const filterVal  = chip.dataset.val;
      activeFilters[filterType] = filterVal;
      showAll = false;

      // Update active chip in that group
      chip.closest('.filter-chips').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Reset card visibility before refiltering
      allCards.forEach(c => { c.classList.remove('visible', 'extra-hidden', 'filtered-out'); });
      applyFilters();
    });
  });

  // Reset filters button (inside no-results)
  document.getElementById('reset-filters')?.addEventListener('click', () => {
    activeFilters = { cat: 'todos', diff: 'todos', cost: 'todos' };
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('active', c.dataset.val === 'todos');
    });
    allCards.forEach(c => c.classList.remove('visible', 'extra-hidden', 'filtered-out'));
    showAll = false;
    applyFilters();
  });

  // ── Ver más / Ver menos ──
  const toggleBtn = document.getElementById('toggle-projects');
  toggleBtn?.addEventListener('click', () => {
    showAll = !showAll;
    allCards.forEach(c => c.classList.remove('visible', 'extra-hidden', 'filtered-out'));
    applyFilters();
    toggleBtn.querySelector('.toggle-text').textContent = showAll ? 'Ver menos' : 'Ver más proyectos';
    toggleBtn.querySelector('.toggle-icon').textContent = showAll ? '▲' : '▼';
    if (!showAll) document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  });

  applyFilters();

  // ── Modal solicitar proyecto ──
  const overlay   = document.getElementById('modal-overlay');
  const form      = document.getElementById('project-form');
  const success   = document.getElementById('form-success');
  document.getElementById('open-modal')?.addEventListener('click',  () => overlay.classList.add('open'));
  document.getElementById('close-modal')?.addEventListener('click', () => overlay.classList.remove('open'));
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay?.classList.remove('open'); });
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText  = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.style.display    = 'none';
        success.style.display = 'block';
        setTimeout(() => {
          overlay.classList.remove('open');
          setTimeout(() => {
            form.style.display    = 'block';
            success.style.display = 'none';
            form.reset();
            submitBtn.textContent = origText;
            submitBtn.disabled    = false;
          }, 400);
        }, 3000);
      } else { throw new Error(); }
    } catch {
      submitBtn.textContent = '⚠ Error — intenta de nuevo';
      submitBtn.disabled    = false;
      setTimeout(() => { submitBtn.textContent = origText; }, 3000);
    }
  });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ── Counter animado ──
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el  = e.target;
        const end = parseInt(el.dataset.target, 10);
        let cur   = 0;
        const step = end / (1500 / 16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(t); }
          el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
        }, 16);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObs.observe(el));

});

// ── Widget de idioma (index) ──
(function() {
  const langBtn      = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langCurrent  = document.getElementById('lang-current');
  const langLabels   = { es:'ES', en:'EN', pt:'PT', fr:'FR', de:'DE', ja:'JA' };

  langBtn?.addEventListener('click', e => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => langDropdown?.classList.remove('open'));

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang    = btn.dataset.lang;
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);

      if (lang === 'es') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
      } else {
        document.cookie = `googtrans=/es/${lang}; expires=${expires.toUTCString()}; path=/`;
        document.cookie = `googtrans=/es/${lang}; expires=${expires.toUTCString()}; path=/; domain=${location.hostname}`;
      }

      document.querySelectorAll('.lang-option').forEach(o => o.classList.remove('active'));
      btn.classList.add('active');
      if (langCurrent) langCurrent.textContent = langLabels[lang] || lang.toUpperCase();
      langDropdown?.classList.remove('open');
      location.reload();
    });
  });

  const match = document.cookie.match(/googtrans=\/es\/([a-z]+)/);
  if (match) {
    const activeLang = match[1];
    if (langCurrent) langCurrent.textContent = langLabels[activeLang] || activeLang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(o => {
      o.classList.toggle('active', o.dataset.lang === activeLang);
    });
  }
})();
