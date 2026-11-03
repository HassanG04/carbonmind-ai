'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { adapter } from '@/demo/adapter';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { ProvenanceModal } from '@/components/common/ProvenanceModal';
import { DEMO_FACTOR } from '@/lib/contracts';

export default function ExecutiveOverview() {
  const { currentOrg, currentSite, sites, siteAssets, siteTotals, orgTotals } = useDemo();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="page-heading">{currentOrg.name}</h1>
          <p className="mt-3 text-muted text-sm">A clear view of your facility’s electricity and carbon inventory.</p>
        </div>
        <Link href="/inventory" className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-subtle">View inventory <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>

      <section aria-labelledby="facility-metrics-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="facility-metrics-title" className="text-base font-medium">{currentSite?.name} <span className="text-muted font-normal">/ recorded activity</span></h2>
          <span className="text-sm text-muted">Synthetic demo totals</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="panel p-6 sm:p-7">
            <p className="text-sm text-muted">Electricity consumption</p>
            <p className="metric-value mt-5">{siteTotals.primaryKwh.toLocaleString()} <span className="text-base font-normal text-muted">kWh</span></p>
            <div className="mt-5"><SyntheticBadge evidenceState={siteTotals.aggregateProvenance} label={siteTotals.aggregateProvenanceLabel} /></div>
          </div>
          <div className="panel p-6 sm:p-7">
            <p className="text-sm text-muted">Scope 2 emissions</p>
            <p className="metric-value mt-5 text-positive">{siteTotals.primaryEmissionsKgCO2e.toLocaleString()} <span className="text-base font-normal text-muted">kgCO2e</span></p>
            <p className="mt-5 text-xs text-muted">Calculated · Fictional factor {DEMO_FACTOR.value} kgCO2e/kWh</p>
          </div>
          <div className="panel p-6 sm:p-7">
            <p className="text-sm text-muted">Registered equipment</p>
            <p className="metric-value mt-5">{siteAssets.length} <span className="text-base font-normal text-muted">assets</span></p>
            <Link href={`/sites/${currentSite?.id}`} className="mt-5 inline-flex items-center gap-2 text-sm text-positive">Explore equipment <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 mt-4 text-sm text-muted">
          <p>{siteTotals.attributionKwh.toLocaleString()} kWh attributed to sub-loads. Included in the primary total.</p>
          <ProvenanceModal trace={siteTotals.trace} />
        </div>
      </section>

      <section className="panel overflow-hidden" aria-labelledby="facilities-title">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div><h2 id="facilities-title" className="text-lg font-semibold">Your facilities</h2><p className="text-sm text-muted mt-1">Organization total: {orgTotals.primaryKwh.toLocaleString()} kWh · {orgTotals.primaryEmissionsKgCO2e.toLocaleString()} kgCO2e</p></div>
          <Link href="/sites" className="text-sm text-positive inline-flex items-center gap-2">Manage facilities <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-muted border-y border-line"><tr>
              <th className="px-6 py-3 font-medium">Facility</th><th className="px-6 py-3 font-medium">Electricity</th><th className="px-6 py-3 font-medium">Scope 2</th><th className="px-6 py-3 font-medium">Input provenance</th>
            </tr></thead>
            <tbody className="divide-y divide-line">
              {sites.map((site) => {
                const totals = adapter.getSiteTotals(site.id);
                return <tr key={site.id} className="hover:bg-subtle/60">
                  <td className="px-6 py-5"><Link href={`/sites/${site.id}`} className="font-medium hover:text-positive">{site.name}</Link><p className="mt-1 text-xs text-muted">{site.facilityCode}{site.id === currentSite?.id ? ' · Selected' : ''}</p></td>
                  <td className="px-6 py-5 tabular-nums whitespace-nowrap">{totals.primaryKwh.toLocaleString()} kWh</td>
                  <td className="px-6 py-5 tabular-nums whitespace-nowrap">{totals.primaryEmissionsKgCO2e.toLocaleString()} kgCO2e</td>
                  <td className="px-6 py-5"><SyntheticBadge evidenceState={totals.aggregateProvenance} label={totals.aggregateProvenanceLabel} /></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Decarbonization Initiatives Snippet */}
      <section className="panel p-6 space-y-4" aria-labelledby="overview-initiatives-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 id="overview-initiatives-title" className="text-base font-semibold">
              Prioritized Decarbonization Actions ({currentOrg.name})
            </h2>
            <p className="text-xs text-muted mt-1">
              Top engineering opportunities ranked by cost-effectiveness
            </p>
          </div>
          <Link
            href="/optimize"
            className="text-xs text-positive inline-flex items-center gap-1.5 hover:underline font-medium"
          >
            Open Scenario Studio <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adapter.getRecommendations().slice(0, 3).map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl border border-line bg-subtle/40 space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface border border-line text-muted">
                {rec.category}
              </span>
              <p className="font-medium text-xs text-ink leading-snug">{rec.action}</p>
              <div className="flex items-baseline justify-between pt-1 text-xs font-mono">
                <span className="text-positive font-semibold">
                  -{rec.estimatedKgCO2eSaved.toLocaleString()} kgCO2e
                </span>
                <span className="text-muted text-[11px]">
                  Effort: {rec.implementationEffort ?? 'Low'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <details className="panel px-6 py-5">
        <summary className="cursor-pointer text-sm font-medium">Accounting boundary &amp; methodology</summary>
        <div className="mt-5 space-y-5 text-sm text-muted">
          <p>{currentOrg.reportingBoundary} · {currentOrg.defaultGwpVersion}. Facility timezone: {currentSite?.timezone}.</p>
          <div className="grid sm:grid-cols-3 gap-6 border-t border-line pt-5">
            <div><h3 className="font-medium text-ink">Scope 1 · Not estimated</h3><p className="mt-2">Direct fuel and refrigerant emissions are outside this demonstration.</p></div>
            <div><h3 className="font-medium text-ink">Scope 2 · Calculated</h3><p className="mt-2">Electricity × a fictional aggregate CO2e factor. Gas-specific masses are unavailable.</p></div>
            <div><h3 className="font-medium text-ink">Scope 3 · Not estimated</h3><p className="mt-2">Value-chain categories are outside this demonstration. This is an incomplete footprint.</p></div>
          </div>
        </div>
      </details>
    </div>
  );
}
