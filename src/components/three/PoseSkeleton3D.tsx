import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  detectSoftwareWebGL,
  disposeObjectHierarchy,
  prefersReducedMotion,
  scheduleSoftwareFrame,
} from './webglUtils';

export type PoseExerciseMode = 'squat' | 'arm-raise';

export interface JointTelemetry {
  id: string;
  label: string;
  angleDeg: number;
  confidence: string;
  vector: string;
}

interface PoseSkeleton3DProps {
  mode: PoseExerciseMode;
  selectedJointId: string;
  onSelectJoint: (telemetry: JointTelemetry) => void;
}

const JOINT_META: Record<string, { label: string; confidence: string }> = {
  head: { label: 'Cranium / Gaze', confidence: '0.99' },
  neck: { label: 'Cervical Spine', confidence: '0.98' },
  lShoulder: { label: 'Left Shoulder', confidence: '0.98' },
  rShoulder: { label: 'Right Shoulder', confidence: '0.99' },
  lElbow: { label: 'Left Elbow', confidence: '0.97' },
  rElbow: { label: 'Right Elbow', confidence: '0.96' },
  lWrist: { label: 'Left Wrist', confidence: '0.95' },
  rWrist: { label: 'Right Wrist', confidence: '0.96' },
  pelvis: { label: 'Pelvis / CoM', confidence: '0.99' },
  lHip: { label: 'Left Hip', confidence: '0.98' },
  rHip: { label: 'Right Hip', confidence: '0.98' },
  lKnee: { label: 'Left Knee', confidence: '0.96' },
  rKnee: { label: 'Right Knee', confidence: '0.96' },
  lAnkle: { label: 'Left Ankle', confidence: '0.95' },
  rAnkle: { label: 'Right Ankle', confidence: '0.95' },
};

const BONE_PAIRS: [string, string][] = [
  ['head', 'neck'],
  ['neck', 'pelvis'],
  ['neck', 'lShoulder'],
  ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'],
  ['lElbow', 'lWrist'],
  ['rShoulder', 'rElbow'],
  ['rElbow', 'rWrist'],
  ['pelvis', 'lHip'],
  ['pelvis', 'rHip'],
  ['lHip', 'lKnee'],
  ['lKnee', 'lAnkle'],
  ['rHip', 'rKnee'],
  ['rKnee', 'rAnkle'],
];

// Pre-allocated math helpers for zero GC inside render loop
const _up = new THREE.Vector3(0, 1, 0);
const _diff = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();

function computeJointAngle(
  prev: THREE.Vector3,
  curr: THREE.Vector3,
  next: THREE.Vector3
): number {
  _vA.subVectors(prev, curr).normalize();
  _vB.subVectors(next, curr).normalize();
  const dot = THREE.MathUtils.clamp(_vA.dot(_vB), -1, 1);
  return Math.round(THREE.MathUtils.radToDeg(Math.acos(dot)));
}

