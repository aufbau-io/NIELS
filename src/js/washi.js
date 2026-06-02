/* ===========================================================================
   Josephine Shen — washi gradient (WebGL fallback)
   ---------------------------------------------------------------------------
   The original lean fullscreen-quad fragment shader: a vertical gofun/sumi/
   murasaki wash over the paper ground, scroll- and cursor-aware. Used only
   when WebGPU is unavailable (see bg.js). Self-initialising on import.
   Requires <canvas id="bg"> + the #bg CSS in main.css.
   =========================================================================== */

(function () {
  const canvas = document.getElementById('bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
          || canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
  if (!gl) return; // <html> paper background remains as the fallback

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const VERT = `
    attribute vec2 p; varying vec2 vUv;
    void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform vec2  uRes;
    uniform float uT;
    uniform vec2  uMouse;
    uniform float uScroll;
    uniform float uDocH;

    const vec3 paper    = vec3(0.937, 0.925, 0.890);
    const vec3 murasaki = vec3(0.416, 0.298, 0.769);
    const vec3 usuzumi  = vec3(0.330, 0.330, 0.360);
    const vec3 gofun    = vec3(0.980, 0.975, 0.960);

    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main(){
      vec2 uv = vUv;
      float docY  = uScroll + (1.0 - uv.y) * uRes.y;
      float docN  = docY / max(uDocH, 1.0);
      float yShift = (uMouse.y - 0.5) * 0.05;
      float y = clamp(1.0 - docN + yShift, 0.0, 1.0);
      vec3 col = paper;

      col = mix(col, gofun, smoothstep(0.32, 1.0, y) * 0.55);
      col = mix(col, usuzumi, smoothstep(0.30, 0.0, y) * 0.09);
      col = mix(col, mix(paper, murasaki, 0.5), smoothstep(0.20, 0.0, y) * 0.062);

      vec2 d = uv - uMouse; d.x *= uRes.x / uRes.y;
      col = mix(col, gofun, exp(-dot(d, d) * 7.0) * 0.5);

      float n = hash(vec2(uv.x * uRes.x, docY) * 0.5 + fract(uT * 0.08) * vec2(13.0, 7.0));
      col += (n - 0.5) * 0.016;

      gl_FragColor = vec4(col, 1.0);
    }`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog); gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {
    res:    gl.getUniformLocation(prog, 'uRes'),
    t:      gl.getUniformLocation(prog, 'uT'),
    mouse:  gl.getUniformLocation(prog, 'uMouse'),
    scroll: gl.getUniformLocation(prog, 'uScroll'),
    docH:   gl.getUniformLocation(prog, 'uDocH'),
  };

  const target = { x: 0.5, y: 0.62 };
  const m = { x: 0.5, y: 0.62 };
  let dpr = 1;

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width  = Math.round(innerWidth  * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  addEventListener('pointermove', (e) => {
    target.x = e.clientX / innerWidth;
    target.y = 1.0 - e.clientY / innerHeight;
  }, { passive: true });

  const start = performance.now();
  function frame(now) {
    m.x += (target.x - m.x) * 0.025;
    m.y += (target.y - m.y) * 0.025;
    const t = reduce ? 0 : (now - start) / 1000;
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.t, t);
    gl.uniform2f(U.mouse, m.x, m.y);
    gl.uniform1f(U.scroll, (window.scrollY || window.pageYOffset || 0) * dpr);
    gl.uniform1f(U.docH, document.documentElement.scrollHeight * dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
