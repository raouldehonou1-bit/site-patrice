
/* ── Hamburger ── */
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mobmenu');
hbg.addEventListener('click', () => {
  hbg.classList.toggle('open');
  mob.classList.toggle('open');
});
document.querySelectorAll('.mob-link, .mob-btns .btn').forEach(a => {
  a.addEventListener('click', () => {
    hbg.classList.remove('open');
    mob.classList.remove('open');
  });
});

/* ── Cursor ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cur = document.getElementById('cursor');
  const rng = document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop() {
    cur.style.transform = `translate(${mx-5}px,${my-5}px)`;
    rx += (mx-rx)*.12; ry += (my-ry)*.12;
    rng.style.transform = `translate(${rx-17}px,${ry-17}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ── Reveal on scroll ── */
new IntersectionObserver((entries) => {
  entries.forEach((e,i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i*65);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .1 });
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e,i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i*65);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── Counters ── */
function animCount(el) {
  const t = +el.dataset.count;
  const sfx = t===100?'%':t===24?'h':'+';
  const start = performance.now();
  (function step(ts) {
    const p = Math.min((ts-start)/1800,1);
    el.textContent = Math.floor(p*t)+sfx;
    if (p<1) requestAnimationFrame(step);
  })(performance.now());
}
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('[data-count]').forEach(animCount);
  });
}, {threshold:.4}).observe(document.querySelector('.stats-bar'));

/* ── Skill bars ── */
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      e.target.querySelectorAll('.sk-fill').forEach(b => b.style.width = b.dataset.pct+'%');
  });
}, {threshold:.25}).observe(document.querySelector('.skills'));

/* — Form — */
document.getElementById('cf').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  const formData = new FormData(form);
  
  btn.textContent = '⏳ Envoi en cours...';
  btn.disabled = true;
  
  try {
    const response = await fetch('https://formspree.io/f/xpqnwgrj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      btn.style.display = 'none';
      document.getElementById('fsuccess').style.display = 'block';
      form.reset(); // vide le formulaire après envoi
    } else {
      alert('Erreur lors de l\'envoi. Réessaie.');
      btn.textContent = 'Envoyer';
      btn.disabled = false;
    }
  } catch (error) {
    alert('Erreur réseau. Vérifie ta connexion.');
    btn.textContent = 'Envoyer';
    btn.disabled = false;
  }
});