import { onBeforeUnmount, onMounted, ref } from 'vue';

export type CrystalShaderConfig = {
  color0: string;
  color1: string;
  number: number;
  seed: string;
};

type Rgb = [number, number, number];

type ShaderState = {
  color0: Rgb;
  color1: Rgb;
  number: number;
  random: number;
};

type ProgramHandles = {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  aPosition: number;
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  color0: WebGLUniformLocation | null;
  color1: WebGLUniformLocation | null;
  number: WebGLUniformLocation | null;
  random: WebGLUniformLocation | null;
};

const VERTEX_SHADER_SOURCE = `#version 300 es
in vec2 aPosition;
out vec2 sourceUV;
void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    sourceUV = aPosition * 0.5 + 0.5;
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec4 _Color0;
uniform vec4 _Color1;
uniform float _Number;
uniform float _Random;

in vec2 sourceUV;
out vec4 outColor;

vec2 hash(vec2 p) {
    p += vec2(_Random);
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 18.5453);
}

float cellDist(vec2 cell, vec2 offset, vec2 uv) {
    vec2 h = hash(cell + offset);
    vec2 r = offset - uv + (0.5 + 0.5 * sin(time * 0.3 + 6.1831 * h));
    return dot(r, r);
}

float mixAmount(vec2 uv) {
    vec2 cell = floor(uv);
    uv = fract(uv);
    float m = 0.0;
    m += cellDist(cell, vec2(-1.0, -1.0), uv);
    m += cellDist(cell, vec2( 0.0, -1.0), uv);
    m += cellDist(cell, vec2( 1.0, -1.0), uv);
    m += cellDist(cell, vec2(-1.0,  0.0), uv);
    m += cellDist(cell, vec2( 0.0,  0.0), uv);
    m += cellDist(cell, vec2( 1.0,  0.0), uv);
    m += cellDist(cell, vec2(-1.0,  1.0), uv);
    m += cellDist(cell, vec2( 0.0,  1.0), uv);
    m += cellDist(cell, vec2( 1.0,  1.0), uv);
    return sqrt(m);
}

void main() {
    vec2 uv = (sourceUV - vec2(0.5)) * vec2(resolution.x / resolution.y, 1.0);
    float m = mixAmount(_Number * uv);
    outColor = mix(_Color1, _Color0, clamp(m / 5.0, 0.0, 1.0));
}
`;

const RENDER_QUALITY = 0.5;
const MAX_BUFFER_DIMENSION = 1920;
const TRANSITION_DURATION_MS = 600;
const DEFAULT_STATE: ShaderState = {
  color0: [1, 1, 1],
  color1: [0, 0, 0],
  number: 5,
  random: 0,
};

const hexToRgb = (hex: string): Rgb => {
  const normalized = hex.replace('#', '');
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((component) => component + component)
          .join('')
      : normalized;
  const value = Number.parseInt(expanded, 16);
  return [((value >> 16) & 0xff) / 255, ((value >> 8) & 0xff) / 255, (value & 0xff) / 255];
};

const seedToRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 10000) / 1000;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const lerpRgb = (from: Rgb, to: Rgb, t: number): Rgb => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
  from[2] + (to[2] - from[2]) * t,
];

