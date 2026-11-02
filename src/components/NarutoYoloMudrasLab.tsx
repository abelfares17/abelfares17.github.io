import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Flame,
  Zap,
  Sparkles,
  Sliders,
  Table,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Eye,
  Crosshair,
  Activity,
  ShieldCheck,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

interface MudraSpec {
  id: string;
  nameFr: string;
  nameEn: string;
  romaji: string;
  kanji: string;
  element: string;
  color: string;
  fingerRule: string;
  conf: number;
  bbox: { xc: number; yc: number; w: number; h: number };
}

const MUDRAS: MudraSpec[] = [
  {
    id: 'dragon',
    nameFr: 'Dragon',
    nameEn: 'Dragon',
    romaji: 'Tatsu',
    kanji: '辰',
    element: 'Eau / Vent',
    color: '#06b6d4',
    fingerRule: 'Pouces superposés vers le bas, petits doigts et annulaires entrecroisés horizontalement.',
    conf: 0.985,
    bbox: { xc: 0.58, yc: 0.50, w: 0.52, h: 0.74 },
  },
  {
    id: 'tigre',
    nameFr: 'Tigre',
    nameEn: 'Tiger',
    romaji: 'Tora',
    kanji: '寅',
    element: 'Feu (Katon)',
    color: '#f97316',
    fingerRule: 'Index et majeurs levés collés, annulaires et auriculaires entrelacés, pouces dressés.',
    conf: 0.982,
    bbox: { xc: 0.48, yc: 0.51, w: 0.24, h: 0.53 },
  },
  {
    id: 'chien',
    nameFr: 'Chien',
    nameEn: 'Dog',
    romaji: 'Inu',
    kanji: '戌',
    element: 'Terre (Doton)',
    color: '#f59e0b',
    fingerRule: 'Paume gauche posée à plat à l’horizontale sur le poing droit fermé.',
    conf: 0.978,
    bbox: { xc: 0.53, yc: 0.62, w: 0.69, h: 0.43 },
  },
  {
    id: 'rat',
    nameFr: 'Rat',
    nameEn: 'Rat',
    romaji: 'Ne',
    kanji: '子',
    element: 'Feu / Ombre',
    color: '#10b981',
    fingerRule: 'Index et majeur droits dressés, entourés et serrés par les quatre doigts de la main gauche.',
    conf: 0.981,
    bbox: { xc: 0.51, yc: 0.61, w: 0.31, h: 0.77 },
  },
  {
    id: 'ram',
    nameFr: 'Bélier',
    nameEn: 'Ram',
    romaji: 'Hitsuji',
    kanji: '未',
    element: 'Feu / Énergie',
    color: '#14b8a6',
    fingerRule: 'Index et majeurs levés et croisés l’un sur l’autre, annulaires repliés vers le bas.',
    conf: 0.984,
    bbox: { xc: 0.61, yc: 0.53, w: 0.42, h: 0.72 },
  },
  {
    id: 'horse',
    nameFr: 'Cheval',
    nameEn: 'Horse',
    romaji: 'Uma',
    kanji: '午',
    element: 'Feu (Katon)',
    color: '#3b82f6',
    fingerRule: 'Index tendus en triangle vers le haut, jointures des autres doigts entrelacées vers l’intérieur.',
    conf: 0.980,
    bbox: { xc: 0.55, yc: 0.56, w: 0.72, h: 0.56 },
  },
  {
    id: 'monkey',
    nameFr: 'Singe',
    nameEn: 'Monkey',
    romaji: 'Saru',
    kanji: '申',
    element: 'Foudre (Raiton)',
    color: '#eab308',
    fingerRule: 'Paumes appliquées à plat l’une contre l’autre, pouces projetés horizontalement en contact.',
    conf: 0.979,
    bbox: { xc: 0.49, yc: 0.55, w: 0.70, h: 0.28 },
  },
  {
    id: 'bird',
    nameFr: 'Oiseau',
    nameEn: 'Bird',
    romaji: 'Tori',
    kanji: '酉',
    element: 'Vent (Fūton)',
    color: '#f43f5e',
    fingerRule: 'Index et petits doigts dressés formant un losange, majeurs et annulaires repliés dos à dos.',
    conf: 0.986,
    bbox: { xc: 0.60, yc: 0.48, w: 0.80, h: 0.92 },
  },
  {
    id: 'ox',
    nameFr: 'Bœuf',
    nameEn: 'Ox',
    romaji: 'Ushi',
    kanji: '丑',
    element: 'Foudre / Terre',
    color: '#a855f7',
    fingerRule: 'Avant-bras croisés, main droite horizontale paume vers le bas étalée sur les doigts gauches.',
    conf: 0.983,
    bbox: { xc: 0.54, yc: 0.55, w: 0.52, h: 0.76 },
  },
  {
    id: 'serpent',
    nameFr: 'Serpent',
    nameEn: 'Snake',
    romaji: 'Mi',
    kanji: '巳',
    element: 'Terre / Eau',
    color: '#64748b',
    fingerRule: 'Dix doigts complètement entrelacés, pouces dressés droits et collés l’un contre l’autre.',
    conf: 0.982,
    bbox: { xc: 0.51, yc: 0.68, w: 0.29, h: 0.59 },
  },
  {
    id: 'hare',
    nameFr: 'Lièvre',
    nameEn: 'Hare',
    romaji: 'U',
    kanji: '卯',
    element: 'Foudre (Raiton)',
    color: '#ec4899',
    fingerRule: 'Main gauche forme un poing levé, main droite posée à plat pouce dressé vers le haut.',
    conf: 0.980,
    bbox: { xc: 0.61, yc: 0.57, w: 0.56, h: 0.67 },
  },
  {
    id: 'boar',
    nameFr: 'Sanglier',
    nameEn: 'Boar',
    romaji: 'I',
    kanji: '亥',
    element: 'Terre (Doton)',
    color: '#8b5cf6',
    fingerRule: 'Poignets cassés vers l’extérieur, paumes tournées vers le sol, jointures des doigts pliées.',
    conf: 0.979,
    bbox: { xc: 0.55, yc: 0.61, w: 0.27, h: 0.60 },
  },
];

