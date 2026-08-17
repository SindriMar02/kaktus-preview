import { SITE, GALLERY, STUDIO } from './content.mjs';
import SIZES from './img-sizes.json' with { type: 'json' };

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* A headline ships as plain text. motion.js splits it into words at runtime, once the
   fonts have settled, and groups those words by the line they actually landed on, so the
   reveal follows the real line breaks at whatever viewport this is. Splitting at build
   time cannot know where the lines fall. The real text stays in aria-label. */
function revealText(lines, tag = 'h2', cls = '') {
  const label = lines.join(' ');
  return `<${tag} class="rv ${cls}" aria-label="${esc(label)}"><span class="rv-src" aria-hidden="true">${esc(label)}</span></${tag}>`;
}

export function render(c, { assetBase, previewOrigin = '', noindex = false }) {
  const A = assetBase;
  const ORIGIN = previewOrigin || SITE.origin;
  const base = previewOrigin ? previewOrigin.replace(/\/$/, '') : SITE.origin;
  const CANON = `${base}/${c.lang === 'en' ? 'en/' : ''}`;

  const img = (name, alt, cls = '', extra = '') => {
    const [w, h] = SIZES[name] || [];
    const dim = w ? ` width="${w}" height="${h}"` : '';
    return `<picture><source srcset="${A}img/${name}.webp" type="image/webp"><img class="${cls}" src="${A}img/${name}.jpg" alt="${esc(
      alt
    )}"${dim} loading="lazy" decoding="async"${extra}></picture>`;
  };

  const room = (r) => ({
    '@type': 'CafeOrCoffeeShop',
    '@id': `${ORIGIN}/#${r.id}`,
    name: `${SITE.brandFull} ${r.name}`,
    parentOrganization: { '@type': 'Organization', name: SITE.brandFull, url: ORIGIN },
    url: ORIGIN,
    image: `${ORIGIN}/img/${r.id === 'vitastigur' ? 'dyr' : 'listo-salur'}.jpg`,
    telephone: r.phoneTel,
    email: SITE.email,
    priceRange: '$$',
    currenciesAccepted: 'ISK',
    servesCuisine: 'Coffee',
    sameAs: [SITE.instagram],
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.name,
      addressLocality: 'Reykjavík',
      postalCode: '101',
      addressCountry: 'IS',
    },
    geo: { '@type': 'GeoCoordinates', latitude: r.lat, longitude: r.lon },
    openingHoursSpecification: r.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.split(',').map(
        (d) =>
          `https://schema.org/${
            { Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' }[d]
          }`
      ),
      opens: h.opens,
      closes: h.closes,
    })),
  });

  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: ORIGIN,
        name: SITE.brandFull,
        description: c.description,
        inLanguage: c.lang,
      },
      ...SITE.rooms.map(room),
    ],
  };

  const navHtml = c.nav.map((n) => `<li><a class="ln" href="${n.href}">${esc(n.label)}</a></li>`).join('');

  /* the marquee is duplicated once so the -50% translation loops seamlessly */
  const mqRun = `<span class="mq-run" aria-hidden="true">${c.marquee
    .map((m) => `${esc(m)}<span class="mq-star">✱</span>`)
    .join('')}</span>`;

  const roomBlock = (r, rc, imgName, alt, alt2) => `
  <section class="rm${alt2 ? ' rm-alt' : ''}">
    <figure class="rm-fig">${img(imgName, alt, 'rm-img')}</figure>
    <div class="rm-tx">
      <div>
        ${revealText([rc.name], 'h2', 'd-xl rm-name')}
        ${rc.sub ? `<p class="cap" style="margin-top:0.7rem">${esc(rc.sub)}</p>` : ''}
      </div>
      <div>
        <p class="rm-blurb">${esc(rc.blurb)}</p>
        <dl class="hrs">
          ${rc.hours.map((h) => `<div><dt>${esc(h.d)}</dt><dd>${esc(h.t)}</dd></div>`).join('')}
          <div><dt>${esc(c.rooms.phoneLabel)}</dt><dd><a class="ln" href="tel:${r.phoneTel}">${r.phone}</a></dd></div>
        </dl>
      </div>
    </div>
  </section>`;

  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<link rel="canonical" href="${CANON}">
