(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('#dots i')];
  const nextBtn = $('#next');
  let cur = 0, lock = false;

  /* ---------- slides ---------- */
  function go(n) {
    if (n < 0 || n >= slides.length || n === cur || lock) return;
    lock = true; setTimeout(() => lock = false, 650);
    slides[cur].classList.remove('on');
    cur = n;
    slides[cur].classList.add('on');
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
    nextBtn.classList.toggle('last', cur === slides.length - 1);
    nextBtn.classList.remove('pulse');
  }
  nextBtn.addEventListener('click', () => go(cur === slides.length - 1 ? 0 : cur + 1));
  addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) go(cur + 1);
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) go(cur - 1);
  });
  let wheelT = 0;
  addEventListener('wheel', e => {
    if (!intro.classList.contains('gone') || Math.abs(e.deltaY) < 20 || Date.now() - wheelT < 800) return;
    wheelT = Date.now(); go(cur + (e.deltaY > 0 ? 1 : -1));
  }, { passive: true });
  let ty = null, tx = null;
  const stage = $('#stage');
  stage.addEventListener('touchstart', e => { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (ty === null) return;
    const dy = e.changedTouches[0].clientY - ty, dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dy) > 45 && Math.abs(dy) > Math.abs(dx)) go(cur + (dy < 0 ? 1 : -1));
    ty = null;
  }, { passive: true });

  /* ---------- music ---------- */
  const audio = new Audio('assets/music.mp3');
  audio.loop = true; audio.volume = 0.6; audio.preload = 'auto';
  const mBtn = $('#music');
  const setPlaying = on => mBtn.classList.toggle('playing', on);
  mBtn.addEventListener('click', () => {
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {}); else { audio.pause(); setPlaying(false); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) { audio.pause(); audio.dataset.auto = '1'; }
    else if (!document.hidden && audio.dataset.auto) { audio.play().catch(() => {}); delete audio.dataset.auto; }
  });

  /* ---------- envelope ---------- */
  const intro = $('#intro'), env = $('#env');
  let opened = false;
  function openEnvelope() {
    if (opened) return; opened = true;
    env.classList.add('open');
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    setTimeout(() => { intro.classList.add('gone'); slides[0].classList.add('on'); }, 2300);
  }
  env.addEventListener('click', openEnvelope);

  /* ---------- share / map / calendar ---------- */
  const msg = [
    '॥ श्री गणेशाय नमः ॥', 'साखरपुडा समारंभ',
    'चि. मृगेश व चि. सौ. कां. अंकिता',
    'शनिवार, १४-११-२०२६, सायंकाळी ६:०० वा.',
    'सुनंदाताई लोकेगावकर हॉल, शिवाजी विद्यालय लेन, काळाचौकी, मुंबई - ४०००३३',
    'आपली उपस्थिती प्रार्थनीय आहे', '– समस्त चौधरी परिवार', ''
  ].join('\n');
  $('#wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg + location.href.split('#')[0]);

  $('#cal').addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sakharpuda Invitation//MR', 'BEGIN:VEVENT',
      'UID:sakharpuda-mrugesh-ankita-20261114@invitation', 'DTSTAMP:20261025T000000Z',
      'DTSTART;TZID=Asia/Kolkata:20261114T180000',
      'SUMMARY:साखरपुडा समारंभ – मृगेश & अंकिता',
      'LOCATION:सुनंदाताई लोकेगावकर हॉल\\, शिवाजी विद्यालय लेन\\, काळाचौकी\\, मुंबई - ४०००३३',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'sakharpuda-samarambh.ics'; document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- falling petals (lightweight canvas) ---------- */
  const cv = $('#petals'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, dpr, petals = [];
  const cols = ['#f7c8cf', '#f2aebb', '#fbd7c8', '#f9e1e5', '#e9bfd3', '#f4b9c4'];
  function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr; }
  function mk(initial) {
    const s = (9 + Math.random() * 15) * dpr;
    return { x: Math.random() * W, y: initial ? Math.random() * H : -s * 2, s,
      vy: (.35 + Math.random() * .6) * dpr, sw: .6 + Math.random() * 1.2, ph: Math.random() * 6.28,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .02, c: cols[(Math.random() * cols.length) | 0],
      a: .55 + Math.random() * .35 };
  }
  function init() { size(); const n = reduce ? 8 : Math.round(Math.min(26, 12 + innerWidth / 60)); petals = Array.from({ length: n }, () => mk(true)); }
  function petal(p, t) {
    ctx.save(); ctx.translate(p.x + Math.sin(t * .0006 * p.sw + p.ph) * 28 * dpr, p.y);
    ctx.rotate(p.rot); ctx.scale(1, .55 + .45 * Math.abs(Math.sin(t * .0008 * p.sw + p.ph)));
    ctx.globalAlpha = p.a; const s = p.s;
    const g = ctx.createLinearGradient(0, -s, 0, s); g.addColorStop(0, p.c); g.addColorStop(1, '#fff3f0');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .9, -s * .5, s * .7, s * .6, 0, s);
    ctx.bezierCurveTo(-s * .7, s * .6, -s * .9, -s * .5, 0, -s); ctx.fill(); ctx.restore();
  }
  let last = 0;
  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden || t - last < 30) return; last = t;
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.y += p.vy; p.rot += p.vr; p.x += .12 * dpr;
      if (p.y > H + p.s * 2 || p.x > W + 60) Object.assign(p, mk(false));
      petal(p, t);
    }
  }
  addEventListener('resize', size);
  init(); if (!reduce) requestAnimationFrame(frame); else { frame(0); }
})();
