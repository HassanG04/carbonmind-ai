'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, AlertTriangle, Info, Calendar, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { DEMO_FACTOR } from '@/lib/contracts';

export default function ForecastsPage() {
  const { currentOrg, currentSite, getForecast } = useDemo();

  const [horizonDays, setHorizonDays] = useState<7 | 14 | 30>(14);
  const [budgetKgCO2e, setBudgetKgCO2e] = useState<string>('8000');

  const parsedBudget = parseFloat(budgetKgCO2e);
  const validBudget = Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : undefined;

  const forecast = getForecast(horizonDays, validBudget);

  // SVG Chart Dimensions & Scale calculations
  const chartWidth = 900;
  const chartHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Max value across upper bounds for Y-scale
  const maxY = Math.max(...forecast.dataPoints.map((d) => d.kwhUpper), 1600);
  const minY = 0;

  const getX = (index: number) => {
    return padding.left + (index / (forecast.dataPoints.length - 1)) * innerWidth;
  };

  const getY = (kwh: number) => {
    return padding.top + innerHeight - ((kwh - minY) / (maxY - minY)) * innerHeight;
  };

  // Build SVG paths
  const historicalPoints = forecast.dataPoints.filter((d) => !d.isProjected);
  const projectedPoints = forecast.dataPoints.filter((d) => d.isProjected);

  // Split indices
  const historicalIndices = forecast.dataPoints.map((d, i) => (!d.isProjected ? i : -1)).filter((i) => i !== -1);
  const projectedIndices = forecast.dataPoints.map((d, i) => (d.isProjected ? i : -1)).filter((i) => i !== -1);

  // Connect last historical point to first projected point for visual continuity
  const transitionIndices = [
    historicalIndices[historicalIndices.length - 1],
    ...projectedIndices,
  ];

  // Historical path (solid)
  const historicalPath = historicalIndices
    .map((idx, i) => `${i === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(forecast.dataPoints[idx].kwh)}`)
    .join(' ');

  // Projected path (dashed)
  const projectedPath = transitionIndices
    .map((idx, i) => `${i === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(forecast.dataPoints[idx].kwh)}`)
    .join(' ');

  // Illustrative area band (+/- 20%) for projected segment
  const bandUpper = transitionIndices.map((idx) => `${getX(idx)},${getY(forecast.dataPoints[idx].kwhUpper)}`);
  const bandLower = [...transitionIndices].reverse().map((idx) => `${getX(idx)},${getY(forecast.dataPoints[idx].kwhLower)}`);
  const bandPolygon = [...bandUpper, ...bandLower].join(' ');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Predictive Analytics</p>
          <h1 className="page-heading">Energy &amp; Carbon Footprint Forecast</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Seasonal-naive projection calibrated on 7-day cyclical history. Periods are strictly non-overlapping.
            Display bounds illustrate a ±20% operational range, not a calibrated statistical confidence interval.
          </p>
        </div>
        <Link
          href="/optimize"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-subtle"
        >
          Explore Decarbonization Scenarios <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* Untrained Model Disclosure Banner */}
      <div className="panel p-5 border-l-4 border-l-warning bg-warning-soft/30 flex items-start gap-4 text-sm">
        <Info className="text-warning shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-ink">Illustrative Prototype Methodology</p>
          <p className="text-muted leading-relaxed">
            This projection uses seasonal-naive repeating heuristics based on historical weekday/weekend patterns.
            It is <strong>not a machine learning model</strong> and has not undergone rolling-origin cross validation.
            Future carbon is computed as projected kWh × {DEMO_FACTOR.value} kgCO2e/kWh.
          </p>
        </div>
      </div>

      {/* Controls: Horizon Selector & Budget Allowance Input */}
      <div className="panel p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        {/* Horizon Picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Forecast Horizon
          </label>
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setHorizonDays(days as 7 | 14 | 30)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                  horizonDays === days
                    ? 'bg-positive text-slate-950 font-semibold shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Budget Input */}
        <div>
          <label htmlFor="budget-input" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            Illustrative Period Budget (kgCO2e)
          </label>
          <div className="relative">
            <input
              id="budget-input"
              type="number"
              min="1"
              step="500"
              value={budgetKgCO2e}
              onChange={(e) => setBudgetKgCO2e(e.target.value)}
              className="w-full px-3 py-2 pr-16 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive font-mono"
            />
            <span className="absolute right-3 top-2.5 text-xs text-muted">kgCO2e</span>
          </div>
        </div>

        {/* Selected Facility Context */}
        <div className="text-xs text-muted">
          <p className="font-semibold text-ink">Target Facility: {currentSite?.name}</p>
          <p className="mt-1">
            7-day baseline mean: <strong className="text-ink">{forecast.baselineDailyAvgKwh} kWh/day</strong>
          </p>
          <p className="mt-0.5">Factor version: {DEMO_FACTOR.version}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="panel p-6">
          <p className="text-xs text-muted uppercase font-medium">Projected Electricity</p>
          <p className="metric-value mt-4 text-ink">
            {forecast.totalProjectedKwh.toLocaleString()}{' '}
            <span className="text-base font-normal text-muted">kWh</span>
          </p>
          <p className="text-xs text-muted mt-3">
            Across next {horizonDays} calendar days (seasonal cycle: {forecast.historicalDays}d)
          </p>
        </div>

        <div className="panel p-6">
          <p className="text-xs text-muted uppercase font-medium">Projected Scope 2 Emissions</p>
          <p className="metric-value mt-4 text-positive">
            {forecast.totalProjectedEmissionsKgCO2e.toLocaleString()}{' '}
            <span className="text-base font-normal text-muted">kgCO2e</span>
          </p>
          <p className="text-xs text-muted mt-3">
            Calculated at fictional {DEMO_FACTOR.value} kgCO2e/kWh
          </p>
        </div>

        <div className="panel p-6">
          <p className="text-xs text-muted uppercase font-medium">Carbon Allowance Status</p>
          {forecast.budgetStatus ? (
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold font-mono ${
                    forecast.budgetStatus === 'surplus' ? 'text-positive' : 'text-negative'
                  }`}
                >
                  {forecast.budgetVarianceKgCO2e !== undefined && forecast.budgetVarianceKgCO2e >= 0 ? '+' : ''}
                  {forecast.budgetVarianceKgCO2e?.toLocaleString()}
                </span>
                <span className="text-sm text-muted">kgCO2e variance</span>
              </div>
              <p className="text-xs text-muted mt-3">
                {forecast.budgetStatus === 'surplus'
                  ? 'Projected surplus: emissions are within illustrative budget.'
                  : 'Projected deficit: emissions exceed illustrative budget.'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted mt-4">Enter a valid positive budget to compare.</p>
          )}
        </div>
      </div>

      {/* Interactive Time-Series SVG Chart */}
      <section className="panel p-6 space-y-4" aria-labelledby="forecast-chart-heading">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 id="forecast-chart-heading" className="text-base font-semibold">
              Daily Energy Trajectory ({currentSite?.name})
            </h2>
            <p className="text-xs text-muted mt-1">
              Solid line: Historical meter baseline · Dashed line: Naive forecast · Shaded area: ±20% range
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="w-3 h-0.5 bg-ink inline-block" /> Historical
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="w-3 h-0.5 bg-positive border-t border-dashed border-positive inline-block" /> Forecast
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="w-3 h-3 bg-positive/15 rounded inline-block" /> ±20% Range
            </span>
          </div>
        </div>

        {/* SVG Container */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[650px] font-mono text-[10px]"
            role="img"
            aria-label="Time series chart showing historical and projected daily energy consumption"
          >
            {/* Grid Lines & Y Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const val = Math.round(minY + pct * (maxY - minY));
              const y = getY(val);
              return (
                <g key={pct}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-line"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted"
                  >
                    {val} kWh
                  </text>
                </g>
              );
            })}

            {/* Illustrative Confidence Band */}
            <polygon points={bandPolygon} className="fill-positive/10" />

            {/* Projected Trajectory Line (Dashed) */}
            <path
              d={projectedPath}
              fill="none"
              stroke="currentColor"
              className="text-positive"
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />

            {/* Historical Baseline Line (Solid) */}
            <path
              d={historicalPath}
              fill="none"
              stroke="currentColor"
              className="text-ink"
              strokeWidth="2.5"
            />

            {/* Data Points */}
            {forecast.dataPoints.map((dp, idx) => {
              const cx = getX(idx);
              const cy = getY(dp.kwh);
              return (
                <g key={dp.date} className="group cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={dp.isProjected ? 3.5 : 4}
                    className={
                      dp.isProjected
                        ? 'fill-surface stroke-positive stroke-2'
                        : 'fill-ink stroke-surface stroke-1'
                    }
                  />
                  {/* Tooltip on hover */}
                  <title>{`${dp.date}: ${dp.kwh} kWh (${dp.kgCO2e} kgCO2e) ${
                    dp.isProjected ? `[Range: ${dp.kwhLower} - ${dp.kwhUpper} kWh]` : '[Historical]'
                  }`}</title>
                </g>
              );
            })}

            {/* X-axis labels (sampled for readability) */}
            {forecast.dataPoints
              .filter((_, idx) => idx % Math.ceil(forecast.dataPoints.length / 8) === 0 || idx === forecast.dataPoints.length - 1)
              .map((dp, _, arr) => {
                const originalIndex = forecast.dataPoints.findIndex((p) => p.date === dp.date);
                const x = getX(originalIndex);
                return (
                  <text
                    key={dp.date}
                    x={x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    className={`text-[10px] ${dp.isProjected ? 'fill-positive' : 'fill-muted'}`}
                  >
                    {dp.date.slice(5)}
                  </text>
                );
              })}
          </svg>
        </div>
      </section>

      {/* Projection Data Table */}
      <section className="panel overflow-hidden" aria-labelledby="forecast-table-heading">
        <div className="p-6 border-b border-line flex items-center justify-between">
          <h2 id="forecast-table-heading" className="text-base font-semibold">
            Daily Projection Breakdown ({horizonDays} Days Ahead)
          </h2>
          <span className="text-xs text-muted font-mono">
            {projectedPoints[0]?.date} → {projectedPoints[projectedPoints.length - 1]?.date}
          </span>
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle text-muted border-b border-line sticky top-0">
              <tr>
                <th className="px-6 py-3 font-medium">Target Date</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Point Estimate</th>
                <th className="px-6 py-3 font-medium">Illustrative Range (±20%)</th>
                <th className="px-6 py-3 font-medium">Projected Scope 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {projectedPoints.map((dp) => (
                <tr key={dp.date} className="hover:bg-subtle/50">
                  <td className="px-6 py-3 font-mono font-medium text-ink">{dp.date}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded bg-positive-soft text-positive text-[10px] font-semibold">
                      SEASONAL NAIVE
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono tabular-nums">{dp.kwh.toLocaleString()} kWh</td>
                  <td className="px-6 py-3 font-mono text-muted tabular-nums">
                    [{dp.kwhLower.toLocaleString()} – {dp.kwhUpper.toLocaleString()}] kWh
                  </td>
                  <td className="px-6 py-3 font-mono text-positive tabular-nums">{dp.kgCO2e.toLocaleString()} kgCO2e</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