<link rel="alternate" hreflang="is" href="${base}/">
<link rel="alternate" hreflang="en" href="${base}/en/">
<link rel="alternate" hreflang="x-default" href="${base}/">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta property="og:type" content="website">
<meta property="og:locale" content="${c.lang === 'is' ? 'is_IS' : 'en_GB'}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${CANON}">
<meta property="og:image" content="${CANON}img/dyr.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F1E8">
<link rel="icon" href="${A}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${A}favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${A}apple-touch-icon.png" sizes="180x180">
<link rel="preload" as="font" type="font/woff2" href="${A}fonts/Gloock.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${A}fonts/ApfelGrotezk-Regular.woff2" crossorigin>
<link rel="preload" as="image" href="${A}img/hero-plate.webp" type="image/webp" fetchpriority="high">
<link rel="stylesheet" href="${A}styles.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#efni">${esc(c.skip)}</a>

<header class="hd">
  <a class="hd-mark" href="./" aria-label="${esc(SITE.brandFull)}">
    <picture>
      <source srcset="${A}img/logo-h.webp" type="image/webp">
      <img class="hd-logo" src="${A}img/logo-h.png" alt="" width="${SIZES['logo-h'][0]}" height="${SIZES['logo-h'][1]}" decoding="async">
    </picture>
  </a>
  <nav class="hd-nav" aria-label="${c.lang === 'is' ? 'Aðalvalmynd' : 'Main'}">
    <ul>${navHtml}</ul>
  </nav>
  <p class="hd-lang" role="group" aria-label="${esc(c.langLabel)}">
    <span class="hd-lang-on" aria-current="true" lang="${c.self.code}">${esc(c.self.label)}</span>
    <span class="hd-lang-sep" aria-hidden="true">/</span>
    <a class="ln" href="${c.other.href}" lang="${c.other.code}" hreflang="${c.other.code}">${esc(c.other.label)}</a>
  </p>
  <a class="btn" href="#stadir">${esc(c.hero.ctaVisit)}</a>
  <button class="hd-burger" type="button" aria-expanded="false" aria-controls="drawer">
    <span class="vh">${c.lang === 'is' ? 'Valmynd' : 'Menu'}</span>
    <span class="hd-bar" aria-hidden="true"></span><span class="hd-bar" aria-hidden="true"></span>
  </button>
</header>

<div class="drawer" id="drawer" hidden>
  <nav aria-label="${c.lang === 'is' ? 'Valmynd' : 'Menu'}">
    <ul>${navHtml}<li><a class="ln" href="${c.other.href}" lang="${c.other.code}" hreflang="${c.other.code}">${c.other.code === 'en' ? 'English' : 'Íslenska'}</a></li></ul>
  </nav>
</div>

<main id="efni">

<!-- 1. HERO: the title card. Fisheye plate, centred wordmark, credits around it. -->
<section class="hero" data-hero-gl>
  <picture>
    <source srcset="${A}img/hero-plate.webp" type="image/webp">
    <img class="hero-plate" src="${A}img/hero-plate.jpg" alt="${esc(c.hero.imgAlt)}"
      width="${SIZES['hero-plate'][0]}" height="${SIZES['hero-plate'][1]}"
      fetchpriority="high" decoding="async">
  </picture>

  <div class="hero-card">
    <h1 class="hero-word">
      <img class="hero-logo" src="${A}img/logo-hero.png" alt="${esc(SITE.brandFull)}"
        width="${SIZES['logo-hero'][0]}" height="${SIZES['logo-hero'][1]}" fetchpriority="high" decoding="async">
    </h1>

    <p class="hero-side hero-side-l">
      <span class="cap hero-side-k">${esc(c.hero.leftLabel)}</span>
      <span class="hero-side-v">${esc(c.hero.leftValue)}</span>
    </p>
    <p class="hero-side hero-side-r">
      <span class="cap hero-side-k">${esc(c.hero.rightLabel)}</span>
      <span class="hero-side-v">${esc(c.hero.rightValue)}</span>
    </p>

    <p class="hero-under">
      <span class="hero-mark" aria-hidden="true">&#9662;</span>
      <span class="cap">${esc(c.hero.under)}</span>
    </p>
  </div>

  <div class="hero-foot">
    <a class="lnk" href="#matsedill"><span class="lnk-c"><span class="lnk-i"><span>${esc(c.hero.ctaMenu)}</span><span>${esc(c.hero.ctaMenu)}</span></span></span></a>
    <a class="lnk" href="#filman"><span class="lnk-c"><span class="lnk-i"><span>${esc(c.film.heading)}</span><span>${esc(c.film.heading)}</span></span></span></a>
  </div>
