import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Gauge, Sun, Film, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

type MeshMode = 'naive' | 'culled' | 'greedy';

const CHUNK_X = 8;
const CHUNK_Y = 6;
const CHUNK_Z = 8;

function generateVoxelGrid(): Uint8Array {
  const grid = new Uint8Array(CHUNK_X * CHUNK_Y * CHUNK_Z);
  for (let x = 0; x < CHUNK_X; x++) {
    for (let z = 0; z < CHUNK_Z; z++) {
      const h =
        x >= 2 && x <= 6 && z >= 2 && z <= 6
          ? 4
          : x >= 1 && x <= 7 && z >= 1 && z <= 7
          ? 3
          : 2;
      for (let y = 0; y < h; y++) {
        grid[x + CHUNK_X * (y + CHUNK_Y * z)] = y === h - 1 ? 2 : 1;
      }
    }
  }
  return grid;
}

const VOXELS = generateVoxelGrid();
const getVoxel = (x: number, y: number, z: number): number => {
  if (x < 0 || x >= CHUNK_X || y < 0 || y >= CHUNK_Y || z < 0 || z >= CHUNK_Z) return 0;
  return VOXELS[x + CHUNK_X * (y + CHUNK_Y * z)];
};

interface QuadRect {
  axis: 'x' | 'y' | 'z';
  dir: 1 | -1;
  slice: number;
  u: number;
  v: number;
  w: number;
  h: number;
  type: number;
}

function buildQuads(mode: MeshMode): QuadRect[] {
  const quads: QuadRect[] = [];

  const axes: { axis: 'x' | 'y' | 'z'; uMax: number; vMax: number; sMax: number }[] = [
    { axis: 'y', uMax: CHUNK_X, vMax: CHUNK_Z, sMax: CHUNK_Y },
    { axis: 'x', uMax: CHUNK_Z, vMax: CHUNK_Y, sMax: CHUNK_X },
    { axis: 'z', uMax: CHUNK_X, vMax: CHUNK_Y, sMax: CHUNK_Z },
  ];

  const sample = (axis: 'x' | 'y' | 'z', s: number, u: number, v: number) => {
    if (axis === 'y') return getVoxel(u, s, v);
    if (axis === 'x') return getVoxel(s, v, u);
    return getVoxel(u, v, s);
  };

  for (const { axis, uMax, vMax, sMax } of axes) {
    for (const dir of [1, -1] as const) {
      for (let s = 0; s < sMax; s++) {
        const mask = new Int32Array(uMax * vMax);
        for (let v = 0; v < vMax; v++) {
          for (let u = 0; u < uMax; u++) {
            const cur = sample(axis, s, u, v);
            if (!cur) continue;
            const neighbor = sample(axis, s + dir, u, v);
            if (mode === 'naive' || neighbor === 0) {
              mask[u + v * uMax] = cur;
            }
          }
        }

        if (mode !== 'greedy') {
          for (let v = 0; v < vMax; v++) {
            for (let u = 0; u < uMax; u++) {
              const t = mask[u + v * uMax];
              if (t !== 0) {
                quads.push({
                  axis,
                  dir,
                  slice: dir === 1 ? s + 1 : s,
                  u,
                  v,
                  w: 1,
                  h: 1,
                  type: t,
                });
              }
            }
          }
        } else {
          for (let v = 0; v < vMax; v++) {
            for (let u = 0; u < uMax; ) {
              const t = mask[u + v * uMax];
              if (t === 0) {
                u++;
                continue;
              }
              let w = 1;
              while (u + w < uMax && mask[u + w + v * uMax] === t) w++;

              let h = 1;
              let done = false;
              while (v + h < vMax) {
                for (let k = 0; k < w; k++) {
                  if (mask[u + k + (v + h) * uMax] !== t) {
                    done = true;
                    break;
                  }
                }
                if (done) break;
                h++;
              }

              quads.push({
                axis,
                dir,
                slice: dir === 1 ? s + 1 : s,
                u,
                v,
                w,
                h,
                type: t,
              });

              for (let dv = 0; dv < h; dv++) {
                for (let du = 0; du < w; du++) {
                  mask[u + du + (v + dv) * uMax] = 0;
                }
              }
              u += w;
            }
          }
        }
      }
    }
  }
  return quads;
}

