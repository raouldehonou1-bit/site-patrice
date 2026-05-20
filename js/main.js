
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


/* ── Form ── */
document.getElementById('cf').addEventListener('submit', function(e) {
  e.preventDefault(); // Empêche le rechargement de la page
  
  const form = this;
  const btn = form.querySelector('button[type=submit]');
  const successMessage = document.getElementById('fsuccess');
  
  // 1. On change le texte du bouton pendant l'envoi réel
  btn.textContent = '⏳ Envoi en cours...';
  btn.disabled = true;

  // 2. On récupère toutes les données saisies dans le formulaire
  const formData = new FormData(form);

  // 3. On envoie les données à l'action du formulaire (Formspree)
  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      // SI L'ENVOI REUSSIT : On cache le bouton et on affiche ton message de succès
      btn.style.display = 'none';
      successMessage.style.display = 'block';
      form.reset(); // Vide les champs du formulaire proprement
    } else {
      // Si Formspree renvoie une erreur (ex: mauvaise URL)
      alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      btn.textContent = '⚡ Envoyer la demande';
      btn.disabled = false;
    }
  })
  .catch(error => {
    // Si problème de connexion internet du visiteur
    alert("Erreur de connexion. Impossible d'envoyer le formulaire.");
    btn.textContent = '⚡ Envoyer la demande';
    btn.disabled = false;
  });
});