export const useCrystalShader = () => {
  const canvas = ref<HTMLCanvasElement | null>(null);

  let gl: WebGL2RenderingContext | null = null;
  let handles: ProgramHandles | null = null;
  let state: ShaderState = { ...DEFAULT_STATE };
  let reducedMotion = false;
  let initialized = false;
  let frameId = 0;
  let disposed = false;
  let transition: { from: ShaderState; to: ShaderState; start: number } | null = null;

  const compileShader = (type: number, source: string): WebGLShader | null => {
    if (!gl) {
      return null;
    }
    const shader = gl.createShader(type);
    if (!shader) {
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const buildProgram = (): ProgramHandles | null => {
    if (!gl) {
      return null;
    }
    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertexShader || !fragmentShader) {
      return null;
    }
    const program = gl.createProgram();
    if (!program) {
      return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    return {
      program,
      buffer,
      aPosition,
      resolution: gl.getUniformLocation(program, 'resolution'),
      time: gl.getUniformLocation(program, 'time'),
      color0: gl.getUniformLocation(program, '_Color0'),
      color1: gl.getUniformLocation(program, '_Color1'),
      number: gl.getUniformLocation(program, '_Number'),
      random: gl.getUniformLocation(program, '_Random'),
    };
  };

  const applyState = () => {
    if (!gl || !handles) {
      return;
    }
    gl.useProgram(handles.program);
    gl.uniform4f(handles.color0, state.color0[0], state.color0[1], state.color0[2], 1);
    gl.uniform4f(handles.color1, state.color1[0], state.color1[1], state.color1[2], 1);
    gl.uniform1f(handles.number, state.number);
    gl.uniform1f(handles.random, state.random);
  };

  const render = (now: number) => {
    if (!gl || !handles || !canvas.value) {
      return;
    }
    if (transition && !reducedMotion) {
      const progress = Math.min(1, (now - transition.start) / TRANSITION_DURATION_MS);
      const eased = easeOutCubic(progress);
      state.color0 = lerpRgb(transition.from.color0, transition.to.color0, eased);
      state.color1 = lerpRgb(transition.from.color1, transition.to.color1, eased);
      if (eased >= 1) {
        state = { ...transition.to };
        transition = null;
      }
    }
    gl.useProgram(handles.program);
    gl.uniform2f(handles.resolution, canvas.value.width, canvas.value.height);
    gl.uniform1f(handles.time, reducedMotion ? 0 : now / 1000);
    applyState();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frameLoop = (now: number) => {
    if (disposed) {
      return;
    }
    render(now);
    if (!reducedMotion) {
      frameId = requestAnimationFrame(frameLoop);
    }
  };

  const resize = () => {
    if (!gl || !canvas.value) {
      return;
    }
    const rect = canvas.value.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = Math.max(1, Math.floor(rect.width * dpr * RENDER_QUALITY));
    let height = Math.max(1, Math.floor(rect.height * dpr * RENDER_QUALITY));
    const maxSide = Math.max(width, height);
    if (maxSide > MAX_BUFFER_DIMENSION) {
      const scale = MAX_BUFFER_DIMENSION / maxSide;
      width = Math.max(1, Math.floor(width * scale));
      height = Math.max(1, Math.floor(height * scale));
    }
    canvas.value.width = width;
    canvas.value.height = height;
    gl.viewport(0, 0, width, height);
    render(reducedMotion ? 0 : performance.now());
  };

  const handleMotionPreference = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches;
    if (reducedMotion) {
      cancelAnimationFrame(frameId);
      render(0);
    } else if (!disposed) {
      frameId = requestAnimationFrame(frameLoop);
    }
  };

  const initialize = () => {
    if (initialized || disposed || !canvas.value) {
      return;
    }
    const context = canvas.value.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!context) {
      return;
    }
    gl = context;
    handles = buildProgram();
    if (!handles) {
      gl = null;
      return;
    }
    initialized = true;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionQuery.matches;
    resize();
    if (!reducedMotion) {
      frameId = requestAnimationFrame(frameLoop);
    }
    window.addEventListener('resize', resize);
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', handleMotionPreference);
    }
  };

  const configure = (config: CrystalShaderConfig) => {
    const target: ShaderState = {
      color0: hexToRgb(config.color0),
      color1: hexToRgb(config.color1),
      number: config.number,
      random: seedToRandom(config.seed),
    };
    if (!initialized || reducedMotion) {
      state = target;
      return;
    }
    state.number = target.number;
    state.random = target.random;
    transition = { from: { ...state }, to: target, start: performance.now() };
  };

  onBeforeUnmount(() => {
    disposed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    if (gl && handles) {
      gl.deleteBuffer(handles.buffer);
      gl.deleteProgram(handles.program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    gl = null;
    handles = null;
  });

  onMounted(initialize);

  return {
    canvas,
    configure,
    resize,
  };
};
