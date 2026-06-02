/* ===========================================================================
   Background router
   ---------------------------------------------------------------------------
   Pulls in the stylesheet (rollup-plugin-postcss extracts it to
   /assets/styles.css at build time) and, when WebGPU is available, the
   ghostly manifold background from manifold.js. If WebGPU is missing or its
   setup fails, the page renders fine without the background.
   =========================================================================== */

   import '../styles/main.css';

   async function boot() {
     if (!navigator.gpu) return;          // no WebGPU → plain page, no background
     try {
       const manifold = await import('./manifold.js');
       await manifold.init();             // resolves false on failure — nothing else to do
     } catch {
       // WebGPU setup threw; leave the background plain
     }
   }
   
   boot();