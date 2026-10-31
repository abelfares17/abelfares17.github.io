import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, Compass, Radio, Users, Zap, GitCommit } from 'lucide-react';

type SimMode = 'random' | 'trafalgar' | 'aoki' | 'density' | 'visual';

interface ModePreset {
  title: string;
  badge: string;
  script: string;
  desc: string;
  formula: string;
  nFish: number;
  dt: number;
  zoneLimit: number;
  speed: number;
  rRepulsion: number;
  rAlignment: number;
  rAttraction: number;
  kRepulsion: number;
  kAlignment: number;
  kAttraction: number;
  visionAngle: number;
  kNeighbors: number;
}

// Exact presets from simulations/partie1..5.py in Projet_mod_geom
const MODE_PRESETS: Record<SimMode, ModePreset> = {
  random: {
    title: 'Part 1 — Stochastic Kinematics & Boundary Reflection',
    badge: 'movement.py',
    script: 'simulations/partie1_mouvement_aleatoire.py',
    desc: 'Constant-speed 3D motion with Gaussian velocity perturbation (η = 0.4) and specular boundary reflection.',
    formula: 'v_i(t+dt) = V · normalize(v_i(t) + N(0, η²)),  p_i(t+dt) = clip(p_i + v_i·dt, ±L)',
    nFish: 50,
    dt: 0.05,
    zoneLimit: 10.0,
    speed: 1.0,
    rRepulsion: 0.9,
    rAlignment: 2.5,
    rAttraction: 5.0,
    kRepulsion: 0.9,
    kAlignment: 0.35,
    kAttraction: 0.18,
    visionAngle: 60,
    kNeighbors: 6,
  },
  trafalgar: {
    title: 'Part 2 — The Trafalgar Effect (Behavioral Contagion)',
    badge: 'trafalgar.py / trafalgar_2.py',
    script: 'simulations/partie2_bis.py',
    desc: 'A red leader periodically perturbs its heading; nearby uncontaminated fish within r_c = 2.5m adopt the directional wave.',
    formula: 'if ||p_i - p_j|| < r_c : v_i ← normalize((1 - α)v_i + α·v_j) · V',
    nFish: 60,
    dt: 0.05,
    zoneLimit: 10.0,
    speed: 1.0,
    rRepulsion: 0.9,
    rAlignment: 2.5,
    rAttraction: 5.0,
    kRepulsion: 0.9,
    kAlignment: 0.35,
    kAttraction: 0.18,
    visionAngle: 60,
    kNeighbors: 6,
  },
  aoki: {
    title: 'Part 3 — Vectorized Aoki (1982) Concentric Zone Model',
    badge: 'aoki.py',
    script: 'simulations/partie3_aoki.py',
    desc: 'Fully vectorized (N, N, 3) pairwise interaction tensor with strong short-range repulsion (k_rep=0.9), alignment (k_align=0.35), and gentle cohesion (k_attr=0.18).',
    formula: 'F_i = k_r Σ(-d̂_ij) + k_a (v̄_align - v_i) + k_c Σ(+d̂_ij)',
    nFish: 70,
    dt: 0.04,
    zoneLimit: 12.0,
    speed: 1.0,
    rRepulsion: 0.2,
    rAlignment: 2.5,
    rAttraction: 5.0,
    kRepulsion: 0.9,
    kAlignment: 0.35,
    kAttraction: 0.18,
    visionAngle: 60,
    kNeighbors: 6,
  },
  density: {
    title: 'Part 4 — Topological k-Nearest Neighbors (SciPy cKDTree)',
    badge: 'density.py',
    script: 'simulations/partie4_densite.py',
    desc: 'Vectorized (N, k-1, 3) tensor forces restricted to the k=6 nearest topological neighbors queried via scipy.spatial.cKDTree in O(N log N).',
    formula: 'N_topo(i) = cKDTree.query(P, k=7)[:, 1:]   (6 topological neighbors)',
    nFish: 120,
    dt: 0.05,
    zoneLimit: 15.0,
    speed: 1.0,
    rRepulsion: 0.9,
    rAlignment: 2.6,
    rAttraction: 5.2,
    kRepulsion: 0.95,
    kAlignment: 0.38,
    kAttraction: 0.18,
    visionAngle: 60,
    kNeighbors: 6,
  },
  visual: {
    title: 'Part 5 — Visual Influence Field-of-View Cone (60° Forward Cone)',
    badge: 'visual_network.py',
    script: 'simulations/partie5_visual_network.py',
    desc: 'Narrow forward vision cone (θ = 60°, half-angle 30°, V = 2.0) evaluated via np.einsum("ijk,ik->ij", directions, vel_dir). Produces fluid curved trajectories and dynamic sub-group fission-fusion without static clumping.',
    formula: 'cos(φ_ij) = einsum("ijk,ik->ij", d̂_ij, v̂_i) ≥ cos(θ / 2)   (θ = 60°)',
    nFish: 90,
    dt: 0.05,
    zoneLimit: 15.0,
    speed: 2.0,
    rRepulsion: 0.9,
    rAlignment: 2.5,
    rAttraction: 5.0,
    kRepulsion: 0.95,
    kAlignment: 0.40,
    kAttraction: 0.16,
    visionAngle: 60,
    kNeighbors: 6,
  },
};

