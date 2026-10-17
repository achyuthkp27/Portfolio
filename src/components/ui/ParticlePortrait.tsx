import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { isLowEndDevice } from "@/hooks/useLowEndDevice";
import { smoothstep } from "@/lib/photoHandoff";

/**
 * The hero photo's particle twin, after the "signal" portrait on sarthak-sharma-portfolio:
 * every opaque pixel of the cutout becomes a point, drawn exactly over the photo. As the page
 * scrolls, the photo hands over to its points, which stream out into four horizontal bands
 * and take on the emerald accent. Plain WebGL (no three.js) and one draw call. It reads the
 * live photo's box every frame, so the photo's own push-in, glide and dim carry over untouched.
 * Draws nothing while the hero sits at the top of the page, pauses off screen and in a hidden tab.
 */

// The points arrive a little ahead of the photo leaving, so the two overlap as a dissolve
const pointsIn = (v: number) => smoothstep(0, 0.09, v);

// --accent-400 (158 64% 52%) as 0–1 RGB for the shader to mix toward
const TINT = [0.213, 0.827, 0.602] as const;

const VERTEX = `
attribute vec2 aUv;
attribute vec3 aColor;
attribute float aSeed;
uniform vec4 uDraw;
uniform vec4 uBox;
uniform vec2 uView;
uniform float uTime;
uniform float uScatter;
uniform float uAlpha;
uniform float uDpr;
uniform float uStep;
uniform float uFadeLeft;
uniform vec3 uTint;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float p = smoothstep(0.02, 0.8, uScatter);
  vec2 rest = uDraw.xy + aUv * uDraw.zw;
  vec2 f = (rest - uBox.xy) / uBox.zw;
  // The photo's own frame: hidden outside the box, faded along the bottom and right like its CSS mask
  float mask = step(0.0, f.x) * step(f.x, 1.0) * step(0.0, f.y) * step(f.y, 1.0)
    * clamp((1.0 - f.y) / 0.18, 0.0, 1.0) * clamp((1.0 - f.x) / 0.14, 0.0, 1.0);
  if (uFadeLeft > 0.0) mask *= smoothstep(0.0, uFadeLeft, rest.x - uBox.x);
  float unit = min(uBox.z, uBox.w);
  float band = floor(clamp(f.x, 0.0, 0.999) * 4.0) - 1.5;
  vec2 target = vec2(
    uView.x * 0.5 + (aSeed - 0.5) * uView.x * 1.3,
    uBox.y + uBox.w * 0.42 + band * unit * 0.18 + sin(aSeed * 25.1327) * unit * 0.055);
  vec2 pos = mix(rest, target, p);
  float edge = smoothstep(0.18, 0.5, abs(f.x - 0.5));
  pos.x += sin(uTime * 0.3 + aSeed * 40.0) * unit * 0.008 * (edge + p);
  pos.y += sin(aSeed * 64.0 + uTime * 0.2) * unit * 0.004 * p;
  gl_Position = vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
  float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
  gl_PointSize = max(1.0, uStep * 0.55) * (0.85 + lum * 0.9) * uDpr;
  // Near-black hair and sweater lift to a dim grey so the silhouette survives as dots
  vColor = mix(aColor + (1.0 - lum) * 0.16, uTint, p * 0.55);
  vAlpha = uAlpha * mask * (1.0 - p * 0.35);
}`;