interface JutsuCombo {
  id: string;
  name: string;
  kanji: string;
  affinity: string;
  themeColor: string;
  sequence: string[];
  desc: string;
}

const JUTSUS: JutsuCombo[] = [
  {
    id: 'katon',
    name: 'Katon: Gōkakyū no Jutsu (Boule de Feu Suprême)',
    kanji: '火遁・豪火球の術',
    affinity: 'Feu (Katon)',
    themeColor: '#f97316',
    sequence: ['serpent', 'ram', 'monkey', 'boar', 'horse', 'tigre'],
    desc: 'Signature du clan Uchiwa concentrant le chakra dans l’estomac puis expulsé en sphère ardente.',
  },
  {
    id: 'chidori',
    name: 'Chidori (Les Mille Oiseaux)',
    kanji: '千鳥',
    affinity: 'Foudre (Raiton)',
    themeColor: '#38bdf8',
    sequence: ['ox', 'hare', 'monkey'],
    desc: 'Concentration foudroyante à haute fréquence dans la paume perforant les défenses adverses.',
  },
  {
    id: 'suiryuudan',
    name: 'Suiton: Suiryūdan no Jutsu (Dragon Aqueux)',
    kanji: '水遁・水龍弾の術',
    affinity: 'Eau (Suiton)',
    themeColor: '#06b6d4',
    sequence: ['ox', 'monkey', 'hare', 'rat'],
    desc: 'Matérialisation hydrodynamique d’un dragon d’eau pressurisé percutant la cible.',
  },
  {
    id: 'kuchiyose',
    name: 'Kuchiyose no Jutsu (Technique d’Invocation)',
    kanji: '口寄せの術',
    affinity: 'Spatio-Temporel',
    themeColor: '#a855f7',
    sequence: ['boar', 'chien', 'bird', 'monkey', 'ram'],
    desc: 'Pacte d’invocation téléportant instantanément des créatures ou armes scellées.',
  },
  {
    id: 'kage_bunshin',
    name: 'Kage Bunshin no Jutsu (Clonage de l’Ombre)',
    kanji: '影分身の術',
    affinity: 'Division de Chakra',
    themeColor: '#10b981',
    sequence: ['tigre', 'serpent'],
    desc: 'Répartition équitable de la réserve de chakra créant des entités réelles et autonomes.',
  },
];