// Build the exact 10-triangle fish mesh with forked caudal fin from src/visualization/renderer.py
function createAuthenticFishGeometry(): THREE.BufferGeometry {
  const s = 0.6;
  const nose = [0, 0, s];
  const top = [0, s * 0.28, 0];
  const bot = [0, -s * 0.28, 0];
  const rgt = [s * 0.32, 0, 0];
  const lft = [-s * 0.32, 0, 0];
  const tail = [0, 0, -s * 0.7];
  const cf_top = [0, s * 0.45, -s * 1.4];
  const cf_mid = [0, 0, -s * 1.1];
  const cf_bot = [0, -s * 0.45, -s * 1.4];

  const tris = [
    // Front 4 faces (nose apex)
    [nose, top, rgt],
    [nose, rgt, bot],
    [nose, bot, lft],
    [nose, lft, top],
    // Rear 4 faces (tail junction apex)
    [tail, rgt, top],
    [tail, bot, rgt],
    [tail, lft, bot],
    [tail, top, lft],
    // Caudal forked fin (2 faces)
    [tail, cf_top, cf_mid],
    [tail, cf_mid, cf_bot],
  ];

  const positions: number[] = [];
  for (const tri of tris) {
    for (const pt of tri) {
      positions.push(pt[0], pt[1], pt[2]);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export default function FishSchoolSim3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<SimMode>('visual');
  const [running, setRunning] = useState(true);
  const [showTrails, setShowTrails] = useState(true);

  const initialPreset = MODE_PRESETS.visual;
  const [nFish, setNFish] = useState(initialPreset.nFish);
  const [speed, setSpeed] = useState(initialPreset.speed);
  const [rRepulsion, setRRepulsion] = useState(initialPreset.rRepulsion);
  const [rAlignment, setRAlignment] = useState(initialPreset.rAlignment);
  const [rAttraction, setRAttraction] = useState(initialPreset.rAttraction);
  const [visionAngle, setVisionAngle] = useState(initialPreset.visionAngle);
  const [kNeighbors, setKNeighbors] = useState(initialPreset.kNeighbors);

  const [polarization, setPolarization] = useState(0);
  const [contaminatedCount, setContaminatedCount] = useState(1);

  const paramsRef = useRef({
    mode,
    running,
    showTrails,
    nFish,
    speed,
    dt: initialPreset.dt,
    zoneLimit: initialPreset.zoneLimit,
    rRepulsion,
    rAlignment,
    rAttraction,
    kRepulsion: initialPreset.kRepulsion,
    kAlignment: initialPreset.kAlignment,
    kAttraction: initialPreset.kAttraction,
    visionAngle,
    kNeighbors,
  });

  useEffect(() => {
    const preset = MODE_PRESETS[mode];
    paramsRef.current = {
      mode,
      running,
      showTrails,
      nFish,
      speed,
      dt: preset.dt,
      zoneLimit: preset.zoneLimit,
      rRepulsion,
      rAlignment,
      rAttraction,
      kRepulsion: preset.kRepulsion,
      kAlignment: preset.kAlignment,
      kAttraction: preset.kAttraction,
      visionAngle,
      kNeighbors,
    };
  }, [mode, running, showTrails, nFish, speed, rRepulsion, rAlignment, rAttraction, visionAngle, kNeighbors]);

  const selectModeWithPreset = (newMode: SimMode) => {
    const p = MODE_PRESETS[newMode];
    setMode(newMode);
    setNFish(p.nFish);
    setSpeed(p.speed);
    setRRepulsion(p.rRepulsion);
    setRAlignment(p.rAlignment);
    setRAttraction(p.rAttraction);
    setVisionAngle(p.visionAngle);
    setKNeighbors(p.kNeighbors);
    setTimeout(() => resetRef.current(p.zoneLimit, p.speed), 0);
  };

  const resetRef = useRef<(zoneLim?: number, spd?: number) => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = 470;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a12);
    scene.fog = new THREE.FogExp2(0x060a12, 0.015);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 160);
    let camTheta = 0.65;
    let camPhi = 1.05;
    let camRadius = 34;

    const updateCamera = () => {
      camera.position.set(
        camRadius * Math.sin(camPhi) * Math.cos(camTheta),
        camRadius * Math.cos(camPhi),
        camRadius * Math.sin(camPhi) * Math.sin(camTheta)
      );
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Dynamic bounding box [-zone_limit, zone_limit]^3
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    const buildBounds = (L: number) => {
      while (boxGroup.children.length > 0) {
        const c = boxGroup.children[0] as THREE.LineSegments;
        c.geometry.dispose();
        boxGroup.remove(c);
      }
      const boxGeo = new THREE.BoxGeometry(L * 2, L * 2, L * 2);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const boxLines = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.75 })
      );
      boxGroup.add(boxLines);

      const gridHelper = new THREE.GridHelper(L * 2, 10, 0x1e293b, 0x0f172a);
      gridHelper.position.y = -L;
      boxGroup.add(gridHelper);
    };

    buildBounds(paramsRef.current.zoneLimit);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(20, 35, 25);
    scene.add(dirLight);

    // Authentic 10-triangle fish mesh from renderer.py
    const MAX_FISH = 140;
    const TRAIL_LEN = 14;
    const fishGeo = createAuthenticFishGeometry();
    const fishMat = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const instancedMesh = new THREE.InstancedMesh(fishGeo, fishMat, MAX_FISH);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // Curved Trajectory Ribbon Lines (shows fluid curved trajectories)
    const trailSegments = MAX_FISH * (TRAIL_LEN - 1);
    const trailPositions = new Float32Array(trailSegments * 2 * 3);
    const trailColors = new Float32Array(trailSegments * 2 * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });
    const trailLines = new THREE.LineSegments(trailGeo, trailMat);
    scene.add(trailLines);

    // State arrays
    const pos = new Float64Array(MAX_FISH * 3);
    const vel = new Float64Array(MAX_FISH * 3);
    const nextVel = new Float64Array(MAX_FISH * 3);
    const isContaminated = new Uint8Array(MAX_FISH);
    const history = new Float32Array(MAX_FISH * TRAIL_LEN * 3);
    let stepCounter = 0;

    const initAgents = (L = paramsRef.current.zoneLimit, spd = paramsRef.current.speed) => {
      stepCounter = 0;
      buildBounds(L);
      camRadius = L * 2.35;
      updateCamera();

      for (let i = 0; i < MAX_FISH; i++) {
        const px = (Math.random() * 2 - 1) * L;
        const py = (Math.random() * 2 - 1) * L;
        const pz = (Math.random() * 2 - 1) * L;
        pos[i * 3] = px;
        pos[i * 3 + 1] = py;
        pos[i * 3 + 2] = pz;

        // Gaussian unit vector like School._random_unit_vector()
        let vx = Math.random() * 2 - 1;
        let vy = Math.random() * 2 - 1;
        let vz = Math.random() * 2 - 1;
        const norm = Math.hypot(vx, vy, vz) || 1;
        vx = (vx / norm) * spd;
        vy = (vy / norm) * spd;
        vz = (vz / norm) * spd;
        vel[i * 3] = vx;
        vel[i * 3 + 1] = vy;
        vel[i * 3 + 2] = vz;

        isContaminated[i] = i === 0 ? 1 : 0;

        for (let t = 0; t < TRAIL_LEN; t++) {
          const base = (i * TRAIL_LEN + t) * 3;
          history[base] = px;
          history[base + 1] = py;
          history[base + 2] = pz;
        }
      }
      setContaminatedCount(1);
    };

    initAgents(paramsRef.current.zoneLimit, paramsRef.current.speed);
    resetRef.current = (L, spd) => initAgents(L ?? paramsRef.current.zoneLimit, spd ?? paramsRef.current.speed);

    // Orbit controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const dom = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      camTheta += (e.clientX - prevX) * 0.008;
      camPhi = Math.max(0.2, Math.min(Math.PI - 0.2, camPhi - (e.clientY - prevY) * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
      updateCamera();
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const targetVec = new THREE.Vector3();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const p = paramsRef.current;
      const N = Math.min(p.nFish, MAX_FISH);
      const L = p.zoneLimit;

      if (p.running) {
        stepCounter++;
        const dt = p.dt;
        const spd = p.speed;
        const cosHalfAngle = Math.cos(((p.visionAngle / 2) * Math.PI) / 180);

        if (p.mode === 'random') {
          for (let i = 0; i < N; i++) {
            const idx = i * 3;
            let vx = vel[idx] + (Math.random() * 2 - 1) * 0.4;
            let vy = vel[idx + 1] + (Math.random() * 2 - 1) * 0.4;
            let vz = vel[idx + 2] + (Math.random() * 2 - 1) * 0.4;
            const n = Math.hypot(vx, vy, vz) || 1;
            nextVel[idx] = (vx / n) * spd;
            nextVel[idx + 1] = (vy / n) * spd;
            nextVel[idx + 2] = (vz / n) * spd;
          }
        } else if (p.mode === 'trafalgar') {
          for (let i = 0; i < N * 3; i++) nextVel[i] = vel[i];
          if (stepCounter % 20 === 0) {
            let vx = vel[0] + (Math.random() * 2 - 1) * 0.6;
            let vy = vel[1] + (Math.random() * 2 - 1) * 0.6;
            let vz = vel[2] + (Math.random() * 2 - 1) * 0.6;
            const n = Math.hypot(vx, vy, vz) || 1;
            nextVel[0] = (vx / n) * spd;
            nextVel[1] = (vy / n) * spd;
            nextVel[2] = (vz / n) * spd;
          }
          if (stepCounter % 5 === 0) {
            let cCount = 0;
            for (let i = 0; i < N; i++) {
              if (!isContaminated[i]) {
                for (let j = 0; j < N; j++) {
                  if (isContaminated[j]) {
                    const dx = pos[j * 3] - pos[i * 3];
                    const dy = pos[j * 3 + 1] - pos[i * 3 + 1];
                    const dz = pos[j * 3 + 2] - pos[i * 3 + 2];
                    if (Math.hypot(dx, dy, dz) < 2.5) {
                      isContaminated[i] = 1;
                      const vx = vel[i * 3] + 0.5 * (vel[j * 3] - vel[i * 3]);
                      const vy = vel[i * 3 + 1] + 0.5 * (vel[j * 3 + 1] - vel[i * 3 + 1]);
                      const vz = vel[i * 3 + 2] + 0.5 * (vel[j * 3 + 2] - vel[i * 3 + 2]);
                      const n = Math.hypot(vx, vy, vz) || 1;
                      nextVel[i * 3] = (vx / n) * spd;
                      nextVel[i * 3 + 1] = (vy / n) * spd;
                      nextVel[i * 3 + 2] = (vz / n) * spd;
                      break;
                    }
                  }
                }
              }
              if (isContaminated[i]) cCount++;
            }
            if (stepCounter % 10 === 0) setContaminatedCount(cCount);
          }
        } else {
          // Exact vectorized implementation matching src/physics/{aoki,density,visual_network}.py
          for (let i = 0; i < N; i++) {
            const ix = pos[i * 3];
            const iy = pos[i * 3 + 1];
            const iz = pos[i * 3 + 2];
            const vix = vel[i * 3];
            const viy = vel[i * 3 + 1];
            const viz = vel[i * 3 + 2];
            const viNorm = Math.hypot(vix, viy, viz);

            // Collect neighbor candidates
            const neighbors: { j: number; d: number; dx: number; dy: number; dz: number }[] = [];

            for (let j = 0; j < N; j++) {
              if (i === j) continue;
              const dx = pos[j * 3] - ix;
              const dy = pos[j * 3 + 1] - iy;
              const dz = pos[j * 3 + 2] - iz;
              const d = Math.hypot(dx, dy, dz);
              if (d < 1e-12) continue;

              if (p.mode === 'visual') {
                // Exact check from visual_network.py:
                // cos_angle = einsum("ijk,ik->ij", directions, vel_dir) >= cos(radians(vision_angle_deg / 2))
                if (viNorm >= 1e-12) {
                  const cosAngle = (dx * vix + dy * viy + dz * viz) / (d * viNorm);
                  if (cosAngle < cosHalfAngle) continue;
                }
              }

              neighbors.push({ j, d, dx: dx / d, dy: dy / d, dz: dz / d });
            }

            if (p.mode === 'density') {
              // Exact cKDTree query(positions, k=min(k+1, n_fish))[:, 1:] BEFORE zone masking
              neighbors.sort((a, b) => a.d - b.d);
              if (neighbors.length > p.kNeighbors) {
                neighbors.length = p.kNeighbors;
              }
            }

            let repX = 0, repY = 0, repZ = 0;
            let alignX = 0, alignY = 0, alignZ = 0;
            let attrX = 0, attrY = 0, attrZ = 0;
            let alignCount = 0;
            let anyInAttraction = false;

            for (let m = 0; m < neighbors.length; m++) {
              const nb = neighbors[m];
              if (nb.d < p.rRepulsion) {
                repX -= nb.dx;
                repY -= nb.dy;
                repZ -= nb.dz;
                anyInAttraction = true;
              } else if (nb.d < p.rAlignment) {
                alignX += vel[nb.j * 3];
                alignY += vel[nb.j * 3 + 1];
                alignZ += vel[nb.j * 3 + 2];
                alignCount++;
                anyInAttraction = true;
              } else if (nb.d < p.rAttraction) {
                attrX += nb.dx;
                attrY += nb.dy;
                attrZ += nb.dz;
                anyInAttraction = true;
              }
            }

            if (!anyInAttraction) {
              nextVel[i * 3] = vix;
              nextVel[i * 3 + 1] = viy;
              nextVel[i * 3 + 2] = viz;
              continue;
            }

            let fx = p.kRepulsion * repX + p.kAttraction * attrX;
            let fy = p.kRepulsion * repY + p.kAttraction * attrY;
            let fz = p.kRepulsion * repZ + p.kAttraction * attrZ;

            if (alignCount > 0) {
              fx += p.kAlignment * (alignX / alignCount - vix);
              fy += p.kAlignment * (alignY / alignCount - viy);
              fz += p.kAlignment * (alignZ / alignCount - viz);
            }

            const nvx = vix + fx;
            const nvy = viy + fy;
            const nvz = viz + fz;
            const nvNorm = Math.hypot(nvx, nvy, nvz);

            if (nvNorm > 1e-12) {
              nextVel[i * 3] = (nvx / nvNorm) * spd;
              nextVel[i * 3 + 1] = (nvy / nvNorm) * spd;
              nextVel[i * 3 + 2] = (nvz / nvNorm) * spd;
            } else {
              nextVel[i * 3] = vix;
              nextVel[i * 3 + 1] = viy;
              nextVel[i * 3 + 2] = viz;
            }
          }
        }

        // Synchronous velocity + position update & boundary bounce
        let sumVx = 0, sumVy = 0, sumVz = 0;
        for (let i = 0; i < N; i++) {
          const idx = i * 3;
          vel[idx] = nextVel[idx];
          vel[idx + 1] = nextVel[idx + 1];
          vel[idx + 2] = nextVel[idx + 2];

          pos[idx] += vel[idx] * dt;
          pos[idx + 1] += vel[idx + 1] * dt;
          pos[idx + 2] += vel[idx + 2] * dt;

          for (let axis = 0; axis < 3; axis++) {
            if (pos[idx + axis] < -L) {
              pos[idx + axis] = -L;
              vel[idx + axis] *= -1;
            } else if (pos[idx + axis] > L) {
              pos[idx + axis] = L;
              vel[idx + axis] *= -1;
            }
          }

          const vn = Math.hypot(vel[idx], vel[idx + 1], vel[idx + 2]) || 1;
          sumVx += vel[idx] / vn;
          sumVy += vel[idx + 1] / vn;
          sumVz += vel[idx + 2] / vn;

          // Shift trail history every 2 steps
          if (stepCounter % 2 === 0) {
            const base = i * TRAIL_LEN * 3;
            for (let t = TRAIL_LEN - 1; t > 0; t--) {
              history[base + t * 3] = history[base + (t - 1) * 3];
              history[base + t * 3 + 1] = history[base + (t - 1) * 3 + 1];
              history[base + t * 3 + 2] = history[base + (t - 1) * 3 + 2];
            }
            history[base] = pos[idx];
            history[base + 1] = pos[idx + 1];
            history[base + 2] = pos[idx + 2];
          }
        }

        if (stepCounter % 8 === 0) {
          const pol = Math.hypot(sumVx, sumVy, sumVz) / N;
          setPolarization(Number(pol.toFixed(2)));
        }
      }

      // Update InstancedMesh & Trajectory Ribbons
      let segCursor = 0;
      for (let i = 0; i < MAX_FISH; i++) {
        if (i >= N) {
          dummy.position.set(0, -999, 0);
          dummy.scale.setScalar(0.001);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }

        const idx = i * 3;
        dummy.position.set(pos[idx], pos[idx + 1], pos[idx + 2]);
        dummy.scale.setScalar(1);
        targetVec.set(pos[idx] + vel[idx], pos[idx + 1] + vel[idx + 1], pos[idx + 2] + vel[idx + 2]);
        dummy.lookAt(targetVec);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

        if (p.mode === 'trafalgar') {
          if (i === 0) color.setHex(0xf43f5e);
          else if (isContaminated[i]) color.setHex(0x34d399);
          else color.setHex(0x64748b);
        } else {
          // Color by 3D heading so dynamic sub-schools share distinct colors
          const vn = Math.hypot(vel[idx], vel[idx + 1], vel[idx + 2]) || 1;
          const hue = (Math.atan2(vel[idx + 2] / vn, vel[idx] / vn) / (2 * Math.PI) + 1) % 1;
          color.setHSL(0.45 + 0.25 * hue, 0.85, 0.58);
        }
        instancedMesh.setColorAt(i, color);

        // Update curved trail segments
        if (p.showTrails) {
          const base = i * TRAIL_LEN * 3;
          for (let t = 0; t < TRAIL_LEN - 1; t++) {
            const p0 = base + t * 3;
            const p1 = base + (t + 1) * 3;
            const outIdx = segCursor * 6;
            trailPositions[outIdx] = history[p0];
            trailPositions[outIdx + 1] = history[p0 + 1];
            trailPositions[outIdx + 2] = history[p0 + 2];
            trailPositions[outIdx + 3] = history[p1];
            trailPositions[outIdx + 4] = history[p1 + 1];
            trailPositions[outIdx + 5] = history[p1 + 2];

            const fade = 1 - t / TRAIL_LEN;
            trailColors[outIdx] = color.r * fade;
            trailColors[outIdx + 1] = color.g * fade;
            trailColors[outIdx + 2] = color.b * fade;
            trailColors[outIdx + 3] = color.r * fade * 0.7;
            trailColors[outIdx + 4] = color.g * fade * 0.7;
            trailColors[outIdx + 5] = color.b * fade * 0.7;
            segCursor++;
          }
        }
      }

      trailLines.visible = p.showTrails;
      if (p.showTrails) {
        trailGeo.setDrawRange(0, segCursor * 2);
        trailGeo.attributes.position.needsUpdate = true;
        trailGeo.attributes.color.needsUpdate = true;
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const info = MODE_PRESETS[mode];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 md:p-7 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5" /> Live 3D Particle Simulation (`Projet_mod_geom`)
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            3D Collective Fish-School Dynamics — Vectorized NumPy Physics & Blitting Engine
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Exact WebGL port of your optimized <code className="text-emerald-300">simulations/partie1..5.py</code> presets, 10-triangle caudal-fin fish geometry, and curved trajectory ribbons.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(MODE_PRESETS) as SimMode[]).map((m) => (
            <button
              key={m}
              onClick={() => selectModeWithPreset(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer border ${
                mode === m
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-semibold'
                  : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'random' && '1. Random'}
              {m === 'trafalgar' && '2. Trafalgar'}
              {m === 'aoki' && '3. Aoki Zones'}
              {m === 'density' && '4. KD-Tree (k=6)'}
              {m === 'visual' && '5. Vision Cone (60°)'}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Formula & Explanation Banner */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-white">{info.title}</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              src/physics/{info.badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {info.script}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{info.desc}</p>
        </div>
        <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300 shrink-0">
          {info.formula}
        </div>
      </div>

      {/* Main Grid: 3D Canvas + Live Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 3D WebGL Viewport */}
        <div className="lg:col-span-8 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[470px] cursor-grab active:cursor-grabbing" />

          {/* Overlay Telemetry */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">Domain: </span>
              <span className="text-cyan-300 font-bold">[-{info.zoneLimit}, {info.zoneLimit}]³</span>
            </div>
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">Polarization Φ: </span>
              <span className="text-emerald-400 font-bold">{polarization.toFixed(2)}</span>
            </div>
            {mode === 'trafalgar' && (
              <div className="bg-slate-950/85 backdrop-blur-md border border-rose-500/40 px-3 py-1.5 rounded-lg text-xs font-mono">
                <span className="text-slate-400">Contaminated: </span>
                <span className="text-rose-400 font-bold">{contaminatedCount} / {nFish}</span>
              </div>
            )}
          </div>

          {/* Play/Pause/Trails/Reset Floating Buttons */}
          <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTrails(!showTrails)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer ${
                showTrails
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-400'
              }`}
            >
              Curved Trails: {showTrails ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setRunning(!running)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-white cursor-pointer"
            >
              {running ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              {running ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => resetRef.current()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset School
            </button>
          </div>
        </div>

        {/* Interactive Parameter Sliders */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
            <span>`SimConfig` Parameters</span>
            <span className="text-[10px] text-emerald-400">k_rep={info.kRepulsion} | k_att={info.kAttraction}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-cyan-400" /> School Size (n_fish)</span>
              <span className="text-white font-bold">{nFish} fish</span>
            </div>
            <input
              type="range"
              min={25}
              max={140}
              value={nFish}
              onChange={(e) => setNFish(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Cruise Speed (V)</span>
              <span className="text-cyan-300 font-bold">{speed.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={3.0}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Repulsion Radius (r_rep)</span>
              <span className="text-rose-400 font-bold">{rRepulsion.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.0}
              step={0.1}
              value={rRepulsion}
              onChange={(e) => setRRepulsion(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Alignment Radius (r_align)</span>
              <span className="text-amber-400 font-bold">{rAlignment.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={1.5}
              max={4.5}
              step={0.1}
              value={rAlignment}
              onChange={(e) => setRAlignment(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Attraction Radius (r_attr)</span>
              <span className="text-emerald-400 font-bold">{rAttraction.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min={3.5}
              max={8.0}
              step={0.2}
              value={rAttraction}
              onChange={(e) => setRAttraction(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {mode === 'visual' && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-300 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Forward Cone (vision_angle_deg)</span>
                <span className="text-cyan-300 font-bold">{visionAngle}° (±{visionAngle / 2}°)</span>
              </div>
              <input
                type="range"
                min={30}
                max={180}
                step={5}
                value={visionAngle}
                onChange={(e) => setVisionAngle(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {mode === 'density' && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-indigo-300 flex items-center gap-1"><Radio className="w-3.5 h-3.5" /> Topological k-NN (`cKDTree`)</span>
                <span className="text-indigo-300 font-bold">k = {kNeighbors} neighbors</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={kNeighbors}
                onChange={(e) => setKNeighbors(Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-emerald-300">Why Vision Cone (60°) flows smoothly:</strong> Because each fish only perceives neighbors within a $\pm 30^\circ$ forward cone (`speed = 2.0`, `k_rep = 0.95`, `k_align = 0.40`), trailing fish follow leading fish along sweeping curved trajectories without backward attraction locking the school into a static cluster.
          </div>
        </div>
      </div>

      {/* Bottom Panel: Physics Vectorization & Matplotlib Blitting Optimizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
            <Zap className="w-3.5 h-3.5" /> 1. Tensorized NumPy Physics (`einsum` & Broadcasting)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Replaced $O(N^2)$ Python nested loops in <code className="text-slate-200">aoki.py</code>, <code className="text-slate-200">density.py</code>, and <code className="text-slate-200">visual_network.py</code> with 3D NumPy broadcasting <code className="text-cyan-300">(N, N, 3)</code>, batched <code className="text-cyan-300">cKDTree.query(positions, k=7)</code>, and <code className="text-cyan-300">np.einsum("ijk,ik-&gt;ij", directions, vel_dir)</code> for vision-cone filtering.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
            <Zap className="w-3.5 h-3.5" /> 2. Vectorized 3D Mesh & Quiver Builders
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminated per-fish Python loops in <code className="text-slate-200">Renderer3D._make_fish_verts</code> and <code className="text-slate-200">_make_quiver_segments</code>: orthonormal local frames <code className="text-cyan-300">(fwd, right, up)</code>, 10-triangle fish bodies, and 3D rotation matrices are assembled in a single NumPy tensor pass.
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-indigo-400">
            <Zap className="w-3.5 h-3.5" /> 3. Matplotlib Background Caching & Blitting
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instead of recreating <code className="text-slate-200">Poly3DCollection</code> and <code className="text-slate-200">quiver</code> every frame, <code className="text-slate-200">renderer.py</code> mutates vertices in-place via <code className="text-indigo-300">set_verts()</code> / <code className="text-indigo-300">set_segments()</code> and uses <code className="text-indigo-300">copy_from_bbox</code> + <code className="text-indigo-300">canvas.blit()</code> with automatic mouse-rotation fallback.
          </p>
        </div>
      </div>
    </div>
  );
}