</section>

<!-- 2. MARQUEE -->
<div class="mq">
  <div class="mq-track">${mqRun}${mqRun}</div>
  <p class="vh">${esc(c.marquee.join(', '))}</p>
</div>

<!-- 3. STATEMENT: bracketed by the marquee above and below, as the reference does -->
<section class="st">
  ${revealText(c.statement.lines, 'h2', 'd-xl st-h')}
  <p class="st-body">${esc(c.statement.body)}</p>
</section>

<div class="mq mq-rev">
  <div class="mq-track mq-track-rev">${mqRun}${mqRun}</div>
</div>

<!-- 4. MENU CALL: photograph beside a saturated panel -->
<section class="call">
  <figure class="call-fig">${img('focaccia', c.call.imgAlt, 'call-img')}</figure>
  <div class="call-panel on-dark">
    ${revealText([c.call.heading], 'h2', 'd-lg call-h')}
    <a class="btn btn-light" href="#matsedill">${esc(c.call.cta)}</a>
  </div>
</section>

<!-- 5. MATSEÐILL -->
<section class="menu" id="matsedill">
  <div class="menu-in">
    <div class="menu-head">${revealText([c.menu.heading], 'h2', 'd-xl')}</div>
    <div class="menu-grid">
      <div>
        <h3 class="cap">${esc(c.menu.drinksTitle)}</h3>
        <ul class="mlist">
          ${c.drinks
            .map(
              (d) =>
                `<li><span class="mlist-n">${esc(d[c.lang] || d.is)}</span><span class="mlist-d" aria-hidden="true"></span><span class="mlist-p">${esc(d.price)}</span></li>`
            )
            .join('')}
        </ul>
        <h3 class="cap cap-sp">${esc(c.menu.extrasTitle)}</h3>
        <ul class="mlist mlist-sm">
          ${c.extras
            .map(
              (d) =>
                `<li><span class="mlist-n">${esc(d[c.lang] || d.is)}</span><span class="mlist-d" aria-hidden="true"></span><span class="mlist-p">${esc(d.price)}</span></li>`
            )
            .join('')}
        </ul>
      </div>
      <div>
        <h3 class="cap">${esc(c.menu.breakfastTitle)}</h3>
        <ul class="mfood">
          ${c.breakfast
            .map(
              (b) => `<li>
              <p class="mfood-t"><span>${esc(b[c.lang] || b.is)}</span><span class="mfood-p">${esc(b.price)} ${esc(c.menu.kr)}</span></p>
              <p class="mfood-d">${esc(c.lang === 'is' ? b.isDesc : b.enDesc)}</p></li>`
            )
            .join('')}
        </ul>
        <h3 class="cap cap-sp">${esc(c.menu.kitchenTitle)}</h3>
        <ul class="mfood">
          ${c.kitchen
            .map(
              (k) => `<li>
              <p class="mfood-t"><span>${esc(k[c.lang] || k.is)}</span></p>
              <p class="mfood-d">${esc(c.lang === 'is' ? k.isDesc : k.enDesc)}</p></li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
    <p class="menu-note">${esc(c.menu.priceNote)}</p>
  </div>
</section>

<!-- 6. THE FILM: the reel, behind the reference's porthole -->
<section class="film on-dark" id="filman">
  <div class="film-in">
    <div class="film-credits">
      ${revealText([c.film.heading], 'h2', 'd-xl film-h')}
      <p class="film-body">${esc(c.film.body)}</p>
      <dl class="film-grid">
        ${c.film.credits.map((cr) => `<div><dt>${esc(cr.k)}</dt><dd>${esc(cr.v)}</dd></div>`).join('')}
      </dl>
    </div>
    <div class="film-stage">
      <video class="film-vid" muted loop playsinline preload="metadata"
        poster="${A}film/kaktus-reel-poster.jpg" aria-label="${esc(c.film.videoLabel)}">
        <source src="${A}film/kaktus-reel.webm" type="video/webm">
        <source src="${A}film/kaktus-reel.mp4" type="video/mp4">
      </video>
    </div>
  </div>
</section>

<div id="stadir">
<!-- 7 + 8. THE TWO ROOMS -->
${roomBlock(SITE.rooms[0], c.rooms.vitastigur, 'bar-bw', c.rooms.vitastigur.alt, false)}
${roomBlock(SITE.rooms[1], c.rooms.listasafn, 'listo-salur', c.rooms.listasafn.alt, true)}
</div>

<!-- 9. MYNDIR: seven pictures, seven cells -->
<section class="gal" id="myndir">
  ${revealText([c.gallery.heading], 'h2', 'd-xl gal-h')}
  <ul class="gal-grid">
    ${GALLERY.map(
      (g, i) => `<li class="gal-c gal-c${i + 1}">
      ${img(g.img, c.lang === 'is' ? g.is : g.en, 'gal-img')}
      <p class="cap gal-cap">${esc(c.lang === 'is' ? g.is : g.en)}</p></li>`
    ).join('')}
  </ul>
</section>

<!-- 10. UM OKKUR -->
<section class="ab" id="um-okkur">
  <figure class="ab-fig">${img('eigendur', c.about.alt, 'ab-img')}</figure>
  <div class="ab-tx">
    ${revealText([c.about.heading], 'h2', 'd-xl')}
    <p class="ab-body">${esc(c.about.body1)}</p>
    <p class="ab-body">${esc(c.about.body2)}</p>
  </div>
</section>

</main>

<!-- 11. FOOTER: the credit block -->
<footer class="ft on-dark">
  <div class="ft-in">
    ${revealText([c.footer.heading], 'h2', 'd-xl ft-h')}
    <div class="ft-grid">
      ${SITE.rooms
        .map((r, i) => {
          const rc = i === 0 ? c.rooms.vitastigur : c.rooms.listasafn;
          return `<div class="ft-col">
          <p class="cap">${esc(r.name)}</p>
          <address>
            ${i === 1 ? `<span>${esc(c.rooms.listasafn.sub)}</span>` : ''}
            <span>${esc(r.area)}</span>
            <a class="ln" href="tel:${r.phoneTel}">${r.phone}</a>
          </address>
          <p class="cap cap-sp">${esc(c.footer.hoursLabel)}</p>
          <dl class="ft-hrs">${rc.hours.map((h) => `<div><dt>${esc(h.d)}</dt><dd>${esc(h.t)}</dd></div>`).join('')}</dl>
        </div>`;
        })
        .join('')}
      <div class="ft-col">
        <p class="cap">${esc(c.footer.emailLabel)}</p>
        <p><a class="ln" href="mailto:${SITE.email}">${SITE.email}</a></p>
        <p class="cap cap-sp">${esc(c.footer.socialLabel)}</p>
        <p><a class="ln" href="${SITE.instagram}" rel="noopener">${SITE.instagramHandle}</a></p>
      </div>
      <div class="ft-col ft-mark">
        <img src="${A}img/logo.png" alt="" width="${SIZES.logo[0]}" height="${SIZES.logo[1]}" loading="lazy" decoding="async">
      </div>
    </div>
    <p class="ft-colophon">
      <span class="ft-colophon-t">${esc(c.footer.colophon)}</span>
      <a class="ft-studio" href="${STUDIO.url}" rel="noopener">
        <svg class="ft-studio-mark" viewBox="0 0 100 100" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="${STUDIO.markPath}" fill="${STUDIO.markColor}"/>
        </svg>
        <span class="vh">${esc(c.footer.builtBy)} </span><span>${esc(STUDIO.name)}</span>
      </a>
    </p>
  </div>
</footer>

<script src="${A}vendor/lenis.min.js" defer></script>
<script src="${A}vendor/gsap.min.js" defer></script>
<script src="${A}vendor/ScrollTrigger.min.js" defer></script>
<script src="${A}hero.js" defer></script>
<script src="${A}app.js" defer></script>
<script src="${A}motion.js" defer></script>
</body>
</html>
`;
}
