/* Kaktus QA: full-page shots at desktop + mobile, plus the motion table.
   The motion table is the gate: static geometry proves nothing on a build whose
   identity is the cut (craft ledger / feedback-motion-is-the-gate). */
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE || 'http://localhost:8751';
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

async function settle(p, ms = 500) { await new Promise((r) => setTimeout(r, ms)); }

async function sweep(p) {
  await p.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const i = setInterval(() => {
        window.scrollTo(0, y);
        y += 500;
        if (y > document.body.scrollHeight) { clearInterval(i); window.scrollTo(0, 0); r(); }
      }, 45);
    });
  });
}

/* ---------- shots ---------- */
for (const [tag, vp] of [
  ['d', { width: 1440, height: 900 }],
  ['m', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
]) {
  for (const [name, path] of [['is', '/'], ['en', '/en/']]) {
    const p = await b.newPage();
    await p.setViewport(vp);
    await p.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 40000 });
    await sweep(p);
    /* A full-page capture flattens the whole document, but scroll reveals below the
       fold have legitimately not fired. Force their end state for the shot only; the
       reveal mechanics are proved separately in the motion table below. */
    await p.evaluate(() => {
      document.querySelectorAll('.rv').forEach((e) => e.classList.add('is-in'));
    });
    await settle(p, 1100);
    await p.screenshot({ path: `qa-${name}-${tag}.png`, fullPage: true });
    await p.close();
  }
}

/* ---------- motion table ---------- */
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto(BASE + '/', { waitUntil: 'networkidle2' });
await settle(p, 700);

const motion = await p.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = { beats: [], drift: [], reveal: [], geometry: {} };

  const hero = document.querySelector('.hero');
  const ap = hero.querySelector('.ap');
  const bg = hero.querySelector('[data-drift]');

  /* device 3: from-state of a heading that has NOT revealed yet */
  const later = document.querySelector('.menu .rv');
  const beforeClip = getComputedStyle(later.querySelector('.cl-i')).clipPath;

  /* devices 1 + 2: sample the aperture frame index and the drift transform
     at ten scroll positions across the hero pass */
  const H = hero.getBoundingClientRect().height;
  for (let i = 0; i <= 10; i++) {
    const y = Math.round((H * i) / 10);
    window.scrollTo(0, y);
    await sleep(90);
    const on = [...ap.querySelectorAll('.ap-f')].findIndex((f) => f.classList.contains('is-on'));
    out.beats.push({ y: y, frame: on });
    out.drift.push({ y: y, t: getComputedStyle(bg).transform });
  }

  window.scrollTo(0, 0);
  await sleep(400);

  /* reveal end-state after the heading has been in view */
  const menu = document.querySelector('.menu');
  menu.scrollIntoView();
  await sleep(1300);
  const afterClip = getComputedStyle(later.querySelector('.cl-i')).clipPath;
  out.reveal = { before: beforeClip, after: afterClip, isIn: later.classList.contains('is-in') };

  window.scrollTo(0, 0);
  await sleep(300);

  const apr = ap.getBoundingClientRect();
  out.geometry = {
    apertureW: Math.round(apr.width),
    apertureH: Math.round(apr.height),
    apertureRadius: getComputedStyle(ap.querySelector('.ap-mask')).borderRadius,
    frames: ap.querySelectorAll('.ap-f').length,
    headerH: Math.round(document.querySelector('.hd').getBoundingClientRect().height),
    navLines: (() => {
      const items = [...document.querySelectorAll('.hd-nav a')];
      return new Set(items.map((a) => Math.round(a.getBoundingClientRect().top))).size;
    })(),
    sections: document.querySelectorAll('main section').length,
    docH: document.documentElement.scrollHeight,
  };
  return out;
});

/* beats: how many px of scroll per cut */
const cuts = [];
for (let i = 1; i < motion.beats.length; i++) {
  if (motion.beats[i].frame !== motion.beats[i - 1].frame) {
    cuts.push(motion.beats[i].y - motion.beats[i - 1].y);
  }
}
console.log(JSON.stringify({ ...motion, cutStepsPx: cuts }, null, 1));

/* ---------- a11y + copy checks ---------- */
const audit = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  const txt = document.body.innerText;
  return {
    lang: document.documentElement.lang,
    imgsNoAlt: imgs.filter((i) => i.alt === null || (i.alt === '' && !i.closest('.hd-mark') && !i.closest('.ft-mark'))).length,
    imgsTotal: imgs.length,
    h1: [...document.querySelectorAll('h1')].map((h) => h.getAttribute('aria-label') || h.innerText),
    headingOrder: [...document.querySelectorAll('h1,h2,h3')].map((h) => h.tagName),
    emDash: (txt.match(/[—–]/g) || []).length,
    lorem: /lorem ipsum/i.test(txt),
    accessibleNames: [...document.querySelectorAll('.rv')].map((r) => r.getAttribute('aria-label')),
    ctaLabels: [...document.querySelectorAll('.btn')].map((b) => b.innerText.trim()),
    eyebrowCount: document.querySelectorAll('.kick').length,
    jsonldRooms: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph']
      .filter((n) => n['@type'] === 'CafeOrCoffeeShop')
      .map((n) => ({ name: n.name, addr: n.address.streetAddress, hours: n.openingHoursSpecification.length })),
  };
});
console.log(JSON.stringify(audit, null, 1));

await p.close();
await b.close();
