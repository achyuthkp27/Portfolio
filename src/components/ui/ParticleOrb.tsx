import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { isLowEndDevice } from "@/hooks/useLowEndDevice";

/** Points on the globe; fewer on budget hardware */
const POINTS = 9000;
const POINTS_LOW = 4500;
/** Globe radius in CSS px at which every point is drawn; smaller globes draw fewer */
const FULL_RADIUS = 220;
const MIN_POINTS = 1500;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
// --accent-400 (158 64% 52%) and a deep emerald, as 0–1 RGB
const BRIGHT = [0.3, 0.86, 0.64] as const;
const DEEP = [0.05, 0.3, 0.2] as const;

const VERTEX = `
attribute vec3 aPos;
// x: seed, y: size, z: a second random for brightness and speed
attribute vec3 aMeta;
uniform vec2 uCenter;
uniform float uRadius;
uniform vec2 uView;
uniform float uTime;
uniform float uScatter;
uniform float uDpr;
uniform vec3 uBright;
uniform vec3 uDeep;
varying vec3 vColor;
varying float vAlpha;
// A swirling flow with no sources or sinks (Arnold-Beltrami-Childress): a little turbulence in the blast
vec3 flow(vec3 q) {
  return vec3(sin(q.z) + cos(q.y), sin(q.x) + cos(q.z), sin(q.y) + cos(q.x));
}
mat2 turn(float a) {
  return mat2(cos(a), sin(a), -sin(a), cos(a));
}
void main() {
  float seed = aMeta.x;
  float s = uScatter;
  // The globe turns slowly about its upright axis, tipped a little toward you
  vec3 p = aPos;
  p.xz = turn(uTime * 0.12) * p.xz;
  p.yz = turn(0.35) * p.yz;
  vec3 n = p;
  // A faint idle ripple and a slow breath; just before it goes, the globe swells as if charging
  float ripple = 0.014 * sin(aPos.y * 8.0 + aPos.x * 2.0 - uTime * 1.4) + 0.01 * sin(uTime * 0.6);
  float charge = 0.1 * smoothstep(0.0, 0.12, s) * (1.0 - smoothstep(0.12, 0.3, s));
  p *= 1.0 + ripple + charge;
  // The blast: every point flies out from the centre along its own line, bent a little by the
  // flow so it doesn't read as a clean sphere growing. Most go together as an expanding shell,
  // fast at first and slowing, with a few sparks shooting far ahead; points coming toward you
  // swell as they pass. All of it runs back into the globe on the way up.
  float go = smoothstep(0.1 + seed * 0.12, 0.62 + seed * 0.12, s);
  float spark = step(0.86, aMeta.z);
  float speed = mix(1.2 + 0.6 * seed, 3.6 + 1.2 * seed, spark);
  float burst = 1.0 - (1.0 - go) * (1.0 - go) * (1.0 - go);
  float dist = burst * speed;
  vec3 dir = normalize(n + flow(n * 2.3 + seed * 9.0) * 0.25);
  dir.xy = turn(go * (seed - 0.5) * 0.8) * dir.xy;
  p += dir * dist;
  float persp = 1.0 / (1.0 - clamp(p.z, -3.0, 2.4) * 0.3);
  vec2 pos = uCenter + p.xy * uRadius * persp;
  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
  // Light from the top left, as on the old glass orb
  float light = max(0.0, dot(n, normalize(vec3(-0.45, -0.55, 0.7))));
  float facing = smoothstep(-0.5, 0.6, n.z);
  float twinkle = 0.82 + 0.18 * sin(uTime * (1.1 + seed * 1.8) + seed * 60.0);
  gl_PointSize = (1.1 + aMeta.y * 1.8 + light * 1.2) * persp * (1.0 + spark * go * 0.8) * uDpr;
  // A flash as each point lets go, cooling as it travels
  float flash = go * (1.0 - smoothstep(0.0, 1.0, dist));
  vColor = mix(uDeep, uBright, clamp(light * 1.15 + 0.12 + flash * 0.8, 0.0, 1.0));
  float onGlobe = (0.1 + 0.9 * facing) * (0.3 + 0.7 * light);
  // In flight the back of the globe shows too; the farther a point has gone, the fainter it gets,
  // so the spray stays light behind the text
  float inFlight = (0.75 + 0.7 * flash) * (1.0 - smoothstep(1.4, 3.6, dist)) / sqrt(persp);
  vAlpha = mix(onGlobe, inFlight, smoothstep(0.0, 0.25, go)) * twinkle * (0.72 + 0.28 * aMeta.z);
}`;

