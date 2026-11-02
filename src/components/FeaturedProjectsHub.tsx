import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import DehazingExplorer from './DehazingExplorer';
import VoxelMeshingLab from './VoxelMeshingLab';
import FishSchoolSim3D from './FishSchoolSim3D';
import MapsProgressiveMesh3D from './MapsProgressiveMesh3D';
import NarutoYoloMudrasLab from './NarutoYoloMudrasLab';

export interface ProjectSpec {
  id: string;
  tierBadge: string;
  number: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  fullDesc: string;
  stackPills: string[];
  attributionRole: string;
  attributionDetails: string[];
  githubUrl?: string;
  accentColor: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'orange';
  coverImage?: string;
  highlights: string[];
}

const PROJECTS: ProjectSpec[] = [
  {
    id: 'dehazing',
    tierBadge: 'TIER 1 — CASE STUDY 01',
    number: '01',
    title: 'Single-Image Haze Removal & Laplacian Soft Matting',
    subtitle: 'Dark Channel Prior & Sparse Laplacian Soft Matting (C++17 / OpenCV / Eigen / OpenMP)',
    shortDesc:
      'Full C++17 implementation of He et al. (CVPR 2009) atmospheric scattering inversion, enhanced with CIE L*a*b* atmospheric light estimation and OpenMP-parallelized sparse Matting Laplacian.',
    fullDesc:
      'Full C++17 implementation of He et al. (CVPR 2009) atmospheric scattering inversion, enhanced with CIE L*a*b* atmospheric light estimation (median luminance L* + extrapolated veil chrominance a*, b* to reject warm foreground bias). Features OpenMP-parallelized construction of the sparse Matting Laplacian (L + λI)t = λt̃ solved with Eigen, 4× downsampling + guided-filter upsampling, Beer-Lambert depth recovery, and full O-HAZE / RESIDE evaluation suites.',
    stackPills: ['C++17', 'OpenCV 4', 'Eigen 3 Sparse', 'OpenMP', 'CIEDE2000'],
    attributionRole: 'Primary Author (17/20 commits, 3,618 LOC)',
    attributionDetails: [
      'Owned: Dark Channel, Atmospheric Light, Eigen/OpenMP Soft Matting, Metrics & Benchmarks',
      'Collaborator: M. Hourde (Scene Recovery & Initial Depth Map)',
    ],
    githubUrl: 'https://github.com/abelfares17/Projet_Image',
    accentColor: 'cyan',
    coverImage: '/assets/dehazing/23_dehazed.jpg',
    highlights: [
      'Koschmieder Model Inversion',
      '(L + λI)t = λt̃ Sparse Solver',
      'CIE L*a*b* Atmospheric Light',
      'O-HAZE & RESIDE Evaluation',
    ],
  },
  {
    id: 'voxel',
    tierBadge: 'TIER 1 — CASE STUDY 02',
    number: '02',
    title: 'Custom 3D Voxel Engine & Cascaded Shadows',
    subtitle: 'Greedy Meshing, Quad Indexing & Cascaded Shadow Mapping (Java 17 / OpenGL 3.2 / GLSL)',
    shortDesc:
      'A 100% personal 3D voxel engine engineered from scratch with worker-thread meshing, greedy surface merging, compact vertices, 4-cascade CSM, and real-time lighting.',
    fullDesc:
      'A 100% personal 3D voxel engine engineered from scratch on top of LWJGL/OpenGL. Implements worker-thread pool chunk meshing, greedy surface merging, compact vertex formatting with shared EBO quad indexing, a 4-cascade (2048²) directional shadow-mapping pipeline with light-volume caster culling, and a physically-inspired celestial day/night cycle.',
    stackPills: ['Java 17', 'OpenGL 3.2 Core', 'GLSL', 'LWJGL 3', 'Multithreading'],
    attributionRole: '100% Personal Project (Sole Author)',
    attributionDetails: [
      'Hardware Benchmarked: Apple M2 Pro (Retina 2268×1382)',
      'Measured Gain: 43.05 → 61.53 FPS (+42.9% via EBO + Compact Verts)',
      'Features: 4-Cascade CSM, Dappled Foliage Shadows, Beer-Lambert Water Optics, Dielectric Glass',
    ],
    githubUrl: 'https://github.com/abelfares17/Voxel_Project',
    accentColor: 'indigo',
    coverImage: '/assets/voxel/sunrise_optics.jpg',
    highlights: [
      'Ear-Clipped Greedy Shadow Mesh',
      'Shared EBO Quad Indexing',
      '4-Cascade CSM (16-Tap PCF)',
      'Dappled Light & Water Optics',
    ],
  },
  {
    id: 'boids',
    tierBadge: 'TIER 1 — CASE STUDY 03',
    number: '03',
    title: '3D Fish-School Geometric Modeling',
    subtitle: 'From Aoki Zones to Topological KD-Trees & Vision Cones (Python / NumPy / SciPy)',
    shortDesc:
      'A 5-stage scientific simulation exploring how local geometric perception rules generate macroscopic self-organization in 3D space with KD-Tree and einsum vectorization.',
    fullDesc:
      'A 5-stage scientific simulation exploring how local geometric perception rules generate macroscopic self-organization in 3D space. Compares metric interaction spheres (Aoki 1982), wave-like behavioral contagion (Trafalgar effect), scale-free topological k-nearest neighbor interactions accelerated via scipy.spatial.cKDTree, and forward field-of-view cone filtering (np.einsum). Both physics and 3D Matplotlib rendering are fully vectorized in NumPy with copy_from_bbox / blit acceleration.',
    stackPills: ['Python 3', 'NumPy Vectorization', 'SciPy cKDTree', 'Tensor (N,N,3)', 'Computational Geometry'],
    attributionRole: 'Lead Author (7/8 commits + Vectorization Pass)',
    attributionDetails: [
      'Physics: Tensorized (N,N,3) & einsum vision cone',
      'Renderer: Vectorized 10-tri mesh + Matplotlib Blitting',
      'Models: Aoki Metric Zones, Behavioral Contagion, Topological k-NN',
    ],
    githubUrl: 'https://github.com/abelfares17/Projet_mod_geom',
    accentColor: 'emerald',
    coverImage: '/assets/boids/boids_preview.jpg',
    highlights: [
      'Aoki Metric Interaction Spheres',
      'Topological k-NN (cKDTree)',
      'Forward Vision Cone (np.einsum)',
      'Trafalgar Behavioral Contagion',
    ],
  },
  {
    id: 'maps',
    tierBadge: 'TIER 1 — CASE STUDY 04',
    number: '04',
    title: 'Progressive 3D Mesh Compression (MAPS)',
    subtitle: 'Multiresolution Hierarchy (.obj → .obja) (Python / NumPy / SciPy / SIGGRAPH ’98)',
    shortDesc:
      'Implementation of the seminal MAPS (Lee et al., SIGGRAPH ’98) pipeline to stream arbitrary 3D triangle meshes under a strict bitrate-distortion tradeoff.',
    fullDesc:
      'Implementation of the seminal MAPS (Multiresolution Adaptive Parameterization of Surfaces, Lee et al., SIGGRAPH ’98) pipeline to stream arbitrary 3D triangle meshes under a strict bitrate-distortion tradeoff. Combines Dobkin-Kirkpatrick independent-set decimation, local conformal 1-ring flattening μ_u(p_jk) = r_k^a · exp(i·a·θ_k), constrained planar re-triangulation, and Loop 1:4 subdivision with bijection tracking Π^l.',
    stackPills: ['Python 3', 'NumPy', 'SciPy', 'Computational Topology', 'SIGGRAPH ’98'],
    attributionRole: '3A Research Project (Module Owner: Hierarchy & Priorities)',
    attributionDetails: [
      'Key Work: Pure NumPy vectorization of w(λ, u), DK independent set, CCW 1-ring ordering & error E(t)',
      'Target: Progressive geometry streaming under strict bitrate-distortion tradeoff',
    ],
    githubUrl: 'https://github.com/b-cb/Projet-CSI',
    accentColor: 'amber',
    coverImage: '/assets/maps/maps_preview.jpg',
    highlights: [
      'Dobkin-Kirkpatrick Decimation',
      'Conformal 1-Ring Flattening μ_u',
      'Loop 1:4 Subdivision & Bijections',
      'Bitrate-Distortion Hierarchy',
    ],
  },
  {
    id: 'naruto_yolo',
    tierBadge: 'TIER 1 — CASE STUDY 05',
    number: '05',
    title: 'YOLOv11 Naruto Hand-Sign Recognition & Jutsu Engine',
    subtitle: 'Zodiac Mudrās Detection, C++ Pipeline & 500-Epoch Fine-Tuning (PyTorch / Ultralytics / OpenCV)',
    shortDesc:
      'End-to-end computer vision and deep learning system recognizing 12 Naruto hand seals in real-time with 99.50% mAP@50 and an interactive Jutsu sequence engine.',
    fullDesc:
      'End-to-end computer vision and applied deep learning project recognizing the 12 Naruto zodiac mudrās in real-time. Built upon a private homemade dataset of 412 photos annotated with CVAT under strict tight-box guidelines, verified via custom C++17/OpenCV bounding-box projection and stratified 80/10/10 splitting. Fine-tuned with YOLOv11 Medium across 500 epochs on Google Colab with an automated multi-day session recovery script, achieving 99.50% mAP@50, 91.69% mAP@50-95, and 100% precision on 11/12 classes.',
    stackPills: ['YOLOv11m', 'PyTorch', 'C++17 Pipeline', 'CVAT Docker', 'Colab GPU', 'mAP@50: 99.5%'],
    attributionRole: 'Co-Author (Dataset Acquisition, C++ Split & Verification, YOLOv11 Tuning)',
    attributionDetails: [
      'Dataset: 412 homemade images, 12 zodiac classes, multi-subject & lighting variations',
      'Engineering: Custom C++17 OpenCV scripts for tight-box verification & stratified partitioning',
      'Training: 500 epochs YOLOv11m with automated 3-day Colab recovery script & cosine lr scheduler',
      'Performance: 99.50% mAP@50, 91.69% mAP@50-95, 98.25% Precision, 98.18% Recall',
    ],
    accentColor: 'orange',
    coverImage: '/assets/naruto_yolo/naruto_yolo_preview.jpg',
    highlights: [
      'YOLOv11m 500-Epoch Fine-Tuning',
      '99.50% mAP@50 Benchmark',
      'C++ Stratified Data Split',
      'Interactive Jutsu State Machine',
    ],
  },
];

