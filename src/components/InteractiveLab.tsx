import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { FORECAST_DATASETS, type ForecastDataset } from '../data/portfolioData';

export type LabTabId = 'analytics' | 'defi' | 'responsive';

interface InteractiveLabProps {
  activeTab: LabTabId;
  onTabChange: (tab: LabTabId) => void;
}

interface SimulatedTx {
  hash: string;
  pair: string;
  input: string;
  output: string;
  impact: string;
  gas: string;
}

const SOLIDITY_SNIPPET = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ConstantProductPool is ReentrancyGuard {
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public constant FEE_BPS = 30; // 0.30%

    error SlippageExceeded(uint256 received, uint256 minOut);

    function getAmountOut(
        uint256 amountIn,
        uint256 resIn,
        uint256 resOut
    ) public pure returns (uint256) {
        uint256 amountInWithFee = amountIn * (10_000 - FEE_BPS);
        return (amountInWithFee * resOut) / (resIn * 10_000 + amountInWithFee);
    }

    function swapAForB(uint256 amountIn, uint256 minOut)
        external
        nonReentrant
        returns (uint256 amountOut)
    {
        amountOut = getAmountOut(amountIn, reserveA, reserveB);
        if (amountOut < minOut) revert SlippageExceeded(amountOut, minOut);
        reserveA += amountIn;
        reserveB -= amountOut;
    }
}`;

export function InteractiveLab({ activeTab, onTabChange }: InteractiveLabProps) {
  return (
    <section
      id="lab"
      className="border-b border-slate-200 bg-[#11161C] py-16 text-slate-100 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-cyan-300">
              Interactive Sandboxes · Simulated Sample Data
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Architecture sandboxes for ML forecasting, DeFi math &amp; responsive UI
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-400">
              Client-side technical demonstrations using simulated sample datasets to illustrate
              time-series confidence bands, constant-product AMM swaps, and adaptive mobile-money
              POS &amp; pose geometry.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Engineering Lab Domains"
            className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 self-start"
          >
            {(
              [
                { id: 'analytics', label: 'ML Predictive Analytics' },
                { id: 'defi', label: 'Web3 & DeFi Simulator' },
                { id: 'responsive', label: 'Cross-Platform & Vision' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                  activeTab === tab.id
                    ? 'bg-[#0E7490] text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {activeTab === 'analytics' && <PredictiveAnalyticsLab />}
          {activeTab === 'defi' && <DefiProtocolLab />}
          {activeTab === 'responsive' && <ResponsiveAndVisionLab />}
        </div>
      </div>
    </section>
  );
}

function PredictiveAnalyticsLab() {
  const [datasetId, setDatasetId] = useState<ForecastDataset['id']>('retail');
  const [confidenceLevel, setConfidenceLevel] = useState<'80' | '95'>('95');
  const [horizonWeeks, setHorizonWeeks] = useState<2 | 4>(4);
  const [hoveredIdx, setHoveredIdx] = useState<number>(8);

  const dataset = FORECAST_DATASETS.find((d) => d.id === datasetId) ?? FORECAST_DATASETS[0];
  const visiblePoints = useMemo(() => {
    const baseCount = 8 + horizonWeeks;
    return dataset.points.slice(0, baseCount);
  }, [dataset, horizonWeeks]);

  const safeIdx = Math.min(hoveredIdx, visiblePoints.length - 1);
  const activePoint = visiblePoints[safeIdx];

  const chartBounds = useMemo(() => {
    let minVal = Infinity;
    let maxVal = -Infinity;
    visiblePoints.forEach((pt) => {
      const band = confidenceLevel === '95' ? pt.band95 : pt.band80;
      const low = Math.min(pt.actual ?? pt.predicted, pt.predicted - band);
      const high = Math.max(pt.actual ?? pt.predicted, pt.predicted + band);
      if (low < minVal) minVal = low;
      if (high > maxVal) maxVal = high;
    });
    const pad = (maxVal - minVal) * 0.14;
    return { min: minVal - pad, max: maxVal + pad };
  }, [visiblePoints, confidenceLevel]);

  const svgW = 760;
  const svgH = 290;
  const padL = 56;
  const padR = 24;
  const padT = 22;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const getX = (idx: number) =>
    padL + (idx / Math.max(visiblePoints.length - 1, 1)) * plotW;
  const getY = (val: number) =>
    padT + ((chartBounds.max - val) / Math.max(chartBounds.max - chartBounds.min, 1)) * plotH;

  const actualPts = visiblePoints
    .map((pt, i) => (pt.actual !== null ? `${getX(i)},${getY(pt.actual)}` : null))
    .filter(Boolean)
    .join(' ');

  const predictedPts = visiblePoints
    .map((pt, i) => `${getX(i)},${getY(pt.predicted)}`)
    .join(' ');

  const bandPolygon = (() => {
    const upper = visiblePoints.map((pt, i) => {
      const b = confidenceLevel === '95' ? pt.band95 : pt.band80;
      return `${getX(i)},${getY(pt.predicted + b)}`;
    });
    const lower = [...visiblePoints]
      .reverse()
      .map((pt, revIdx) => {
        const i = visiblePoints.length - 1 - revIdx;
        const b = confidenceLevel === '95' ? pt.band95 : pt.band80;
        return `${getX(i)},${getY(pt.predicted - b)}`;
      });
    return [...upper, ...lower].join(' ');
  })();

  const handleDownloadCsv = () => {
    const header = 'Period,Actual,Predicted,ConfidenceBand\n';
    const rows = visiblePoints
      .map((pt) => {
        const band = confidenceLevel === '95' ? pt.band95 : pt.band80;
        return `${pt.label},${pt.actual ?? ''},${pt.predicted},+/-${band}`;
      })
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.id}-forecast-${confidenceLevel}pct.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 sm:p-7">
      {/* Controls Row */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {FORECAST_DATASETS.map((ds) => (
            <button
              key={ds.id}
              type="button"
              onClick={() => setDatasetId(ds.id)}
              className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                datasetId === ds.id
                  ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-200'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              {ds.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
            {(['80', '95'] as const).map((ci) => (
              <button
                key={ci}
                type="button"
                onClick={() => setConfidenceLevel(ci)}
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  confidenceLevel === ci
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ci}% CI
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
            {([2, 4] as const).map((wks) => (
              <button
                key={wks}
                type="button"
                onClick={() => setHorizonWeeks(wks)}
                className={`rounded-md px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  horizonWeeks === wks
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                +{wks}w Horizon
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 whitespace-nowrap hover:border-cyan-400/60 hover:text-cyan-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-b border-slate-800 pb-6 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-400">Active Model</p>
          <p className="mt-1 text-sm font-semibold text-white">{dataset.modelName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Projected Lift</p>
          <p className="mt-1 font-mono text-lg font-bold text-cyan-300 tabular-nums">
            {dataset.projectedLift}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Validation MAPE / RMSE</p>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-100 tabular-nums">
            {dataset.mape} · {dataset.rmse}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Detected Anomalies</p>
          <p className="mt-1 font-mono text-sm font-semibold text-amber-300 tabular-nums">
            {dataset.anomalyCount} {dataset.anomalyCount === 1 ? 'Flagged Interval' : 'Flagged Intervals'}
          </p>
        </div>
      </div>

      {/* Main Chart + Point Inspector */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-[#11161C] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Hover or click data points to inspect {dataset.unit} actual vs. ML prediction
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span className="inline-block h-0.5 w-4 bg-slate-100" /> Actual
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-cyan-400" /> Forecast
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="inline-block h-2.5 w-2.5 bg-cyan-400/20 border border-cyan-400/40" /> {confidenceLevel}% Band
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full h-auto overflow-visible"
            role="img"
            aria-label={`${dataset.label} predictive analytics chart`}
          >
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = padT + t * plotH;
              const val = chartBounds.max - t * (chartBounds.max - chartBounds.min);
              return (
                <g key={t}>
                  <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="#1E293B" strokeWidth="1" />
                  <text
                    x={padL - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#94A3B8"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {val >= 100 ? Math.round(val) : val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Forecast cutoff vertical guide */}
            <line
              x1={getX(7)}
              y1={padT}
              x2={getX(7)}
              y2={svgH - padB}
              stroke="#334155"
              strokeDasharray="4 4"
            />

            {/* Confidence Interval Polygon */}
            <polygon points={bandPolygon} fill="rgba(34, 211, 238, 0.14)" />

            {/* Predicted Line */}
            <polyline
              points={predictedPts}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />

            {/* Actual Line */}
            <polyline
              points={actualPts}
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Nodes */}
            {visiblePoints.map((pt, i) => {
              const x = getX(i);
              const yPred = getY(pt.predicted);
              const yAct = pt.actual !== null ? getY(pt.actual) : null;
              const isSelected = i === safeIdx;
              return (
                <g
                  key={pt.label}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onClick={() => setHoveredIdx(i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x - 20}
                    y={padT}
                    width="40"
                    height={plotH}
                    fill="transparent"
                  />
                  {isSelected && (
                    <line
                      x1={x}
                      y1={padT}
                      x2={x}
                      y2={svgH - padB}
                      stroke="#22D3EE"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={yPred}
                    r={isSelected ? 5.5 : 3.5}
                    fill={isSelected ? '#22D3EE' : '#0F172A'}
                    stroke="#22D3EE"
                    strokeWidth="2"
                  />
                  {yAct !== null && (
                    <circle
                      cx={x}
                      cy={yAct}
                      r={isSelected ? 5.5 : 3.5}
                      fill={pt.note ? '#F59E0B' : '#F8FAFC'}
                      stroke="#11161C"
                      strokeWidth="1.5"
                    />
                  )}
                  <text
                    x={x}
                    y={svgH - 10}
                    textAnchor="middle"
                    fill={isSelected ? '#22D3EE' : '#94A3B8'}
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {pt.label.replace(' (Now)', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Period Readout & Forecast Table */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#11161C] p-5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-cyan-300">Selected Interval</span>
              <span className="font-mono text-sm font-bold text-white tabular-nums">
                {activePoint.label}
              </span>
            </div>

            <dl className="mt-4 space-y-3 font-mono text-sm tabular-nums">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <dt className="font-sans text-xs text-slate-400">Observed Actual</dt>
                <dd className="font-semibold text-white">
                  {activePoint.actual !== null
                    ? `${dataset.prefix}${activePoint.actual} ${dataset.unit}`
                    : 'Forecast Window'}
                </dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <dt className="font-sans text-xs text-slate-400">ML Prediction</dt>
                <dd className="font-semibold text-cyan-300">
                  {dataset.prefix}
                  {activePoint.predicted} {dataset.unit}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-sans text-xs text-slate-400">{confidenceLevel}% Confidence Bounds</dt>
                <dd className="text-slate-200">
                  ±{confidenceLevel === '95' ? activePoint.band95 : activePoint.band80}
                </dd>
              </div>
            </dl>

            {activePoint.note && (
              <p className="mt-4 border-t border-slate-800 pt-3 text-xs text-amber-300">
                Anomaly Note: {activePoint.note}
              </p>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#11161C]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Window</th>
                  <th className="px-4 py-2.5 font-medium text-right">Predicted</th>
                  <th className="px-4 py-2.5 font-medium text-right">Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
                {visiblePoints.slice(-4).map((row) => {
                  const band = confidenceLevel === '95' ? row.band95 : row.band80;
                  return (
                    <tr key={row.label} className="hover:bg-slate-900/60">
                      <td className="px-4 py-2 text-slate-200">{row.label}</td>
                      <td className="px-4 py-2 text-right text-cyan-300">{row.predicted}</td>
                      <td className="px-4 py-2 text-right text-slate-400">±{band}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DefiProtocolLab() {
  const [poolPair, setPoolPair] = useState<'ETH_USDC' | 'cUGX_USDC'>('ETH_USDC');
  const [reverseDirection, setReverseDirection] = useState(false);
  const [amountInStr, setAmountInStr] = useState('2.5');
  const [slippagePct, setSlippagePct] = useState<0.5 | 1 | 2.5>(1);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initial constant product pool reserves
  const poolConfig =
    poolPair === 'ETH_USDC'
      ? { tokenA: 'ETH', tokenB: 'USDC', resA: 48, resB: 153600 }
      : { tokenA: 'cUGX', tokenB: 'USDC', resA: 370000000, resB: 100000 };

  const [txLog, setTxLog] = useState<SimulatedTx[]>([
    {
      hash: '0x7a9c...3f18',
      pair: 'ETH -> USDC',
      input: '1.25 ETH',
      output: '3,886.42 USDC',
      impact: '2.54%',
      gas: '94,210',
    },
  ]);

  const tokenIn = reverseDirection ? poolConfig.tokenB : poolConfig.tokenA;
  const tokenOut = reverseDirection ? poolConfig.tokenA : poolConfig.tokenB;
  const resIn = reverseDirection ? poolConfig.resB : poolConfig.resA;
  const resOut = reverseDirection ? poolConfig.resA : poolConfig.resB;

  const parsedIn = Math.max(0, Number(amountInStr) || 0);
  const feeBps = 0.003;
  const amountInAfterFee = parsedIn * (1 - feeBps);
  const amountOut = parsedIn > 0 ? (amountInAfterFee * resOut) / (resIn + amountInAfterFee) : 0;

  const spotPrice = resOut / resIn;
  const effectivePrice = parsedIn > 0 ? amountOut / parsedIn : spotPrice;
  const priceImpactPct =
    parsedIn > 0 ? Math.max(0, ((spotPrice - effectivePrice) / spotPrice) * 100) : 0;
  const slippageRevert = priceImpactPct > slippagePct;

  const formatNum = (val: number, maxDec = 4) =>
    val.toLocaleString('en-US', { maximumFractionDigits: maxDec });

  const handleSimulateSwap = () => {
    if (parsedIn <= 0 || slippageRevert) return;
    const randomHex = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newTx: SimulatedTx = {
      hash: `0x${randomHex}...e8a2`,
      pair: `${tokenIn} -> ${tokenOut}`,
      input: `${formatNum(parsedIn, 2)} ${tokenIn}`,
      output: `${formatNum(amountOut, 2)} ${tokenOut}`,
      impact: `${priceImpactPct.toFixed(2)}%`,
      gas: '96,480',
    };
    setTxLog((prev) => [newTx, ...prev].slice(0, 4));
  };

  const handleCopySolidity = async () => {
    try {
      await navigator.clipboard.writeText(SOLIDITY_SNIPPET);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setCopiedCode(false);
    }
  };

  // Curve coordinates for visualization
  const ratioShift = Math.min(0.85, parsedIn / (resIn * 0.6));
  const x0 = 135;
  const y0 = 92;
  const x1 = reverseDirection ? x0 - ratioShift * 55 : x0 + ratioShift * 110;
  const y1 = (x0 * y0) / Math.max(x1, 45);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Interactive Swap & AMM Curve */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              {(
                [
                  { id: 'ETH_USDC', label: 'ETH / USDC Pool' },
                  { id: 'cUGX_USDC', label: 'cUGX / USDC Pool' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPoolPair(p.id);
                    setAmountInStr(p.id === 'ETH_USDC' ? '2.5' : '5000000');
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    poolPair === p.id
                      ? 'bg-[#0E7490] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setReverseDirection((d) => !d)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-cyan-400/60"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-300" />
              <span>Flip Pair</span>
            </button>
          </div>

          {/* Swap Inputs */}
          <div className="rounded-xl border border-slate-800 bg-[#11161C] p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label htmlFor="swap-amount-input">Input Amount ({tokenIn})</label>
                <span className="font-mono tabular-nums">
                  Pool Reserve: {formatNum(resIn, 0)} {tokenIn}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5">
                <input
                  id="swap-amount-input"
                  type="number"
                  min="0"
                  step="any"
                  value={amountInStr}
                  onChange={(e) => setAmountInStr(e.target.value)}
                  className="w-full bg-transparent font-mono text-lg font-semibold text-white tabular-nums focus:outline-none"
                />
                <span className="font-mono text-sm font-bold text-cyan-300">{tokenIn}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-xs text-slate-400">Estimated Output ({tokenOut})</span>
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {formatNum(amountOut, 4)} {tokenOut}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-3 font-mono text-xs tabular-nums">
              <div>
                <span className="block font-sans text-slate-400">LP Fee (0.30%)</span>
                <span className="mt-0.5 block text-slate-200">
                  {formatNum(parsedIn * feeBps, 4)} {tokenIn}
                </span>
              </div>
              <div>
                <span className="block font-sans text-slate-400">Price Impact</span>
                <span
                  className={`mt-0.5 block font-semibold ${
                    slippageRevert ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                >
                  {priceImpactPct.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="block font-sans text-slate-400">Guard Status</span>
                <span
                  className={`mt-0.5 block font-semibold ${
                    slippageRevert ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {slippageRevert ? 'Reverts: Slippage' : 'Pass'}
                </span>
              </div>
            </div>
          </div>

          {/* Slippage Control & Execute */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Slippage:</span>
              {([0.5, 1, 2.5] as const).map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setSlippagePct(pct)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs tabular-nums ${
                    slippagePct === pct
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={parsedIn <= 0 || slippageRevert}
              onClick={handleSimulateSwap}
              className="min-h-[40px] rounded-lg bg-[#0E7490] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#0B5F76] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
            >
              Simulate Hardhat Swap
            </button>
          </div>

          {/* Bonding Curve Visualization */}
          <div className="rounded-xl border border-slate-800 bg-[#11161C] p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>AMM Invariant Curve (x * y = k)</span>
              <span className="font-mono text-slate-300">Pre-Swap ○ → Post-Swap ●</span>
            </div>
            <svg viewBox="0 0 340 165" className="h-36 w-full" role="img" aria-label="AMM bonding curve">
              <line x1="30" y1="145" x2="320" y2="145" stroke="#334155" strokeWidth="1" />
              <line x1="30" y1="15" x2="30" y2="145" stroke="#334155" strokeWidth="1" />
              <path
                d="M 55 22 Q 115 104 302 132"
                fill="none"
                stroke="#0E7490"
                strokeWidth="2.5"
              />
              <circle cx={x0} cy={y0} r="5" fill="#11161C" stroke="#94A3B8" strokeWidth="2" />
              <line
                x1={x0}
                y1={y0}
                x2={x1}
                y2={Math.min(136, Math.max(22, y1))}
                stroke="#22D3EE"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              <circle
                cx={x1}
                cy={Math.min(136, Math.max(22, y1))}
                r="6"
                fill="#22D3EE"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Right: Solidity Contract & Execution Ledger */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-5">
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#11161C]">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
              <span className="font-mono text-xs font-medium text-slate-300">
                ConstantProductPool.sol
              </span>
              <button
                type="button"
                onClick={handleCopySolidity}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Solidity</span>
                  </>
                )}
              </button>
            </div>
            <pre className="max-h-72 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
              <code>{SOLIDITY_SNIPPET}</code>
            </pre>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#11161C]">
            <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-medium text-slate-300">
              Local Hardhat Execution Log
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Tx Hash</th>
                  <th className="px-3 py-2 font-medium">Route</th>
                  <th className="px-3 py-2 font-medium text-right">Output</th>
                  <th className="px-3 py-2 font-medium text-right">Gas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
                {txLog.map((tx, idx) => (
                  <tr key={`${tx.hash}-${idx}`} className="hover:bg-slate-900/50">
                    <td className="px-3 py-2 text-cyan-300">{tx.hash}</td>
                    <td className="px-3 py-2 font-sans text-slate-200">{tx.pair}</td>
                    <td className="px-3 py-2 text-right text-white">{tx.output}</td>
                    <td className="px-3 py-2 text-right text-slate-400">{tx.gas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponsiveAndVisionLab() {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('tablet');
  const [posLang, setPosLang] = useState<'en' | 'lg' | 'nyn'>('en');
  const [payMethod, setPayMethod] = useState<'momo' | 'airtel'>('momo');
  const [cartQty, setCartQty] = useState<{ rice: number; oil: number }>({ rice: 2, oil: 1 });

  const [elbowAngle, setElbowAngle] = useState(92);
  const [kneeAngle, setKneeAngle] = useState(145);
  const [poseLang, setPoseLang] = useState<'en' | 'fr' | 'sw'>('en');

  const posCopy = {
    en: {
      heading: 'SMARTBUZ Register',
      rice: 'Super Rice (5kg)',
      oil: 'Cooking Oil (2L)',
      collect: 'Collect Payment',
      receipt: 'SMS receipt ready in English',
    },
    lg: {
      heading: 'SMARTBUZ Akaduuka',
      rice: 'Omuceere (5kg)',
      oil: 'Butto (2L)',
      collect: 'Sasula Kati',
      receipt: 'Obubaka bwa SMS mu Luganda',
    },
    nyn: {
      heading: 'SMARTBUZ Ebyobushuubuzi',
      rice: 'Omuceeri (5kg)',
      oil: 'Amajuta (2L)',
      collect: 'Shashura Hati',
      receipt: 'SMS omu Runyankore etebeekanisiibwe',
    },
  }[posLang];

  const totalUgx = cartQty.rice * 24000 + cartQty.oil * 18500;

  // Dynamic biomechanical coordinates from sliders
  const elbowRad = ((180 - elbowAngle) * Math.PI) / 180;
  const wristX = Math.round(78 + Math.cos(elbowRad) * 52);
  const wristY = Math.round(165 + Math.sin(elbowRad) * 52);

  const kneeRad = ((180 - kneeAngle) * Math.PI) / 180;
  const kneeX = Math.round(122 - Math.sin(kneeRad) * 28);
  const kneeY = Math.round(230 + Math.cos(kneeRad) * 68);
  const ankleX = Math.round(kneeX + 6);
  const ankleY = Math.round(kneeY + 62);

  const formOk = elbowAngle >= 80 && elbowAngle <= 120 && kneeAngle >= 125;
  const feedbackText = {
    en: formOk
      ? 'Aligned posture: shoulder and elbow torque within safe range.'
      : 'Form adjustment: stabilize elbow between 80° and 120° and extend knee.',
    fr: formOk
      ? 'Posture alignée : couple épaule et coude dans la plage optimale.'
      : 'Correction : stabilisez le coude entre 80° et 120° et redressez le genou.',
    sw: formOk
      ? 'Mkao sahihi: kiwiko na goti viko katika uwiano salama.'
      : 'Rekebisha mkao: weka kiwiko kati ya 80° na 120° na nyoosha goti.',
  }[poseLang];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Cross-Platform Adaptive Viewport Demo */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Adaptive Layout &amp; Mobile Money POS
              </h3>
              <p className="text-xs text-slate-400">
                Switch viewport breakpoints and localized SMS dialects in real time.
              </p>
            </div>

            <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
              {(
                [
                  { id: 'mobile', label: '375px', icon: Smartphone },
                  { id: 'tablet', label: '768px', icon: Tablet },
                  { id: 'desktop', label: '1280px', icon: Monitor },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setViewport(id)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    viewport === id
                      ? 'bg-[#0E7490] text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center rounded-xl border border-slate-800 bg-[#0B1220] p-4 sm:p-6">
            <div
              className={`w-full rounded-xl border border-slate-700 bg-slate-900 p-4 transition-all duration-200 ${
                viewport === 'mobile'
                  ? 'max-w-[300px]'
                  : viewport === 'tablet'
                  ? 'max-w-[480px]'
                  : 'max-w-full'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <span className="font-display text-sm font-bold text-white">
                  {posCopy.heading}
                </span>
                <div className="inline-flex rounded-md border border-slate-700 bg-slate-950 p-0.5 text-[11px]">
                  {(
                    [
                      { id: 'en', label: 'EN' },
                      { id: 'lg', label: 'LG' },
                      { id: 'nyn', label: 'NYN' },
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setPosLang(lang.id)}
                      className={`rounded px-2 py-0.5 font-mono ${
                        posLang === lang.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`mt-4 grid gap-3 ${
                  viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{posCopy.rice}</p>
                    <p className="font-mono text-xs text-slate-400 tabular-nums">UGX 24,000</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setCartQty((c) => ({ ...c, rice: Math.max(0, c.rice - 1) }))
                      }
                      className="h-7 w-7 rounded border border-slate-700 text-slate-200 hover:bg-slate-800"
                      aria-label="Decrease rice quantity"
                    >
                      -
                    </button>
                    <span className="w-4 text-center tabular-nums text-white">{cartQty.rice}</span>
                    <button
                      type="button"
                      onClick={() => setCartQty((c) => ({ ...c, rice: c.rice + 1 }))}
                      className="h-7 w-7 rounded border border-slate-700 text-slate-200 hover:bg-slate-800"
                      aria-label="Increase rice quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{posCopy.oil}</p>
                    <p className="font-mono text-xs text-slate-400 tabular-nums">UGX 18,500</p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setCartQty((c) => ({ ...c, oil: Math.max(0, c.oil - 1) }))
                      }
                      className="h-7 w-7 rounded border border-slate-700 text-slate-200 hover:bg-slate-800"
                      aria-label="Decrease cooking oil quantity"
                    >
                      -
                    </button>
                    <span className="w-4 text-center tabular-nums text-white">{cartQty.oil}</span>
                    <button
                      type="button"
                      onClick={() => setCartQty((c) => ({ ...c, oil: c.oil + 1 }))}
                      className="h-7 w-7 rounded border border-slate-700 text-slate-200 hover:bg-slate-800"
                      aria-label="Increase cooking oil quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('momo')}
                    className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                      payMethod === 'momo'
                        ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('airtel')}
                    className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                      payMethod === 'airtel'
                        ? 'border-rose-400 bg-rose-400/15 text-rose-200'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    Airtel Money
                  </button>
                </div>

                <div className="text-right font-mono tabular-nums">
                  <span className="block text-[11px] text-slate-400">{posCopy.collect}</span>
                  <span className="text-base font-bold text-cyan-300">
                    UGX {totalUgx.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">{posCopy.receipt}</p>
            </div>
          </div>
        </div>

        {/* Right: ROCKHAI Interactive Posture Kinematics */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-[#0B1220] p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display text-base font-bold text-white">
              ROCKHAI Posture Kinematics
            </h3>
            <div className="inline-flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-[11px]">
              {(
                [
                  { id: 'en', label: 'EN' },
                  { id: 'fr', label: 'FR' },
                  { id: 'sw', label: 'SW' },
                ] as const
              ).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setPoseLang(l.id)}
                  className={`rounded px-2 py-0.5 font-mono ${
                    poseLang === l.id ? 'bg-[#0E7490] text-white' : 'text-slate-400'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <svg viewBox="0 0 280 340" className="h-56 w-auto" role="img" aria-label="Dynamic skeletal angle visualizer">
              <circle cx="140" cy="40" r="20" stroke="#22D3EE" strokeWidth="3" fill="none" />
              <line x1="140" y1="60" x2="140" y2="95" stroke="#22D3EE" strokeWidth="3" />
              {/* Shoulders & Torso */}
              <path
                d="M104 95H176M104 95L122 200H158L176 95"
                stroke="#22D3EE"
                strokeWidth="3"
                fill="none"
                strokeLinejoin="round"
              />
              {/* Left Arm (Dynamic) */}
              <path
                d={`M104 95 L78 165 L${wristX} ${wristY}`}
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Arm */}
              <path
                d="M176 95 L202 165 L190 220"
                stroke="#22D3EE"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left Leg (Dynamic) */}
              <path
                d={`M122 200 L${kneeX} ${kneeY} L${ankleX} ${ankleY}`}
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Leg */}
              <path
                d="M158 200 L166 268 L172 325"
                stroke="#22D3EE"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Keypoints */}
              {[
                [104, 95],
                [176, 95],
                [78, 165],
                [wristX, wristY],
                [122, 200],
                [158, 200],
                [kneeX, kneeY],
                [ankleX, ankleY],
              ].map(([cx, cy], idx) => (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="5.5"
                  fill="#0B1220"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-3">
            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="elbow-slider" className="text-slate-300">
                  Elbow Flexion
                </label>
                <span className="font-mono text-cyan-300 tabular-nums">{elbowAngle}°</span>
              </div>
              <input
                id="elbow-slider"
                type="range"
                min={55}
                max={165}
                value={elbowAngle}
                onChange={(e) => setElbowAngle(Number(e.target.value))}
                className="mt-1 w-full accent-[#22D3EE] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="knee-slider" className="text-slate-300">
                  Knee Extension
                </label>
                <span className="font-mono text-cyan-300 tabular-nums">{kneeAngle}°</span>
              </div>
              <input
                id="knee-slider"
                type="range"
                min={85}
                max={175}
                value={kneeAngle}
                onChange={(e) => setKneeAngle(Number(e.target.value))}
                className="mt-1 w-full accent-[#22D3EE] cursor-pointer"
              />
            </div>

            <p
              className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                formOk
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
              }`}
            >
              {feedbackText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