const FRAGMENT = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.25, 0.5, d)) * vAlpha;
  if (a < 0.02) discard;
  gl_FragColor = vec4(vColor * a, a);
}`;

/** A small seeded random (mulberry32), so the globe is the same on every visit */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

/**
 * Experiments' orb as a turning globe of points, the same family as the hero photo's particles:
 * as the section scrolls past, the globe swells for a moment and then blasts apart, every point
 * flying out from the centre and fading as it goes. It gathers again on the way back, and
 * breathes and shimmers while you stay. It sits where `anchor` is, so the anchor's own scroll
 * drift carries it. Plain WebGL, one draw call; pauses off screen and in a hidden tab. If WebGL is
 * missing, `onFailure` lets the caller keep its plain orb.
 */
export const ParticleOrb = ({
  anchor,
  scatter,
  running,
  onFailure,
}: {
  anchor: React.RefObject<HTMLDivElement | null>;
  /** 0 = the whole globe, 1 = fully streamed apart */
  scatter: MotionValue<number>;
  running: boolean;
  onFailure: () => void;
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  // Bumped when the browser takes the context away, to start again on a fresh canvas
  const [attempt, setAttempt] = useState(0);
  const runningRef = useRef(running);
  runningRef.current = running;
  const startRef = useRef<() => void>(() => {});
  const failRef = useRef(onFailure);
  failRef.current = onFailure;

  useEffect(() => {
    if (running) startRef.current();
  }, [running]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A fresh canvas each run: a context lost in teardown can't be had back on the same element,
    // so reusing it (hot reload, Strict Mode) would fall back to the still version for good
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 w-full h-full";
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl?.createProgram();
    if (!gl || !vs || !fs || !program) {
      failRef.current();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      failRef.current();
      return;
    }
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const lowEnd = isLowEndDevice();
    const count = lowEnd ? POINTS_LOW : POINTS;
    // A Fibonacci sphere, each point nudged off its spiral and a little below the surface so the
    // even spacing doesn't print moiré rings, with a seed, a size and a brightness of its own
    const random = seeded(7);
    const spacing = Math.sqrt((4 * Math.PI) / count);
    const data = new Float32Array(count * 6);
    // Stored in shuffled order, so any leading share of the buffer is an even sample of the globe
    const order = Array.from({ length: count }, (_, i) => i);
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (let i = 0; i < count; i++) {
      const y = 1 - (2 * (i + 0.5)) / count;
      const r = Math.sqrt(1 - y * y);
      const th = i * GOLDEN;
      let px = Math.cos(th) * r + (random() - 0.5) * spacing * 0.7;
      let py = y + (random() - 0.5) * spacing * 0.7;
      let pz = Math.sin(th) * r + (random() - 0.5) * spacing * 0.7;
      const depth = (1 - random() * 0.035) / Math.hypot(px, py, pz);
      px *= depth;
      py *= depth;
      pz *= depth;
      data.set([px, py, pz, random(), Math.pow(random(), 2.2), random()], order[i] * 6);
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const attr = (name: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 24, offset * 4);
    };
    attr("aPos", 3, 0);
    attr("aMeta", 3, 3);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uCenter = u("uCenter"),
      uRadius = u("uRadius"),
      uView = u("uView"),
      uTime = u("uTime"),
      uScatter = u("uScatter"),
      uDpr = u("uDpr");
    gl.uniform3f(u("uBright"), BRIGHT[0], BRIGHT[1], BRIGHT[2]);
    gl.uniform3f(u("uDeep"), DEEP[0], DEEP[1], DEEP[2]);
    const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.25 : 2);

    let raf = 0;
    let disposed = false;
    let shown = scatter.get();
    let last = 0;
    const frame = (now: number) => {
      raf = 0;
      if (disposed || !runningRef.current || document.hidden) return;
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      // Damped, so the points trail the scroll a touch
      shown += (scatter.get() - shown) * (1 - Math.exp(-5 * dt));
      const view = canvas.getBoundingClientRect();
      const box = anchor.current?.getBoundingClientRect();
      if (!box || !view.width) return;
      const w = Math.round(view.width * dpr);
      const h = Math.round(view.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uCenter, box.left - view.left + box.width / 2, box.top - view.top + box.height / 2);
      gl.uniform1f(uRadius, box.width / 2);
      gl.uniform2f(uView, view.width, view.height);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uScatter, shown);
      gl.uniform1f(uDpr, dpr);
      // The same density at any size: a small globe on a phone draws a share of the points, not all of them packed in
      const share = Math.min(1, Math.pow(box.width / 2 / FULL_RADIUS, 2));
      gl.drawArrays(gl.POINTS, 0, Math.max(MIN_POINTS, Math.round(count * share)));
    };
    const start = () => {
      if (!raf && !disposed) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    startRef.current = start;
    const onVisibility = () => {
      if (!document.hidden && runningRef.current) start();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      // Chrome drops the oldest context when a page holds too many (hot reloads pile them up);
      // start again a few times before settling for the plain orb
      if (attempt < 3) setAttempt(attempt + 1);
      else failRef.current();
    };
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    if (runningRef.current) start();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [anchor, scatter, attempt]);

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
};

export default ParticleOrb;
