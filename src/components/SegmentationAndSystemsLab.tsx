import React, { useState, useMemo } from 'react';
import { Scan, Binary, Terminal, Github, ExternalLink } from 'lucide-react';

const SEG_CASES = [
  {
    id: 'cat',
    title: 'Foreground Object Segmentation (`cat`)',
    desc: 'Comparison between color-only OpenCV K-Means, spatial-color K-Means (B, G, R, λx, λy), and non-parametric Mean-Shift clustering.',
    meanShiftColor: '/assets/segmentation/meanshift_cat_color.png',
    opencvMask: '/assets/segmentation/cat_opencv_mask.png',
    spatialMask: '/assets/segmentation/cat_kmeans_perso_mask.png',
    meanShiftMask: '/assets/segmentation/cat_meanshift_mask.png',
  },
  {
    id: 'HappyFish',
    title: 'Multi-Color Textured Subject (`HappyFish`)',
    desc: 'Mean-Shift preserves homogeneous spatial regions before Otsu thresholding, reducing high-frequency speckle in binary masks.',
    meanShiftColor: '/assets/segmentation/meanshift_HappyFish_color.png',
    opencvMask: '/assets/segmentation/HappyFish_opencv_mask.png',
    spatialMask: '/assets/segmentation/HappyFish_kmeans_perso_mask.png',
    meanShiftMask: '/assets/segmentation/HappyFish_meanshift_mask.png',
  },
  {
    id: 'texture8',
    title: 'Bipartite Texture Partitioning (`texture8`)',
    desc: 'Spatial-color feature weighting (λ=120) enforces spatial contiguity where pure BGR clustering fragments textured patterns.',
    meanShiftColor: '/assets/segmentation/meanshift_texture8_color.png',
    opencvMask: '/assets/segmentation/texture8_opencv_mask.png',
    spatialMask: '/assets/segmentation/texture8_kmeans_perso_mask.png',
    meanShiftMask: '/assets/segmentation/texture8_meanshift_mask.png',
  },
];

interface HuffNode {
  char?: string;
  freq: number;
  left?: HuffNode;
  right?: HuffNode;
}

function buildHuffman(text: string): { codes: Record<string, string>; bitLength: number; asciiBits: number } {
  const clean = text.slice(0, 64) || 'R&D';
  const freqs: Record<string, number> = {};
  for (const ch of clean) freqs[ch] = (freqs[ch] || 0) + 1;

  const nodes: HuffNode[] = Object.entries(freqs).map(([char, freq]) => ({ char, freq }));
  if (nodes.length === 1) {
    return {
      codes: { [nodes[0].char!]: '0' },
      bitLength: clean.length,
      asciiBits: clean.length * 8,
    };
  }

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ freq: left.freq + right.freq, left, right });
  }

  const codes: Record<string, string> = {};
  const traverse = (n: HuffNode | undefined, prefix: string) => {
    if (!n) return;
    if (n.char !== undefined) {
      codes[n.char] = prefix || '0';
      return;
    }
    traverse(n.left, prefix + '0');
    traverse(n.right, prefix + '1');
  };
  traverse(nodes[0], '');

  let bitLength = 0;
  for (const ch of clean) bitLength += codes[ch].length;
  return { codes, bitLength, asciiBits: clean.length * 8 };
}

