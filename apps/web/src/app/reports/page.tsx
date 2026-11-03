'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Printer, ShieldCheck, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { adapter } from '@/demo/adapter';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { DEMO_FACTOR } from '@/lib/contracts';
import { generateSafeCsv } from '@/demo/math';

export default function ReportsPage() {
  const { currentOrg, currentSite, sites, activities, orgTotals, siteTotals } = useDemo();

  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // CSV Export with Formula Injection Protection (CWE-1236)
  const handleExportCsv = () => {
    const headers = [
      'Activity ID',
      'Organization',
      'Facility ID',
      'Source ID',
      'Representation',
      'Parent Activity ID',
      'Start Interval',
      'End Interval',
      'Quantity (kWh)',
      'Scope 2 (kgCO2e)',
      'Emission Factor',
      'Factor Version',
      'Evidence State',
      'Is Synthetic',
      'Assumptions',
    ];

    const rows = activities.map((a) => {
      const kgCO2e = Math.round(a.quantityKwh * DEMO_FACTOR.value * 100) / 100;
      return [
        a.id,
        currentOrg.name,
        a.siteId,
        a.sourceId,
        a.representation,
        a.parentActivityId ?? 'NONE',
        a.start,
        a.end,
        a.quantityKwh,
        kgCO2e,
        DEMO_FACTOR.value,
        DEMO_FACTOR.version,
        a.evidenceState,
        'TRUE',
        a.assumptions.join('; '),
      ];
    });

    const csvContent = generateSafeCsv(headers, rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `carbonmind_${currentOrg.id}_emissions_report_synthetic.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="eyebrow">Audit &amp; Compliance</p>
          <h1 className="page-heading">GHG Protocol Scope 1, 2 &amp; 3 Summary</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Formal greenhouse gas inventory accounting table adhering to the GHG Protocol Corporate Standard.
            Includes formula-injection protected CSV generation and methodology trace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-subtle text-ink transition-colors"
          >
            <Printer size={16} /> Print Report
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-lg bg-positive text-slate-950 px-4 py-2.5 text-sm font-medium hover:bg-positive/90 transition-colors shadow-sm"
          >
            <Download size={16} /> Export Safe CSV
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-positive-soft border border-positive text-ink flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-positive" size={18} />
            <span>
              <strong>CSV exported safely:</strong> Pre-filtered for spreadsheet formula injection (CWE-1236).
            </span>
          </div>
          <span className="text-xs text-muted">carbonmind_{currentOrg.id}_emissions_report_synthetic.csv</span>
        </div>
      )}

      {/* Accounting Scope Breakdown Table */}
      <section className="panel overflow-hidden" aria-labelledby="ghg-table-heading">
        <div className="p-6 border-b border-line flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="ghg-table-heading" className="text-base font-semibold">
              GHG Protocol Emissions Ledger ({currentOrg.name})
            </h2>
            <p className="text-xs text-muted mt-1">
              Boundary: {currentOrg.reportingBoundary} · Consolidation: {currentOrg.defaultGwpVersion}
            </p>
          </div>
          <SyntheticBadge label="AUDIT TRAIL SYNTHETIC" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-subtle text-muted border-b border-line text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Scope &amp; Category</th>
                <th className="px-6 py-3 font-medium">Accounting Status</th>
                <th className="px-6 py-3 font-medium">Primary Activity</th>
                <th className="px-6 py-3 font-medium">Scope 2 Factor</th>
                <th className="px-6 py-3 font-medium text-right">Calculated CO2e</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {/* Scope 1 Rows */}
              <tr className="hover:bg-subtle/40">
                <td className="px-6 py-4 font-medium text-ink">
                  Scope 1 · Stationary Combustion (Boilers, Generators)
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded bg-subtle text-muted font-medium">
                    Not estimated
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">No fuel meters attached in prototype</td>
                <td className="px-6 py-4 text-muted">—</td>
                <td className="px-6 py-4 text-right font-mono text-muted">0.0 kgCO2e</td>
              </tr>
              <tr className="hover:bg-subtle/40">
                <td className="px-6 py-4 font-medium text-ink">
                  Scope 1 · Mobile Fleet Combustion &amp; Refrigerants
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded bg-subtle text-muted font-medium">
                    Not estimated
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">Fugitive refrigerant leaks outside scope</td>
                <td className="px-6 py-4 text-muted">—</td>
                <td className="px-6 py-4 text-right font-mono text-muted">0.0 kgCO2e</td>
              </tr>

              {/* Scope 2 Rows */}
              <tr className="hover:bg-subtle/40 bg-positive-soft/10">
                <td className="px-6 py-4 font-medium text-ink">
                  Scope 2 · Purchased Electricity (Location-based)
                  <p className="text-[11px] text-muted font-normal mt-0.5">
                    Grid electricity across {sites.length} operational facilities
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded bg-positive-soft text-positive font-semibold">
                    Calculated
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-medium text-ink">
                  {orgTotals.primaryKwh.toLocaleString()} kWh
                </td>
                <td className="px-6 py-4 font-mono text-muted">
                  {DEMO_FACTOR.value} {DEMO_FACTOR.unit}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-positive text-sm">
                  {orgTotals.primaryEmissionsKgCO2e.toLocaleString()} kgCO2e
                </td>
              </tr>

              {/* Scope 3 Rows */}
              <tr className="hover:bg-subtle/40">
                <td className="px-6 py-4 font-medium text-ink">
                  Scope 3 · Category 1: Purchased Goods &amp; Services
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded bg-subtle text-muted font-medium">
                    Not estimated
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">Supply chain data not connected</td>
                <td className="px-6 py-4 text-muted">—</td>
                <td className="px-6 py-4 text-right font-mono text-muted">0.0 kgCO2e</td>
              </tr>
              <tr className="hover:bg-subtle/40">
                <td className="px-6 py-4 font-medium text-ink">
                  Scope 3 · Category 6: Business Travel &amp; Commuting
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded bg-subtle text-muted font-medium">
                    Not estimated
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">Travel expense telemetry excluded</td>
                <td className="px-6 py-4 text-muted">—</td>
                <td className="px-6 py-4 text-right font-mono text-muted">0.0 kgCO2e</td>
              </tr>
            </tbody>
            <tfoot className="bg-subtle font-semibold text-ink border-t border-line text-xs">
              <tr>
                <td className="px-6 py-4" colSpan={4}>
                  Total Corporate Footprint (Scope 1 + Scope 2 + Scope 3)
                  <span className="block text-[11px] text-muted font-normal mt-0.5">
                    Note: Footprint is partial due to unestimated Scope 1 &amp; Scope 3 categories.
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-sm text-positive">
                  {orgTotals.primaryEmissionsKgCO2e.toLocaleString()} kgCO2e
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Facility Breakdown Section */}
      <section className="panel overflow-hidden" aria-labelledby="facility-breakdown-heading">
        <div className="p-6 border-b border-line">
          <h2 id="facility-breakdown-heading" className="text-base font-semibold">
            Facility Scope 2 Allocation Summary
          </h2>
          <p className="text-xs text-muted mt-1">
            Site-level distribution under operational control
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle text-muted border-b border-line">
              <tr>
                <th className="px-6 py-3 font-medium">Facility Name</th>
                <th className="px-6 py-3 font-medium">Facility Code</th>
                <th className="px-6 py-3 font-medium">Timezone</th>
                <th className="px-6 py-3 font-medium">Primary Energy</th>
                <th className="px-6 py-3 font-medium">Sub-meter Attributed</th>
                <th className="px-6 py-3 font-medium text-right">Scope 2 Emissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sites.map((site) => {
                const siteTotal = adapter.getSiteTotals(site.id);
                return (
                  <tr key={site.id} className="hover:bg-subtle/50">
                    <td className="px-6 py-3.5 font-medium text-ink">{site.name}</td>
                    <td className="px-6 py-3.5 font-mono text-muted">{site.facilityCode}</td>
                    <td className="px-6 py-3.5 text-muted">{site.timezone}</td>
                    <td className="px-6 py-3.5 font-mono tabular-nums">{siteTotal.primaryKwh.toLocaleString()} kWh</td>
                    <td className="px-6 py-3.5 font-mono text-muted tabular-nums">
                      {siteTotal.attributionKwh.toLocaleString()} kWh (retained)
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-positive tabular-nums">
                      {siteTotal.primaryEmissionsKgCO2e.toLocaleString()} kgCO2e
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Emission Factor Registry & Trace */}
      <section className="panel p-6 space-y-4" aria-labelledby="factor-registry-heading">
        <h2 id="factor-registry-heading" className="text-base font-semibold">
          Applied Emission Factor Registry
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-subtle border border-line space-y-1">
            <span className="text-muted block text-[10px] uppercase font-sans">Factor ID</span>
            <span className="font-semibold text-ink">{DEMO_FACTOR.id}</span>
          </div>
          <div className="p-4 rounded-lg bg-subtle border border-line space-y-1">
            <span className="text-muted block text-[10px] uppercase font-sans">Factor Value</span>
            <span className="font-semibold text-positive">
              {DEMO_FACTOR.value} {DEMO_FACTOR.unit}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-subtle border border-line space-y-1">
            <span className="text-muted block text-[10px] uppercase font-sans">Region / Status</span>
            <span className="font-semibold text-ink">Fictional Demo Factor</span>
          </div>
          <div className="p-4 rounded-lg bg-subtle border border-line space-y-1">
            <span className="text-muted block text-[10px] uppercase font-sans">Version</span>
            <span className="font-semibold text-ink">{DEMO_FACTOR.version}</span>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          <strong>Scientific Notice:</strong> This aggregate factor represents fictional Scope 2 electricity intensity
          ({DEMO_FACTOR.value} kgCO2e/kWh) from <code>docs/scientific_engine.md</code>. Aggregate factors do not yield
          artificial methane (CH4) or nitrous oxide (N2O) breakdowns; gas-specific masses remain unestimated.
        </p>
      </section>
    </div>
  );
}
