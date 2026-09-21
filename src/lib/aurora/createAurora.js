import { hexToRgb01 } from './color';
import { AURORA_DEFAULTS } from './defaults';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';

/**
 * Renders the Aurora effect with plain WebGL2 into a canvas appended to `container`.
 *
 * Returns `{ destroy }`, or `null` when WebGL2 is unavailable (the page then simply
 * keeps its black background).
 *
 * @param {HTMLElement} container
 * @param {{ colorStops?: readonly string[], amplitude?: number, blend?: number, speed?: number }} [options]
 */
export function createAurora(container, options = {}) {
  const { colorStops, amplitude, blend, speed } = { ...AURORA_DEFAULTS, ...options };

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
  });
  if (!gl) return null;

  container.appendChild(canvas);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[aurora] shader compile error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  };

  const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[aurora] program link error:', gl.getProgramInfoLog(program));
  }
  gl.useProgram(program);

  // One oversized triangle covers the whole viewport (cheaper than a quad).
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    amplitude: gl.getUniformLocation(program, 'uAmplitude'),
    colorStops: gl.getUniformLocation(program, 'uColorStops'),
    resolution: gl.getUniformLocation(program, 'uResolution'),
    blend: gl.getUniformLocation(program, 'uBlend'),
  };

  // Static uniforms are uploaded once; only uTime changes per frame.
  gl.uniform3fv(uniforms.colorStops, new Float32Array(colorStops.flatMap(hexToRgb01)));
  gl.uniform1f(uniforms.amplitude, amplitude);
  gl.uniform1f(uniforms.blend, blend);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(container.offsetWidth * dpr);
    canvas.height = Math.floor(container.offsetHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
  };
  window.addEventListener('resize', resize);
  resize();

  let frameId = 0;
  const render = (timestamp) => {
    frameId = requestAnimationFrame(render);
    gl.uniform1f(uniforms.time, timestamp * 0.01 * speed * 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  frameId = requestAnimationFrame(render);

  return {
    destroy() {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
