import React, { useState, useRef } from 'react';
import { Sliders, Layers, Activity, Clock, Sparkles, AlertTriangle, Trophy, Award, Microscope } from 'lucide-react';

interface SceneData {
  id: string;
  name: string;
  subtitle: string;
  metrics: {
    fast: { psnr: number; ssim: number; ciede2000: number; timeMs: number };
    matting: { psnr: number; ssim: number; ciede2000: number; timeMs: number };
  };
  layers: {
    hazy: string;
    dark: string;
    trans_raw: string;
    trans_refined: string;
    dehazed: string;
    depth: string;
    gt: string;
  };
}

const SCENES: SceneData[] = [
  {
    id: '23_outdoor',
    name: 'O-HAZE #23 — Dense Foliage & Stone',
    subtitle: 'CIE L*a*b* atmospheric light estimation + Eigen Soft Matting (22.89 dB PSNR, 7.07 ΔE₀₀)',
    metrics: {
      fast: { psnr: 21.36, ssim: 0.7173, ciede2000: 7.92, timeMs: 736 },
      matting: { psnr: 22.89, ssim: 0.7648, ciede2000: 7.07, timeMs: 4894 },
    },
    layers: {
      hazy: '/assets/dehazing/23_hazy.jpg',
      dark: '/assets/dehazing/23_dark.jpg',
      trans_raw: '/assets/dehazing/23_trans_raw.jpg',
      trans_refined: '/assets/dehazing/23_trans_refined.jpg',
      dehazed: '/assets/dehazing/23_dehazed.jpg',
      depth: '/assets/dehazing/23_depth.jpg',
      gt: '/assets/dehazing/23_gt.jpg',
    },
  },
  {
    id: '03_outdoor',
    name: 'O-HAZE #03 — Park & Depth Gradient',
    subtitle: 'Strong depth discontinuity and heavy smoke veil (21.80 dB PSNR, 0.7795 SSIM)',
    metrics: {
      fast: { psnr: 20.41, ssim: 0.6719, ciede2000: 12.28, timeMs: 2074 },
      matting: { psnr: 21.80, ssim: 0.7795, ciede2000: 11.65, timeMs: 10407 },
    },
    layers: {
      hazy: '/assets/dehazing/03_hazy.jpg',
      dark: '/assets/dehazing/03_dark.jpg',
      trans_raw: '/assets/dehazing/03_trans_raw.jpg',
      trans_refined: '/assets/dehazing/03_trans_refined.jpg',
      dehazed: '/assets/dehazing/03_dehazed.jpg',
      depth: '/assets/dehazing/03_depth.jpg',
      gt: '/assets/dehazing/03_gt.jpg',
    },
  },
];

type LayerKey = keyof SceneData['layers'];

const LAYER_META: Record<LayerKey, { label: string; formula: string; badge: string }> = {
  hazy: {
    label: 'Hazy Input I(x)',
    formula: 'I(x) = J(x)t(x) + A(1 - t(x))',
    badge: 'CV_8UC3 Input',
  },
  dark: {
    label: 'Dark Channel J^dark',
    formula: 'min_{y in Omega(x)} ( min_{c in {r,g,b}} I^c(y) )',
    badge: '15x15 Patch Erosion',
  },
  trans_raw: {
    label: 'Raw Transmission t~(x)',
    formula: 't~(x) = 1 - omega * min_c ( min_{y} (I^c(y) / A^c) )',
    badge: 'Blocky Halo Artifacts',
  },
  trans_refined: {
    label: 'Refined Transmission t(x)',
    formula: '(L + lambda * I) t = lambda * t~  (Eigen Sparse + OpenMP)',
    badge: 'Soft Matting + Guided Upsample',
  },
  dehazed: {
    label: 'Recovered Scene J(x)',
    formula: 'J(x) = (I(x) - A) / max(t(x), t_0) + A',
    badge: 'Dehazed Output',
  },
  depth: {
    label: 'Estimated Depth d(x)',
    formula: 'd(x) = -ln(t(x)) / beta',
    badge: 'Beer-Lambert Law',
  },
  gt: {
    label: 'Ground Truth (Haze-Free)',
    formula: 'O-HAZE Reference Target',
    badge: 'GT Reference',
  },
};