export default function FeaturedProjectsHub() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Sync with URL hash (#dehazing, #voxel, etc.)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (PROJECTS.some((p) => p.id === hash)) {
        setActiveProjectId(hash);
      } else if (!hash) {
        setActiveProjectId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const openProject = useCallback((id: string) => {
    setActiveProjectId(id);
    window.history.pushState(null, '', `#${id}`);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
    window.history.pushState(null, '', window.location.pathname);
    document.body.style.overflow = '';
  }, []);

  const currentIndex = PROJECTS.findIndex((p) => p.id === activeProjectId);

  const prevProject = useCallback(() => {
    if (currentIndex > 0) {
      openProject(PROJECTS[currentIndex - 1].id);
    } else {
      openProject(PROJECTS[PROJECTS.length - 1].id);
    }
  }, [currentIndex, openProject]);

  const nextProject = useCallback(() => {
    if (currentIndex < PROJECTS.length - 1) {
      openProject(PROJECTS[currentIndex + 1].id);
    } else {
      openProject(PROJECTS[0].id);
    }
  }, [currentIndex, openProject]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeProjectId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProject();
      } else if (e.key === 'ArrowLeft') {
        prevProject();
      } else if (e.key === 'ArrowRight') {
        nextProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectId, closeProject, prevProject, nextProject]);

  const activeProject = PROJECTS.find((p) => p.id === activeProjectId);

  return (
    <section id="featured-projects" className="py-16 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Primary R&D Case Studies (Tier 1)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Research & Engineering Labs
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Interactive 3D simulations, verified mathematical formulations, and native benchmark suites. Click any card to launch its deep-dive lab and technical breakdown.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            <span>4 Tier-1 Projects</span> • <span>Click to Expand</span>
          </div>
        </div>

        {/* 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, idx) => {
            const isCyan = project.accentColor === 'cyan';
            const isIndigo = project.accentColor === 'indigo';
            const isEmerald = project.accentColor === 'emerald';
            const isAmber = project.accentColor === 'amber';
            const isOrange = project.accentColor === 'orange';

            const borderHoverClass = isCyan
              ? 'hover:border-cyan-500/60 hover:shadow-cyan-500/10'
              : isIndigo
              ? 'hover:border-indigo-500/60 hover:shadow-indigo-500/10'
              : isEmerald
              ? 'hover:border-emerald-500/60 hover:shadow-emerald-500/10'
              : isOrange
              ? 'hover:border-orange-500/60 hover:shadow-orange-500/10'
              : 'hover:border-amber-500/60 hover:shadow-amber-500/10';

            const badgeBgClass = isCyan
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
              : isIndigo
              ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
              : isEmerald
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : isOrange
              ? 'bg-orange-500/10 text-orange-300 border-orange-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30';

            const textAccentClass = isCyan
              ? 'text-cyan-400'
              : isIndigo
              ? 'text-indigo-400'
              : isEmerald
              ? 'text-emerald-400'
              : isOrange
              ? 'text-orange-400'
              : 'text-amber-400';

            const btnClass = isCyan
              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : isIndigo
              ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              : isEmerald
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isOrange
              ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border-orange-500/40'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40';

            return (
              <div
                key={project.id}
                onClick={() => openProject(project.id)}
                className={`group relative cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${borderHoverClass}`}
              >
                <div className="space-y-4">
                  {/* Header: Badge & Role */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`px-2.5 py-1 rounded-md border font-bold ${badgeBgClass}`}>
                      {project.tierBadge}
                    </span>
                    <span className="text-slate-400 text-[11px] bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {project.attributionRole.split('(')[0]}
                    </span>
                  </div>

                  {/* Visual Preview Banner */}
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        loading="lazy"
                      />
                    ) : project.id === 'boids' ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-mono text-emerald-300 font-semibold">
                          3D Swarm Vectorization (NumPy)
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Topological cKDTree k-NN • Trafalgar Effect • Vision Cones
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <Layers className="w-6 h-6" />
                        </div>
                        <div className="text-xs font-mono text-amber-300 font-semibold">
                          MAPS Multiresolution Parameterization
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Dobkin-Kirkpatrick Decimation • Loop 1:4 Subdivision
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90">
                      <span className="text-xs tracking-wide bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700/60 backdrop-blur-sm">
                        Interactive 3D Lab Ready
                      </span>
                      <span className={`font-bold flex items-center gap-1 ${textAccentClass}`}>
                        Click to Expand <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.stackPills.map((pill) => (
                      <span
                        key={pill}
                        className="text-[11px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  {/* 4 Bullet Highlights */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                    {project.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${textAccentClass}`}></span>
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Case Study & Simulation
                  </span>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-2 shadow-sm ${btnClass}`}
                  >
                    Open Deep Dive Lab <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN / SLIDE-OVER PROJECT DETAILS MODAL */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/90 backdrop-blur-2xl p-2 sm:p-4 md:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProject();
          }}
        >
          <div
            className="relative w-full max-w-6xl my-4 sm:my-8 rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* STICKY MODAL TOP BAR */}
            <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
              {/* Left: Project Identity */}
              <div className="flex items-center gap-3 truncate">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
                  {activeProject.tierBadge}
                </span>
                <span className="text-sm font-bold text-white truncate hidden sm:inline">
                  {activeProject.title}
                </span>
              </div>

              {/* Center: Navigation (Prev / Next) */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={prevProject}
                  title="Previous Project (Left Arrow)"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Prev</span>
                </button>
                <span className="text-xs font-mono text-slate-400 px-2">
                  {currentIndex + 1} / {PROJECTS.length}
                </span>
                <button
                  type="button"
                  onClick={nextProject}
                  title="Next Project (Right Arrow)"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Actions (GitHub & Close) */}
              <div className="flex items-center gap-2 shrink-0">
                {activeProject.githubUrl ? (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition"
                  >
                    GitHub ↗
                  </a>
                ) : (
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Private Dataset (Privacy Protected)</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={closeProject}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 hover:border-red-500/50 border border-slate-700 text-xs font-mono text-slate-200 hover:text-red-300 transition flex items-center gap-1.5 font-bold"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                  <span>Close (Esc)</span>
                </button>
              </div>
            </div>

            {/* MODAL SCROLLABLE BODY (100% of Original Project Details & Lab) */}
            <div className="p-4 sm:p-6 md:p-8 space-y-8 overflow-y-auto max-h-[85vh]">
              {/* Project Header Details */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">
                      {activeProject.stackPills.join(' • ')}
                    </span>
                    {activeProject.githubUrl ? (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        {activeProject.githubUrl.replace('https://', '')} ↗
                      </a>
                    ) : (
                      <span className="text-amber-400/90 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Private Dataset (Participant Privacy Protected)
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {activeProject.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {activeProject.fullDesc}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-1.5 shrink-0 max-w-sm">
                  <div className="text-slate-400 uppercase text-[10px]">Attribution & Verification</div>
                  <div className="text-emerald-400 font-bold">{activeProject.attributionRole}</div>
                  {activeProject.attributionDetails.map((detail, dIdx) => (
                    <div key={dIdx} className="text-slate-300 text-[11px] leading-snug">
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Study 01 Specific: Mathematical Formulation Cards */}
              {activeProject.id === 'dehazing' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-mono text-cyan-400 uppercase mb-1">
                      1. Koschmieder Scattering Model
                    </div>
                    <div className="text-sm font-mono text-white bg-slate-950 p-2.5 rounded border border-slate-800 my-2">
                      I(x) = J(x)·t(x) + A·(1 - t(x))
                    </div>
                    <p className="text-xs text-slate-400">
                      Relates observed hazy image <code className="text-slate-200">I(x)</code> to true scene radiance{' '}
                      <code className="text-slate-200">J(x)</code>, global atmospheric light{' '}
                      <code className="text-slate-200">A</code>, and medium transmission{' '}
                      <code className="text-slate-200">t(x) = exp(-β·d(x))</code>.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-mono text-indigo-400 uppercase mb-1">
                      2. Sparse Matting Laplacian (Eigen + OpenMP)
                    </div>
                    <div className="text-sm font-mono text-white bg-slate-950 p-2.5 rounded border border-slate-800 my-2">
                      (L + λI) · t = λ · t̃
                    </div>
                    <p className="text-xs text-slate-400">
                      Eliminates block-erosion halo artifacts around depth discontinuities using Levin’s local window
                      covariance matrix <code className="text-indigo-300">L_ij</code>, parallelized across CPU threads via OpenMP.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-xs font-mono text-emerald-400 uppercase mb-1">
                      3. Radiance Inversion & Depth Map
                    </div>
                    <div className="text-sm font-mono text-white bg-slate-950 p-2.5 rounded border border-slate-800 my-2">
                      J(x) = (I(x) - A) / max(t(x), t₀) + A
                    </div>
                    <p className="text-xs text-slate-400">
                      Regularized by transmission floor <code className="text-slate-200">t₀ = 0.20</code> to prevent noise
                      amplification in dense haze, with depth recovered up to scale via{' '}
                      <code className="text-slate-200">d(x) = -ln(t)/β</code>.
                    </p>
                  </div>
                </div>
              )}

              {/* Interactive Browser Simulation Labs */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-1 sm:p-2">
                {activeProject.id === 'dehazing' && <DehazingExplorer />}
                {activeProject.id === 'voxel' && <VoxelMeshingLab />}
                {activeProject.id === 'boids' && <FishSchoolSim3D />}
                {activeProject.id === 'maps' && <MapsProgressiveMesh3D />}
                {activeProject.id === 'naruto_yolo' && <NarutoYoloMudrasLab />}
              </div>

              {/* Footer Navigation Bar Inside Modal */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <button
                  type="button"
                  onClick={prevProject}
                  className="hover:text-cyan-400 transition flex items-center gap-1"
                >
                  ← Previous Case Study
                </button>
                <div className="flex items-center gap-2">
                  <span>Press</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                    ←
                  </kbd>
                  <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                    →
                  </kbd>
                  <span>to navigate •</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
                <button
                  type="button"
                  onClick={nextProject}
                  className="hover:text-cyan-400 transition flex items-center gap-1"
                >
                  Next Case Study →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
