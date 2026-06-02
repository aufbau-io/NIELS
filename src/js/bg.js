/* ===========================================================================
   Background router
   ---------------------------------------------------------------------------
   Import THIS instead of bg.js (e.g. in main.js:  import './background.js';).

   WebGPU available & a device comes up  ->  the new ghostly manifold.
   Anything missing or failing           ->  the existing WebGL bg.js (standard
                                              page), imported unchanged.

   manifold.init() resolves to false (rather than throwing) when WebGPU can't
   be used, which is what triggers the fallback below.
   =========================================================================== */

   async function boot() {
    if (navigator.gpu) {
      try {
        const manifold = await import('./manifold.js');
        if (await manifold.init()) return;     // WebGPU path took over
      } catch (e) {
        // fall through to the WebGL standard page
      }
    }
    await import('./bg.js');                    // existing washi shader
  }
  
  boot();