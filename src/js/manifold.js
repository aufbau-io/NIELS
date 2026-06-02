/* ===========================================================================
   Daniel Humphries — WebGPU manifold background
   ---------------------------------------------------------------------------
   Drives two canvases:
     • #banner       — tan-plane fragment shader (ported from the original WebGL
                       fragment to WGSL).
     • #bg-manifold  — full-page WavePlaneScene: a displaced wave surface, a cube
                       wireframe, and red "well" rain, coloured with the original
                       iridescent log(sin/cos/tan(dot)) pattern.

   Loaded lazily by bg.js. init() resolves to false (instead of throwing) when
   WebGPU is unavailable or setup fails, which makes bg.js fall back to the
   WebGL banner. Caps DPR at 2 and respects prefers-reduced-motion (freezes the
   auto-animation; the cursor orbit stays live).

   TUNABLES live in the manifold WGSL: GHOST_ALPHA (presence behind the text),
   SCAN_GAIN (sweeping highlight).
   =========================================================================== */

export async function init() {
  const bannerCanvas = document.getElementById('banner');
  const bgCanvas = document.getElementById('bg-manifold');
  if (!bannerCanvas || !bgCanvas || !navigator.gpu) return false;

  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
    if (!adapter) return false;
    const device = await adapter.requestDevice();
    const format = navigator.gpu.getPreferredCanvasFormat();

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DPR_CAP = 2;

    // shared cursor (0..1 from top-left), eased — driven from anywhere on the page
    const tcur = { x: 0.5, y: 0.5 }, cur = { x: 0.5, y: 0.5 };
    addEventListener('pointermove', (e) => {
      tcur.x = e.clientX / innerWidth;
      tcur.y = e.clientY / innerHeight;
    }, { passive: true });

    // ---- tan-plane banner (ported from the original WebGL fragment) ----
    const BANNER_WGSL = `
      struct U { time: f32, _p: f32, mouse: vec2<f32> };
      @group(0) @binding(0) var<uniform> u: U;

      const color1 = vec3<f32>(0.816, 0.816, 0.816);
      const color2 = vec3<f32>(0.733, 0.271, 0.000);
      const color3 = vec3<f32>(0.855, 0.667, 0.333);

      struct VOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
      @vertex fn vs(@builtin(vertex_index) vi: u32) -> VOut {
        var v = array<vec2<f32>,3>(vec2<f32>(-1.,-1.), vec2<f32>(3.,-1.), vec2<f32>(-1.,3.));
        var o: VOut; let p = v[vi];
        o.pos = vec4<f32>(p, 0., 1.); o.uv = p * 0.5 + 0.5; return o;
      }
      @fragment fn fs(in: VOut) -> @location(0) vec4<f32> {
        let position = in.uv * 3.0;
        let wave = 0.5 * (tan(position.x + u.time * 0.1 + 10.0) + u.mouse.x + sin(position.y + u.time + u.mouse.y));
        var color = mix(color1, color2, wave);
        color = mix(color, color3, wave * wave);
        return vec4<f32>(color, 1.0);
      }`;

    const bannerCtx = bannerCanvas.getContext('webgpu');
    if (!bannerCtx) return false;
    bannerCtx.configure({ device, format, alphaMode: 'opaque' });
    const bMod = device.createShaderModule({ code: BANNER_WGSL });
    const bLayout = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {} }] });
    const bPL = device.createPipelineLayout({ bindGroupLayouts: [bLayout] });
    const bannerPipe = device.createRenderPipeline({
      layout: bPL,
      vertex: { module: bMod, entryPoint: 'vs' },
      fragment: { module: bMod, entryPoint: 'fs', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });
    const bBuf = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const bBG = device.createBindGroup({ layout: bLayout, entries: [{ binding: 0, resource: { buffer: bBuf } }] });
    const bUni = new Float32Array(4);

    // ---- manifold (WavePlaneScene) ----
    // TUNABLES: GHOST_ALPHA = how present the render is behind the text (1.0 = opaque)
    //           SCAN_GAIN   = sweeping highlight (0.0 = off)
    const MANIFOLD_WGSL = `
      struct U { viewProj: mat4x4<f32>, time: f32, _p0: f32, _p1: f32, _p2: f32 };
      @group(0) @binding(0) var<uniform> u: U;

      const GHOST_ALPHA: f32 = 0.45;
      const SCAN_GAIN:   f32 = 0.5;
      const SCAN_SPEED:  f32 = 2.0;
      const SCAN_WIDTH:  f32 = 0.5;
      fn scanBoost(worldX: f32) -> f32 {
        let s = mix(-5.0, 5.0, fract(u.time * SCAN_SPEED));
        return exp(-pow((worldX - s) / SCAN_WIDTH, 2.0)) * SCAN_GAIN;
      }
      // sanitize the intentionally-wild log(tan) pattern: NaN -> transparent
      fn finish(col: vec3<f32>) -> vec4<f32> {
        let bad = any(col != col);
        let rgb = select(col, vec3<f32>(0.0), col != col);
        return vec4<f32>(rgb, select(GHOST_ALPHA, 0.0, bad));
      }

      struct POut { @builtin(position) pos: vec4<f32>, @location(0) world: vec3<f32> };
      @vertex fn vs_plane(@location(0) position: vec3<f32>, @location(1) disp: f32) -> POut {
        let tf = u.time * 5.0;
        let combined = sin(position.x + tf) * 0.5 + cos(position.z * 0.5 - tf) * 0.3;
        let displaced = vec3<f32>(position.x, position.y + disp * combined, position.z);
        var o: POut; o.pos = u.viewProj * vec4<f32>(displaced, 1.0); o.world = displaced; return o;
      }
      @fragment fn fs_plane(in: POut) -> @location(0) vec4<f32> {
        let scale = 0.0015;
        let cp = vec3<f32>(in.pos.x, in.pos.y, in.pos.z);
        let ap = abs(in.world * cp * scale);
        let p1 = log(sin(dot(ap, cp) * 0.01));
        let p2 = log(cos(dot(ap, cp) * 0.01));
        let p3 = log(tan(dot(ap, cp) * 10.0));
        let c1 = mix(p1, p2, sin(u.time * cp.x * cp.y * 0.01));
        let c2 = mix(p2, p3, cos(u.time * cp.y * cp.y * 0.01));
        let c3 = mix(p3, p2, sin(u.time * cp.z * cp.y * 0.0001));
        var col = vec3<f32>(c1, c2, c3);
        col *= 1.0 + scanBoost(in.world.x);
        return finish(col);
      }

      struct LOut { @builtin(position) pos: vec4<f32>, @location(0) world: vec3<f32> };
      @vertex fn vs_line(@location(0) position: vec3<f32>) -> LOut {
        let scaled = position * 0.5;
        var o: LOut; o.pos = u.viewProj * vec4<f32>(scaled, 1.0); o.world = scaled; return o;
      }
      @fragment fn fs_line(in: LOut) -> @location(0) vec4<f32> {
        let scale = 0.002;
        let cp = vec3<f32>(in.pos.x, in.pos.y, in.pos.z);
        let ap = abs(cos(u.time) * cp * scale);
        let p1 = log(sin(dot(ap, cp) * 0.01));
        let p2 = log(cos(dot(ap, cp) * 0.01));
        let p3 = log(tan(dot(ap, cp) * 10.0));
        let c1 = mix(p1, p2, sin(u.time * cp.x * cp.y * 0.01));
        let c2 = mix(p2, p3, cos(u.time * cp.y * cp.y * 0.01));
        let c3 = mix(p3, p2, sin(u.time * cp.z * cp.y * 0.0001));
        var col = vec3<f32>(c1, c2, c3);
        col *= 1.0 + scanBoost(in.world.x);
        return finish(col);
      }

      struct WOut { @builtin(position) pos: vec4<f32> };
      @vertex fn vs_well(@location(0) position: vec3<f32>) -> WOut {
        var o: WOut; o.pos = u.viewProj * vec4<f32>(position, 1.0); return o;
      }
      @fragment fn fs_well(in: WOut) -> @location(0) vec4<f32> {
        let y = fract(in.pos.y / 100.0 - u.time * 5.0);
        var op = 0.0;
        if (y > 0.5) { op = y - 0.5; }
        return vec4<f32>(1.0, 0.0, 0.0, op);
      }`;

    const bgCtx = bgCanvas.getContext('webgpu');
    if (!bgCtx) return false;
    bgCtx.configure({ device, format, alphaMode: 'opaque' });
    const mMod = device.createShaderModule({ code: MANIFOLD_WGSL });
    const mLayout = device.createBindGroupLayout({ entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: {} }] });
    const mPL = device.createPipelineLayout({ bindGroupLayouts: [mLayout] });
    const mBuf = device.createBuffer({ size: 80, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const mBG = device.createBindGroup({ layout: mLayout, entries: [{ binding: 0, resource: { buffer: mBuf } }] });
    const mUni = new Float32Array(20);

    const depthState = (write, compare) => ({ format: 'depth32float', depthWriteEnabled: write, depthCompare: compare });
    const alphaOver = {
      color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    };
    const planePipe = device.createRenderPipeline({
      layout: mPL,
      vertex: { module: mMod, entryPoint: 'vs_plane', buffers: [{ arrayStride: 16, attributes: [
        { shaderLocation: 0, offset: 0, format: 'float32x3' }, { shaderLocation: 1, offset: 12, format: 'float32' }] }] },
      fragment: { module: mMod, entryPoint: 'fs_plane', targets: [{ format, blend: alphaOver }] },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
      depthStencil: depthState(true, 'less'),
    });
    const linePipe = device.createRenderPipeline({
      layout: mPL,
      vertex: { module: mMod, entryPoint: 'vs_line', buffers: [{ arrayStride: 12, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }] },
      fragment: { module: mMod, entryPoint: 'fs_line', targets: [{ format, blend: alphaOver }] },
      primitive: { topology: 'line-list' },
      depthStencil: depthState(true, 'less'),
    });
    const wellPipe = device.createRenderPipeline({
      layout: mPL,
      vertex: { module: mMod, entryPoint: 'vs_well', buffers: [{ arrayStride: 12, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }] },
      fragment: { module: mMod, entryPoint: 'fs_well', targets: [{ format, blend: {
        color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' },
        alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } } }] },
      primitive: { topology: 'line-list' },
      depthStencil: depthState(false, 'less'),
    });

    // geometry (from wave_plane.rs)
    const GRID = 100;
    const pv = new Float32Array(GRID * GRID * 4); let k = 0;
    for (let x = 0; x < GRID; x++) for (let z = 0; z < GRID; z++) {
      const xp = (x / (GRID - 1)) * 10 - 5, zp = (z / (GRID - 1)) * 10 - 5;
      const dist = Math.sqrt(xp * xp + zp * zp + Math.random() * 0.05);
      const wf = 0.05 + Math.random() * 0.01, wf2 = 0.5 + Math.random() * 0.01;
      pv[k++] = xp; pv[k++] = 0; pv[k++] = zp;
      pv[k++] = 3.0 * Math.sin(xp * wf - wf2 * dist) * Math.cos(zp * wf - wf2 * dist);
    }
    const pi = [];
    for (let x = 0; x < GRID - 1; x++) for (let z = 0; z < GRID - 1; z++) {
      const s = x * GRID + z; pi.push(s, s + GRID, s + 1, s + 1, s + GRID, s + GRID + 1);
    }
    const planeIdx = new Uint16Array(pi);
    const cubeV = new Float32Array([-5,-5,-5, 5,-5,-5, -5,5,-5, 5,5,-5, -5,-5,5, 5,-5,5, -5,5,5, 5,5,5]);
    const cubeI = new Uint16Array([0,1,1,3,3,2,2,0, 4,5,5,7,7,6,6,4, 0,4,1,5,2,6,3,7]);
    const wv = []; for (let i = 0; i < 10; i++) { const x = i - 5 + 0.5; wv.push(x,-5,0, x,5,0); }
    const wellV = new Float32Array(wv);
    const wellI = new Uint16Array(Array.from({ length: 20 }, (_, i) => i));

    const mk = (data, usage) => { const b = device.createBuffer({ size: (data.byteLength + 3) & ~3, usage: usage | GPUBufferUsage.COPY_DST }); device.queue.writeBuffer(b, 0, data); return b; };
    const planeVB = mk(pv, GPUBufferUsage.VERTEX), planeIB = mk(planeIdx, GPUBufferUsage.INDEX);
    const cubeVB = mk(cubeV, GPUBufferUsage.VERTEX), cubeIB = mk(cubeI, GPUBufferUsage.INDEX);
    const wellVB = mk(wellV, GPUBufferUsage.VERTEX), wellIB = mk(wellI, GPUBufferUsage.INDEX);

    // ---- mat4 helpers ----
    const mul = (a, b) => { const o = new Float32Array(16);
      for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++)
        o[c*4+r] = a[r]*b[c*4] + a[4+r]*b[c*4+1] + a[8+r]*b[c*4+2] + a[12+r]*b[c*4+3];
      return o; };
    const persp = (fovy, asp, n, f) => { const t = 1/Math.tan(fovy/2), nf = 1/(n-f), m = new Float32Array(16);
      m[0] = t/asp; m[5] = t; m[10] = f*nf; m[11] = -1; m[14] = f*n*nf; return m; };
    const look = (e, c, up) => {
      let fx=c[0]-e[0],fy=c[1]-e[1],fz=c[2]-e[2]; const fl=Math.hypot(fx,fy,fz); const f=[fx/fl,fy/fl,fz/fl];
      let sx=f[1]*up[2]-f[2]*up[1],sy=f[2]*up[0]-f[0]*up[2],sz=f[0]*up[1]-f[1]*up[0]; const sl=Math.hypot(sx,sy,sz); const s=[sx/sl,sy/sl,sz/sl];
      const u0=s[1]*f[2]-s[2]*f[1],u1=s[2]*f[0]-s[0]*f[2],u2=s[0]*f[1]-s[1]*f[0]; const m=new Float32Array(16);
      m[0]=s[0];m[1]=u0;m[2]=-f[0]; m[4]=s[1];m[5]=u1;m[6]=-f[1]; m[8]=s[2];m[9]=u2;m[10]=-f[2];
      m[12]=-(s[0]*e[0]+s[1]*e[1]+s[2]*e[2]); m[13]=-(u0*e[0]+u1*e[1]+u2*e[2]); m[14]=(f[0]*e[0]+f[1]*e[1]+f[2]*e[2]); m[15]=1; return m; };

    // ---- sizing ----
    let dpr = 1, depthTex = null, depthView = null;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
      bannerCanvas.width  = Math.max(1, Math.round(bannerCanvas.clientWidth  * dpr));
      bannerCanvas.height = Math.max(1, Math.round(bannerCanvas.clientHeight * dpr));
      bgCanvas.width  = Math.max(1, Math.round(innerWidth  * dpr));
      bgCanvas.height = Math.max(1, Math.round(innerHeight * dpr));
      if (depthTex) depthTex.destroy();
      depthTex = device.createTexture({ size: [bgCanvas.width, bgCanvas.height], format: 'depth32float', usage: GPUTextureUsage.RENDER_ATTACHMENT });
      depthView = depthTex.createView();
    }
    addEventListener('resize', resize, { passive: true });
    resize();

    const t0 = performance.now();
    function frame(now) {
      cur.x += (tcur.x - cur.x) * 0.06;
      cur.y += (tcur.y - cur.y) * 0.06;
      const secs = (now - t0) / 1000;
      const tBanner = reduce ? 0 : secs;
      const tManif  = reduce ? 0 : secs * 0.05;

      bUni[0] = tBanner; bUni[2] = cur.x * 2 - 1; bUni[3] = 1 - 2 * cur.y;
      device.queue.writeBuffer(bBuf, 0, bUni);

      const up = 1 - cur.y;
      const az = (cur.x - 0.5) * Math.PI * 1.2 + (reduce ? 0 : secs * 0.04);
      const el = Math.min(Math.max((up - 0.5) + 0.45, 0.1), 1.3);
      const R = 35;
      const eye = [Math.sin(az)*Math.cos(el)*R, Math.sin(el)*R, Math.cos(az)*Math.cos(el)*R];
      const vp = mul(persp(20*Math.PI/180, bgCanvas.width/bgCanvas.height, 0.1, 200), look(eye, [0,0,0], [0,1,0]));
      mUni.set(vp, 0); mUni[16] = tManif;
      device.queue.writeBuffer(mBuf, 0, mUni);

      const enc = device.createCommandEncoder();

      const mp = enc.beginRenderPass({
        colorAttachments: [{ view: bgCtx.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0.980, g: 0.980, b: 0.980, a: 1 } }],
        depthStencilAttachment: { view: depthView, depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store' },
      });
      mp.setBindGroup(0, mBG);
      mp.setPipeline(planePipe); mp.setVertexBuffer(0, planeVB); mp.setIndexBuffer(planeIB, 'uint16'); mp.drawIndexed(planeIdx.length);
      mp.setPipeline(linePipe);  mp.setVertexBuffer(0, cubeVB);  mp.setIndexBuffer(cubeIB, 'uint16');  mp.drawIndexed(cubeI.length);
      mp.setPipeline(wellPipe);  mp.setVertexBuffer(0, wellVB);  mp.setIndexBuffer(wellIB, 'uint16');  mp.drawIndexed(wellI.length);
      mp.end();

      const bp = enc.beginRenderPass({
        colorAttachments: [{ view: bannerCtx.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0.137, g: 0.137, b: 0.137, a: 1 } }],
      });
      bp.setPipeline(bannerPipe); bp.setBindGroup(0, bBG); bp.draw(3); bp.end();

      device.queue.submit([enc.finish()]);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return true;
  } catch (e) {
    return false;
  }
}