const ABLATION_DATA = [
  { config: 'Baseline (sans augmentation)', map50: 0.946, map95: 0.896, p: 0.983, r: 0.880, note: 'Convergence initiale rapide' },
  { config: 'Color only (HSV Variations)', map50: 0.949, map95: 0.904, p: 0.981, r: 0.894, note: 'Meilleur mAP50-95 à court terme (préserve la géométrie des doigts)' },
  { config: 'Translate only', map50: 0.959, map95: 0.879, p: 0.957, r: 0.917, note: 'Améliore le centrage' },
  { config: 'Scale only', map50: 0.950, map95: 0.852, p: 0.960, r: 0.877, note: 'Tolérance à la distance' },
  { config: 'Degrees only (Rotations ±20°)', map50: 0.968, map95: 0.787, p: 0.937, r: 0.952, note: 'Perturbe la lecture fine des angles des phalanges' },
  { config: 'Mosaic low (0.5)', map50: 0.971, map95: 0.821, p: 0.969, r: 0.929, note: 'Généralise aux scènes multi-mains' },
  { config: 'Geo combo (Translate+Scale+Degrees)', map50: 0.974, map95: 0.812, p: 0.962, r: 0.924, note: 'Augmente la robustesse globale' },
  { config: 'Geo + Color', map50: 0.961, map95: 0.789, p: 0.944, r: 0.917, note: 'Compromis équilibré' },
  { config: 'Geo + Color + Mosaic (20 époques)', map50: 0.963, map95: 0.779, p: 0.929, r: 0.923, note: 'Difficile à 20 ép., mais essentiel sur 500 ép.' },
  { config: '★ Run Final 500 Époques (YOLOv11m)', map50: 0.995, map95: 0.917, p: 0.983, r: 0.982, note: 'Pic mAP50-95 à 0.927 (époque 450). Diagonale matrice à 100% sur 11/12 classes !' },
];

