import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PROFILE, PROOF_METRICS } from '../data/portfolioData';
import { PortraitImage } from './PortraitImage';
import {
  PoseSkeleton3D,
  type JointTelemetry,
  type PoseExerciseMode,
} from './three/PoseSkeleton3D';

type HeroPreviewMode = 'vision' | 'defi' | 'analytics';

interface HeroSectionProps {
  onSelectLabTab: (tab: 'analytics' | 'defi' | 'responsive') => void;
}

export function HeroSection({ onSelectLabTab }: HeroSectionProps) {
  const [previewMode, setPreviewMode] = useState<HeroPreviewMode>('vision');
  const [poseMode, setPoseMode] = useState<PoseExerciseMode>('squat');
  const [jointTelemetry, setJointTelemetry] = useState<JointTelemetry>({
    id: 'lElbow',
    label: 'Left Elbow',
    angleDeg: 92,
    confidence: '0.97',
    vector: '(-0.29, 1.29, 0.20)',
  });
  const [curveX, setCurveX] = useState<number>(120);

  // Constant-product curve sample for hero DeFi preview (k = 14400)
  const kConst = 14400;
  const reserveY = Math.round(kConst / curveX);
  const marginalPrice = (reserveY / curveX).toFixed(2);

  const jumpToLab = (tab: 'analytics' | 'defi' | 'responsive') => {
    onSelectLabTab(tab);
    const el = document.getElementById('lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="rainbow-surface border-b border-slate-200/80">
      <div className="relative z-[1] mx-auto max-w-7xl px-5 pt-12 pb-14 sm:px-8 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Typographic Column */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <PortraitImage compact className="h-full w-full" />
                </div>
                <div>
                  <p className="font-display text-base font-bold text-slate-950">
                    {PROFILE.name}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">
                    <span>{PROFILE.location}</span>
                    <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                    <span>Web, Mobile, Web3 &amp; AI</span>
                  </p>
                </div>
              </div>

              <h1
                className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.04]"
                style={{ textWrap: 'balance' }}
              >
                Cross-Platform Systems, DeFi Protocols &amp; Predictive AI.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                I am <strong className="font-semibold text-slate-900">{PROFILE.name}</strong>, a
                software developer building responsive web and Flutter mobile applications,
                Solidity decentralized finance architectures, and machine-learning analytics
                dashboards engineered for real-world reliability.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0E7490] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#0B5F76] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
                >
                  <span>Inspect Selected Work</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() => jumpToLab('analytics')}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-slate-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
                >
                  <span>Interactive Sandboxes</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span>
                    <span className="font-semibold text-slate-900">Primary Stack:</span>{' '}
                    Flutter · React · Next.js · TypeScript
                  </span>
                  <span>
                    <span className="font-semibold text-slate-900">Emerging Tech:</span>{' '}
                    Solidity · Hardhat · MediaPipe · FastAPI
                  </span>
                </div>
                <a
                  href={PROFILE.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#0E7490] whitespace-nowrap hover:underline"
                >
                  <span>View CV (PDF)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Interactive Architectural Canvas */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-[#11161C] p-5 text-slate-100">
              {/* Segmented Preview Switcher */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  Interactive Blueprint
                </span>
                <div
                  role="tablist"
                  aria-label="Hero technical preview switcher"
                  className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800"
                >
                  {(
                    [
                      { id: 'vision', label: 'AI Vision' },
                      { id: 'defi', label: 'DeFi AMM' },
                      { id: 'analytics', label: 'Forecast' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={previewMode === tab.id}
                      type="button"
                      onClick={() => setPreviewMode(tab.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                        previewMode === tab.id
                          ? 'bg-[#0E7490] text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Stage */}
              <div className="my-4 flex-1 flex flex-col justify-center">
                {previewMode === 'vision' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-7">
                      <PoseSkeleton3D
                        mode={poseMode}
                        selectedJointId={jointTelemetry.id}
                        onSelectJoint={setJointTelemetry}
                      />
                    </div>

                    <div className="sm:col-span-5 flex flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-cyan-300">
                          ROCKHAI 3D Pose Rig
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-white">
                          {jointTelemetry.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          Move cursor to tilt skeleton or click any 3D joint sphere to inspect.
                        </p>
                      </div>

                      <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
                        {(
                          [
                            { id: 'squat', label: 'Squat' },
                            { id: 'arm-raise', label: 'Arm Raise' },
                          ] as const
                        ).map((ex) => (
                          <button
                            key={ex.id}
                            type="button"
                            onClick={() => setPoseMode(ex.id)}
                            className={`flex-1 rounded-md px-2 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                              poseMode === ex.id
                                ? 'bg-[#0E7490] text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {ex.label}
                          </button>
                        ))}
                      </div>

                      <dl className="space-y-2 border-t border-slate-800 pt-3 font-mono text-xs tabular-nums">
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Live Angle</dt>
                          <dd className="font-semibold text-white">
                            {jointTelemetry.angleDeg}°
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-slate-400">Confidence</dt>
                          <dd className="font-semibold text-cyan-300">
                            {jointTelemetry.confidence}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-slate-400 shrink-0">XYZ</dt>
                          <dd className="truncate text-slate-200">{jointTelemetry.vector}</dd>
                        </div>
                      </dl>

                      <button
                        type="button"
                        onClick={() => jumpToLab('responsive')}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
                      >
                        Open Posture Simulator
                      </button>
                    </div>
                  </div>
                )}

                {previewMode === 'defi' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-[#0F192D] p-4">
                      <svg
                        viewBox="0 0 320 180"
                        className="h-44 w-full"
                        role="img"
                        aria-label="Constant product AMM bonding curve preview"
                      >
                        <line x1="30" y1="155" x2="305" y2="155" stroke="#334155" strokeWidth="1" />
                        <line x1="30" y1="15" x2="30" y2="155" stroke="#334155" strokeWidth="1" />
                        <path
                          d="M 48 24 Q 105 112 292 142"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="2.5"
                        />
                        {(() => {
                          const t = (curveX - 60) / 180;
                          const px = 55 + t * 220;
                          const py = 32 + Math.pow(t, 0.55) * 106;
                          return (
                            <g>
                              <line
                                x1={px}
                                y1={py}
                                x2={px}
                                y2="155"
                                stroke="#64748B"
                                strokeDasharray="3 3"
                              />
                              <line
                                x1="30"
                                y1={py}
                                x2={px}
                                y2={py}
                                stroke="#64748B"
                                strokeDasharray="3 3"
                              />
                              <circle cx={px} cy={py} r="6" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="2" />
                            </g>
                          );
                        })()}
                        <text x="240" y="170" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          Reserve X
                        </text>
                        <text x="36" y="24" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          Reserve Y
                        </text>
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor="hero-amm-slider" className="text-slate-300">
                          Adjust Pool Reserve X
                        </label>
                        <span className="font-mono text-cyan-300 tabular-nums">
                          {curveX} ETH / {reserveY}k USDC
                        </span>
                      </div>
                      <input
                        id="hero-amm-slider"
                        type="range"
                        min={60}
                        max={240}
                        value={curveX}
                        onChange={(e) => setCurveX(Number(e.target.value))}
                        className="w-full accent-[#22D3EE] cursor-pointer"
                      />
                      <div className="flex items-center justify-between pt-1 text-xs font-mono tabular-nums text-slate-400">
                        <span>Spot Price: ${marginalPrice}k</span>
                        <button
                          type="button"
                          onClick={() => jumpToLab('defi')}
                          className="font-sans font-semibold text-cyan-300 hover:underline"
                        >
                          Simulate Swap in Lab →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {previewMode === 'analytics' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-[#0F192D] p-4">
                      <svg
                        viewBox="0 0 320 180"
                        className="h-44 w-full"
                        role="img"
                        aria-label="Predictive demand forecast chart preview"
                      >
                        <line x1="25" y1="150" x2="305" y2="150" stroke="#334155" strokeWidth="1" />
                        <line x1="25" y1="30" x2="305" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                        <line x1="25" y1="90" x2="305" y2="90" stroke="#1E293B" strokeDasharray="3 3" />
                        <polygon
                          points="180,76 225,52 265,36 300,22 300,66 265,74 225,84 180,96"
                          fill="rgba(34, 211, 238, 0.14)"
                        />
                        <polyline
                          points="30,136 68,124 106,129 144,104 180,86"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <polyline
                          points="180,86 225,68 265,55 300,44"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="2.5"
                          strokeDasharray="5 4"
                          strokeLinecap="round"
                        />
                        <circle cx="180" cy="86" r="4.5" fill="#22D3EE" />
                        <text x="166" y="168" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          Now
                        </text>
                        <text x="262" y="168" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          +90d
                        </text>
                      </svg>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono tabular-nums text-slate-300">
                        SMARTBUZ Forecast · MAPE 4.2%
                      </span>
                      <button
                        type="button"
                        onClick={() => jumpToLab('analytics')}
                        className="font-semibold text-cyan-300 hover:underline"
                      >
                        Inspect Full Dashboard →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                <span>BSc IT · Uganda Christian University</span>
                <span className="font-mono tabular-nums text-slate-300">CGPA 3.70</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="mt-12 grid grid-cols-1 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/85 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {PROOF_METRICS.map((item) => (
            <div key={item.label} className="p-6">
              <div className="font-display text-3xl font-extrabold tracking-tight text-slate-950 tabular-nums">
                {item.value}
              </div>
              <div className="mt-1.5 text-sm font-semibold text-slate-900">{item.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