const RAT_SNIPPETS = [
  {
    title: 'Pointers & Dynamic Allocation (`new` / `*p` / `&x`)',
    ratCode: `main {
  int * px = (new int);
  int y = 42;
  (*px) = (y + 8);
  px = &y;
  print (*px);
}`,
    astPass: `AstPlacement.Programme:
  ├─ DeclPtr(px: int*, addr=0[SB])
  ├─ Alloc(int, size=1) -> CALL MAlloc
  ├─ DeclVar(y: int, addr=1[SB], val=42)
  ├─ AssignDeref(px, BinOp(+, Val(y), 8))
  ├─ AssignAddr(px, &y -> LOADA 1[SB])
  └─ AffichageInt(Deref(px) -> LOAD 0[SB]; LOADI(1))`,
    tamAsm: `; --- RAT Compiler TAM Codegen ---
PUSH 1
LOADL 1
SUBR MAlloc
STORE (1) 0[SB]    ; px = new int
PUSH 1
LOADL 42
STORE (1) 1[SB]    ; int y = 42
LOAD (1) 1[SB]
LOADL 8
SUBR IAdd
LOAD (1) 0[SB]
STOREI (1)         ; (*px) = y + 8
LOADA 1[SB]
STORE (1) 0[SB]    ; px = &y
LOAD (1) 0[SB]
LOADI (1)
SUBR IOut          ; print (*px)`,
  },
  {
    title: 'Pass-by-Reference & Procedures (`void` / `ref`)',
    ratCode: `void swap (ref int a, ref int b) {
  int tmp = a;
  a = b;
  b = tmp;
}
main {
  int u = 10; int v = 20;
  swap (ref u, ref v);
}`,
    astPass: `AstType.Fonction(swap, ret=Void):
  ├─ ParamRef(a: int, offset=-2[LB])
  ├─ ParamRef(b: int, offset=-1[LB])
  └─ Body: indirect LOADI(1) / STOREI(1) via LB
Main:
  └─ AppelProc(swap, [Ref(u -> LOADA 0[SB]), Ref(v -> LOADA 1[SB])])`,
    tamAsm: `swap:
PUSH 1
LOAD (1) -2[LB]
LOADI (1)
STORE (1) 3[LB]    ; int tmp = a
LOAD (1) -1[LB]
LOADI (1)
LOAD (1) -2[LB]
STOREI (1)         ; a = b
LOAD (1) 3[LB]
LOAD (1) -1[LB]
STOREI (1)         ; b = tmp
RETURN (0) 2
main:
LOADA 0[SB]
LOADA 1[SB]
CALL (SB) swap`,
  },
];

