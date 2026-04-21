import { JSX, useMemo, useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    body: THREE.Mesh;
    Screen: THREE.Mesh;
    left_arm: THREE.Mesh;
    right_arm_: THREE.Mesh;
  };
};

type RobotProps = JSX.IntrinsicElements["group"] & {
  phase?: "idle" | "fetching" | "playing" | "listening" | "submitting" | "done";
};

export function Robot({ phase = "idle", ...props }: RobotProps) {
  const { nodes } = useGLTF("/model/robot.glb") as unknown as GLTFResult;
  const screenRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const frameAcc = useRef(0);
  const targetFps = useRef(30);

  useEffect(() => {
    if (!screenRef.current) return;
    const geometry = screenRef.current.geometry;
    const pos = geometry.attributes.position;
    if (!pos) return;

    const arr = pos.array as Float32Array;
    const uvs = new Float32Array((arr.length / 3) * 2);

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    for (let i = 0; i < arr.length; i += 3) {
      if (arr[i] < minX) minX = arr[i];
      if (arr[i] > maxX) maxX = arr[i];
      if (arr[i + 1] < minY) minY = arr[i + 1];
      if (arr[i + 1] > maxY) maxY = arr[i + 1];
    }

    for (let i = 0; i < arr.length; i += 3) {
      uvs[(i / 3) * 2] = (arr[i] - minX) / (maxX - minX);
      uvs[(i / 3) * 2 + 1] = (arr[i + 1] - minY) / (maxY - minY);
    }

    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.attributes.uv.needsUpdate = true;
  }, []);

  const face = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return { canvas, ctx, texture };
  }, []);

  useEffect(() => () => face.texture.dispose(), [face.texture]);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio ?? 1;
    const hi = cores >= 8 && dpr <= 1.5;
    const active = hi ? 45 : 30;

    const apply = () => {
      targetFps.current = document.hidden ? 8 : active;
    };

    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, []);

  useFrame(({ clock }, delta) => {
    const ctx = face.ctx;
    if (!ctx) return;

    frameAcc.current += delta;
    if (frameAcc.current < 1 / targetFps.current) return;
    frameAcc.current %= 1 / targetFps.current;

    const t = clock.getElapsedTime();
    const w = face.canvas.width;
    const h = face.canvas.height;
    const isTalking = phase === "playing";
    const isListening = phase === "listening";

    const p = (t % 2.4) / 2.4;
    let blink = 1;
    if (p > 0.82 && p < 0.88) blink = 1 - (p - 0.82) / 0.06;
    else if (p >= 0.88 && p < 0.94) blink = (p - 0.88) / 0.06;

    const eyeRX = w * 0.085;
    const eyeRY = Math.max(w * 0.012, eyeRX * 1.6 * blink);

    const talkSpeed = isTalking ? 10.0 : 2.0;
    const talkScale = isTalking ? 0.06 : 0.01;
    const smileR = w * (0.21 + talkScale * Math.sin(t * talkSpeed));
    const lineW = w * (0.035 + 0.005 * Math.sin(t * talkSpeed));

    const armSpeed = isTalking ? 3.5 : 1.0;
    const armAmp = isTalking ? 0.18 : 0.06;
    const armAngle = Math.sin(t * armSpeed) * armAmp;

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = armAngle;
      leftArmRef.current.rotation.x = isListening ? 0.08 * Math.sin(t * 2) : 0;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -armAngle;
      rightArmRef.current.rotation.x = isListening ? 0.08 * Math.sin(t * 2) : 0;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";

    ctx.beginPath();
    ctx.ellipse(w * 0.36, h * 0.41, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(w * 0.64, h * 0.41, eyeRX, eyeRY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.6, smileR, 0.12, Math.PI - 0.12);
    ctx.stroke();

    face.texture.needsUpdate = true;
  });

  return (
    <group
      {...props}
      position={[0, -0.3, 0]}
      rotation={[0.5 * Math.PI, 0, 0]}
      dispose={null}
      scale={0.8}
    >
      <mesh geometry={nodes.body.geometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <mesh ref={screenRef} geometry={nodes.Screen.geometry}>
        <meshPhysicalMaterial
          color="#0a0a0a"
          emissive="#ffffff"
          emissiveMap={face.texture}
          emissiveIntensity={1.35}
          metalness={0.25}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.6}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>

      <mesh ref={leftArmRef} geometry={nodes.left_arm.geometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <mesh ref={rightArmRef} geometry={nodes.right_arm_.geometry}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/model/robot.glb");