const FRAGMENT = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.27, 0.5, d)) * vAlpha;
  if (a < 0.025) discard;
  gl_FragColor = vec4(min(vColor * 1.35, 1.0) * a, a);
}`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

/** "74% 18%" or "70% 0%" as fractions; anything else centres. */
const readObjectPosition = (img: HTMLImageElement): [number, number] => {
  const parts = getComputedStyle(img).objectPosition.split(" ");
  const frac = (s: string | undefined) => (s?.endsWith("%") ? parseFloat(s) / 100 : 0.5);
  return [frac(parts[0]), frac(parts[1])];
};

type Props = {
  src: string;
  /** The real photo: its live box (transforms included) and object-position place the points */
  photo: React.RefObject<HTMLImageElement | null>;
  /** Hero scroll progress, 0 at the top of the page */
  progress: MotionValue<number>;
  /** The photo's own scroll dim, so the points dim with it */
  dim: MotionValue<number>;
  /** False while the hero is off screen: the loop stops */
  running: boolean;
  /** Width of the phone layout's left-edge fade over the photo, in px; 0 on wide screens */
  fadeLeft: number;
  onReady: () => void;
  onFailure: () => void;
};

export const ParticlePortrait = ({ src, photo, progress, dim, running, fadeLeft, onReady, onFailure }: Props) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(running);
  const fadeLeftRef = useRef(fadeLeft);
  const startRef = useRef<() => void>(() => {});
  const callbacks = useRef({ onReady, onFailure });
  callbacks.current = { onReady, onFailure };
  fadeLeftRef.current = fadeLeft;

  useEffect(() => {
    runningRef.current = running;
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
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) {
      callbacks.current.onFailure();
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      callbacks.current.onFailure();
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      callbacks.current.onFailure();
      return;
    }
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uDraw = u("uDraw"),
      uBox = u("uBox"),
      uView = u("uView"),
      uTime = u("uTime"),
      uScatter = u("uScatter"),
      uAlpha = u("uAlpha"),
      uDpr = u("uDpr"),
      uStep = u("uStep"),
      uFadeLeft = u("uFadeLeft"),
      uTint = u("uTint");
    gl.uniform3f(uTint, TINT[0], TINT[1], TINT[2]);

    const lowEnd = isLowEndDevice();
    const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.25 : 2);
    let count = 0;
    let sampleWidth = 1;
    let natW = 1672,
      natH = 941;
    let objectPos: [number, number] = [0.5, 0.5];
    let raf = 0;
    let last = 0;
    let scatter = progress.get();
    let drawn = false;
    let disposed = false;
    let lost = false;

    const syncObjectPosition = () => {
      if (photo.current) objectPos = readObjectPosition(photo.current);
    };

    // The photo's drawn image (object-fit: cover) inside its live box, relative to the canvas
    const measure = () => {
      const img = photo.current;
      if (!img) return null;
      const box = img.getBoundingClientRect();
      const view = canvas.getBoundingClientRect();
      if (!box.width || !box.height || !view.width || !view.height) return null;
      const scale = Math.max(box.width / natW, box.height / natH);
      const dw = natW * scale,
        dh = natH * scale;
      const bx = box.left - view.left,
        by = box.top - view.top;
      return {
        view,
        box: [bx, by, box.width, box.height] as const,
        draw: [bx + (box.width - dw) * objectPos[0], by + (box.height - dh) * objectPos[1], dw, dh] as const,
      };
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || lost || !runningRef.current || document.hidden || !count) return;
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      const v = progress.get();
      // Damped, so the points trail the scroll a touch like a liquid
      scatter += (v - scatter) * (1 - Math.exp(-4 * dt));
      const alpha = pointsIn(v) * dim.get();
      if (alpha < 0.002) {
        if (drawn) gl.clear(gl.COLOR_BUFFER_BIT);
        drawn = false;
        return;
      }
      const m = measure();
      if (!m) return;
      const w = Math.round(m.view.width * dpr),
        h = Math.round(m.view.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(uDraw, m.draw[0], m.draw[1], m.draw[2], m.draw[3]);
      gl.uniform4f(uBox, m.box[0], m.box[1], m.box[2], m.box[3]);
      gl.uniform2f(uView, m.view.width, m.view.height);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uScatter, scatter);
      gl.uniform1f(uAlpha, alpha);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uStep, m.draw[2] / sampleWidth);
      gl.uniform1f(uFadeLeft, fadeLeftRef.current);
      gl.drawArrays(gl.POINTS, 0, count);
      drawn = true;
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
      lost = true;
      callbacks.current.onFailure();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", syncObjectPosition);
    canvas.addEventListener("webglcontextlost", onLost);

    // Sample the cutout: one point per opaque pixel, about two and a half CSS pixels apart on screen
    const source = new Image();
    source.decoding = "async";
    source.onload = () => {
      if (disposed) return;
      try {
        natW = source.naturalWidth || natW;
        natH = source.naturalHeight || natH;
        syncObjectPosition();
        const drawnWidth = measure()?.draw[2] ?? 1200;
        sampleWidth = Math.round(Math.min(lowEnd ? 420 : 680, Math.max(220, drawnWidth / 2.4)));
        const sampleHeight = Math.round((sampleWidth * natH) / natW);
        const scratch = document.createElement("canvas");
        scratch.width = sampleWidth;
        scratch.height = sampleHeight;
        const ctx = scratch.getContext("2d", { willReadFrequently: true });
        if (!ctx) return callbacks.current.onFailure();
        ctx.drawImage(source, 0, 0, sampleWidth, sampleHeight);
        const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        // u, v, r, g, b, seed per point
        const points = new Float32Array(sampleWidth * sampleHeight * 6);
        let n = 0;
        for (let y = 0; y < sampleHeight; y++) {
          for (let x = 0; x < sampleWidth; x++) {
            const i = (y * sampleWidth + x) * 4;
            if (data[i + 3] < 128) continue;
            const o = n * 6;
            points[o] = (x + 0.5) / sampleWidth;
            points[o + 1] = (y + 0.5) / sampleHeight;
            points[o + 2] = data[i] / 255;
            points[o + 3] = data[i + 1] / 255;
            points[o + 4] = data[i + 2] / 255;
            points[o + 5] = ((127 * x + 311 * y) % 997) / 997;
            n++;
          }
        }
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, points.subarray(0, n * 6), gl.STATIC_DRAW);
        const stride = 6 * 4;
        const attr = (name: string, size: number, offset: number) => {
          const loc = gl.getAttribLocation(program, name);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset * 4);
        };
        attr("aUv", 2, 0);
        attr("aColor", 3, 2);
        attr("aSeed", 1, 5);
        count = n;
        scatter = progress.get();
        callbacks.current.onReady();
        if (runningRef.current) start();
      } catch {
        callbacks.current.onFailure();
      }
    };
    source.onerror = () => callbacks.current.onFailure();
    source.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      source.onload = null;
      source.onerror = null;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", syncObjectPosition);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, [src, photo, progress, dim]);

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 pointer-events-none" />;
};

export default ParticlePortrait;