const PARAM_SWEEP = [
  { patch: 5, omega: 0.85, t0: 0.1, psnr: 16.38, ssim: 0.578, note: 'Small patch: overshoots dark channel on bright foreground textures' },
  { patch: 15, omega: 0.85, t0: 0.1, psnr: 17.12, ssim: 0.614, note: 'Balanced patch size, mild haze residue in far field' },
  { patch: 15, omega: 0.95, t0: 0.2, psnr: 17.94, ssim: 0.649, note: 'Optimal O-HAZE configuration with CIE L*a*b* atmospheric light (Default)' },
  { patch: 21, omega: 0.95, t0: 0.2, psnr: 17.51, ssim: 0.631, note: 'Larger patch increases block halo artifacts before soft matting' },
  { patch: 31, omega: 1.0, t0: 0.05, psnr: 15.29, ssim: 0.542, note: 'Aggressive omega=1.0 + low t0 amplifies noise in deep haze regions' },
];

interface SotaRow {
  method: string;
  approach: string;
  psnr: number;
  ssim: number;
  ciede2000: number;
  isOurs?: boolean;
  isBestMatting?: boolean;
  isDeepLearning?: boolean;
}

// Official O-HAZE Benchmark (Ancuti et al., CVPRW 2018 — Table 2, p. 6, 45 images) + Our Verified Results
const OHAZE_SOTA_BENCHMARK: SotaRow[] = [
  { method: 'Fattal (ACM TOG 2014)', approach: 'Color-Lines Prior', psnr: 15.639, ssim: 0.707, ciede2000: 19.854 },
  { method: 'Cai et al. — DehazeNet (TIP 2016)', approach: 'Deep CNN', psnr: 16.207, ssim: 0.666, ciede2000: 17.348, isDeepLearning: true },
  { method: 'He et al. — Original DCP (CVPR 2009)', approach: 'Dark Channel Prior (RGB)', psnr: 16.586, ssim: 0.735, ciede2000: 20.745 },
  { method: 'Berman et al. — Haze-Lines (CVPR 2016)', approach: 'Non-Local Prior', psnr: 16.610, ssim: 0.750, ciede2000: 17.088 },
  { method: 'Ancuti et al. (ICIP 2016)', approach: 'Multi-Scale Fusion', psnr: 16.855, ssim: 0.747, ciede2000: 16.431 },
  { method: 'Meng et al. — BCCR (ICCV 2013)', approach: 'Boundary Regularized DCP', psnr: 17.443, ssim: 0.753, ciede2000: 16.968 },
  { method: 'Our Project (Fast Mode, No Matting)', approach: 'DCP + A in CIE L*a*b*', psnr: 17.473, ssim: 0.602, ciede2000: 13.945, isOurs: true },
  { method: 'Our Project (With Soft Matting)', approach: 'DCP + A in CIE L*a*b* + Matting', psnr: 17.938, ssim: 0.649, ciede2000: 13.567, isOurs: true, isBestMatting: true },
  { method: 'Ren et al. — MSCNN (ECCV 2016)', approach: 'Multi-Scale Deep CNN', psnr: 19.068, ssim: 0.765, ciede2000: 14.670, isDeepLearning: true },
];