interface VideoClipSpec {
  id: string;
  badge: string;
  title: string;
  src: string;
  poster: string;
  caption: string;
  shaderTech: string;
  javaFlags: string;
}

const VIDEO_SHOWCASES: VideoClipSpec[] = [
  {
    id: 'sunset_night',
    badge: 'Clip 01 • Celestial Skybox & Extended Horizon',
    title: 'Sunset to Starry Night Transition over 1.2km LOD Horizon (23.5° Orbit)',
    src: '/assets/voxel/videos/sunset_to_night.mp4',
    poster: '/assets/voxel/voxel_sunset.jpg',
    caption:
      'Mountain summit vantage point (Y=194+) overlooking a 1,280m procedural LOD mountain relief. Continuous transition from golden-hour sunlight to directional twilight scattering with dynamic horizon dip, circular chunk culling with 8×8 Bayer screen-door dissolve, smoothstep shadow deactivation (2°–8° solar elevation), and 512 deterministic stars with lunar shadow handoff.',
    shaderTech:
      'SkyRenderer (Ray Reconstruction + Dynamic Horizon Dip) • DistantTerrainRenderer (1.2km Unified LOD Mesh + Valley AO) • 8×8 Bayer Dither Crossfade • CelestialState.at(worldDays)',
    javaFlags: '-Dvoxel.startHour=6.0 -Dvoxel.timeScale=20 -Dvoxel.skyMode=procedural',
  },
    {
    id: 'cinematic_optics',
    badge: 'Clip 02 • High-Fidelity Lighting & Optics',
    title: 'Atmospheric Sunrise, Dappled Shadows & Dielectric Materials',
    src: '/assets/voxel/videos/cinematic_lighting_optics.mp4',
    poster: '/assets/voxel/voxel_sunrise_optics.jpg',
    caption:
      'Sunrise timelapse showcasing atmospheric lighting and multi-pass materials: massive mountain shadows receding across the terrain with distance fade (160–256m), wind-animated dappled canopy shadows with foliage SSS, dual-wave water with celestial specular glints and Beer-Lambert underwater absorption, and sorted dielectric Fresnel glass reflections.',
    shaderTech:
      '4-Cascade CSM (16-Tap PCF) • Alpha-Cutout Foliage Shadow Pass & SSS • Dual-Wave Water Optics & Beer-Lambert Fog • Dielectric Fresnel Glass (n=1.50)',
    javaFlags:
      './gradlew run -Dvoxel.cinematic=true -Dvoxel.spectator=true -Dvoxel.startHour=6.4 -Dvoxel.timeScale=25.0 -Dvoxel.shadowFade=true',
  },
  {
    id: 'debug_stages',
    badge: 'Clip 03 • Graphics Pipeline Diagnostics',
    title: 'Real-Time Engine Diagnostics (CSM Splits / Greedy Shadow Mesh / Bias)',
    src: '/assets/voxel/videos/pipeline_debug_modes.mp4',
    poster: '/assets/voxel/voxel_debug.jpg',
    caption:
      'Live inspection across internal OpenGL diagnostic stages: 4-cascade CSM frustum splits, raw shadow attenuation masks, slope-scaled depth bias (acne vs. peter-panning), and greedy shadow mesh topology with T-junction crack mitigation.',
    shaderTech:
      'Multi-Stage GLSL Diagnostics + Ear-Clipped Greedy Shadow Meshing + Light-Space Stabilization',
    javaFlags:
      'Interactive F-Keys: F4 (CSM Splits / Texel Grid) • F7/Shift+F7 (Visual vs Shadow Wireframe) • F9 (Bias Modes)',
  },
];

