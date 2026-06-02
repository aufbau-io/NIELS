/* ===========================================================================
   Background router  (imported by main.js:  import './bg.js';)
   ---------------------------------------------------------------------------
   WebGPU available & a device comes up  ->  the manifold.
   Anything missing or failing           ->  the WebGL washi shader (washi.js).

   ┌─ PICK A MANIFOLD VARIANT ────────────────────────────────────────────────┐
   │  './manifold.js'             — Josie palette (paper / lilac / ink)        │
   │  './manifold-iridescent.js'  — the iridescent log(sin/cos/tan) Rust look  │
   └──────────────────────────────────────────────────────────────────────────┘
   Both export init() and are otherwise identical (same ray, camera, geometry).
   =========================================================================== */

const MANIFOLD = './manifold.js';   // ← swap to './manifold-iridescent.js' for the other look

async function boot() {
  if (navigator.gpu) {
    try {
      const manifold = await import(MANIFOLD);
      if (await manifold.init()) return;   // WebGPU manifold took over
    } catch (e) {
      // fall through to the WebGL standard page
    }
  }
  await import('./washi.js');              // WebGL washi gradient (fallback)
}

boot();