export default function SegmentationAndSystemsLab() {
  const [segIdx, setSegIdx] = useState(0);
  const [huffInput, setHuffInput] = useState('DARK_CHANNEL_PRIOR_OPENMP');
  const [ratIdx, setRatIdx] = useState(0);

  const seg = SEG_CASES[segIdx];
  const huff = useMemo(() => buildHuffman(huffInput), [huffInput]);
  const rat = RAT_SNIPPETS[ratIdx];

  const compressionRatio = huff.asciiBits > 0 ? Math.round((1 - huff.bitLength / huff.asciiBits) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* 1. Segmentation Comparison Grid (Traitement_Image) */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 md:p-7 shadow-xl text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-full">
                <Scan className="w-3.5 h-3.5" /> C++17 / OpenCV Segmentation (`Traitement_Image`)
              </div>
              <a
                href="https://github.com/mhourde/Traitement_Image"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
              >
                <Github className="w-3.5 h-3.5 text-amber-400" />
                <span>mhourde/Traitement_Image</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
            <h3 className="text-xl font-bold text-white">
              Spatial-Color K-Means $(B, G, R, \lambda x, \lambda y)$ vs. Mean-Shift & Otsu Masks
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real outputs exported from the C++17 segmentation pipeline with automatic foreground/background Dice orientation.
            </p>
          </div>
          <div className="flex gap-2">
            {SEG_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSegIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer border transition ${
                  segIdx === idx
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 my-4">{seg.desc}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <img src={seg.meanShiftColor} alt="Mean-Shift Color" className="w-full aspect-square object-contain rounded bg-slate-900 mb-2" />
            <div className="text-xs font-mono font-semibold text-cyan-300">Mean-Shift Filtered</div>
            <div className="text-[10px] text-slate-400">Spatial-Color Window</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <img src={seg.opencvMask} alt="OpenCV K-Means Mask" className="w-full aspect-square object-contain rounded bg-slate-900 mb-2" />
            <div className="text-xs font-mono font-semibold text-slate-200">OpenCV K-Means</div>
            <div className="text-[10px] text-slate-400">Pure BGR Space (k=2)</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <img src={seg.spatialMask} alt="Custom Spatial K-Means" className="w-full aspect-square object-contain rounded bg-slate-900 mb-2" />
            <div className="text-xs font-mono font-semibold text-amber-300">Custom Spatial K-Means</div>
            <div className="text-[10px] text-slate-400">Feature (B,G,R, λx, λy)</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <img src={seg.meanShiftMask} alt="Mean-Shift + Otsu Mask" className="w-full aspect-square object-contain rounded bg-slate-900 mb-2" />
            <div className="text-xs font-mono font-semibold text-emerald-300">Mean-Shift + Otsu</div>
            <div className="text-[10px] text-slate-400">Binary Mask Evaluation</div>
          </div>
        </div>
      </div>

      {/* 2. Systems & Compilers Interactive Dual-Card: Ada Huffman + OCaml RAT Compiler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ada Bit-Level Huffman Encoder */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 shadow-xl text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
                <Binary className="w-3.5 h-3.5" /> Ada Systems (`ADA_huffman_compression`)
              </div>
              <a
                href="https://github.com/abelfares17/ADA_huffman_compression"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-emerald-300 hover:text-white transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repo</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
            <h4 className="text-lg font-bold text-white">Interactive `.hff` Bit-Stream Encoder</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Type any ASCII payload to inspect the greedy Huffman prefix table and bit-level `.hff` stream density:
            </p>

            <input
              type="text"
              value={huffInput}
              onChange={(e) => setHuffInput(e.target.value)}
              placeholder="Enter text to compress..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 mb-4"
            />

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              {Object.entries(huff.codes).map(([ch, code]) => (
                <div key={ch} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono flex items-center gap-1.5">
                  <span className="text-amber-300 font-bold">'{ch === ' ' ? '␣' : ch}'</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-800 text-center font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Raw ASCII</div>
              <div className="text-sm font-bold text-slate-200">{huff.asciiBits} bits</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Huffman Payload</div>
              <div className="text-sm font-bold text-emerald-400">{huff.bitLength} bits</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400">Bit Savings</div>
              <div className="text-sm font-bold text-cyan-300">{compressionRatio}%</div>
            </div>
          </div>
        </div>

        {/* OCaml RAT Multi-Pass Compiler Explorer */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/75 backdrop-blur-md p-5 shadow-xl text-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full">
                  <Terminal className="w-3.5 h-3.5" /> OCaml Compiler (`TDL` — RAT to TAM)
                </div>
                <a
                  href="https://github.com/abelfares17/TDL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-indigo-300 hover:text-white transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repo</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
              <div className="flex gap-1">
                {RAT_SNIPPETS.map((s, idx) => (
                  <button
                    key={s.title}
                    onClick={() => setRatIdx(idx)}
                    className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer border ${
                      ratIdx === idx
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Pass #{idx + 1}
                  </button>
                ))}
              </div>
            </div>
            <h4 className="text-lg font-bold text-white">{rat.title}</h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              Multi-pass AST typing, memory offset placement (`SB`/`LB`), and TAM stack-machine code generation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="text-[10px] uppercase text-amber-400 mb-1.5">RAT Source + Placement AST</div>
                <pre className="text-slate-200 leading-relaxed">{rat.ratCode}</pre>
                <div className="mt-2 pt-2 border-t border-slate-800 text-slate-400 whitespace-pre-wrap">
                  {rat.astPass}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                <div className="text-[10px] uppercase text-cyan-400 mb-1.5">Generated TAM Assembly</div>
                <pre className="text-cyan-300 leading-relaxed">{rat.tamAsm}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