export default function VoxelMeshingLab() {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<MeshMode>('greedy');
  const [wireframe, setWireframe] = useState(true);
  const [indexedVBO, setIndexedVBO] = useState(true);
  const [activeClipIdx, setActiveClipIdx] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stats, setStats] = useState({ quads: 0, tris: 0, verts: 0 });

  const stateRef = useRef({ mode, wireframe });
  const rebuildRef = useRef<() => void>(() => {});

  const activeClip = VIDEO_SHOWCASES[activeClipIdx];

  useEffect(() => {
    stateRef.current = { mode, wireframe };
    rebuildRef.current();
  }, [mode, wireframe, indexedVBO]);

  useEffect(() => {
    setVideoReady(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeClipIdx]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 560;
    const height = 390;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    let theta = 0.78;
    let phi = 0.98;
    const radius = 14.5;

    const updateCamera = () => {
      camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 1.5, 0);
    };
    updateCamera();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(10, 18, 12);
    scene.add(dirLight);

    const chunkGroup = new THREE.Group();
    chunkGroup.position.set(-CHUNK_X / 2, 0, -CHUNK_Z / 2);
    scene.add(chunkGroup);

    const buildChunkMesh = () => {
      while (chunkGroup.children.length > 0) {
        const child = chunkGroup.children[0] as THREE.Mesh;
        child.geometry.dispose();
        chunkGroup.remove(child);
      }

      const quads = buildQuads(stateRef.current.mode);
      const positions: number[] = [];
      const colors: number[] = [];
      const indices: number[] = [];

      const cTop = new THREE.Color(0x10b981);
      const cSide = new THREE.Color(0x0284c7);
      const cDirt = new THREE.Color(0x6366f1);

      quads.forEach((q, idx) => {
        const { axis, dir, slice, u, v, w, h, type } = q;
        let p0: [number, number, number];
        let p1: [number, number, number];
        let p2: [number, number, number];
        let p3: [number, number, number];

        if (axis === 'y') {
          p0 = [u, slice, v];
          p1 = [u + w, slice, v];
          p2 = [u + w, slice, v + h];
          p3 = [u, slice, v + h];
        } else if (axis === 'x') {
          p0 = [slice, v, u];
          p1 = [slice, v + h, u];
          p2 = [slice, v + h, u + w];
          p3 = [slice, v, u + w];
        } else {
          p0 = [u, v, slice];
          p1 = [u + w, v, slice];
          p2 = [u + w, v + h, slice];
          p3 = [u, v + h, slice];
        }

        const baseVertex = idx * 4;
        positions.push(...p0, ...p1, ...p2, ...p3);

        const col = axis === 'y' && dir === 1 ? cTop : type === 2 ? cSide : cDirt;
        for (let k = 0; k < 4; k++) {
          colors.push(col.r, col.g, col.b);
        }

        if (dir === 1) {
          indices.push(baseVertex, baseVertex + 2, baseVertex + 1);
          indices.push(baseVertex, baseVertex + 3, baseVertex + 2);
        } else {
          indices.push(baseVertex, baseVertex + 1, baseVertex + 2);
          indices.push(baseVertex, baseVertex + 2, baseVertex + 3);
        }
      });

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const solidMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.55,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      const solidMesh = new THREE.Mesh(geo, solidMat);
      chunkGroup.add(solidMesh);

      if (stateRef.current.wireframe) {
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xe2e8f0,
          wireframe: true,
          transparent: true,
          opacity: 0.75,
        });
        const wireMesh = new THREE.Mesh(geo, wireMat);
        chunkGroup.add(wireMesh);
      }

      const quadCount = quads.length;
      const triCount = quadCount * 2;
      const vertCount = indexedVBO ? quadCount * 4 : quadCount * 6;
      setStats({ quads: quadCount, tris: triCount, verts: vertCount });
    };

    rebuildRef.current = buildChunkMesh;
    buildChunkMesh();

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
      phi = Math.max(0.25, Math.min(Math.PI / 2, phi - (e.clientY - prevY) * 0.008));
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
        theta += 0.0025;
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
  }, [indexedVBO]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 md:p-7 shadow-2xl text-slate-100 space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full mb-2">
            <Box className="w-3.5 h-3.5" /> 100% Personal Engine (`Voxel_Project` — Java 17 / OpenGL / GLSL)
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Interactive Greedy Meshing, Quad Indexing & Celestial CSM Video Showcase
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Toggle between Naive Voxel Rendering, Hidden-Face Culling, and 2D Slice Greedy Meshing, or inspect the OpenGL 3.2 video showcase below.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['naive', 'culled', 'greedy'] as MeshMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase transition cursor-pointer border ${
                mode === m
                  ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200 font-bold shadow-lg shadow-indigo-950/50'
                  : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m === 'naive' && '1. Naive (All Faces)'}
              {m === 'culled' && '2. Face Culling'}
              {m === 'greedy' && '3. Greedy Meshing'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Row: Interactive 3D Meshing Sandbox + Measured Engine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <div ref={mountRef} className="w-full h-[390px] cursor-grab active:cursor-grabbing" />

          {/* Live Polygon Counter Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">Triangles: </span>
              <span className="text-indigo-300 font-bold">{stats.tris}</span>
            </div>
            <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-slate-400">VBO Vertices: </span>
              <span className="text-cyan-300 font-bold">{stats.verts}</span>
            </div>
          </div>

          {/* Wireframe & EBO Toggle Controls */}
          <div className="absolute bottom-3 right-3 flex flex-wrap gap-2">
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer ${
                wireframe
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-400'
              }`}
            >
              Wireframe: {wireframe ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setIndexedVBO(!indexedVBO)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer ${
                indexedVBO
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-400'
              }`}
            >
              Indexed EBO (4v/quad vs 6v): {indexedVBO ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Measured Apple M2 Pro Benchmarks from Engine Reports */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2.5">
            <Gauge className="w-4 h-4" /> Verified Apple M2 Pro Engine Benchmarks
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Reproducible 20-second dynamic camera + moving sun benchmarks at Retina <code className="text-slate-200">2268×1382</code> with 3×2048² Cascaded Shadow Maps (`World 10`):
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Unindexed Quads (6 verts/quad)</span>
                <span className="text-amber-400 font-bold">43.05 FPS (23.2 ms)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-emerald-900/60">
              <div className="flex justify-between text-slate-200 mb-1">
                <span>Indexed EBO + Compact Vertex Layout</span>
                <span className="text-emerald-400 font-bold">61.53 FPS (16.2 ms)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">Shadow Caster Culling</div>
              <div className="text-base font-bold text-cyan-300">-26% Vertices</div>
              <div className="text-[10px] text-slate-400">Light-volume frustum test</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">Frame Time Gain</div>
              <div className="text-base font-bold text-emerald-300">+42.9% FPS</div>
              <div className="text-[10px] text-slate-400">P95: 28 ms → 20 ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Video Showcase Infrastructure (Sunset -> Night Skybox & CSM) */}
      <div className="pt-5 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Film className="w-4 h-4" /> Real-Time OpenGL 3.2 Video Showcase (Sunset, Night Skybox & CSM)
          </div>
          <div className="flex flex-wrap gap-2">
            {VIDEO_SHOWCASES.map((clip, idx) => (
              <button
                key={clip.id}
                onClick={() => setActiveClipIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition border ${
                  activeClipIdx === idx
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {clip.badge}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          {/* Video Player Viewport with Fallback Poster */}
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-900 group">
            <video
              ref={videoRef}
              key={activeClip.src}
              src={activeClip.src}
              poster={activeClip.poster}
              autoPlay
              loop
              muted
              playsInline
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
              className="w-full h-full object-cover"
            />

            {/* Status / Drop-in Path Overlay when video file is not yet placed */}
            {!videoReady && (
              <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center mb-3">
                  <Sun className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{activeClip.title}</div>
                <p className="text-xs text-slate-300 max-w-md mb-3">
                  Video slot ready! Drop your recorded MP4/WebM file at the path below and it will automatically play in 60 FPS loop:
                </p>
                <code className="px-3 py-1.5 rounded-lg bg-slate-900/95 border border-amber-500/50 text-amber-300 text-xs font-mono">
                  public{activeClip.src}
                </code>
              </div>
            )}

            {/* Playback Controls when video is loaded */}
            {videoReady && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-700 text-xs font-mono text-white cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={restartVideo}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            )}
          </div>

          {/* Technical Breakdown of the Selected Video Clip */}
          <div className="lg:col-span-4 space-y-3.5 p-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" /> {activeClip.badge}
            </div>
            <h4 className="text-lg font-bold text-white leading-snug">{activeClip.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{activeClip.caption}</p>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-cyan-400">OpenGL / Shader Pipeline</div>
              <div className="text-xs font-mono text-slate-200">{activeClip.shaderTech}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-emerald-400">Recommended Recording Flags</div>
              <code className="block text-[11px] font-mono text-emerald-300 break-all">
                {activeClip.javaFlags}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
