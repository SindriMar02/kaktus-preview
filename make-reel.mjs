/* Builds the Kaktus reel: a MONDAY-structured brand film cut from Kaktus's own
   photographs, graded as vintage film stock.

   Structure comes from the reference (_refs/kaktus/monday-coffee-reel.mp4, measured with
   ffmpeg scene detection: 720x1280, 30fps, a cut every 7 frames, the full frame changing
   every 14). The GRAMMAR is kept - two tier cutting, inset previews the next plate, hard
   cuts only - and the TEMPO is halved, because at the reference's 0.233s the piece reads
   as a flicker rather than as a morning.

     beat        14 frames  = 0.467s   the inset card swaps   (exactly half the reference)
     shot        28 frames  = 0.933s   the full frame changes
     loop        196 frames = 6.53s    seven shots, the same length as the reference

   The camera is LOCKED OFF, exactly as the reference is. No weave, no drift, no shake:
   the reference's whole energy comes from the cut rate and nothing else moves, so any
   frame-to-frame displacement reads as a fault rather than as film.

   Vintage treatment is therefore all tonal, none of it motion:
     - faded stock curve: lifted blacks, warm highlights, blue rolled off the top end
     - desaturated then warmed, so it reads as aged rather than as a sepia toggle
     - halation: only the top ~14% of the range blooms, screened back at 10%, so
       highlights glow without fogging the whole frame
     - fine grain. No vignette: the darkened corners read as a frame effect rather
       than as film stock, and the reference has none

   Run: node make-reel.mjs   (writes public/film/kaktus-reel.mp4 + webm + poster)
*/
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, '_assets', 'photos');
const TMP = join(here, '.reel-frames');
const OUT = join(here, 'public', 'film');

const W = 720, H = 1280, FPS = 30;
const BEAT = 14;             // inset swap, 0.467s, exactly half the reference's rate
const FRAMES_PER_SHOT = 28;  // plate change, 0.933s
const SHOTS = 7;
const LOOP = FRAMES_PER_SHOT * SHOTS; // 196 frames, 6.53s

const SHOTLIST = [
  { full: 'Kaktus_espressobar_Door.jpg',        detail: 'Kaktus_espressobar_caktus.jpg' },
  { full: 'Kaktus_espressobar_Latte.jpg',       detail: 'Kaktus_espressobar_Americano.jpg' },
  { full: 'Listo+mynd(1).jpg',                  detail: 'Listó.jpg' },
  { full: 'Kaktus_espressobar_focaccia.jpg',    detail: 'Kaktus_espressobar_Soup.jpg' },
  { full: 'Kaktus_espressobar_outdoor.jpg',     detail: 'Listo+mynd.jpg' },
  { full: 'Kaktus_espressobar_two_coffee.jpg',  detail: 'Screenshot+2025-01-12+at+07.42.39.jpg' },
  { full: 'Kaktus_espressobar_coffee.jpg',      detail: 'Kaktus_espressobar_sandwich.jpg' },
];

const INSET = [
  { x: 0.30, y: 0.30 }, { x: 0.42, y: 0.22 },
  { x: 0.18, y: 0.34 }, { x: 0.36, y: 0.28 },
  { x: 0.44, y: 0.36 }, { x: 0.22, y: 0.24 },
  { x: 0.34, y: 0.32 }, { x: 0.46, y: 0.26 },
  { x: 0.20, y: 0.30 }, { x: 0.38, y: 0.20 },
  { x: 0.28, y: 0.38 }, { x: 0.44, y: 0.30 },
  { x: 0.24, y: 0.26 }, { x: 0.40, y: 0.34 },
];
const INSET_W = 0.46;
const INSET_RATIO = 4 / 3;

/* seeded so the film is byte-identical on every rebuild */
let seed = 20260816;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

/* the faded-stock curve: shadows lifted off zero, highlights warm, blue rolled off */
const STOCK =
  "curves=r='0/0.040 0.25/0.30 0.5/0.560 0.75/0.815 1/0.985':" +
  "g='0/0.035 0.25/0.28 0.5/0.530 0.75/0.785 1/0.960':" +
  "b='0/0.060 0.25/0.26 0.5/0.480 0.75/0.730 1/0.930'";

await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });
await mkdir(OUT, { recursive: true });

const iw = Math.round(W * INSET_W);
const ih = Math.round(iw * INSET_RATIO);

for (let f = 0; f < LOOP; f++) {
  const shot = Math.floor(f / FRAMES_PER_SHOT);
  const beat = Math.floor(f / BEAT);
  const secondBeat = Math.floor((f % FRAMES_PER_SHOT) / BEAT) === 1;
  const s = SHOTLIST[shot];
  const insetSrc = secondBeat ? SHOTLIST[(shot + 1) % SHOTS].full : s.detail;
  const pos = INSET[beat % INSET.length];
  const ix = Math.round((W - iw) * pos.x + W * 0.06);
  const iy = Math.round((H - ih) * pos.y);

  const out = join(TMP, String(f).padStart(4, '0') + '.png');
  await run('ffmpeg', [
    '-v', 'error', '-y',
    '-i', join(SRC, s.full),
    '-i', join(SRC, insetSrc),
    '-filter_complex',
    /* plate: locked off, no overscan and no offset, then graded */
    `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},` +
      `eq=saturation=0.82:contrast=1.07:gamma=1.01,${STOCK}[bg];` +
    /* inset: the same stock, a touch softer so it reads as a print laid on the frame */
    `[1:v]scale=${iw}:${ih}:force_original_aspect_ratio=increase,crop=${iw}:${ih},` +
      `eq=saturation=0.80:contrast=1.06:gamma=1.02,${STOCK},gblur=sigma=0.35[in];` +
    `[bg][in]overlay=${ix}:${iy}[ov];` +
    /* halation: pull the top end, blur it, screen it back so highlights bloom */
    `[ov]split[o1][o2];` +
    `[o2]curves=all='0/0 0.86/0 0.95/0.32 1/1',gblur=sigma=10[glow];` +
    `[o1][glow]blend=all_mode=screen:all_opacity=0.10[bloom];` +
    `[bloom]noise=alls=9:allf=t+u[out]`,
    '-map', '[out]', '-frames:v', '1', out,
  ]);
}

const list = [];
for (let f = 0; f < LOOP; f++) list.push(join(TMP, String(f).padStart(4, '0') + '.png'));
await writeFile(
  join(TMP, 'list.txt'),
  list.map((p) => `file '${p}'\nduration ${1 / FPS}`).join('\n') + `\nfile '${list[list.length - 1]}'\n`
);

await run('ffmpeg', [
  '-v', 'error', '-y',
  '-f', 'concat', '-safe', '0', '-i', join(TMP, 'list.txt'),
  '-r', String(FPS),
  '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
  '-crf', '23', '-movflags', '+faststart',
  join(OUT, 'kaktus-reel.mp4'),
]);
await run('ffmpeg', ['-v', 'error', '-y', '-i', join(OUT, 'kaktus-reel.mp4'),
  '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-an', join(OUT, 'kaktus-reel.webm')]);
await run('ffmpeg', ['-v', 'error', '-y', '-i', join(OUT, 'kaktus-reel.mp4'),
  '-frames:v', '1', '-q:v', '3', join(OUT, 'kaktus-reel-poster.jpg')]);

await rm(TMP, { recursive: true, force: true });

const { stdout } = await run('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height,r_frame_rate,nb_frames,duration', '-of', 'csv=p=0',
  join(OUT, 'kaktus-reel.mp4')]);
console.log('reel:', stdout.trim());
