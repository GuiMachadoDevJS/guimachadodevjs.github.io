/* ════════════════════════════════════════
   GMP Dev — main.js  v3.0
   Guilherme Pelegrino · gmpdev.com.br
════════════════════════════════════════ */
'use strict';

/* ── 1. BARRA DE PROGRESSO DE LEITURA ── */
const readBar = document.getElementById('read-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  readBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ── 2. CURSOR PERSONALIZADO ── */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const glow = document.getElementById('cursorGlow');
const isTouch = window.matchMedia('(hover:none)').matches;
if (isTouch) {
  [dot, ring, glow].forEach(el => { if (el) el.style.display = 'none'; });
} else {
  ring.style.display = 'none';
  glow.style.display = 'none';
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  });
  // ring cresce em links e botões
  document.querySelectorAll('a,button,.project-card,.skill-card,.servico-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  // lag suave
  (function animRing() {
    requestAnimationFrame(animRing);
  })();
}

/* ── 3. SCROLL REVEAL ── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// stagger em grids
document.querySelectorAll('.projects-grid,.skills-grid,.servicos-grid,.depoimentos-grid,.aprendendo-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i * 0.07) + 's'; });
});

/* ── 4. SCROLL TO TOP ── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 5. MOBILE NAV ── */
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  mobileBtn.innerHTML = mobileMenu.classList.contains('open')
    ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});
window.closeMobile = () => {
  mobileMenu.classList.remove('open');
  mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
};

/* ── 6. DARK / LIGHT TOGGLE ── */
const themeBtn = document.getElementById('themeToggle');
const themeIcon = themeBtn.querySelector('i');
let isDark = true;
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('gmp-theme', isDark ? 'dark' : 'light');
});
// restaura preferência
if (localStorage.getItem('gmp-theme') === 'light') {
  isDark = false;
  document.body.classList.add('light');
  themeIcon.className = 'fas fa-moon';
}

/* ── 7. TYPING HERO ── */
const phrases = [
  'Full Stack Developer',
  'IA no fluxo 🤖',
  'Node.js & PHP',
  'PostgreSQL Lover',
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('hero-typed');
function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ── 8. CONTADORES ANIMADOS ── */
function animCount(el, target, suffix) {
  let start = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.innerHTML = start + '<span>' + suffix + '</span>';
    if (start >= target) clearInterval(timer);
  }, 35);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animCount(el, parseInt(el.dataset.target), el.dataset.suffix || '');
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

/* ── 9. HORÁRIO AO VIVO ── */
function updateTime() {
  const el = document.getElementById('live-time');
  if (!el) return;
  const now = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
  const hour = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false });
  const avail = parseInt(hour) >= 8 && parseInt(hour) < 22;
  el.textContent = now + ' em Guarulhos — ' + (avail ? 'disponível agora' : 'fora do horário');
  const dot = document.querySelector('.time-dot');
  if (dot) dot.style.background = avail ? 'var(--green)' : '#f59e0b';
}
updateTime();
setInterval(updateTime, 30000);

/* ── 10. PARTÍCULAS NO HERO ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 600 ? 30 : 60;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1000, y: Math.random() * 800,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5, op: Math.random() * .5 + .1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${p.op})`;
      ctx.fill();
    });
    // conexões
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 120) * 0.15})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 11. DEPOIMENTOS TABS ── */
document.querySelectorAll('.dep-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dep-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.depoimento-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.source === filter ? '' : 'none';
    });
  });
});

/* ── 12. FAQ ACORDEÃO ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── 13. FORM SERVICES TOGGLE ── */
window.toggleService = el => el.classList.toggle('active');

/* ── 14. FORM SUBMIT → WHATSAPP ── */
window.submitForm = function () {
  const nome = document.getElementById('cNome').value.trim();
  const tel = document.getElementById('cTel').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  if (!nome || !tel || !msg) { alert('Por favor preencha: Nome, WhatsApp e Mensagem.'); return; }
  const services = [...document.querySelectorAll('.form-service-opt.active')].map(s => s.textContent).join(', ');
  const email = document.getElementById('cEmail').value.trim();
  const text = `Olá Guilherme! Vim pelo portfólio GMPDev.\n\n*Nome:* ${nome}\n*Tel:* ${tel}${email ? '\n*E-mail:* ' + email : ''}${services ? '\n*Serviços:* ' + services : ''}\n\n*Mensagem:*\n${msg}`;
  window.open('https://wa.me/5511944474451?text=' + encodeURIComponent(text), '_blank');
  document.getElementById('successName').textContent = nome;
  document.getElementById('formContent').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
};

