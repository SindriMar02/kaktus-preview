/* Kaktus motion: smoothed scroll, and headline reveals that read as typography arriving
   rather than as a box being wiped.

   The old reveal clipped a whole line and slid it up on a fixed delay. Every line moved
   the same distance at the same speed, which is why it read as generic. This one:

     - splits each headline into WORDS, then measures which LINE each word landed on
     - masks every word individually
     - rises each word from below its own mask with a slight counter-rotation, so the
       letterforms pivot into place instead of translating
     - staggers by line first, then by word, with the starts OVERLAPPING, so a heading
       cascades instead of marching
     - eases on expo-out, which spends most of its time decelerating: the arrival is
       the part you see

   Scroll is smoothed with Lenis and ScrollTrigger is driven from Lenis's own tick, so
   the reveals resolve on the same eased clock as the page. Without that the type lands
   on raw wheel deltas and no amount of easing hides it.

   Accessibility: the real text stays in aria-label on the heading and the split spans
   are aria-hidden, so the accessible name never becomes the words run together.
   Real space text nodes are interleaved between words (craft ledger #144) so
   textContent, copy-paste and in-page find still work.
*/
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var heads = [].slice.call(document.querySelectorAll('.rv'));

  /* ---------- reduced motion, or no libraries: everything is simply present ---------- */
  if (reduce || !hasGsap) {
    heads.forEach(function (h) { h.classList.add('is-in'); });
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    /* one clock: Lenis ticks, ScrollTrigger updates from it, gsap drives the frame */
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* in-page anchors have to go through Lenis or they jump past the smoothing */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: -84 });
    });
  }

  /* ---------- split each heading into masked words, grouped by rendered line ---------- */
  function split(head) {
    var src = head.querySelector('.rv-src');
    if (!src) return null;
    var text = src.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return null;

    var words = text.split(' ');
    src.textContent = '';
    var spans = [];
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      outer.className = 'w';
      var inner = document.createElement('span');
      inner.className = 'wi';
      inner.textContent = w;
      outer.appendChild(inner);
      src.appendChild(outer);
      /* a real space, not a margin: keeps textContent and find-in-page intact */
      if (i < words.length - 1) src.appendChild(document.createTextNode(' '));
      spans.push(inner);
    });

    /* group by line: words that share an offsetTop are on the same line */
    var lines = [];
    var lastTop = null;
    spans.forEach(function (s) {
      var top = Math.round(s.parentElement.offsetTop);
      if (lastTop === null || Math.abs(top - lastTop) > 4) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(s);
    });
    return lines;
  }

  function build() {
    heads.forEach(function (head) {
      var lines = split(head);
      if (!lines) { head.classList.add('is-in'); return; }
      head.classList.add('is-split');

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: head,
          start: 'top 88%',
          once: true,
        },
        onComplete: function () {
          /* hand the letterforms back to the browser: transforms left on display type
             fight subpixel rendering and any later layout (ledger: clearProps traps) */
          lines.forEach(function (l) { gsap.set(l, { clearProps: 'transform,opacity' }); });
          head.classList.add('is-in');
        },
      });

      lines.forEach(function (line, li) {
        tl.fromTo(
          line,
          { yPercent: 118, rotate: 2.4, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            stagger: { each: 0.055, from: 'start' },
          },
          /* lines overlap: the next begins before the previous has settled */
          li * 0.11
        );
      });
    });

    ScrollTrigger.refresh();
  }

  /* Fonts must be ready before the split: splitting on fallback metrics puts the line
     breaks in the wrong places and the per-word masks then crop the wrong glyphs.
     Raced against a timeout so a font that never settles cannot hold the page hostage. */
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1800); })]).then(build);

  /* ---------- section polish, on the same clock ---------- */

  /* full-bleed photographs settle in behind a rising mask, slightly overscaled so the
     frame never shows an edge while it moves */
  gsap.utils.toArray('.rm-fig, .call-fig').forEach(function (fig) {
    var im = fig.querySelector('img');
    if (!im) return;
    gsap.fromTo(
      im,
      { scale: 1.12, yPercent: -3 },
      {
        scale: 1,
        yPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: 1 },
      }
    );
    gsap.fromTo(
      fig,
      { clipPath: 'inset(14% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: fig, start: 'top 86%', once: true },
      }
    );
  });

  /* the marquee leans with scroll velocity, which is the cheapest honest signal that
     the page is being moved by a hand */
  var track = document.querySelector('.mq-track');
  if (track && lenis) {
    var skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' });
    var shift = gsap.quickTo(track, 'x', { duration: 0.6, ease: 'power3.out' });
    lenis.on('scroll', function (e) {
      var v = Math.max(-40, Math.min(40, e.velocity || 0));
      skew(v * -0.14);
      shift(v * -1.6);
    });
  }

  /* menu rows arrive as a short cascade rather than all at once */
  gsap.utils.toArray('.mlist, .mfood').forEach(function (list) {
    gsap.fromTo(
      list.children,
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.045,
        scrollTrigger: { trigger: list, start: 'top 88%', once: true },
      }
    );
  });
})();
