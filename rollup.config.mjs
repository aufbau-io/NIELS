import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

/* ---------------------------------------------------------------------------
   Build
   ---------------------------------------------------------------------------
   Entry is src/js/main.js. It imports content.json (bundled by @rollup/plugin-json)
   and the stylesheet (main.css), which rollup-plugin-postcss extracts into
   dist/assets/styles.css. The HTML pages, the content folder, and anything in
   public/ are copied across verbatim.

   index.html links /js/main.js (the bundle) and /assets/styles.css directly.

   `yarn dev`  → rollup -c -w  : watches, rebuilds into dist/, AND serves it at
                 http://localhost:5173 with live reload (serve + livereload below,
                 active only when ROLLUP_WATCH is set).
   `yarn build`→ rollup -c     : one-off production build (minified, no server).
   --------------------------------------------------------------------------- */

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/js/main.js',
  output: {
    dir: 'dist',
    format: 'es',
    // Pin stable, unhashed names so the hand-written HTML can link them
    // directly: JS at /js/main.js, CSS (extracted below) at /assets/styles.css.
    entryFileNames: 'js/[name].js',
    assetFileNames: 'assets/[name][extname]',
    sourcemap: dev,
  },
  plugins: [
    nodeResolve(),
    json(),
    postcss({
      // Relative to output.dir (dist/), so this writes dist/assets/styles.css —
      // which is exactly what index.html links to.
      extract: 'assets/styles.css',
      minimize: !dev,
      sourceMap: dev,
    }),
    copy({
      targets: [
        { src: 'src/index.html',   dest: 'dist' },
        { src: 'src/404.html',     dest: 'dist' },   // Vercel serves this for not-found routes
        { src: 'src/content',      dest: 'dist' },   // content.json shipped for reference/edits
        { src: 'public/*',         dest: 'dist' },   // favicon, square.png, etc.
      ],
      copyOnce: false,
    }),
    // dev-only: live server + reload. http://localhost:5173, SPA-style fallback
    // so deep links resolve. Not included in production builds.
    dev && serve({ contentBase: 'dist', port: 5173, historyApiFallback: true }),
    dev && livereload('dist'),
  ].filter(Boolean),
};