export default function NarutoYoloMudrasLab() {
  const [activeTab, setActiveTab] = useState<'ablation' | 'detector' | 'sequencer'>('ablation');
  const [selectedJutsuId, setSelectedJutsuId] = useState('katon');
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMudraId, setSelectedMudraId] = useState('tigre');
  const [confThreshold, setConfThreshold] = useState(0.50);
  const [iouThreshold, setIouThreshold] = useState(0.70);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeCurveModal, setActiveCurveModal] = useState<string | null>(null);

  const selectedJutsu = JUTSUS.find((j) => j.id === selectedJutsuId) || JUTSUS[0];
  const selectedMudra = MUDRAS.find((m) => m.id === selectedMudraId) || MUDRAS[0];

  // Check sequence match
  useEffect(() => {
    if (userSequence.length === selectedJutsu.sequence.length) {
      const match = userSequence.every((val, idx) => val === selectedJutsu.sequence[idx]);
      if (match) {
        setIsSuccess(true);
      }
    }
  }, [userSequence, selectedJutsu]);

  // Handle mudra click
  const handleAddMudra = (mudraId: string) => {
    if (isSuccess) return;
    if (userSequence.length >= selectedJutsu.sequence.length) {
      setUserSequence([mudraId]);
      setIsSuccess(false);
      return;
    }
    const nextSeq = [...userSequence, mudraId];
    setUserSequence(nextSeq);
  };

  const handleReset = () => {
    setUserSequence([]);
    setIsSuccess(false);
    setIsAutoPlaying(false);
  };

  // Auto-play combo simulation
  const handleAutoPlay = () => {
    handleReset();
    setIsAutoPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < selectedJutsu.sequence.length) {
        const sign = selectedJutsu.sequence[step];
        setUserSequence((prev) => [...prev, sign]);
        step++;
      } else {
        clearInterval(interval);
        setIsAutoPlaying(false);
      }
    }, 650);
  };

  // Detector filter simulation
  const isDetected = selectedMudra.conf >= confThreshold;

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/85 backdrop-blur-md shadow-2xl p-5 md:p-8 space-y-6 text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-400 bg-orange-950/70 border border-orange-800/60 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Applied Deep Learning & Computer Vision
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              YOLOv11 Medium • 500 Epochs • Google Colab Recovery
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Naruto Mudrās Real-Time Detection & Jutsu State Machine
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            End-to-end hand seal detector trained on a private homemade dataset of 412 photos across 12 zodiac classes. Engineered with OpenCV/C++17 verification and stratified partitioning, achieving <strong className="text-emerald-400">99.50% mAP@50</strong> and <strong className="text-cyan-300">91.69% mAP@50-95</strong>.
          </p>
        </div>

        {/* Telemetry pill */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 shrink-0 font-mono text-xs space-y-1">
          <div className="flex justify-between gap-4 text-slate-400">
            <span>Peak mAP@50:</span>
            <span className="text-emerald-400 font-bold">99.50%</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400">
            <span>Peak mAP@50-95:</span>
            <span className="text-cyan-300 font-bold">92.69%</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400">
            <span>Precision / Recall:</span>
            <span className="text-amber-300 font-bold">98.3% / 98.2%</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('ablation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition ${
            activeTab === 'ablation'
              ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>1. Étude d’Ablation & Matrice 100%</span>
        </button>

        <button
          onClick={() => setActiveTab('detector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition ${
            activeTab === 'detector'
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>2. Inspecteur YOLO & Seuils IoU</span>
        </button>

        <button
          onClick={() => setActiveTab('sequencer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition ${
            activeTab === 'sequencer'
              ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/10'
              : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>3. Décodeur & Séquenceur de Jutsu</span>
        </button>
      </div>

      {/* TAB 1: JUTSU SEQUENCER & REAL-TIME STATE MACHINE */}
      {activeTab === 'sequencer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Controls & Combo Selector */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Technique Cible</span>
                  <span className="text-[10px] text-orange-400 font-bold">Chakra Flow</span>
                </div>

                <div className="space-y-2">
                  {JUTSUS.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => {
                        setSelectedJutsuId(j.id);
                        handleReset();
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border transition font-mono text-xs flex flex-col gap-0.5 ${
                        selectedJutsuId === j.id
                          ? 'bg-orange-950/40 border-orange-500/60 text-white'
                          : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{j.name.split('(')[0]}</span>
                        <span className="text-[10px] text-slate-400">{j.kanji}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{j.affinity}</div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleAutoPlay}
                    disabled={isAutoPlaying}
                    className="flex-1 py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-600/20"
                  >
                    <Play className="w-3 h-3" /> Auto-Détection
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Technical Pipeline Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2">
                <div className="text-slate-400 uppercase text-[10px] font-bold">Pipeline Temporel (Idée R&D)</div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Une fois chaque mudrā localisé à &gt;95% de confiance par YOLO, une machine à états temporelle vérifie la chronologie stricte des transitions avant de déclencher le Jutsu.
                </p>
                <div className="text-slate-400 text-[10px] space-y-1 pt-1 border-t border-slate-800/80">
                  <div className="flex justify-between">
                    <span>Inférence YOLOv11m:</span>
                    <span className="text-cyan-300">~11.4 ms (GPU)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fréquence Vidéo:</span>
                    <span className="text-emerald-400">85+ FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fenêtre de Tolérance:</span>
                    <span className="text-amber-300">0.8 s / mudrā</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Area */}
            <div className="lg:col-span-8 space-y-4">
              {/* Target Sequence Display */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Enchaînement requis ({selectedJutsu.sequence.length} signes) :</span>
                  <span className="text-slate-400 text-[11px]">{selectedJutsu.desc}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedJutsu.sequence.map((mudraId, idx) => {
                    const m = MUDRAS.find((item) => item.id === mudraId)!;
                    const isPassed = userSequence.length > idx && userSequence[idx] === mudraId;
                    const isCurrent = userSequence.length === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-xs transition ${
                          isPassed
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                            : isCurrent
                            ? 'bg-orange-950/40 border-orange-400 text-orange-200 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="text-[10px] w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold">{m.kanji}</span>
                        <span>{m.nameFr}</span>
                        {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Jutsu Success Banner */}
              {isSuccess ? (
                <div className="rounded-xl border border-orange-500 bg-gradient-to-r from-orange-950/80 via-slate-900 to-orange-950/80 p-5 text-center space-y-2 animate-fade-in shadow-2xl shadow-orange-500/20">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400 text-orange-300 text-xs font-mono font-bold">
                    <Sparkles className="w-4 h-4 animate-spin" /> JUTSU DÉCLENCHÉ AVEC SUCCÈS !
                  </div>
                  <h4 className="text-2xl font-black text-white tracking-wider font-mono">
                    {selectedJutsu.name}
                  </h4>
                  <p className="text-xs font-mono text-orange-200 max-w-xl mx-auto">
                    Tous les mudrās ont été validés en séquence avec une confiance moyenne de 98.2%. Le flux de chakra est stable et l’activation est confirmée.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold transition"
                  >
                    Réinitialiser l’enchaînement
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>
                    Cliquez sur les mudrās ci-dessous dans l'ordre pour compléter la séquence temporelle.
                  </span>
                </div>
              )}

              {/* 12 Interactive Mudra Buttons Grid */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Sélection des 12 Mudrās (Banque de Détection) :
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {MUDRAS.map((m) => {
                    const isNextExpected =
                      !isSuccess &&
                      userSequence.length < selectedJutsu.sequence.length &&
                      selectedJutsu.sequence[userSequence.length] === m.id;

                    return (
                      <button
                        key={m.id}
                        onClick={() => handleAddMudra(m.id)}
                        disabled={isSuccess}
                        className={`p-2.5 rounded-xl border text-left font-mono transition flex flex-col justify-between h-20 ${
                          isNextExpected
                            ? 'bg-orange-950/30 border-orange-500 text-white hover:bg-orange-900/40'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold" style={{ color: m.color }}>
                            {m.kanji}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{m.romaji}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white truncate">{m.nameFr}</div>
                          <div className="text-[10px] text-slate-400 truncate">{m.element}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETECTION INSPECTOR & THRESHOLD TUNER */}
      {activeTab === 'detector' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Mudra Selector List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Sélectionner un Mudrā à inspecter :
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
                  {MUDRAS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMudraId(m.id)}
                      className={`p-2 rounded-lg border font-mono text-xs flex items-center justify-between transition ${
                        selectedMudraId === m.id
                          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{m.kanji} {m.nameFr}</span>
                      <span className="text-[10px] text-slate-400">{(m.conf * 100).toFixed(0)}%</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Threshold Sliders */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Seuil de Confiance (Conf)
                  </span>
                  <span className="text-cyan-300 font-bold">{confThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.99"
                  step="0.01"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.10 (Rappel max)</span>
                  <span>0.50 (Standard)</span>
                  <span>0.99 (Précision pure)</span>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5 text-amber-400" /> Seuil IoU / NMS
                    </span>
                    <span className="text-amber-300 font-bold">{iouThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.30"
                    max="0.85"
                    step="0.05"
                    value={iouThreshold}
                    onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0.30 (NMS agressif)</span>
                    <span>0.70 (YOLO default)</span>
                    <span>0.85 (Multi-mains)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bounding Box Canvas Simulation */}
            <div className="lg:col-span-8 space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center p-6">
                {/* Simulated frame grid */}
                <div className="absolute inset-0 lab-grid-bg opacity-30"></div>

                {/* Simulated Hand Detection Canvas */}
                <div className="relative w-full h-full border border-slate-800/60 rounded-xl bg-slate-900/40 flex items-center justify-center">
                  {/* Central Kanji Silhouette */}
                  <div className="flex flex-col items-center justify-center space-y-1 text-center select-none pointer-events-none">
                    <span className="text-7xl font-bold opacity-30" style={{ color: selectedMudra.color }}>
                      {selectedMudra.kanji}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      {selectedMudra.romaji} • {selectedMudra.nameFr}
                    </span>
                  </div>

                  {/* Bounding Box Visualizer */}
                  {isDetected ? (
                    <div
                      className="absolute border-2 rounded transition-all duration-300 pointer-events-none"
                      style={{
                        borderColor: selectedMudra.color,
                        backgroundColor: `${selectedMudra.color}15`,
                        left: `${(selectedMudra.bbox.xc - selectedMudra.bbox.w / 2) * 100}%`,
                        top: `${(selectedMudra.bbox.yc - selectedMudra.bbox.h / 2) * 100}%`,
                        width: `${selectedMudra.bbox.w * 100}%`,
                        height: `${selectedMudra.bbox.h * 100}%`,
                      }}
                    >
                      {/* Bounding Box Tag */}
                      <div
                        className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1.5"
                        style={{ backgroundColor: selectedMudra.color }}
                      >
                        <span>{selectedMudra.id}</span>
                        <span className="bg-black/30 px-1 rounded text-[10px]">
                          {selectedMudra.conf.toFixed(2)}
                        </span>
                      </div>

                      {/* Center Crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        <div className="w-3 h-0.5 bg-white"></div>
                        <div className="h-3 w-0.5 bg-white absolute"></div>
                      </div>

                      {/* Corner indicators */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                      <div className="text-center space-y-1 text-rose-400 font-mono text-xs">
                        <AlertTriangle className="w-5 h-5 mx-auto" />
                        <div>DÉTECTION FILTRÉE PAR LE SEUIL DE CONFIANCE</div>
                        <div className="text-[11px] text-slate-400">
                          Confiance du modèle ({selectedMudra.conf.toFixed(2)}) &lt; Seuil fixé ({confThreshold.toFixed(2)})
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Telemetry HUD in Canvas */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
                    <span>YOLO 1.1 Coords: xc={selectedMudra.bbox.xc} yc={selectedMudra.bbox.yc} w={selectedMudra.bbox.w} h={selectedMudra.bbox.h}</span>
                    <span className={isDetected ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                      {isDetected ? '● DETECTED (TP)' : '○ SUPPRESSED (FN)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anatomy & Geometric Criteria Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="uppercase text-[10px] font-bold text-cyan-400">Critères Géométriques d'Annotation (Tight Box)</span>
                  <span className="text-[11px]">Classe #{MUDRAS.findIndex((m) => m.id === selectedMudra.id)}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {selectedMudra.fingerRule}
                </p>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80 flex flex-wrap gap-4">
                  <span>Affinité élémentaire : <strong className="text-white">{selectedMudra.element}</strong></span>
                  <span>Règle CVAT : <strong className="text-white">Strictement mains (visage exclu)</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ABLATION BENCHMARK & CONFUSION MATRIX */}
      {activeTab === 'ablation' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" /> Étude d’Ablation des Augmentations de Données (Tableau 3.1 du Rapport)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Comparaison sur 20 époques pour isoler l'impact de chaque transformation, validant la configuration retenue pour le run final de 500 époques.
            </p>
          </div>

          {/* Ablation Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Configuration Testée</th>
                  <th className="py-2.5 px-3 text-cyan-300">mAP@50</th>
                  <th className="py-2.5 px-3 text-emerald-400">mAP@50-95</th>
                  <th className="py-2.5 px-3">Précision</th>
                  <th className="py-2.5 px-3">Rappel</th>
                  <th className="py-2.5 px-3 text-slate-400">Justification & Analyse R&D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ABLATION_DATA.map((row, idx) => {
                  const isFinal = idx === ABLATION_DATA.length - 1;
                  return (
                    <tr key={idx} className={isFinal ? 'bg-indigo-950/40 font-bold text-white' : 'hover:bg-slate-900/40'}>
                      <td className="py-2 px-3 whitespace-nowrap">{row.config}</td>
                      <td className="py-2 px-3 text-cyan-300 font-bold">{row.map50.toFixed(3)}</td>
                      <td className="py-2 px-3 text-emerald-400 font-bold">{row.map95.toFixed(3)}</td>
                      <td className="py-2 px-3">{row.p.toFixed(3)}</td>
                      <td className="py-2 px-3">{row.r.toFixed(3)}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Evaluation Graphs Preview Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="uppercase text-[10px] font-bold text-indigo-400">
                Artefacts Officiels Ultralytics (Preuves Mathématiques Anonymisées)
              </span>
              <span>Cliquez pour agrandir</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveCurveModal('/assets/naruto_yolo/results.png')}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-indigo-500/60 transition space-y-2"
              >
                <div className="aspect-[2/1] overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
                  <img
                    src="/assets/naruto_yolo/results.png"
                    alt="Courbes de convergence 500 époques"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-bold">Courbes de Perte & mAP</span>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  Décroissance de box_loss (0.31) et cls_loss (0.20) sans aucun sur-apprentissage sur 500 époques.
                </p>
              </div>

              <div
                onClick={() => setActiveCurveModal('/assets/naruto_yolo/confusion_matrix_normalized.png')}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-indigo-500/60 transition space-y-2"
              >
                <div className="aspect-[2/1] overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
                  <img
                    src="/assets/naruto_yolo/confusion_matrix_normalized.png"
                    alt="Matrice de confusion normalisée"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-bold">Matrice de Confusion (100%)</span>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  Diagonale à 1.00 sur 11/12 classes avec analyse critique sur la taille du set de validation.
                </p>
              </div>

              <div
                onClick={() => setActiveCurveModal('/assets/naruto_yolo/BoxPR_curve.png')}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-indigo-500/60 transition space-y-2"
              >
                <div className="aspect-[2/1] overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
                  <img
                    src="/assets/naruto_yolo/BoxPR_curve.png"
                    alt="Courbe Précision-Rappel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-bold">Courbe Précision-Rappel (PR)</span>
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  Aire sous la courbe mAP@50 = 0.995 sur l'ensemble des 12 signes astrologiques.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR HIGH-RESOLUTION GRAPH VIEW */}
      {activeCurveModal && (
        <div
          onClick={() => setActiveCurveModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-white">Visualisation Artefact d'Évaluation</span>
              <button
                onClick={() => setActiveCurveModal(null)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900"
              >
                Fermer ✕
              </button>
            </div>
            <img src={activeCurveModal} alt="Agrandissement graphique" className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