export function PoseSkeleton3D({
  mode,
  selectedJointId,
  onSelectJoint,
}: PoseSkeleton3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<PoseExerciseMode>(mode);
  const selectedIdRef = useRef<string>(selectedJointId);
  const callbackRef = useRef(onSelectJoint);
  const [webglFailed, setWebglFailed] = useState(false);

  modeRef.current = mode;
  selectedIdRef.current = selectedJointId;
  callbackRef.current = onSelectJoint;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion = prefersReducedMotion();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const initW = Math.max(container.clientWidth, 240);
    const initH = Math.max(container.clientHeight, 260);
    renderer.setSize(initW, initH);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11161c, 0.09);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, initW / initH, 0.1, 40);
    camera.position.set(0, 1.18, 3.6);
    camera.lookAt(0, 1.0, 0);

    // Three-point studio lighting + cool fill
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.2);
    keyLight.position.set(2.5, 4.2, 3.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 1.6);
    rimLight.position.set(-2.4, 2.2, -2.8);
    scene.add(rimLight);

    // Ground floor grid + radial contact shadow disc
    const floorGroup = new THREE.Group();
    const gridHelper = new THREE.GridHelper(3.4, 12, 0x164e63, 0x1e293b);
    gridHelper.position.y = 0;
    floorGroup.add(gridHelper);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
      grad.addColorStop(0.5, 'rgba(14, 116, 144, 0.12)');
      grad.addColorStop(1, 'rgba(11, 18, 32, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 1.9),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = 0.005;
    floorGroup.add(contactPlane);
    scene.add(floorGroup);

    // Articulated Skeleton Rig Group
    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    const jointGeo = new THREE.SphereGeometry(0.052, 20, 20);
    const headGeo = new THREE.SphereGeometry(0.115, 24, 24);
    const haloGeo = new THREE.TorusGeometry(0.145, 0.009, 12, 40);
    const boneGeo = new THREE.CylinderGeometry(0.022, 0.026, 1, 14);

    const baseJointMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0x0891b2,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.65,
    });

    const activeJointMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.8,
      roughness: 0.15,
      metalness: 0.4,
    });

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0e7490,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.85,
    });

    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.65,
    });

    const jointPositions: Record<string, THREE.Vector3> = {};
    const jointMeshes: Record<string, THREE.Mesh> = {};
    const clickableMeshes: THREE.Mesh[] = [];

    Object.keys(JOINT_META).forEach((id) => {
      jointPositions[id] = new THREE.Vector3();
      const mat = id === selectedIdRef.current ? activeJointMat : baseJointMat.clone();
      const mesh = new THREE.Mesh(id === 'head' ? headGeo : jointGeo, mat);
      mesh.userData.jointId = id;
      if (id === 'head') {
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = Math.PI / 2.3;
        mesh.add(halo);
      }
      rigGroup.add(mesh);
      jointMeshes[id] = mesh;
      clickableMeshes.push(mesh);
    });

    const boneMeshes = BONE_PAIRS.map(([a, b]) => {
      const mesh = new THREE.Mesh(boneGeo, boneMat);
      rigGroup.add(mesh);
      return { a, b, mesh };
    });

    // Cursor tracking for smooth rig tilt + joint raycasting
    const pointerTarget = { x: 0, y: 0 };
    const pointerNdc = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let lastTelemetryEmit = 0;

    const updatePoseKinematics = (elapsed: number) => {
      const cycle = reducedMotion ? 0.35 : (Math.sin(elapsed * 1.6) + 1) * 0.5;

      if (modeRef.current === 'squat') {
        const squatDepth = cycle; // 0 = standing, 1 = deep squat
        const hipY = 0.96 - squatDepth * 0.32;
        const torsoLeanZ = squatDepth * 0.16;
        const kneeForward = squatDepth * 0.24;
        const armForward = squatDepth * 0.34;

        jointPositions.lAnkle.set(-0.2, 0.06, 0.0);
        jointPositions.rAnkle.set(0.2, 0.06, 0.0);

        jointPositions.lKnee.set(-0.23, 0.52 - squatDepth * 0.08, kneeForward);
        jointPositions.rKnee.set(0.23, 0.52 - squatDepth * 0.08, kneeForward);

        jointPositions.lHip.set(-0.15, hipY, -squatDepth * 0.14);
        jointPositions.rHip.set(0.15, hipY, -squatDepth * 0.14);
        jointPositions.pelvis.set(0, hipY + 0.03, -squatDepth * 0.14);

        const shoulderY = hipY + 0.52 - squatDepth * 0.04;
        const shoulderZ = -squatDepth * 0.14 + torsoLeanZ;
        jointPositions.neck.set(0, shoulderY + 0.04, shoulderZ);
        jointPositions.head.set(0, shoulderY + 0.26, shoulderZ + 0.04);

        jointPositions.lShoulder.set(-0.24, shoulderY, shoulderZ);
        jointPositions.rShoulder.set(0.24, shoulderY, shoulderZ);

        jointPositions.lElbow.set(
          -0.29,
          shoulderY - 0.18 + squatDepth * 0.18,
          shoulderZ + armForward * 0.6
        );
        jointPositions.rElbow.set(
          0.29,
          shoulderY - 0.18 + squatDepth * 0.18,
          shoulderZ + armForward * 0.6
        );

        jointPositions.lWrist.set(
          -0.26,
          shoulderY - 0.32 + squatDepth * 0.32,
          shoulderZ + armForward * 1.18
        );
        jointPositions.rWrist.set(
          0.26,
          shoulderY - 0.32 + squatDepth * 0.32,
          shoulderZ + armForward * 1.18
        );
      } else {
        // Overhead lateral arm raise + subtle knee brace
        const lift = cycle; // 0 = arms lowered, 1 = overhead V-raise
        const armAngle = -Math.PI * 0.42 + lift * Math.PI * 0.72;

        jointPositions.lAnkle.set(-0.18, 0.06, 0);
        jointPositions.rAnkle.set(0.18, 0.06, 0);
        jointPositions.lKnee.set(-0.19, 0.52, 0.03);
        jointPositions.rKnee.set(0.19, 0.52, 0.03);
        jointPositions.lHip.set(-0.14, 0.96, 0);
        jointPositions.rHip.set(0.14, 0.96, 0);
        jointPositions.pelvis.set(0, 0.99, 0);
        jointPositions.neck.set(0, 1.51, 0);
        jointPositions.head.set(0, 1.73, 0.02);

        jointPositions.lShoulder.set(-0.24, 1.47, 0);
        jointPositions.rShoulder.set(0.24, 1.47, 0);

        const upperLen = 0.28;
        const foreLen = 0.27;
        const lx = -0.24 - Math.cos(armAngle) * upperLen;
        const ly = 1.47 + Math.sin(armAngle) * upperLen;
        const rx = 0.24 + Math.cos(armAngle) * upperLen;
        const ry = 1.47 + Math.sin(armAngle) * upperLen;

        jointPositions.lElbow.set(lx, ly, 0.08 * lift);
        jointPositions.rElbow.set(rx, ry, 0.08 * lift);

        const foreAngle = armAngle + 0.35;
        jointPositions.lWrist.set(
          lx - Math.cos(foreAngle) * foreLen * 0.72,
          ly + Math.sin(foreAngle) * foreLen + 0.06,
          0.16 * lift
        );
        jointPositions.rWrist.set(
          rx + Math.cos(foreAngle) * foreLen * 0.72,
          ry + Math.sin(foreAngle) * foreLen + 0.06,
          0.16 * lift
        );
      }

      // Apply joint positions & highlight active joint
      Object.entries(jointMeshes).forEach(([id, mesh]) => {
        mesh.position.copy(jointPositions[id]);
        const isSel = id === selectedIdRef.current;
        const targetScale = isSel ? 1.38 : 1.0;
        mesh.scale.setScalar(targetScale);
        mesh.material = isSel ? activeJointMat : baseJointMat;
      });

      // Align bone cylinders between joint vectors
      boneMeshes.forEach(({ a, b, mesh }) => {
        const posA = jointPositions[a];
        const posB = jointPositions[b];
        _diff.subVectors(posB, posA);
        const len = Math.max(_diff.length(), 0.001);
        _mid.addVectors(posA, posB).multiplyScalar(0.5);
        mesh.position.copy(_mid);
        mesh.scale.set(1, len, 1);
        _diff.normalize();
        _quat.setFromUnitVectors(_up, _diff);
        mesh.quaternion.copy(_quat);
      });
    };

    const emitJointTelemetry = (id: string) => {
      const meta = JOINT_META[id] ?? JOINT_META.lElbow;
      const p = jointPositions[id];
      let angleDeg = 172;
      if (id === 'lElbow') {
        angleDeg = computeJointAngle(
          jointPositions.lShoulder,
          jointPositions.lElbow,
          jointPositions.lWrist
        );
      } else if (id === 'rElbow') {
        angleDeg = computeJointAngle(
          jointPositions.rShoulder,
          jointPositions.rElbow,
          jointPositions.rWrist
        );
      } else if (id === 'lKnee') {
        angleDeg = computeJointAngle(
          jointPositions.lHip,
          jointPositions.lKnee,
          jointPositions.lAnkle
        );
      } else if (id === 'rKnee') {
        angleDeg = computeJointAngle(
          jointPositions.rHip,
          jointPositions.rKnee,
          jointPositions.rAnkle
        );
      } else if (id === 'lShoulder') {
        angleDeg = computeJointAngle(
          jointPositions.lHip,
          jointPositions.lShoulder,
          jointPositions.lElbow
        );
      } else if (id === 'rShoulder') {
        angleDeg = computeJointAngle(
          jointPositions.rHip,
          jointPositions.rShoulder,
          jointPositions.rElbow
        );
      } else if (id === 'lHip') {
        angleDeg = computeJointAngle(
          jointPositions.lShoulder,
          jointPositions.lHip,
          jointPositions.lKnee
        );
      } else if (id === 'rHip') {
        angleDeg = computeJointAngle(
          jointPositions.rShoulder,
          jointPositions.rHip,
          jointPositions.rKnee
        );
      }

      callbackRef.current({
        id,
        label: meta.label,
        angleDeg,
        confidence: meta.confidence,
        vector: `(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`,
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pointerTarget.x = nx;
      pointerTarget.y = ny;

      pointerNdc.set(nx, ny);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const jId = hits[0].object.userData.jointId as string | undefined;
        if (jId) {
          selectedIdRef.current = jId;
          emitJointTelemetry(jId);
        }
      }
    };

    const onPointerLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
      renderer.domElement.style.cursor = 'default';
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      setWebglFailed(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 100);
        const h = Math.max(entry.contentRect.height, 100);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;
    const timers: number[] = [];
    let disposed = false;

    const registerTimer = (id: number) => {
      timers.push(id);
    };

    updatePoseKinematics(0);
    emitJointTelemetry(selectedIdRef.current);

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      updatePoseKinematics(elapsed);

      // Smooth cursor-responsive tilt + subtle idle turntable sweep
      const idleYaw = reducedMotion ? 0.25 : Math.sin(elapsed * 0.45) * 0.22;
      const targetRotY = idleYaw + pointerTarget.x * 0.55;
      const targetRotX = -pointerTarget.y * 0.14;
      rigGroup.rotation.y = THREE.MathUtils.damp(rigGroup.rotation.y, targetRotY, 5.5, delta);
      rigGroup.rotation.x = THREE.MathUtils.damp(rigGroup.rotation.x, targetRotX, 5.5, delta);

      const now = performance.now();
      if (now - lastTelemetryEmit > 140) {
        lastTelemetryEmit = now;
        emitJointTelemetry(selectedIdRef.current);
      }

      renderer.render(scene, camera);

      if (reducedMotion) return;
      if (isSoftwareGl) {
        scheduleSoftwareFrame(renderer, tick, registerTimer);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      timers.forEach((id) => clearTimeout(id));
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      disposeObjectHierarchy(scene);
      baseJointMat.dispose();
      activeJointMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-slate-800 bg-[#161D26] p-4 text-center text-xs text-slate-400">
        3D ROCKHAI Pose Viewport (WebGL unavailable in current browser context)
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-label="Interactive 3D ROCKHAI computer vision pose skeleton. Move cursor to tilt or click a joint node to inspect."
      className="h-64 w-full overflow-hidden rounded-xl border border-slate-800/80 bg-[#161D26] sm:h-72"
    />
  );
}