/* ── 15. IMAGENS FALLBACK ── */
document.querySelectorAll('.project-screenshot-img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const ph = this.closest('.project-screenshot').querySelector('.project-screenshot-placeholder');
    if (ph) ph.style.display = 'flex';
  });
});

/* ── 16. MODAL ORÇAMENTO ── */
let orcServices = [];
window.openOrcamento = () => { document.getElementById('orcModal').classList.add('open'); document.body.style.overflow = 'hidden'; };
window.closeOrcamento = () => { document.getElementById('orcModal').classList.remove('open'); document.body.style.overflow = ''; };
document.getElementById('orcModal').addEventListener('click', e => { if (e.target === document.getElementById('orcModal')) window.closeOrcamento(); });
window.toggleOrcService = (el, name) => {
  el.classList.toggle('selected');
  orcServices = el.classList.contains('selected')
    ? [...new Set([...orcServices, name])]
    : orcServices.filter(s => s !== name);
};
const stepLabels = ['', '1 — Escolha os serviços', '2 — Seus dados', '3 — Confirmar'];
window.goStep = n => {
  document.querySelectorAll('.orcamento-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n).classList.add('active');
  [1, 2, 3].forEach(i => {
    const d = document.getElementById('sd' + i);
    d.classList.remove('active', 'done');
    if (i < n) d.classList.add('done'); else if (i === n) d.classList.add('active');
  });
  document.getElementById('stepLabel').textContent = stepLabels[n];
  if (n === 3) renderSummary();
};
function renderSummary() {
  const v = id => document.getElementById(id).value || '—';
  document.getElementById('orcSummary').innerHTML = `
    <div class="summary-row"><span class="key">Serviços</span><span class="val">${orcServices.join(', ') || '—'}</span></div>
    <div class="summary-row"><span class="key">Nome</span><span class="val">${v('oNome')}</span></div>
    <div class="summary-row"><span class="key">WhatsApp</span><span class="val">${v('oTel')}</span></div>
    <div class="summary-row"><span class="key">E-mail</span><span class="val">${v('oEmail')}</span></div>
    <div class="summary-row"><span class="key">Prazo</span><span class="val">${v('oPrazo')}</span></div>
    <div class="summary-row"><span class="key">Projeto</span><span class="val" style="white-space:pre-wrap">${v('oDesc')}</span></div>`;
}
window.sendOrcamento = function () {
  const nome = document.getElementById('oNome').value.trim();
  const tel = document.getElementById('oTel').value.trim();
  if (!nome || !tel) { alert('Preencha nome e WhatsApp.'); window.goStep(2); return; }
  const email = document.getElementById('oEmail').value.trim();
  const prazo = document.getElementById('oPrazo').value;
  const desc = document.getElementById('oDesc').value.trim();
  const text = `Olá Guilherme! Vim pelo portfólio GMPDev.\n\n*Orçamento*\n*Serviços:* ${orcServices.join(', ') || '—'}\n*Nome:* ${nome}\n*Tel:* ${tel}${email ? '\n*E-mail:* ' + email : ''}${prazo ? '\n*Prazo:* ' + prazo : ''}${desc ? '\n\n*Projeto:*\n' + desc : ''}`;
  window.open('https://wa.me/5511944474451?text=' + encodeURIComponent(text), '_blank');
  window.closeOrcamento();
};

/* ── 17. GITHUB API ── */
(async function loadGitHub() {
  const user = 'GuiMachadoDevJS';
  const reposEl = document.getElementById('github-repos');
  const starsEl = document.getElementById('gh-stars');
  const reposCountEl = document.getElementById('gh-repos-count');
  if (!reposEl) return;

  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`);
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error('rate limit');

    const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
    if (starsEl) starsEl.textContent = totalStars;
    if (reposCountEl) reposCountEl.textContent = repos.length;

    const top = repos
      .filter(r => !r.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    reposEl.innerHTML = top.map(r => `
      <a class="repo-card reveal" href="${r.html_url}" target="_blank" rel="noopener">
        <div>
          <div class="repo-name">${r.name}</div>
          <div class="repo-desc">${r.description || ''}</div>
          <div class="repo-meta">
            ${r.language ? `<span class="repo-lang">${r.language}</span>` : ''}
            ${r.stargazers_count ? `<span class="repo-stars">★ ${r.stargazers_count}</span>` : ''}
          </div>
        </div>
        <i class="fas fa-arrow-right repo-arrow"></i>
      </a>`).join('');

    // re-observa os novos elementos
    reposEl.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  } catch {
    reposEl.innerHTML = '<p class="repos-loading">Veja os repositórios em <a href="https://github.com/GuiMachadoDevJS" target="_blank" style="color:var(--accent)">github.com/GuiMachadoDevJS</a></p>';
  }
})();

/* ── 18. ESC fecha modal ── */
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeOrcamento(); });

/* ════════════════════════════════════════
   NOVOS RECURSOS v4.0
════════════════════════════════════════ */

/* ── WHATSAPP FLUTUANTE: aparece após 3s ── */
setTimeout(() => {
  const wa = document.getElementById('waFloat');
  if (wa) wa.style.opacity = '1';
}, 3000);

/* ── EXIT INTENT ── */
let exitShown = false;
document.addEventListener('mouseleave', e => {
  if (e.clientY <= 0 && !exitShown && !sessionStorage.getItem('exitDismissed')) {
    exitShown = true;
    document.getElementById('exitOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});
// mobile: exit após 60s sem interação
let mobileExitTimer = setTimeout(() => {
  if (!exitShown && !sessionStorage.getItem('exitDismissed') && window.innerWidth < 768) {
    exitShown = true;
    document.getElementById('exitOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}, 60000);

window.closeExit = function () {
  document.getElementById('exitOverlay').classList.remove('open');
  document.body.style.overflow = '';
  sessionStorage.setItem('exitDismissed', '1');
};
window.sendExitLead = function () {
  const wa = document.getElementById('exitWa').value.trim();
  if (!wa) { document.getElementById('exitWa').focus(); return; }
  const msg = `Olá Guilherme! Vi seu portfólio e tenho interesse em uma proposta. Meu WhatsApp é ${wa}.`;
  window.open('https://wa.me/5511944474451?text=' + encodeURIComponent(msg), '_blank');
  window.closeExit();
};

/* ── MODO RECRUTADOR ── */
let recruiterMode = false;
const recruiterBtnEl = document.getElementById('recruiterBtn');
if (recruiterBtnEl) {
  recruiterBtnEl.addEventListener('click', () => {
    recruiterMode = true;
    document.body.classList.add('recruiter-mode');
    document.getElementById('recruiterBanner').style.display = 'flex';
    document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
  });
}
window.exitRecruiter = function () {
  recruiterMode = false;
  document.body.classList.remove('recruiter-mode');
  document.getElementById('recruiterBanner').style.display = 'none';
};

/* ── PREÇOS TOGGLE (projeto único / + manutenção) ── */
let precosManut = false;
window.togglePrecos = function () {
  precosManut = !precosManut;
  const btn = document.getElementById('precosToggle');
  btn.classList.toggle('on', precosManut);
  document.querySelectorAll('.preco-manut').forEach(el => {
    el.style.display = precosManut ? 'block' : 'none';
  });
};

/* ── CALCULADORA ── */
window.calcSelect = function (el, groupId) {
  document.querySelectorAll('#' + groupId + ' .calc-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  calcUpdate();
};

window.calcUpdate = function () {
  const tipoEl = document.querySelector('#calcTipo .calc-opt.selected');
  const prazoEl = document.querySelector('#calcPrazo .calc-opt.selected');
  const base = tipoEl ? parseFloat(tipoEl.dataset.val) : 500;
  const mult = prazoEl ? parseFloat(prazoEl.dataset.val) : 1;

  let extras = 0;
  document.querySelectorAll('#calcExtras input:checked').forEach(cb => {
    extras += parseInt(cb.value);
  });

  const low = Math.round((base + extras) * mult / 100) * 100;
  const high = Math.round(low * 1.4 / 100) * 100;

  document.getElementById('calcRange').textContent =
    'R$ ' + low.toLocaleString('pt-BR') + ' – R$ ' + high.toLocaleString('pt-BR');
  document.getElementById('cbBase').textContent = 'R$ ' + base.toLocaleString('pt-BR');

  const prazoLabel = prazoEl ? prazoEl.textContent.trim() : 'Normal';
  document.getElementById('cbPrazo').textContent =
    mult > 1 ? prazoLabel + ' (+40%)' : mult < 1 ? prazoLabel + ' (-15%)' : prazoLabel;

  const cbExtrasRow = document.getElementById('cbExtrasRow');
  if (extras > 0) {
    cbExtrasRow.style.display = 'flex';
    document.getElementById('cbExtras').textContent = '+ R$ ' + extras.toLocaleString('pt-BR');
  } else {
    cbExtrasRow.style.display = 'none';
  }
};

/* ── CÓDIGO AO VIVO (digitação sintaxe) ── */
(function initCodeTyper() {
  const el = document.getElementById('codeDisplay');
  if (!el) return;

  const code = [
    { t: 'cc', v: '// Olá! Bem-vindo ao meu portfólio 👋\n\n' },
    { t: 'ck', v: 'const ' },
    { t: 'co', v: 'dev ' },
    { t: '', v: '= ' },
    { t: 'cs', v: '"Guilherme Pelegrino"' },
    { t: '', v: ';\n' },
    { t: 'ck', v: 'const ' },
    { t: 'co', v: 'especialidade ' },
    { t: '', v: '= ' },
    { t: 'cs', v: '"Sites, sistemas e dashboards"' },
    { t: '', v: ';\n\n' },
    { t: 'ck', v: 'if ' },
    { t: '', v: '(' },
    { t: 'co', v: 'voce.precisaDeUmSite' },
    { t: '', v: ') {\n' },
    { t: '', v: '  ' },
    { t: 'co', v: 'console' },
    { t: '', v: '.' },
    { t: 'cf', v: 'log' },
    { t: '', v: '(' },
    { t: 'cs', v: '"Você está no lugar certo!"' },
    { t: '', v: ');\n' },
    { t: '', v: '  ' },
    { t: 'co', v: 'console' },
    { t: '', v: '.' },
    { t: 'cf', v: 'log' },
    { t: '', v: '(' },
    { t: 'cs', v: '"Entrego com qualidade e no prazo."' },
    { t: '', v: ');\n' },
    { t: '', v: '  ' },
    { t: 'ck', v: 'return ' },
    { t: 'cs', v: '"Vamos iniciar um projeto juntos? 👇"' },
    { t: '', v: ';\n' },
    { t: '', v: '}\n\n' },
    { t: 'cc', v: '// Me chama no WhatsApp — sem compromisso!' },
  ];

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.unobserve(el);
      let i = 0, j = 0;
      el.innerHTML = '';
      function typeChunk() {
        if (i >= code.length) return;
        const chunk = code[i];
        const chars = chunk.v.split('');
        function typeChar() {
          if (j >= chars.length) { i++; j = 0; setTimeout(typeChunk, 10); return; }
          const c = document.createElement(chunk.t ? 'span' : 'span');
          c.className = chunk.t || '';
          c.textContent += chars[j++];
          // append last char to last span or create new
          const last = el.lastChild;
          if (last && last.className === (chunk.t || '') && last.tagName === 'SPAN') {
            last.textContent += chars[j - 1];
            last.textContent = last.textContent.slice(0, -1); // undo double add
          }
          // simpler: rebuild
          el.innerHTML = '';
          let html = '';
          for (let ci = 0; ci < i; ci++) {
            html += code[ci].t
              ? `<span class="${code[ci].t}">${escHtml(code[ci].v)}</span>`
              : escHtml(code[ci].v);
          }
          // partial current chunk
          const partial = chars.slice(0, j).join('');
          html += chunk.t ? `<span class="${chunk.t}">${escHtml(partial)}</span>` : escHtml(partial);
          el.innerHTML = html;
          setTimeout(typeChar, chars[j - 1] === '\n' ? 30 : 18);
        }
        typeChar();
      }
      typeChunk();
    }
  }, { threshold: 0.1 });
  obs.observe(el);
})();

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