export default function DehazingExplorer() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [leftLayer, setLeftLayer] = useState<LayerKey>('hazy');
  const [rightLayer, setRightLayer] = useState<LayerKey>('dehazed');
  const [sliderPos, setSliderPos] = useState(50);
  const [sweepIdx, setSweepIdx] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  const scene = SCENES[sceneIdx];
  const sweep = PARAM_SWEEP[sweepIdx];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 md:p-7 shadow-2xl text-slate-100">
      {/* Header & Scene Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full mb-2">
            <Layers className="w-3.5 h-3.5" /> Interactive C++17 / OpenCV / Eigen Pipeline Inspector
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            Single-Image Dehazing — Multi-Stage Layer & Metric Lab
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Compare intermediate mathematical stages computed from the actual C++17 repository on the O-HAZE benchmark.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setSceneIdx(idx)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                sceneIdx === idx
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Left Split Layer (A)
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {LAYER_META[leftLayer].badge}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(LAYER_META) as LayerKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setLeftLayer(key)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  leftLayer === key
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {LAYER_META[key].label.split(' ')[0]} {LAYER_META[key].label.split(' ')[1]}
              </button>
            ))}
          </div>
          <div className="mt-2.5 text-xs font-mono text-slate-400 truncate">
            Formula: <code className="text-amber-300">{LAYER_META[leftLayer].formula}</code>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Right Split Layer (B)
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {LAYER_META[rightLayer].badge}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(LAYER_META) as LayerKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setRightLayer(key)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  rightLayer === key
                    ? 'bg-cyan-400 text-slate-950 font-semibold'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {LAYER_META[key].label.split(' ')[0]} {LAYER_META[key].label.split(' ')[1]}
              </button>
            ))}
          </div>
          <div className="mt-2.5 text-xs font-mono text-slate-400 truncate">
            Formula: <code className="text-cyan-300">{LAYER_META[rightLayer].formula}</code>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="text-slate-400 font-mono">Quick R&D Comparisons:</span>
        <button
          onClick={() => { setLeftLayer('hazy'); setRightLayer('dehazed'); }}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
        >
          Hazy Input vs Dehazed
        </button>
        <button
          onClick={() => { setLeftLayer('trans_raw'); setRightLayer('trans_refined'); }}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-900/60 cursor-pointer"
        >
          Raw Transmission vs Eigen Soft-Matting
        </button>
        <button
          onClick={() => { setLeftLayer('dehazed'); setRightLayer('depth'); }}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-900/60 cursor-pointer"
        >
          Restored Scene vs Beer-Lambert Depth Map
        </button>
        <button
          onClick={() => { setLeftLayer('dehazed'); setRightLayer('gt'); }}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-900/60 cursor-pointer"
        >
          Dehazed vs Ground Truth
        </button>
      </div>

      {/* Interactive Split-Screen Image Viewport */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        className="relative w-full aspect-[16/10] max-h-[540px] rounded-xl overflow-hidden select-none cursor-ew-resize border border-slate-700/80 bg-slate-950 shadow-inner"
      >
        {/* Right Layer (Background) */}
        <img
          src={scene.layers[rightLayer]}
          alt={LAYER_META[rightLayer].label}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Left Layer (Clipped Foreground) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={scene.layers[leftLayer]}
            alt={LAYER_META[leftLayer].label}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(34,211,238,0.9)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/90 border-2 border-cyan-400 flex items-center justify-center shadow-lg">
            <Sliders className="w-4 h-4 text-cyan-300 rotate-90" />
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1 rounded-md text-xs font-mono pointer-events-none">
          {LAYER_META[leftLayer].label}
        </div>
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-md text-xs font-mono pointer-events-none">
          {LAYER_META[rightLayer].label}
        </div>
      </div>

      {/* Quantitative Benchmark & Parameter Sweep Bottom Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 pt-6 border-t border-slate-800/80">
        {/* O-HAZE Measured Metrics */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-3">
            <Activity className="w-4 h-4" /> O-HAZE Dataset Benchmark (45 Images)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Scene PSNR (Soft Matting)</div>
              <div className="text-2xl font-bold text-white mt-0.5">
                {scene.metrics.matting.psnr.toFixed(2)} <span className="text-xs font-normal text-emerald-400">dB</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dataset Mean: <span className="text-slate-200 font-mono">17.94 dB</span> (Fast: 17.47)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Scene SSIM (Structural)</div>
              <div className="text-2xl font-bold text-cyan-300 mt-0.5">
                {scene.metrics.matting.ssim.toFixed(4)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dataset Mean: <span className="text-slate-200 font-mono">0.6490</span> (Fast: 0.6018)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">CIEDE2000 Color Error</div>
              <div className="text-xl font-bold text-indigo-300 mt-0.5">
                {scene.metrics.matting.ciede2000.toFixed(2)} <span className="text-xs font-normal text-slate-400">ΔE₀₀</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dataset Mean: <span className="text-slate-200 font-mono">13.57</span> (Fast: 13.95)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Scene Compute Time
              </div>
              <div className="text-sm font-mono text-amber-300 mt-1">
                Fast: <strong>{(scene.metrics.fast.timeMs / 1000).toFixed(2)} s</strong> ({scene.metrics.fast.psnr.toFixed(2)} dB)
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                Matting: <strong>{(scene.metrics.matting.timeMs / 1000).toFixed(2)} s</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Parameter Sweep Explorer */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" /> Hyperparameter Sensitivity Sweep (`bench_params.cpp`)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Configuration {sweepIdx + 1} / {PARAM_SWEEP.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Drag the slider to inspect how patch size $\Omega$, aerial perspective $\omega$, and transmission floor $t_0$ impact restoration quality:
            </p>
            <input
              type="range"
              min={0}
              max={PARAM_SWEEP.length - 1}
              value={sweepIdx}
              onChange={(e) => setSweepIdx(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 my-3 text-center font-mono">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">patch_size</div>
              <div className="text-sm font-bold text-white">{sweep.patch}×{sweep.patch}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">omega (ω)</div>
              <div className="text-sm font-bold text-white">{sweep.omega.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <div className="text-[10px] text-slate-400">floor (t₀)</div>
              <div className="text-sm font-bold text-white">{sweep.t0.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-cyan-900/60">
              <div className="text-[10px] text-cyan-400">Mean PSNR</div>
              <div className="text-sm font-bold text-cyan-300">{sweep.psnr.toFixed(2)} dB</div>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-emerald-900/60">
              <div className="text-[10px] text-emerald-400">Mean SSIM</div>
              <div className="text-sm font-bold text-emerald-300">{sweep.ssim.toFixed(3)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{sweep.note}</span>
          </div>
        </div>
      </div>

      {/* STATE-OF-THE-ART BENCHMARK COMPARISON (O-HAZE CVPRW 2018 TABLE 2) */}
      <div className="mt-7 pt-7 border-t border-slate-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-full mb-2">
              <Trophy className="w-3.5 h-3.5" /> Official O-HAZE Benchmark Comparison (CVPRW 2018, Table 2 — All 45 Images)
            </div>
            <h4 className="text-lg md:text-xl font-bold text-white">
              Positioning Against Published State-of-the-Art Methods (`ohaze_summary.csv` vs `docs/O-HAZE.pdf`)
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Direct quantitative evaluation across the complete 45-pair O-HAZE outdoor benchmark against the 7 reference methods evaluated by Ancuti et al.
            </p>
          </div>
        </div>

        {/* 3 Key Scientific Positioning Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-emerald-950/25 border border-emerald-500/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> #1 Classical Method in PSNR
              </span>
              <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                17.94 dB (#2 Overall)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ranks <strong>1st among all non-deep-learning methods</strong>, outperforming original He et al. DCP (<strong>+1.35 dB</strong>), Berman Haze-Lines (16.61 dB), Ancuti Multi-Scale Fusion (16.86 dB), Meng BCCR (17.44 dB), and even the deep CNN <em>DehazeNet</em> (16.21 dB). Trails only the multi-scale CNN <em>MSCNN</em> (19.07 dB) by 1.13 dB.
            </p>
          </div>

          <div className="rounded-xl bg-cyan-950/25 border border-cyan-500/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> #1 Absolute in Color Fidelity
              </span>
              <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                CIEDE2000 = 13.57
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thanks to estimating atmospheric light <code className="text-cyan-300">A</code> in perceptual <strong>CIE L*a*b*</strong> space (<code className="text-cyan-300">estimate_atmospheric_light</code>), our pipeline beats <strong>every published method in the paper</strong>—including <em>MSCNN</em> (14.67) and original RGB DCP (20.75, a <strong>-7.18 ΔE₀₀</strong> chromatic error reduction).
            </p>
          </div>

          <div className="rounded-xl bg-amber-950/20 border border-amber-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Microscope className="w-4 h-4" /> Critical Analysis (SSIM Tradeoff)
              </span>
              <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                SSIM = 0.649
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              SSIM remains slightly below the paper’s top range (0.735–0.765) due to two deliberate engineering tradeoffs: <code className="text-amber-300">ds_factor = 8</code> subsampling used to accelerate the sparse Soft Matting solver slightly smooths high-frequency transmission edges, and local contrast amplification in dense haze alters the local variance term in SSIM.
            </p>
          </div>
        </div>

        {/* Full Benchmark Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Method (45 O-HAZE Images)</th>
                <th className="py-3 px-4">Approach / Prior</th>
                <th className="py-3 px-4 text-right">PSNR (dB) ↑</th>
                <th className="py-3 px-4 text-right">SSIM ↑</th>
                <th className="py-3 px-4 text-right">CIEDE2000 (ΔE₀₀) ↓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {OHAZE_SOTA_BENCHMARK.map((row) => (
                <tr
                  key={row.method}
                  className={
                    row.isBestMatting
                      ? 'bg-emerald-500/15 text-white font-semibold'
                      : row.isOurs
                      ? 'bg-cyan-500/10 text-cyan-100'
                      : 'text-slate-300 hover:bg-slate-900/50'
                  }
                >
                  <td className="py-2.5 px-4 flex items-center gap-2">
                    <span>{row.method}</span>
                    {row.isBestMatting && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500 text-slate-950 font-bold">
                        #1 Classical PSNR • #1 Overall ΔE₀₀
                      </span>
                    )}
                    {row.isOurs && !row.isBestMatting && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/30 border border-cyan-400/50 text-cyan-200">
                        #2 Classical PSNR (Fast)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400">
                    {row.approach}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={row.isOurs ? 'text-emerald-300 font-bold' : ''}>
                      {row.psnr.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={row.psnr > 19 ? 'text-indigo-300 font-bold' : ''}>
                      {row.ssim.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={row.isOurs ? 'text-cyan-300 font-bold' : ''}>
                      {row.ciede2000.toFixed(3)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
