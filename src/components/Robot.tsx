"use client";

import { JSX, useEffect, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type RobotPhase =
  | "idle"
  | "fetching"
  | "playing"
  | "listening"
  | "submitting"
  | "done";

type RobotProps = JSX.IntrinsicElements["group"] & {
  phase?: RobotPhase;
  avatarText?: string;
};

const MODE_REACTIONS: Record<RobotPhase, { blinkRate: number; swaySpeed: number; swayAmount: number }> = {
  idle: { blinkRate: 0.35, swaySpeed: 0.3, swayAmount: 0.008 },
  fetching: { blinkRate: 0.45, swaySpeed: 0.45, swayAmount: 0.01 },
  playing: { blinkRate: 0.6, swaySpeed: 0.6, swayAmount: 0.015 },
  listening: { blinkRate: 0.5, swaySpeed: 0.5, swayAmount: 0.012 },
  submitting: { blinkRate: 0.4, swaySpeed: 0.35, swayAmount: 0.009 },
  done: { blinkRate: 0.3, swaySpeed: 0.25, swayAmount: 0.007 },
};

const VISEME_SHAPES: Record<string, Record<string, number>> = {
  sil: { jawOpen: 0, mouthOpen: 0, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  aa: { jawOpen: 0.85, mouthOpen: 0.9, viseme_aa: 1, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  E: { jawOpen: 0.5, mouthOpen: 0.55, viseme_aa: 0, viseme_E: 1, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  ih: { jawOpen: 0.3, mouthOpen: 0.35, viseme_aa: 0, viseme_E: 0.3, viseme_I: 1, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  oh: { jawOpen: 0.7, mouthOpen: 0.75, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 1, viseme_U: 0.3, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  oo: { jawOpen: 0.4, mouthOpen: 0.5, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0.3, viseme_U: 1, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  PP: { jawOpen: 0.05, mouthOpen: 0.05, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 1, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  FF: { jawOpen: 0.2, mouthOpen: 0.25, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 1, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  TH: { jawOpen: 0.25, mouthOpen: 0.3, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 1, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  SS: { jawOpen: 0.15, mouthOpen: 0.2, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 1, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  DD: { jawOpen: 0.3, mouthOpen: 0.3, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 1, viseme_kk: 0, viseme_nn: 0, viseme_RR: 0 },
  kk: { jawOpen: 0.25, mouthOpen: 0.25, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 1, viseme_nn: 0, viseme_RR: 0 },
  nn: { jawOpen: 0.2, mouthOpen: 0.2, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 1, viseme_RR: 0 },
  RR: { jawOpen: 0.25, mouthOpen: 0.3, viseme_aa: 0, viseme_E: 0, viseme_I: 0, viseme_O: 0, viseme_U: 0, viseme_PP: 0, viseme_FF: 0, viseme_TH: 0, viseme_SS: 0, viseme_DD: 0, viseme_kk: 0, viseme_nn: 0, viseme_RR: 1 },
};

const CHAR_TO_VISEME: Record<string, string> = {
  a: "aa", e: "E", i: "ih", o: "oh", u: "oo",
  b: "PP", p: "PP", m: "PP",
  f: "FF", v: "FF",
  t: "DD", d: "DD", n: "nn", l: "nn",
  s: "SS", z: "SS", c: "SS",
  k: "kk", g: "kk", q: "kk", x: "kk",
  r: "RR",
  w: "oo", y: "ih",
  j: "SS", h: "E",
};

const ALL_MORPH_KEYS = Object.keys(VISEME_SHAPES.sil);

function textToVisemeTimeline(text: string, speechRate = 0.95) {
  const timeline: Array<{ time: number; viseme: string; duration: number }> = [];
  const msPerChar = 70 / speechRate;
  let time = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    if (char === " " || char === "," || char === ".") {
      const pauseDuration = char === " " ? msPerChar * 0.8 : msPerChar * 3;
      timeline.push({ time, viseme: "sil", duration: pauseDuration });
      time += pauseDuration;
    } else if (char === "!" || char === "?") {
      timeline.push({ time, viseme: "sil", duration: msPerChar * 4 });
      time += msPerChar * 4;
    } else {
      const viseme = CHAR_TO_VISEME[char] || "DD";
      const isVowel = "aeiou".includes(char);
      const duration = isVowel ? msPerChar * 1.4 : msPerChar * 0.9;
      timeline.push({ time, viseme, duration });
      time += duration;
    }
  }

  timeline.push({ time, viseme: "sil", duration: 200 });
  return { timeline, totalDuration: time + 200 };
}

function lerpVisemes(a: Record<string, number>, b: Record<string, number>, t: number) {
  const result: Record<string, number> = {};
  const ct = 0.5 - 0.5 * Math.cos(t * Math.PI);
  ALL_MORPH_KEYS.forEach((key) => {
    const va = a[key] || 0;
    const vb = b[key] || 0;
    result[key] = va + (vb - va) * ct;
  });
  return result;
}

export function Robot({ phase = "playing", avatarText = "", ...props }: RobotProps) {
  const { scene } = useGLTF("/model/interview.glb");
  const groupRef = useRef<THREE.Group>(null);
  const jawMeshesRef = useRef<THREE.Mesh[]>([]);
  const visemeRef = useRef<Record<string, number>>(VISEME_SHAPES.sil);
  const visemeRafRef = useRef<number | null>(null);
  const visemeStopRef = useRef(false);
  const timeRef = useRef(0);
  const blinkTimerRef = useRef(0);
  const currentJawRef = useRef(0);
  const initializedRef = useRef(false);

  const stopVisemeTimeline = useCallback(() => {
    visemeStopRef.current = true;
    if (visemeRafRef.current) {
      cancelAnimationFrame(visemeRafRef.current);
      visemeRafRef.current = null;
    }
    visemeRef.current = VISEME_SHAPES.sil;
  }, []);

  useEffect(() => {
    if (!avatarText?.trim()) {
      stopVisemeTimeline();
      return;
    }

    const { timeline, totalDuration } = textToVisemeTimeline(avatarText, 0.95);
    if (!timeline.length || totalDuration <= 0) return;

    visemeStopRef.current = false;
    const startTime = performance.now();

    const tick = () => {
      if (visemeStopRef.current) {
        visemeRef.current = VISEME_SHAPES.sil;
        return;
      }

      // LOOP forever (debug): wrap elapsed time by totalDuration
      const elapsedRaw = performance.now() - startTime;
      const elapsed = elapsedRaw % totalDuration;

      let currentIdx = 0;
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (elapsed >= timeline[i].time) {
          currentIdx = i;
          break;
        }
      }

      const current = timeline[currentIdx];
      const next = timeline[Math.min(currentIdx + 1, timeline.length - 1)];
      const currentShape = VISEME_SHAPES[current.viseme] || VISEME_SHAPES.sil;
      const nextShape = VISEME_SHAPES[next.viseme] || VISEME_SHAPES.sil;
      const progress =
        current.duration > 0
          ? Math.min((elapsed - current.time) / current.duration, 1)
          : 0;

      visemeRef.current = lerpVisemes(currentShape, nextShape, progress);

      // always continue (infinite loop)
      visemeRafRef.current = requestAnimationFrame(tick);
    };

    visemeRafRef.current = requestAnimationFrame(tick);
    return stopVisemeTimeline;
  }, [avatarText, stopVisemeTimeline]);

  useEffect(() => {
    if (!scene || initializedRef.current) return;
    initializedRef.current = true;

    scene.updateWorldMatrix(true, true);

    const jawMeshes: THREE.Mesh[] = [];
    const allMeshes: THREE.Mesh[] = [];

    let wMinY = Infinity, wMaxY = -Infinity;
    let wMinX = Infinity, wMaxX = -Infinity;
    let wMinZ = Infinity, wMaxZ = -Infinity;

    const wv = new THREE.Vector3();

    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      allMeshes.push(mesh);
      const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!posAttr) return;

      for (let i = 0; i < posAttr.count; i++) {
        wv.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).applyMatrix4(mesh.matrixWorld);
        if (wv.y < wMinY) wMinY = wv.y; if (wv.y > wMaxY) wMaxY = wv.y;
        if (wv.x < wMinX) wMinX = wv.x; if (wv.x > wMaxX) wMaxX = wv.x;
        if (wv.z < wMinZ) wMinZ = wv.z; if (wv.z > wMaxZ) wMaxZ = wv.z;
      }
    });

    if (!allMeshes.length) return;

    const wHeight = wMaxY - wMinY;
    const wWidth = wMaxX - wMinX;
    const wDepth = wMaxZ - wMinZ;
    const wCenterX = (wMinX + wMaxX) / 2;

    const headThreshY = wMinY + wHeight * 0.65;
    let posZCount = 0, negZCount = 0;
    let wMaxHeadZ = -Infinity, wMinHeadZ = Infinity;

    allMeshes.forEach((mesh) => {
      const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      const normAttr = mesh.geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
      if (!posAttr || !normAttr) return;
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
      const wn = new THREE.Vector3();

      for (let i = 0; i < posAttr.count; i++) {
        wv.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).applyMatrix4(mesh.matrixWorld);
        if (wv.y < headThreshY) continue;
        if (wv.z > wMaxHeadZ) wMaxHeadZ = wv.z;
        if (wv.z < wMinHeadZ) wMinHeadZ = wv.z;

        wn.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i)).applyMatrix3(normalMatrix).normalize();
        if (wn.z > 0.3) posZCount++;
        if (wn.z < -0.3) negZCount++;
      }
    });

    const faceFrontZ = posZCount >= negZCount ? 1 : -1;
    const faceWorldZ = faceFrontZ > 0 ? wMaxHeadZ : wMinHeadZ;
    const faceZThreshW = faceFrontZ > 0 ? wMaxHeadZ - wDepth * 0.3 : wMinHeadZ + wDepth * 0.3;

    let wNoseY = wMinY, wChinY = wMaxY;
    allMeshes.forEach((mesh) => {
      const posAttr = mesh.geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!posAttr) return;
      for (let i = 0; i < posAttr.count; i++) {
        wv.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).applyMatrix4(mesh.matrixWorld);
        if (wv.y < headThreshY) continue;
        const isFront = faceFrontZ > 0 ? wv.z > faceZThreshW : wv.z < faceZThreshW;
        if (!isFront) continue;
        if (wv.y > wNoseY) wNoseY = wv.y;
        if (wv.y < wChinY) wChinY = wv.y;
      }
    });

    const wFaceH = wNoseY - wChinY;
    const wLipY = wChinY + wFaceH * 0.38;
    const wLowerJawMin = wChinY - wFaceH * 0.03;
    const wLowerJawMax = wLipY;
    const wUpperLipMax = wLipY + wFaceH * 0.14;
    const wLatRange = wWidth * 0.14;

    allMeshes.forEach((mesh) => {
      const geom = mesh.geometry;
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!posAttr) return;

      const vertCount = posAttr.count;
      const lowerJawWeights = new Float32Array(vertCount);
      const upperLipWeights = new Float32Array(vertCount);
      let jawVertCount = 0;

      for (let i = 0; i < vertCount; i++) {
        wv.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)).applyMatrix4(mesh.matrixWorld);

        const wy = wv.y;
        const wz = wv.z;
        const wx = wv.x;

        if (wy < wLowerJawMin || wy > wUpperLipMax) continue;
        const isFront = faceFrontZ > 0 ? wz > faceZThreshW : wz < faceZThreshW;
        if (!isFront) continue;
        if (Math.abs(wx - wCenterX) > wLatRange) continue;

        const latT = Math.abs(wx - wCenterX) / wLatRange;
        const lateralFalloff = 1 - latT * latT * 0.95;

        let depthFalloff = 1;
        const depthRange = Math.abs(faceWorldZ - faceZThreshW);
        if (depthRange > 0.0001) {
          const dT = faceFrontZ > 0 ? (wz - faceZThreshW) / depthRange : (faceZThreshW - wz) / depthRange;
          depthFalloff = 0.5 + 0.5 * Math.max(0, Math.min(1, dT));
        }

        if (wy >= wLowerJawMin && wy <= wLowerJawMax) {
          const t = (wy - wLowerJawMin) / Math.max(0.0001, wLowerJawMax - wLowerJawMin);
          let w = 0.75 - t * 0.45;
          w *= lateralFalloff * depthFalloff;
          w = Math.max(0, Math.min(1, w));
          w = w * w * (3 - 2 * w);
          lowerJawWeights[i] = w;
          if (w > 0.01) jawVertCount++;
        }

        if (wy >= wLipY && wy <= wUpperLipMax) {
          const t = (wy - wLipY) / Math.max(0.0001, wUpperLipMax - wLipY);
          let w = 0.14 * (1 - t * t);
          w *= lateralFalloff * depthFalloff;
          w = Math.max(0, Math.min(1, w));
          w = w * w * (3 - 2 * w);
          upperLipWeights[i] = w;
          if (w > 0.01) jawVertCount++;
        }
      }

      if (jawVertCount < 3) return;

      geom.setAttribute("aLowerJaw", new THREE.BufferAttribute(lowerJawWeights, 1));
      geom.setAttribute("aUpperLip", new THREE.BufferAttribute(upperLipWeights, 1));

      const displaceDown = wFaceH * 0.09;
      const displaceUp = wFaceH * 0.015;
      const displaceForward = wFaceH * 0.025;

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const patched = mats.map((mat) => {
        const cloned = mat.clone() as THREE.Material & {
          userData: {
            jawUniforms?: {
              uJawOpen: { value: number };
              uJawAsymmetry: { value: number };
            };
          };
        };

        cloned.userData.jawUniforms = {
          uJawOpen: { value: 0 },
          uJawAsymmetry: { value: 0 },
        };

        cloned.onBeforeCompile = (shader) => {
          shader.uniforms.uJawOpen = cloned.userData.jawUniforms!.uJawOpen;
          shader.uniforms.uJawAsymmetry = cloned.userData.jawUniforms!.uJawAsymmetry;

          shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `#include <common>
attribute float aLowerJaw;
attribute float aUpperLip;
uniform float uJawOpen;
uniform float uJawAsymmetry;`
          );

          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
{
  float jaw = uJawOpen;
  float lowerDisp = aLowerJaw * jaw;
  transformed.y -= lowerDisp * ${displaceDown.toFixed(6)};
  transformed.x -= lowerDisp * ${displaceForward.toFixed(6)};
  float upperDisp = aUpperLip * jaw;
  transformed.y += upperDisp * ${displaceUp.toFixed(6)};
  transformed.x += lowerDisp * uJawAsymmetry * ${(displaceDown * 0.012).toFixed(6)};
}`
          );
        };

        cloned.needsUpdate = true;
        cloned.customProgramCacheKey = () => `jaw_v6_${cloned.uuid}`;
        return cloned;
      });

      mesh.material = patched.length === 1 ? patched[0] : patched;
      jawMeshes.push(mesh);
    });

    jawMeshesRef.current = jawMeshes;
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;
    const t = timeRef.current;
    const cfg = MODE_REACTIONS[phase] || MODE_REACTIONS.idle;

    groupRef.current.rotation.y =
      Math.sin(t * cfg.swaySpeed) * cfg.swayAmount +
      Math.sin(t * cfg.swaySpeed * 1.3) * cfg.swayAmount * 0.4;
    groupRef.current.position.y =
      Math.sin(t * cfg.swaySpeed * 0.7) * cfg.swayAmount * 0.25 - 0.5;

    const jawTarget = Math.max(0, Math.min(1, visemeRef.current.jawOpen ?? 0));
    const lerpSpeed = jawTarget > currentJawRef.current ? 0.5 : 0.18;
    currentJawRef.current += (jawTarget - currentJawRef.current) * lerpSpeed;

    let jawValue = currentJawRef.current;
    if (jawValue > 0.03) {
      jawValue += Math.sin(t * 18) * 0.006;
      jawValue += Math.sin(t * 7.3) * 0.004;
      jawValue += Math.sin(t * 3.1) * 0.003;
      jawValue = Math.max(0, jawValue);
    }

    const asymmetry = jawValue > 0.04
      ? Math.sin(t * 1.7) * 0.1 + Math.sin(t * 4.1) * 0.05
      : 0;

    jawMeshesRef.current.forEach((mesh) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const m = mat as THREE.Material & {
          userData: {
            jawUniforms?: {
              uJawOpen: { value: number };
              uJawAsymmetry: { value: number };
            };
          };
        };
        if (!m.userData.jawUniforms) return;
        m.userData.jawUniforms.uJawOpen.value = jawValue;
        m.userData.jawUniforms.uJawAsymmetry.value = asymmetry;
      });
    });

    blinkTimerRef.current += delta;
    if (blinkTimerRef.current > 1 / cfg.blinkRate) {
      blinkTimerRef.current = 0;
      scene.traverse((obj) => {
        const child = obj as THREE.Mesh;
        if (child.isMesh && child.name?.toLowerCase().includes("eye")) {
          child.scale.y = 0.05;
          window.setTimeout(() => {
            child.scale.y = 1;
          }, 120);
        }
      });
    }
  });

  useEffect(() => () => stopVisemeTimeline(), [stopVisemeTimeline]);

  return (
    <group ref={groupRef} {...props} dispose={null} scale={1.6} position={[0, 0, 0]}>
      <group rotation={[0, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("/model/interview.glb");