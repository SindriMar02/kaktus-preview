/* Kaktus Espressobar - motion.
   Five devices, each justified in DESIGN.md. No scroll listener anywhere: a single
   rAF loop runs only while something it drives is on screen, gated by
   IntersectionObserver, and stops itself the moment the set empties. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ---------- the film ----------
     A plain autoplaying loop, no control: a deliberate product decision. It still does
     not start itself when the visitor has asked for less motion, and it only decodes
     while it is on screen. */
  var vid = document.querySelector('.film-vid');
  if (vid) {
    var wants = !reduce.matches;
    var tryPlay = function () {
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting && wants) tryPlay();
            else if (!e.isIntersecting) vid.pause();
          });
        },
        { threshold: 0.15 }
      ).observe(vid);
    } else if (wants) { tryPlay(); }
  }

  /* ---------- header: transparent on the title card, solid past it ---------- */
  var hd = document.querySelector('.hd');
  var heroEl = document.querySelector('.hero');
  if (hd && heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      function (e) { hd.classList.toggle('is-solid', !e[0].isIntersecting); },
      { rootMargin: '-60px 0px 0px 0px', threshold: 0 }
    ).observe(heroEl);
  } else if (hd) {
    hd.classList.add('is-solid');
  }

  /* ---------- drawer ---------- */
  var burger = document.querySelector('.hd-burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
      if (hd) hd.classList.toggle('is-open', open);
    };
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });
  }

})();
