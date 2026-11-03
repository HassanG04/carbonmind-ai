'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sliders, Zap, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, TrendingDown, DollarSign } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { ScenarioInput, Recommendation } from '@/lib/contracts';

export default function OptimizePage() {
  const { currentOrg, currentSite, recommendations, runSimulation, totals } = useDemo();

  // Scenario Levers state
  const [lightingReduction, setLightingReduction] = useState<number>(15);
  const [hvacDelta, setHvacDelta] = useState<number>(1.5);
  const [hoursDelta, setHoursDelta] = useState<number>(2);
  const [solarPvKw, setSolarPvKw] = useState<number>(20);

  // Recommendation Category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const simulationParams: ScenarioInput = {
    lightingReductionPct: lightingReduction,
    hvacSetpointDeltaC: hvacDelta,
    operatingHoursDelta: hoursDelta,
    solarPvKw,
  };

  const simResult = runSimulation(simulationParams);

  // Filter recommendations
  const categories = Array.from(new Set(recommendations.map((r) => r.category)));
  const filteredRecommendations =
    categoryFilter === 'all'
      ? recommendations
      : recommendations.filter((r) => r.category === categoryFilter);

  const resetLevers = () => {
    setLightingReduction(0);
    setHvacDelta(0);
    setHoursDelta(0);
    setSolarPvKw(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Scenario Studio &amp; Recommendations</p>
          <h1 className="page-heading">Decarbonization Optimizer</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Simulate operational levers and review targeted recommendations.
            Calculated counterfactual savings are model estimates and must be verified before operational adoption.
          </p>
        </div>
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-subtle"
        >
          View GHG Protocol Reports <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* Counterfactual Disclaimer Banner */}
      <div className="panel p-5 border-l-4 border-l-info bg-info-soft/30 flex items-start gap-4 text-sm">
        <Sparkles className="text-info shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-ink">Potential Savings — Not Actual Savings</p>
          <p className="text-muted leading-relaxed">
            Baseline minus alternative calculations represent <strong>illustrative counterfactual scenarios</strong> based on linear elasticity assumptions.
            Actual measurement &amp; verification (M&amp;V) following IPMVP protocols is required to claim verified carbon reductions.
          </p>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Interactive Control Levers */}
        <section className="lg:col-span-5 panel p-6 space-y-6" aria-labelledby="scenario-controls-heading">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 id="scenario-controls-heading" className="text-base font-semibold">
              Operational &amp; Tech Levers
            </h2>
            <button
              type="button"
              onClick={resetLevers}
              className="text-xs text-muted hover:text-ink underline underline-offset-4"
            >
              Reset to Baseline
            </button>
          </div>

          <div className="space-y-5 text-sm">
            {/* Lever 1: Lighting Reduction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="lighting-slider" className="font-medium text-ink">
                  Lighting Schedule Reduction
                </label>
                <span className="font-mono text-positive font-semibold">{lightingReduction}%</span>
              </div>
              <input
                id="lighting-slider"
                type="range"
                min="0"
                max="50"
                step="5"
                value={lightingReduction}
                onChange={(e) => setLightingReduction(parseInt(e.target.value, 10))}
                className="w-full accent-positive cursor-pointer"
              />
              <p className="text-[11px] text-muted">
                Off-peak dimming and automated daylight harvesting (assumes lighting is ~25% of load).
              </p>
            </div>

            {/* Lever 2: HVAC Setpoint Adjustment */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="hvac-slider" className="font-medium text-ink">
                  Chilled Air Cooling Setpoint Delta
                </label>
                <span className="font-mono text-positive font-semibold">+{hvacDelta}°C</span>
              </div>
              <input
                id="hvac-slider"
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={hvacDelta}
                onChange={(e) => setHvacDelta(parseFloat(e.target.value))}
                className="w-full accent-positive cursor-pointer"
              />
              <p className="text-[11px] text-muted">
                Supply air temperature increase (each +1°C yields ~5% HVAC chiller power savings).
              </p>
            </div>

            {/* Lever 3: Standby Hours Reduction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="standby-slider" className="font-medium text-ink">
                  Auxiliary Equipment Standby Reduction
                </label>
                <span className="font-mono text-positive font-semibold">-{hoursDelta} hrs/day</span>
              </div>
              <input
                id="standby-slider"
                type="range"
                min="0"
                max="8"
                step="1"
                value={hoursDelta}
                onChange={(e) => setHoursDelta(parseInt(e.target.value, 10))}
                className="w-full accent-positive cursor-pointer"
              />
              <p className="text-[11px] text-muted">
                Automated night-time shutdown of idling conveyors, ventilation fans, and shop pumps.
              </p>
            </div>

            {/* Lever 4: Solar PV Capacity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="solar-slider" className="font-medium text-ink">
                  On-Site Solar PV Capacity
                </label>
                <span className="font-mono text-positive font-semibold">{solarPvKw} kWp</span>
              </div>
              <input
                id="solar-slider"
                type="range"
                min="0"
                max="100"
                step="10"
                value={solarPvKw}
                onChange={(e) => setSolarPvKw(parseInt(e.target.value, 10))}
                className="w-full accent-positive cursor-pointer"
              />
              <p className="text-[11px] text-muted">
                Rooftop solar PV generation offset (calibrated at 4.2 kWh/kWp per day).
              </p>
            </div>
          </div>

          {/* Operational Trade-offs Panel */}
          <div className="p-4 rounded-lg bg-subtle border border-line text-xs space-y-2">
            <span className="font-semibold text-muted uppercase tracking-wider text-[11px]">
              Operational Constraints &amp; Trade-offs
            </span>
            <ul className="space-y-1.5 list-disc list-inside text-muted">
              {simResult.tradeoffs.map((t, idx) => (
                <li key={idx} className="leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: Real-time Counterfactual Impact Dashboard */}
        <section className="lg:col-span-7 space-y-6" aria-labelledby="scenario-impact-heading">
          <div className="panel p-6 space-y-6">
            <div className="border-b border-line pb-4 flex items-center justify-between">
              <div>
                <h2 id="scenario-impact-heading" className="text-base font-semibold">
                  Counterfactual Impact Analysis
                </h2>
                <p className="text-xs text-muted mt-1">
                  Baseline daily intake vs Simulated alternative for {currentSite?.name}
                </p>
              </div>
              <SyntheticBadge label="SIMULATED OUTCOME" />
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-line bg-subtle/50 space-y-2">
                <p className="text-xs text-muted uppercase font-medium">Daily Consumption Shift</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-mono text-ink">
                    {simResult.alternativeDailyKwh.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-muted">kWh/d</span>
                  </span>
                  <span className="text-xs font-mono text-positive font-semibold">
                    (-{simResult.dailySavingsKwh.toLocaleString()} kWh)
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Baseline: {simResult.baselineDailyKwh.toLocaleString()} kWh/day
                </p>
              </div>

              <div className="p-5 rounded-xl border border-line bg-subtle/50 space-y-2">
                <p className="text-xs text-muted uppercase font-medium">Daily Scope 2 Abatement</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold font-mono text-positive">
                    {simResult.dailySavingsKgCO2e.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-muted">kgCO2e/d</span>
                  </span>
                  <span className="text-xs text-muted">abated</span>
                </div>
                <p className="text-[11px] text-muted">
                  Factor: 0.45 kgCO2e/kWh fictional grid intensity
                </p>
              </div>

              <div className="p-5 rounded-xl border border-positive/30 bg-positive-soft/20 space-y-2">
                <p className="text-xs text-muted uppercase font-medium">Annualized Energy Abatement</p>
                <p className="text-2xl font-bold font-mono text-ink">
                  {simResult.annualSavingsKwh.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-muted">kWh/yr</span>
                </p>
                <p className="text-[11px] text-muted">
                  Yields ~{simResult.annualSavingsKgCO2e.toLocaleString()} kgCO2e annualized reduction
                </p>
              </div>

              <div className="p-5 rounded-xl border border-positive/30 bg-positive-soft/20 space-y-2">
                <p className="text-xs text-muted uppercase font-medium">Estimated Financial Savings</p>
                <p className="text-2xl font-bold font-mono text-positive">
                  ${simResult.estimatedAnnualCostSavingsUsd.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-muted">USD/yr</span>
                </p>
                <p className="text-[11px] text-muted">
                  Benchmark tariff: $0.12/kWh commercial electric rate
                </p>
              </div>
            </div>

            {/* Visual Savings Bar Comparison */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Baseline ({simResult.baselineDailyKwh} kWh)</span>
                <span>Alternative ({simResult.alternativeDailyKwh} kWh)</span>
              </div>
              <div className="w-full bg-line h-4 rounded-full overflow-hidden flex">
                <div
                  className="bg-positive h-full transition-all duration-300"
                  style={{
                    width: `${Math.max(
                      5,
                      (simResult.alternativeDailyKwh / simResult.baselineDailyKwh) * 100
                    )}%`,
                  }}
                  title={`Alternative: ${simResult.alternativeDailyKwh} kWh`}
                />
                <div
                  className="bg-positive/30 h-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      95,
                      (simResult.dailySavingsKwh / simResult.baselineDailyKwh) * 100
                    )}%`,
                  }}
                  title={`Potential Savings: ${simResult.dailySavingsKwh} kWh`}
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted justify-end">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-positive rounded-full inline-block" /> Adjusted Load
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-positive/30 rounded-full inline-block" /> Potential Abatement
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Intelligent Recommendation Center */}
      <section className="space-y-6 pt-4" aria-labelledby="recommendation-center-heading">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="recommendation-center-heading" className="text-lg font-semibold">
              Intelligent Recommendation Center ({currentOrg.name})
            </h2>
            <p className="text-sm text-muted mt-1">
              Curated engineering and operational decarbonization measures ranked by cost-effectiveness.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-select" className="text-xs text-muted shrink-0">
              Filter Category:
            </label>
            <select
              id="category-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-positive"
            >
              <option value="all">All Categories ({recommendations.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="panel p-6 flex flex-col justify-between space-y-4 hover:border-positive/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-subtle text-muted">
                    {rec.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      rec.implementationEffort === 'Low'
                        ? 'bg-positive-soft text-positive'
                        : rec.implementationEffort === 'Medium'
                        ? 'bg-warning-soft text-warning'
                        : 'bg-subtle text-muted'
                    }`}
                  >
                    Effort: {rec.implementationEffort ?? 'Medium'}
                  </span>
                </div>

                <h3 className="font-semibold text-ink text-sm leading-snug">{rec.action}</h3>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line text-xs font-mono">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-sans">Abatement</span>
                    <span className="font-semibold text-positive">
                      {rec.estimatedKgCO2eSaved.toLocaleString()} kgCO2e
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-sans">Energy Saved</span>
                    <span className="text-ink">
                      {rec.estimatedKwhSaved.toLocaleString()} kWh/yr
                    </span>
                  </div>
                  {rec.paybackMonths !== undefined && (
                    <div className="col-span-2 pt-1 text-[11px] text-muted font-sans">
                      Payback Period: <strong className="text-ink">{rec.paybackMonths === 0 ? 'Immediate / Operational' : `${rec.paybackMonths} months`}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Assumptions Drawer / Accordion */}
              <div className="pt-3 border-t border-line space-y-1.5 text-[11px] text-muted">
                <p className="font-semibold uppercase tracking-wider text-[10px] text-muted">
                  Transparent Assumptions
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  {rec.assumptions.map((asm, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {asm}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
