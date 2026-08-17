/* Kaktus hero: the reference's fisheye title card, unwound by scroll.

   A single fullscreen quad. The fragment shader does three things at once, all driven
   by one progress value that runs 0 (title card) to 1 (an ordinary photograph):

     1. barrel distortion    strong lens curvature relaxing to none
     2. porthole             a circular frame whose corners are crushed to black,
                             opening out until the picture is rectangular again
     3. lens breathing       a slight scale-down as the distortion releases, so the
                             frame does not appear to grow

   WebGL rather than an SVG filter because feDisplacementMap re-rasterises the whole
   plate every frame and drops to single digits on a 4K source.

   Gotchas this file is written around (memory: webgl-image-effect-gotchas):
     - a cached image never fires onload, so decode() is used with a complete check
     - the canvas is never faded in; it draws its first frame before it is shown
*/
(function () {
  'use strict';

  var host = document.querySelector('[data-hero-gl]');
  if (!host) return;

  var img = host.querySelector('.hero-plate');
  var canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* No WebGL, or motion is unwelcome: the plain photograph is already in the DOM and
     already correct. Leave it alone. */
  if (!gl || reduce.matches) return;

  var VERT =
    'attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}';

  var FRAG = [
    '#extension GL_OES_standard_derivatives : enable',
    'precision highp float;',
    'varying vec2 v;',
    'uniform sampler2D tex;',
    'uniform vec2 uCanvas;',
    'uniform vec2 uImage;',
    'uniform float uP;',      // 0 = fisheye title card, 1 = ordinary photograph
    'uniform float uTime;',
    'const float PI = 3.14159265;',

    /* cover-fit: the overflowing axis samples a smaller range of the texture */
    'vec2 coverUV(vec2 c){',
    '  float ca = uCanvas.x / uCanvas.y;',
    '  float ia = uImage.x / uImage.y;',
    '  vec2 s = (ca > ia) ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);',
    '  return c * s + 0.5;',
    '}',

    'void main(){',
    '  float ca = uCanvas.x / uCanvas.y;',
    '  vec2 c = v - 0.5;',
    '  vec2 a = vec2(c.x * ca, c.y);',          // square space: the lens is round

    /* TWO radii, and keeping them apart is the whole trick. The projection is normalised
       against a FIXED reference; only the mask radius animates. Sharing one radius makes
       the sampling coordinates shrink as the circle opens, which is a zoom, not a lens. */
    '  float R0 = 0.5 * ca;',                       // fixed: the lens, for the projection
    '  float rp = length(a) / R0;',
    '  float Rmask = mix(R0, 4.0, uP);',            // animated: the visible circle only
    '  float rm = length(a) / Rmask;',

    /* Equidistant fisheye: display radius IS the angle, source sampled at tan(theta).
       As halfFov goes to zero, tan(rp*f)/tan(f) approaches rp, which is a plain
       rectilinear sample, so the lens relaxes without ever changing scale. */
    '  float halfFov = radians(mix(58.0, 0.35, uP));',
    '  float srcR = tan(rp * halfFov) / tan(halfFov);',
    '  vec2 dir = length(a) > 0.0001 ? a / length(a) : vec2(0.0);',

    /* back out of square space. At rp = 1 the lens edge maps to the plate edge, so the
       framing is identical at every stage of the unwind. */
    '  vec2 dSq = dir * srcR * R0;',
    '  vec2 d = vec2(dSq.x / ca, dSq.y);',

    '  vec2 uvc = coverUV(d);',
    '  float inside = step(0.0, uvc.x) * step(uvc.x, 1.0) * step(0.0, uvc.y) * step(uvc.y, 1.0);',
    '  vec3 col = texture2D(tex, clamp(uvc, 0.0, 1.0)).rgb * inside;',

    /* the lens circle itself: a real edge, only softened enough to stop it aliasing */
    '  float aa = fwidth(rm) * 1.5 + 0.002;',
    '  float circle = 1.0 - smoothstep(1.0 - aa, 1.0, rm);',
    '  col *= circle;',

    /* a little falloff inside the glass, and exposure riding with the opening */
    '  col *= mix(1.0 - 0.34 * pow(clamp(rm, 0.0, 1.0), 2.2), 1.0, uP);',
    '  col *= mix(0.74, 1.0, uP);',

    '  float g = fract(sin(dot(v * uCanvas + uTime, vec2(12.9898, 78.233))) * 43758.5453);',
    '  col += (g - 0.5) * 0.042;',

    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('hero shader:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  gl.getExtension('OES_standard_derivatives');
  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uCanvas = gl.getUniformLocation(prog, 'uCanvas');
  var uImage = gl.getUniformLocation(prog, 'uImage');
  var uP = gl.getUniformLocation(prog, 'uP');
  var uTime = gl.getUniformLocation(prog, 'uTime');

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var ready = false;
  var progress = 0;
  var frame = 0;

  function size() {
    var r = host.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width * dpr));
    var h = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw() {
    if (!ready) return;
    size();
    gl.uniform2f(uCanvas, canvas.width, canvas.height);
    gl.uniform2f(uImage, img.naturalWidth || 2048, img.naturalHeight || 1365);
    gl.uniform1f(uP, progress);
    gl.uniform1f(uTime, (frame++ % 600) * 0.37);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* progress: 0 while the hero fills the screen, 1 by the time it has left */
  function readProgress() {
    var r = host.getBoundingClientRect();
    var travel = r.height || 1;
    var p = -r.top / travel;
    progress = p < 0 ? 0 : p > 1 ? 1 : p;
  }

  var running = false;
  function tick() {
    readProgress();
    draw();
    if (running) requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(tick);
  }
  function stop() { running = false; }

  function upload() {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    ready = true;
    /* draw one full frame BEFORE the canvas is revealed: never fade a canvas in,
       the first painted frame must already be the finished picture */
    readProgress();
    draw();
    host.classList.add('is-gl');
    start();
  }

  /* A cached image never fires load. Check complete first, then decode(). */
  if (img.complete && img.naturalWidth) {
    upload();
  } else if (img.decode) {
    img.decode().then(upload).catch(function () {
      img.addEventListener('load', upload, { once: true });
    });
  } else {
    img.addEventListener('load', upload, { once: true });
  }

  host.insertBefore(canvas, host.firstChild);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      function (e) { (e[0].isIntersecting ? start : stop)(); },
      { threshold: 0 }
    ).observe(host);
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { size(); draw(); }, 120);
  });
})();
