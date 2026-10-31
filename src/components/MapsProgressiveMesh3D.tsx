import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, GitBranch, Cpu, Minimize2, Maximize2 } from 'lucide-react';

const LEVELS = [
  {
    level: 0,
    name: 'L⁰ — Base Domain (Dobkin-Kirkpatrick Decimated Core)',
    subdivisions: 0,
    noiseAmp: 0.14,
    bitrateBpv: 2.1,
    hausdorffErr: 0.084,
    desc: 'Coarsest mesh (P⁰, K⁰) after iterative independent-set vertex removal with priority w(λ, u) and conformal 1-ring flattening.',
  },
  {
    level: 1,
    name: 'L¹ — 1st Adaptive Loop Subdivision & Bijection Walk',
    subdivisions: 1,
    noiseAmp: 0.11,
    bitrateBpv: 4.8,
    hausdorffErr: 0.039,
    desc: '1:4 topological split with barycentric projection Π⁻¹ onto the original fine mesh and Loop tangential smoothing.',
  },
  {
    level: 2,
    name: 'L² — Intermediate Progressive Stream (.obja)',
    subdivisions: 2,
    noiseAmp: 0.09,
    bitrateBpv: 9.4,
    hausdorffErr: 0.015,
    desc: 'High-curvature features emerge first due to curvature-area priority weighting w(λ, u) = λ a(u)/a_max + (1-λ) κ(u)/κ_max.',
  },
  {
    level: 3,
    name: 'L³ — Fine Reconstructed Surface (Full .obja Stream)',
    subdivisions: 3,
    noiseAmp: 0.075,
    bitrateBpv: 16.2,
    hausdorffErr: 0.004,
    desc: 'Crack-free progressive mesh closely matching original geometry (P^L, K^L) with optimal rate-distortion tradeoff.',
  },
];

export default function MapsProgressiveMesh3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [levelIdx, setLevelIdx] = useState(2);
  const [lambda, setLambda] = useState(0.5);
  const [showWireframe, setShowWireframe] = useState(true);
  const [meshCounts, setMeshCounts] = useState({ verts: 0, faces: 0 });

  const rebuildRef = useRef<() => void>(() => {});
  const stateRef = useRef({ levelIdx, lambda, showWireframe });

  useEffect(() => {
    stateRef.current = { levelIdx, lambda, showWireframe };
    rebuildRef.current();
  }, [levelIdx, lambda, showWireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = 370;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a12);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    let theta = 0.5;
    let phi = 1.25;
    const radius = 4.2;

    const updateCamera = () => {
      camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x818cf8, 0.7);
    fillLight.position.set(-6, -4, -5);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const buildProgressiveMesh = () => {
      while (group.children.length > 0) {
        const c = group.children[0] as THREE.Mesh;
        c.geometry.dispose();
        group.remove(c);
      }

      const { levelIdx: lvl, lambda: lmb, showWireframe: wf } = stateRef.current;
      const spec = LEVELS[lvl];

      const geo = new THREE.IcosahedronGeometry(1.35, spec.subdivisions);
      const posAttr = geo.attributes.position;
      const colors: number[] = [];
      const v = new THREE.Vector3();
      const c = new THREE.Color();

      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i);
        const dir = v.clone().normalize();
        // Multi-lobe harmonic displacement simulating anatomical/curved 3D surface
        const harmonic =
          0.22 * Math.sin(3 * dir.x) * Math.cos(3 * dir.y) +
          0.16 * Math.cos(4 * dir.z) +
          spec.noiseAmp * Math.sin(6 * dir.x + 4 * dir.z);

        const r = 1.25 + harmonic;
        v.copy(dir).multiplyScalar(r);
        posAttr.setXYZ(i, v.x, v.y, v.z);

        // Compute simulated Dobkin-Kirkpatrick priority w(lambda, u)
        const normArea = 0.5 + 0.5 * Math.abs(Math.sin(2.5 * dir.y));
        const normCurv = Math.min(1, Math.abs(harmonic) * 3.2);
        const priority = lmb * normArea + (1 - lmb) * normCurv;

        // Heatmap from cyan (low w = decimated early) to amber/rose (high curvature/area)
        c.setHSL(0.56 - priority * 0.48, 0.85, 0.54);
        colors.push(c.r, c.g, c.b);
      }

      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.computeVertexNormals();

      const solidMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.35,
        metalness: 0.15,
        flatShading: lvl <= 1,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      group.add(new THREE.Mesh(geo, solidMat));

      if (wf) {
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xe2e8f0,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        group.add(new THREE.Mesh(geo, wireMat));
      }

      const uniqueVerts = Math.round(posAttr.count / ( geo.index ? 1 : 3 ));
      const faceCount = geo.index ? geo.index.count / 3 : posAttr.count / 3;
      setMeshCounts({ verts: uniqueVerts, faces: Math.round(faceCount) });
    };

    rebuildRef.current = buildProgressiveMesh;
    buildProgressiveMesh();

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const dom = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      theta += (e.clientX - prevX) * 0.008;
      phi = Math.max(0.25, Math.min(Math.PI - 0.25, phi - (e.clientY - prevY) * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
      updateCamera();
    };
    const onUp = () => {
      isDragging = false;
    };

    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isDragging) {
        theta += 0.003;
        updateCamera();
      }
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
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const cur = LEVELS[levelIdx];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 md:p-7 shadow-2xl text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full mb-2">
            <GitBranch className="w-3.5 h-3.5" /> 3A Research Project (`Projet-CSI` — MAPS SIGGRAPH ’98)
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Progressive 3D Mesh Compression (`.obj` → `.obja`) via MAPS Hierarchy
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Interactive visualization of Dobkin-Kirkpatrick hierarchy levels $L^0 \to L^3$ and the vectorized NumPy priority heatmap $w(\lambda, u)$.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l, idx) => (
            <button
              key={l.level}
              onClick={() => setLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition border ${
                levelIdx === idx
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              Level L^{l.level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-start">
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[370px] cursor-grab active:cursor-grabbing" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-md text-xs font-mono">
              <span className="text-slate-400">Active Faces |K^l|: </span>
              <span className="text-cyan-300 font-bold">{meshCounts.faces}</span>
            </div>
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-md text-xs font-mono">
              <span className="text-slate-400">Error E(t): </span>
              <span className="text-emerald-300 font-bold">{cur.hausdorffErr}</span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => setShowWireframe(!showWireframe)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
            >
              Conformal Triangulation Wireframe: {showWireframe ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="text-sm font-bold text-white">{cur.name}</div>
          <p className="text-xs text-slate-400 leading-relaxed">{cur.desc}</p>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
            w(λ, u) = λ · a(u)/a_max + (1 - λ) · κ(u)/κ_max
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Resolution Slider (L⁰ → L³)</span>
              <span className="text-cyan-300 font-bold">Level {cur.level}</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={levelIdx}
              onChange={(e) => setLevelIdx(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300">Area vs. Curvature Weight (λ)</span>
              <span className="text-amber-300 font-bold">λ = {lambda.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={lambda}
              onChange={(e) => setLambda(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-0.5">
              <span>Pure Curvature κ(u)</span>
              <span>Pure 1-Ring Area a(u)</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-emerald-300">Personal Contribution (`p1_hierarchy.py`):</strong> Implemented and vectorized `compute_priorities` in pure NumPy (removing Trimesh overhead), maximal independent set selection ($\deg(u) \le 12$), CCW 1-ring topological ordering, and geometric error $E(t)$.
          </div>
        </div>
      </div>
    </div>
  );
}
