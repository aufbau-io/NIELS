/* ===========================================================================
   Daniel Humphries — WebGPU manifold background — IRIDESCENT variant (Rust log(sin/cos/tan) colors)
   ---------------------------------------------------------------------------
   The manifold from the Rust crate (raum) = WavePlaneScene:

     • the wave surface   — wave_plane.rs grid + plane_shader.wgsl (vertex AND
                            fragment ported verbatim)
     • the cube wireframe — cube_edges at ×0.5, line_shader.wgsl fragment verbatim
     • the wells          — generate_wells + well_shader.wgsl (red rain, verbatim)

   Coloring of the surface/wire is the original iridescent log(sin/cos/tan(dot))
   pattern, keyed off the framebuffer + world position exactly as in Rust.
   Composited over the washi ground with GHOST_ALPHA. Cursor orbits the camera;
   a scan band sweeps across world-x.

   Drop-in via main.js (the router); when WebGPU is unavailable the page renders
   without a background. Renders into <canvas id="bg-manifold">. Caps DPR at 2,
   respects prefers-reduced-motion (freezes auto
   animation; cursor-orbit stays live).
   =========================================================================== */

   const WGSL = /* wgsl */ `
   struct U {
     viewProj: mat4x4<f32>,
     time: f32,             // elapsed * TIME_SCALE  (== Rust time.time; 0 if reduced-motion)
     _p0: f32, _p1: f32, _p2: f32,
   };
   @group(0) @binding(0) var<uniform> u: U;
   
   const paper    = vec3<f32>(0.937, 0.925, 0.890);  // #efece3
   const usuzumi  = vec3<f32>(0.330, 0.330, 0.360);
   const gofun    = vec3<f32>(0.980, 0.975, 0.960);
   
   // ---- TUNABLES -----------------------------------------------------------
   const GHOST_ALPHA: f32 = 0.7;   // surface/wire opacity over the ground (1.0 = opaque Rust look)
   const SCAN_GAIN:   f32 = 0.8;   // brightness of the sweeping scan band (0.0 = off)
   const SCAN_SPEED:  f32 = 2.0;
   const SCAN_WIDTH:  f32 = 0.5;
   
   fn scanBoost(worldX: f32) -> f32 {
     let scanX = mix(-5.0, 5.0, fract(u.time * SCAN_SPEED));
     return exp(-pow((worldX - scanX) / SCAN_WIDTH, 2.0)) * SCAN_GAIN;
   }
   
   // =========================================================================
   //  washi ground (fullscreen, behind the geometry)
   // =========================================================================
   struct BgOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
   
   @vertex
   fn vs_bg(@builtin(vertex_index) vi: u32) -> BgOut {
     var v = array<vec2<f32>, 3>(vec2<f32>(-1.0,-1.0), vec2<f32>(3.0,-1.0), vec2<f32>(-1.0,3.0));
     var o: BgOut;
     let p = v[vi];
     o.pos = vec4<f32>(p, 0.0, 1.0);
     o.uv  = p * 0.5 + 0.5;
     return o;
   }
   @fragment
   fn fs_bg(in: BgOut) -> @location(0) vec4<f32> {
     var col = paper;
     col = mix(col, gofun,   smoothstep(0.32, 1.0, in.uv.y) * 0.45);
     col = mix(col, usuzumi, smoothstep(0.30, 0.0, in.uv.y) * 0.08);
     return vec4<f32>(col, 1.0);
   }
   
   // =========================================================================
   //  wave surface — plane_shader.wgsl (vertex + fragment verbatim)
   // =========================================================================
   struct POut { @builtin(position) pos: vec4<f32>, @location(0) world: vec3<f32> };
   
   @vertex
   fn vs_plane(@location(0) position: vec3<f32>, @location(1) disp: f32) -> POut {
     let time_factor  = u.time * 5.0;
     let sin_wave     = sin(position.x * 1.0 + time_factor) * 0.5;
     let cos_wave     = cos(position.z * 0.5 - time_factor) * 0.3;
     let combined     = sin_wave + cos_wave;
     let new_disp     = disp * combined;
     let displaced    = vec3<f32>(position.x, position.y + new_disp, position.z);
     var o: POut;
     o.pos   = u.viewProj * vec4<f32>(displaced, 1.0);
     o.world = displaced;
     return o;
   }
   @fragment
   fn fs_plane(in: POut) -> @location(0) vec4<f32> {
     let scale = 0.0015;
     let clip_pos_truncated = vec3<f32>(in.pos.x, in.pos.y, in.pos.z);   // framebuffer coords, as in Rust
     let adjusted_pos = abs(in.world * clip_pos_truncated * scale);
   
     let pattern1 = log(sin(dot(adjusted_pos, clip_pos_truncated) * 0.01));
     let pattern2 = log(cos(dot(adjusted_pos, clip_pos_truncated) * 0.01));
     let pattern3 = log(tan(dot(adjusted_pos, clip_pos_truncated) * 10.0));
   
     let color1 = mix(pattern1, pattern2, sin(u.time * clip_pos_truncated.x * clip_pos_truncated.y * 0.01));
     let color2 = mix(pattern2, pattern3, cos(u.time * clip_pos_truncated.y * clip_pos_truncated.y * 0.01));
     let color3 = mix(pattern3, pattern2, sin(u.time * clip_pos_truncated.z * clip_pos_truncated.y * 0.0001));
   
     var col = vec3<f32>(color1, color2, color3);
     col *= 1.0 + scanBoost(in.world.x);
     return vec4<f32>(col, GHOST_ALPHA);
   }
   
   // =========================================================================
   //  cube wireframe — line_shader.wgsl (position ×0.5, fragment verbatim)
   // =========================================================================
   struct LOut { @builtin(position) pos: vec4<f32>, @location(0) world: vec3<f32> };
   
   @vertex
   fn vs_line(@location(0) position: vec3<f32>) -> LOut {
     let scaled = position * 0.5;
     var o: LOut;
     o.pos   = u.viewProj * vec4<f32>(scaled, 1.0);
     o.world = scaled;
     return o;
   }
   @fragment
   fn fs_line(in: LOut) -> @location(0) vec4<f32> {
     let scale = 0.002;
     let clip_pos_truncated = vec3<f32>(in.pos.x, in.pos.y, in.pos.z);
     let adjusted_pos = abs(cos(u.time) * clip_pos_truncated * scale);
   
     let pattern1 = log(sin(dot(adjusted_pos, clip_pos_truncated) * 0.01));
     let pattern2 = log(cos(dot(adjusted_pos, clip_pos_truncated) * 0.01));
     let pattern3 = log(tan(dot(adjusted_pos, clip_pos_truncated) * 10.0));
   
     let color1 = mix(pattern1, pattern2, sin(u.time * clip_pos_truncated.x * clip_pos_truncated.y * 0.01));
     let color2 = mix(pattern2, pattern3, cos(u.time * clip_pos_truncated.y * clip_pos_truncated.y * 0.01));
     let color3 = mix(pattern3, pattern2, sin(u.time * clip_pos_truncated.z * clip_pos_truncated.y * 0.0001));
   
     var col = vec3<f32>(color1, color2, color3);
     col *= 1.0 + scanBoost(in.world.x);
     return vec4<f32>(col, GHOST_ALPHA);
   }
   
   // =========================================================================
   //  wells — well_shader.wgsl (red rain, verbatim), additive
   // =========================================================================
   struct WOut { @builtin(position) pos: vec4<f32> };
   
   @vertex
   fn vs_well(@location(0) position: vec3<f32>) -> WOut {
     var o: WOut;
     o.pos = u.viewProj * vec4<f32>(position, 1.0);
     return o;
   }
   @fragment
   fn fs_well(in: WOut) -> @location(0) vec4<f32> {
     let speed    = 5.0;
     let repeat_y = 100.0;
     let y_effect = fract(in.pos.y / repeat_y - u.time * speed);
     var opacity  = 0.0;
     if (y_effect > 0.5) { opacity = y_effect - 0.5; }
     return vec4<f32>(1.0, 0.0, 0.0, opacity);
   }
   `;
   
   // ---- tiny column-major mat4 helpers (no cgmath in the browser) ----------
   function mat4Mul(a, b) {
     const o = new Float32Array(16);
     for (let c = 0; c < 4; c++)
       for (let r = 0; r < 4; r++)
         o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
     return o;
   }
   function perspectiveZO(fovy, aspect, near, far) {
     const f = 1 / Math.tan(fovy / 2);
     const nf = 1 / (near - far);
     const m = new Float32Array(16);
     m[0] = f / aspect; m[5] = f;
     m[10] = far * nf;  m[11] = -1;
     m[14] = far * near * nf;
     return m;
   }
   function lookAtRH(eye, center, up) {
     const fx = center[0] - eye[0], fy = center[1] - eye[1], fz = center[2] - eye[2];
     let fl = Math.hypot(fx, fy, fz); const f = [fx / fl, fy / fl, fz / fl];
     let sx = f[1] * up[2] - f[2] * up[1], sy = f[2] * up[0] - f[0] * up[2], sz = f[0] * up[1] - f[1] * up[0];
     let sl = Math.hypot(sx, sy, sz); const s = [sx / sl, sy / sl, sz / sl];
     const u0 = s[1] * f[2] - s[2] * f[1], u1 = s[2] * f[0] - s[0] * f[2], u2 = s[0] * f[1] - s[1] * f[0];
     const m = new Float32Array(16);
     m[0] = s[0]; m[1] = u0; m[2] = -f[0]; m[3] = 0;
     m[4] = s[1]; m[5] = u1; m[6] = -f[1]; m[7] = 0;
     m[8] = s[2]; m[9] = u2; m[10] = -f[2]; m[11] = 0;
     m[12] = -(s[0] * eye[0] + s[1] * eye[1] + s[2] * eye[2]);
     m[13] = -(u0 * eye[0] + u1 * eye[1] + u2 * eye[2]);
     m[14] =  (f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2]);
     m[15] = 1;
     return m;
   }
   
   // ---- geometry (ported from wave_plane.rs) -------------------------------
   const GRID = 100;
   function buildPlane() {
     const verts = new Float32Array(GRID * GRID * 4);
     let k = 0;
     for (let x = 0; x < GRID; x++) {
       for (let z = 0; z < GRID; z++) {
         const xp = (x / (GRID - 1)) * 10 - 5;
         const zp = (z / (GRID - 1)) * 10 - 5;
         const dist = Math.sqrt(xp * xp + zp * zp + Math.random() * 0.05);
         const wf  = 0.05 + Math.random() * 0.01;
         const wf2 = 0.5  + Math.random() * 0.01;
         const disp = 3.0 * Math.sin(xp * wf - wf2 * dist) * Math.cos(zp * wf - wf2 * dist);
         verts[k++] = xp; verts[k++] = 0; verts[k++] = zp; verts[k++] = disp;
       }
     }
     const idx = [];
     for (let x = 0; x < GRID - 1; x++) {
       for (let z = 0; z < GRID - 1; z++) {
         const s = x * GRID + z;
         idx.push(s, s + GRID, s + 1, s + 1, s + GRID, s + GRID + 1);
       }
     }
     return { verts, idx: new Uint16Array(idx) };
   }
   const CUBE_VERTS = new Float32Array([
     -5,-5,-5,  5,-5,-5,  -5,5,-5,  5,5,-5,
     -5,-5, 5,  5,-5, 5,  -5,5, 5,  5,5, 5,
   ]);
   const CUBE_IDX = new Uint16Array([
     0,1, 1,3, 3,2, 2,0,  4,5, 5,7, 7,6, 6,4,  0,4, 1,5, 2,6, 3,7,
   ]);
   function buildWells() {
     const n = 10, v = [], idx = [];
     for (let i = 0; i < n; i++) {
       const x = i - n / 2 + 0.5;
       v.push(x, -5, 0, x, 5, 0);
     }
     for (let i = 0; i < n * 2; i++) idx.push(i);
     return { verts: new Float32Array(v), idx: new Uint16Array(idx) };
   }
   
   export async function init() {
     const canvas = document.getElementById('bg-manifold');
     if (!canvas || !navigator.gpu) return false;
   
     let adapter, device;
     try {
       adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
       if (!adapter) return false;
       device = await adapter.requestDevice();
     } catch (e) { return false; }
   
     const ctx = canvas.getContext('webgpu');
     if (!ctx) return false;
     const format = navigator.gpu.getPreferredCanvasFormat();
     ctx.configure({ device, format, alphaMode: 'opaque' });
   
     const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
     const DPR_CAP = 2;
     const TIME_SCALE = 0.05;        // matches the Rust shared time_scale
     const CAM_RADIUS = 35;          // ~|eye (15,10,30)|
     const FOVY = 20 * Math.PI / 180;
     const DEPTH = 'depth32float';
   
     const plane = buildPlane();
     const wells = buildWells();
     const mk = (data, usage) => {
       const b = device.createBuffer({ size: (data.byteLength + 3) & ~3, usage: usage | GPUBufferUsage.COPY_DST });
       device.queue.writeBuffer(b, 0, data);
       return b;
     };
     const planeVB = mk(plane.verts, GPUBufferUsage.VERTEX);
     const planeIB = mk(plane.idx,   GPUBufferUsage.INDEX);
     const cubeVB  = mk(CUBE_VERTS,  GPUBufferUsage.VERTEX);
     const cubeIB  = mk(CUBE_IDX,    GPUBufferUsage.INDEX);
     const wellVB  = mk(wells.verts, GPUBufferUsage.VERTEX);
     const wellIB  = mk(wells.idx,   GPUBufferUsage.INDEX);
   
     const uniBuf = device.createBuffer({ size: 80, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
     const uni = new Float32Array(20);   // 0..15 viewProj · 16 time
   
     const module = device.createShaderModule({ code: WGSL });
     const bindLayout = device.createBindGroupLayout({
       entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: {} }],
     });
     const pipeLayout = device.createPipelineLayout({ bindGroupLayouts: [bindLayout] });
     const bindGroup = device.createBindGroup({ layout: bindLayout, entries: [{ binding: 0, resource: { buffer: uniBuf } }] });
   
     const depthState = (write, compare) => ({ format: DEPTH, depthWriteEnabled: write, depthCompare: compare });
     const alphaOver = {
       color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
       alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
     };
   
     const bgPipe = device.createRenderPipeline({
       layout: pipeLayout,
       vertex: { module, entryPoint: 'vs_bg' },
       fragment: { module, entryPoint: 'fs_bg', targets: [{ format }] },
       primitive: { topology: 'triangle-list' },
       depthStencil: depthState(false, 'always'),
     });
     const planePipe = device.createRenderPipeline({
       layout: pipeLayout,
       vertex: { module, entryPoint: 'vs_plane', buffers: [{ arrayStride: 16, attributes: [
         { shaderLocation: 0, offset: 0, format: 'float32x3' },
         { shaderLocation: 1, offset: 12, format: 'float32' },
       ] }] },
       fragment: { module, entryPoint: 'fs_plane', targets: [{ format, blend: alphaOver }] },
       primitive: { topology: 'triangle-list', cullMode: 'none' },
       depthStencil: depthState(true, 'less'),
     });
     const linePipe = device.createRenderPipeline({
       layout: pipeLayout,
       vertex: { module, entryPoint: 'vs_line', buffers: [{ arrayStride: 12, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }] },
       fragment: { module, entryPoint: 'fs_line', targets: [{ format, blend: alphaOver }] },
       primitive: { topology: 'line-list' },
       depthStencil: depthState(true, 'less'),
     });
     const wellPipe = device.createRenderPipeline({
       layout: pipeLayout,
       vertex: { module, entryPoint: 'vs_well', buffers: [{ arrayStride: 12, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }] },
       fragment: { module, entryPoint: 'fs_well', targets: [{ format, blend: {
         color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' },
         alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
       } }] },
       primitive: { topology: 'line-list' },
       depthStencil: depthState(false, 'less'),
     });
     let dpr = 1, depthTex = null, depthView = null;
     function resize() {
       dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
       canvas.width  = Math.max(1, Math.round(innerWidth  * dpr));
       canvas.height = Math.max(1, Math.round(innerHeight * dpr));
       canvas.style.width  = innerWidth  + 'px';
       canvas.style.height = innerHeight + 'px';
       if (depthTex) depthTex.destroy();
       depthTex = device.createTexture({ size: [canvas.width, canvas.height], format: DEPTH, usage: GPUTextureUsage.RENDER_ATTACHMENT });
       depthView = depthTex.createView();
     }
     addEventListener('resize', resize, { passive: true });
     resize();
   
     const targetM = { x: 0.5, y: 0.5 };
     const m = { x: 0.5, y: 0.5 };
     addEventListener('pointermove', (e) => {
       targetM.x = e.clientX / innerWidth;
       targetM.y = 1.0 - e.clientY / innerHeight;
     }, { passive: true });
   
     const start = performance.now();
     function frame(now) {
       m.x += (targetM.x - m.x) * 0.025;
       m.y += (targetM.y - m.y) * 0.025;
       const t = reduce ? 0 : (now - start) / 1000 * TIME_SCALE;
   
       // camera orbit
       const az = (m.x - 0.5) * Math.PI * 1.2 + (reduce ? 0 : (now - start) / 1000 * 0.04);
       const el = Math.min(Math.max((m.y - 0.5) * 1.0 + 0.45, 0.1), 1.3);
       const eye = [
         Math.sin(az) * Math.cos(el) * CAM_RADIUS,
         Math.sin(el) * CAM_RADIUS,
         Math.cos(az) * Math.cos(el) * CAM_RADIUS,
       ];
       const aspect = canvas.width / canvas.height;
       const viewProj = mat4Mul(perspectiveZO(FOVY, aspect, 0.1, 200), lookAtRH(eye, [0, 0, 0], [0, 1, 0]));
   
       uni.set(viewProj, 0);
       uni[16] = t;
       device.queue.writeBuffer(uniBuf, 0, uni);
   
       const encoder = device.createCommandEncoder();
       const pass = encoder.beginRenderPass({
         colorAttachments: [{ view: ctx.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store',
           clearValue: { r: 0.937, g: 0.925, b: 0.890, a: 0 } }],
         depthStencilAttachment: { view: depthView, depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store' },
       });
       pass.setBindGroup(0, bindGroup);
   
       pass.setPipeline(bgPipe);    pass.draw(3);
   
       pass.setPipeline(planePipe);
       pass.setVertexBuffer(0, planeVB);
       pass.setIndexBuffer(planeIB, 'uint16');
       pass.drawIndexed(plane.idx.length);
   
       pass.setPipeline(linePipe);
       pass.setVertexBuffer(0, cubeVB);
       pass.setIndexBuffer(cubeIB, 'uint16');
       pass.drawIndexed(CUBE_IDX.length);
   
       pass.setPipeline(wellPipe);
       pass.setVertexBuffer(0, wellVB);
       pass.setIndexBuffer(wellIB, 'uint16');
       pass.drawIndexed(wells.idx.length);
   
       pass.end();
       device.queue.submit([encoder.finish()]);
       requestAnimationFrame(frame);
     }
     requestAnimationFrame(frame);
     return true;
   }