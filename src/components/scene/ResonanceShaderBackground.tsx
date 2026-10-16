"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER_SRC = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
varying vec2 vUv;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_mouse_speed;
uniform float u_scroll_velocity;

// Smooth pseudo-random hash
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// 2D Value Noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion for acoustic flow
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.02 + vec2(0.15, 0.25);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 st = (vUv - 0.5) * aspect;
  vec2 mouseSt = (u_mouse - 0.5) * aspect;

  float distToMouse = length(st - mouseSt);

  // Acoustic ripple radiating outwards from cursor position
  float rippleFreq = 28.0;
  float rippleSpeed = 4.2;
  float rippleWave = sin(distToMouse * rippleFreq - u_time * rippleSpeed);
  float rippleDecay = exp(-distToMouse * 3.6);
  float mouseRipple = rippleWave * rippleDecay * (0.35 + u_mouse_speed * 1.2);

  // Displace UVs by acoustic ripple wave
  vec2 dir = normalize(st - mouseSt + 0.0001);
  vec2 displacedSt = st - dir * mouseRipple * 0.028;

  // Scroll velocity compression (Doppler shift on vertical axis)
  float velocityAbs = abs(u_scroll_velocity);
  float scrollComp = u_scroll_velocity * 0.008;
  displacedSt.y += scrollComp;

  // Ambient resonance flow
  float t = u_time * 0.18;
  vec2 flow = vec2(
    fbm(displacedSt * 1.5 + vec2(t * 0.08, -t * 0.04)),
    fbm(displacedSt * 1.5 + vec2(-t * 0.06, t * 0.10))
  );

  float harmonic = fbm(displacedSt * 2.0 + flow * 1.6);

  // Topographic acoustic frequency wave contours (tactical sound waves)
  float waveCycle = sin((harmonic * 14.0) + (distToMouse * 6.0) - (u_time * 0.6));
  float waveContour = smoothstep(0.70, 0.98, waveCycle);

  // Palette: Industrial Charcoal base with Warm Amber highlights
  vec3 charcoalBase = vec3(0.032, 0.038, 0.046);
  vec3 amberWarm = vec3(0.96, 0.62, 0.08); // Warm Amber #f59e0b
  vec3 amberDim = vec3(0.42, 0.25, 0.03);  // Muted amber depth

  // Energy flare surging with scroll velocity
  float energySurge = clamp(velocityAbs * 0.012, 0.0, 0.40);

  // Proximity glow around cursor
  float mouseGlow = exp(-distToMouse * 3.2) * (0.12 + u_mouse_speed * 0.35);

  // Horizon resonance beam when scrolling fast
  float horizonBeam = exp(-abs(st.y) * 3.5) * energySurge * 0.35;

  // Color composition
  vec3 color = charcoalBase;

  // Wave contour lines in soft warm amber
  color += amberDim * waveContour * (0.25 + energySurge * 0.35);

  // Subtle bright amber highlights on wave crests
  float crestHighlight = smoothstep(0.92, 0.99, waveCycle);
  color += amberWarm * crestHighlight * (0.18 + energySurge * 0.25);

  // Ripple illumination
  color += amberWarm * max(0.0, mouseRipple) * 0.35;
  color += amberWarm * mouseGlow * 0.20;

  // Horizon flare during kinetic scroll
  color += amberWarm * horizonBeam;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ResonanceShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) return;

    // Compile shaders & program
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getShaderInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouseSpeed = gl.getUniformLocation(program, "u_mouse_speed");
    const uScrollVelocity = gl.getUniformLocation(program, "u_scroll_velocity");

    // Dynamic state
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currMouseX = 0.5;
    let currMouseY = 0.5;
    let targetMouseSpeed = 0;
    let currMouseSpeed = 0;

    let targetScrollVel = 0;
    let currScrollVel = 0;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastScrollTime = performance.now();

    let isVisible = true;
    let animFrameId: number;
    const startTime = performance.now();

    // Resize handler
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap at 1.5 for optimal performance
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });

    // Mouse movement listener
    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - (e.clientY / window.innerHeight); // WebGL Y invert
      const speed = Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);
      targetMouseSpeed = Math.min(speed / 25, 2.5);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Touch listener for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = touch.clientX / window.innerWidth;
        targetMouseY = 1.0 - (touch.clientY / window.innerHeight);
        targetMouseSpeed = 1.0;
      }
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Scroll velocity listener
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 16);
      const dy = window.scrollY - lastScrollY;
      targetScrollVel = dy / (dt / 16); // Normalized pixels per standard frame
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Page visibility listener (saves GPU when tab is hidden)
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Animation Render Loop
    const render = () => {
      if (isVisible) {
        const elapsed = (performance.now() - startTime) * 0.001;

        // Smoothly interpolate mouse and velocities
        currMouseX += (targetMouseX - currMouseX) * 0.08;
        currMouseY += (targetMouseY - currMouseY) * 0.08;
        currMouseSpeed += (targetMouseSpeed - currMouseSpeed) * 0.1;
        targetMouseSpeed *= 0.91; // Natural damping

        currScrollVel += (targetScrollVel - currScrollVel) * 0.12;
        targetScrollVel *= 0.88; // Natural scroll friction decay

        // Update uniforms
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform2f(uMouse, currMouseX, currMouseY);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uMouseSpeed, currMouseSpeed);
        gl.uniform1f(uScrollVelocity, currScrollVel);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      style={{ display: "block" }}
    />
  );
}
