import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COPY, SITE } from './content.mjs';
import { render } from './template.mjs';

/* A preview carries a real business's brand on a URL that is not theirs:
   noindex + canonical back at the preview so it can never outrank kaktusespressobar.com */
const PREVIEW_ORIGIN = process.env.PREVIEW_ORIGIN || '';
const isPreview = Boolean(PREVIEW_ORIGIN);

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'en'), { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });

/* Favicon: the cup from their own mark, drawn as the aperture shape.
   Relative href in the template, so the client's tab never inherits another origin's icon. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" fill="#F0F1EC"/>
<path d="M20 26h24l-2.4 16.2A8 8 0 0 1 33.7 49h-3.4a8 8 0 0 1-7.9-6.8L20 26Z" fill="none" stroke="#305828" stroke-width="3.4" stroke-linejoin="round"/>
<path d="M44 30h2.6a4.4 4.4 0 0 1 0 8.8H43" fill="none" stroke="#305828" stroke-width="3.4" stroke-linecap="round"/>
<path d="M32 24v-6M32 20c-2.6 0-4.6-1.6-4.6-4M32 20c2.6 0 4.6-1.6 4.6-4" fill="none" stroke="#305828" stroke-width="3.4" stroke-linecap="round"/>
</svg>`;
await writeFile(join(dist, 'favicon.svg'), favicon);

const opts = { previewOrigin: PREVIEW_ORIGIN, noindex: isPreview };
await writeFile(join(dist, 'index.html'), render(COPY.is, { assetBase: '', ...opts }));
await writeFile(join(dist, 'en', 'index.html'), render(COPY.en, { assetBase: '../', ...opts }));
if (isPreview) await writeFile(join(dist, '.nojekyll'), '');

const O = (PREVIEW_ORIGIN || SITE.origin).replace(/\/$/, '');
await writeFile(
  join(dist, 'robots.txt'),
  isPreview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${O}/sitemap.xml\n`
);
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${O}/</loc>
    <xhtml:link rel="alternate" hreflang="is" href="${O}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${O}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${O}/"/>
  </url>
  <url><loc>${O}/en/</loc>
    <xhtml:link rel="alternate" hreflang="is" href="${O}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${O}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${O}/"/>
  </url>
</urlset>
`
);

console.log(`built dist/index.html + dist/en/index.html${isPreview ? ' [preview noindex]' : ''}`);
