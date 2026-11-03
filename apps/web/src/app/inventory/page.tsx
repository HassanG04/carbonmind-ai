'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { ProvenanceModal } from '@/components/common/ProvenanceModal';
import {
  calculateDemoEnergy,
  calculateDemoEmissions,
  validateIsoTimestampWithOffset,
} from '@/demo/math';
import { DEMO_FACTOR, EvidenceState } from '@/lib/contracts';

export default function CarbonInventoryPage() {
  const { currentOrg, currentSite, sites, activities, totals, addActivity } = useDemo();

  // Filters - reset when currentOrg changes
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>('all');

  useEffect(() => {
    setSelectedSiteFilter('all');
  }, [currentOrg.id]);

  // Modal State for New Activity Entry
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importPreviewRows, setImportPreviewRows] = useState<
    { siteId: string; sourceId: string; start: string; end: string; quantityKwh: number; representation: 'primary' | 'attribution'; status: 'valid' | 'invalid'; error?: string }[]
  >([]);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'direct_kwh' | 'watts_hours'>('direct_kwh');

  const [formSiteId, setFormSiteId] = useState<string>(currentSite?.id ?? sites[0]?.id ?? '');
  const [formSourceId, setFormSourceId] = useState<string>('meter-manual-entry');
  const [formStart, setFormStart] = useState<string>('2026-10-27T08:00:00+02:00');
  const [formEnd, setFormEnd] = useState<string>('2026-10-27T16:00:00+02:00');
  const [formRepresentation, setFormRepresentation] = useState<'primary' | 'attribution'>('primary');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formKwh, setFormKwh] = useState<string>('100');
  const [formWatts, setFormWatts] = useState<string>('120');
  const [formHours, setFormHours] = useState<string>('8'); // Default 8h for 8h interval
  const [formAssumptions, setFormAssumptions] = useState<string>('Manual operational activity log');
  const [formError, setFormError] = useState<string | null>(null);

  // Focus management refs for accessibility
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLSelectElement | null>(null);
  const wasModalOpenRef = useRef(false);

  useEffect(() => {
    if (modalOpen) {
      wasModalOpenRef.current = true;
      firstInputRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setModalOpen(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (wasModalOpenRef.current) {
      triggerBtnRef.current?.focus();
      wasModalOpenRef.current = false;
    }
  }, [modalOpen]);

  // Ensure form site ID is always valid for current organization
  useEffect(() => {
    if (sites.length > 0) {
      if (!sites.some((s) => s.id === formSiteId)) {
        setFormSiteId(sites[0].id);
      }
    }
  }, [currentOrg.id, sites, formSiteId]);

  const filteredActivities = activities.filter((act) => {
    if (selectedSiteFilter !== 'all' && act.siteId !== selectedSiteFilter) return false;
    if (selectedRepFilter !== 'all' && act.representation !== selectedRepFilter) return false;
    return true;
  });

  const openImportModal = () => {
    const targetSite = currentSite?.id ?? sites[0]?.id ?? 'site-atlas-main';
    const sampleBatch: { siteId: string; sourceId: string; start: string; end: string; quantityKwh: number; representation: 'primary' | 'attribution'; status: 'valid' | 'invalid'; error?: string }[] = [
      {
        siteId: targetSite,
        sourceId: `batch-feed-${Date.now().toString().slice(-4)}-01`,
        start: '2026-10-28T00:00:00+02:00',
        end: '2026-10-28T23:59:59+02:00',
        quantityKwh: 1240,
        representation: 'primary',
        status: 'valid',
      },
      {
        siteId: targetSite,
        sourceId: `batch-feed-${Date.now().toString().slice(-4)}-02`,
        start: '2026-10-29T00:00:00+02:00',
        end: '2026-10-29T23:59:59+02:00',
        quantityKwh: 1315,
        representation: 'primary',
        status: 'valid',
      },
    ];
    setImportPreviewRows(sampleBatch);
    setImportFeedback(null);
    setImportModalOpen(true);
  };

  const handleSimulateImport = () => {
    let successCount = 0;
    for (const row of importPreviewRows) {
      if (row.status === 'valid') {
        const res = addActivity({
          siteId: row.siteId,
          sourceId: row.sourceId,
          start: row.start,
          end: row.end,
          quantityKwh: row.quantityKwh,
          representation: row.representation,
          evidenceState: 'USER_REPORTED',
          assumptions: ['Mock CSV batch ingestion sample record'],
        });
        if (res.activity) {
          successCount++;
        }
      }
    }
    setImportFeedback(`Successfully ingested ${successCount} entries into session memory.`);
    setTimeout(() => {
      setImportModalOpen(false);
      setImportFeedback(null);
    }, 1500);
  };
  const openActivityModal = () => {
    setFormSiteId(currentSite?.id ?? sites[0]?.id ?? '');
    setFormSourceId(`manual-meter-${Date.now().toString().slice(-4)}`);
    setFormStart('2026-10-27T08:00:00+02:00');
    setFormEnd('2026-10-27T16:00:00+02:00');
    setFormRepresentation('primary');
    setFormParentId('');
    setFormKwh('100');
    setFormWatts('120');
    setFormHours('8'); // 8 hours in default interval
    setFormError(null);
    setModalOpen(true);
  };

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate timestamps with explicit offset first
    const startVal = validateIsoTimestampWithOffset(formStart);
    if (!startVal.valid) {
      setFormError(`Start timestamp error: ${startVal.error}`);
      return;
    }
    const endVal = validateIsoTimestampWithOffset(formEnd);
    if (!endVal.valid) {
      setFormError(`End timestamp error: ${endVal.error}`);
      return;
    }

    const startMs = new Date(formStart).getTime();
    const endMs = new Date(formEnd).getTime();
    if (endMs <= startMs) {
      setFormError('End timestamp must be strictly after start timestamp.');
      return;
    }

    const intervalMaxHours = (endMs - startMs) / (1000 * 60 * 60);

    let finalKwh = 0;
    let evidenceState: EvidenceState = 'USER_REPORTED';
    const assumptionsList = formAssumptions ? [formAssumptions] : [];

    if (inputMode === 'direct_kwh') {
      const parsed = parseFloat(formKwh);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setFormError('Direct kWh quantity must be a finite, non-negative number.');
        return;
      }
      finalKwh = parsed;
      evidenceState = 'USER_REPORTED';
      assumptionsList.push(`Direct user reported reading: ${finalKwh} kWh`);
    } else {
      const w = parseFloat(formWatts);
      const h = parseFloat(formHours);

      // Duration check passed explicitly
      const calc = calculateDemoEnergy(w, h, intervalMaxHours);
      if (calc.status !== 'calculated' || calc.energyKwh === null) {
        setFormError(calc.reason || 'Invalid watts or hours input.');
        return;
      }
      finalKwh = calc.energyKwh;
      evidenceState = 'MODEL_ESTIMATED';
      assumptionsList.push(`Model estimated: ${w} W * ${h} h / 1000 = ${finalKwh} kWh (interval duration: ${intervalMaxHours} h)`);
    }

    const res = addActivity({
      siteId: formSiteId,
      sourceId: formSourceId,
      start: formStart,
      end: formEnd,
      quantityKwh: finalKwh,
      representation: formRepresentation,
      parentActivityId: formRepresentation === 'attribution' && formParentId ? formParentId : undefined,
      evidenceState,
      assumptions: assumptionsList,
    });

    if (res.error) {
      setFormError(res.error);
      return;
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
        <div>
          <p className="eyebrow">{currentOrg.name} / Activity records</p>
          <h1 className="page-heading">Carbon inventory</h1>
          <p className="text-sm text-muted mt-3">Review electricity use, input provenance and calculated emissions.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={openImportModal}
            className="px-3.5 py-2 border border-line bg-surface text-ink rounded-lg text-sm font-semibold hover:bg-subtle transition flex items-center space-x-1.5 shadow-sm"
          >
            <span>Import CSV Batch</span>
          </button>
          <button
            ref={triggerBtnRef}
            onClick={openActivityModal}
            className="px-3.5 py-2 bg-positive-strong text-white rounded-lg text-sm font-semibold hover:bg-positive-strong transition flex items-center space-x-1.5 shadow-sm focus:ring-2 focus:ring-emerald-500"
          >
            <span>+ Record Activity Entry</span>
          </button>
        </div>
      </div>

      {/* Aggregate Balance Cards */}
      <section aria-label="Selected facility totals" className="space-y-3">
      <p className="text-sm text-muted">Selected facility: <span className="font-medium text-ink">{currentSite?.name}</span> · Synthetic totals</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel p-6">
          <p className="text-sm text-muted">Primary electricity</p>
          <div className="metric-value mt-4">
            {totals.primaryKwh.toLocaleString()} <span className="text-sm font-normal text-muted">kWh</span>
          </div>
          <div className="text-xs text-muted mt-1">
            Sum of {totals.primaryCount} primary recorded intervals
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-sm text-muted">Attributed sub-load</p>
          <div className="metric-value mt-4">
            {totals.attributionKwh.toLocaleString()} <span className="text-sm font-normal text-muted">kWh</span>
          </div>
          <div className="text-xs text-info mt-1">
            Sub-allocations (retained inside primary envelope)
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-sm text-muted">Scope 2 emissions</p>
          <div className="metric-value mt-4 text-positive">
            {totals.primaryEmissionsKgCO2e.toLocaleString()} <span className="text-sm font-normal text-muted">kgCO2e</span>
          </div>
          <div className="text-xs text-muted mt-3 flex flex-wrap gap-2 items-center justify-between">
            <span>Factor: {DEMO_FACTOR.value} kgCO2e/kWh</span>
            <ProvenanceModal trace={totals.trace} />
          </div>
        </div>
      </div>
      <p className="text-sm text-muted">Attributed sub-loads are included in primary totals. The ledger below can show records from all facilities.</p>
      </section>

      {/* Filter Toolbar */}
      <div className="bg-surface p-4 rounded-xl border border-line shadow-sm flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:flex-wrap gap-4">
          <div className="flex min-w-0 flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="inventory-facility-filter" className="font-semibold text-muted">
              Facility:
            </label>
            <select
              id="inventory-facility-filter"
              value={selectedSiteFilter}
              onChange={(e) => setSelectedSiteFilter(e.target.value)}
              className="border border-line rounded px-2.5 py-1 text-sm focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Facilities ({sites.length})</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-0 flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="inventory-rep-filter" className="font-semibold text-muted">
              Representation:
            </label>
            <select
              id="inventory-rep-filter"
              value={selectedRepFilter}
              onChange={(e) => setSelectedRepFilter(e.target.value)}
              className="border border-line rounded px-2.5 py-1 text-sm focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Representations</option>
              <option value="primary">Primary (Meter / Bill)</option>
              <option value="attribution">Attribution (Sub-Allocation)</option>
            </select>
          </div>
        </div>

        <div className="text-muted text-xs">
          Showing {filteredActivities.length} of {activities.length} records
        </div>
      </div>

      {/* Inventory Activities Table */}
      <div className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-line text-muted uppercase tracking-wider bg-subtle">
                <th className="py-2.5 px-4 font-semibold">Source ID / Interval</th>
                <th className="py-2.5 px-4 font-semibold">Facility</th>
                <th className="py-2.5 px-4 font-semibold">Representation</th>
                <th className="py-2.5 px-4 font-semibold">Quantity (kWh)</th>
                <th className="py-2.5 px-4 font-semibold">Scope 2 (kgCO2e)</th>
                <th className="py-2.5 px-4 font-semibold">Provenance State</th>
                <th className="py-2.5 px-4 font-semibold text-right">Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No activity entries found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const emissionsCalc = calculateDemoEmissions(act.quantityKwh);
                  const isPrimary = act.representation === 'primary';
                  const siteObj = sites.find((s) => s.id === act.siteId);

                  return (
                    <tr
                      key={act.id}
                      className={`hover:bg-subtle/70 transition ${
                        !isPrimary ? 'bg-info-soft/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-ink">
                        <div className="font-mono text-ink">{act.sourceId}</div>
                        <div className="text-xs text-muted font-mono">
                          {act.start} &rarr; {act.end.slice(11)}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-ink">
                        <div>{siteObj?.name ?? act.siteId}</div>
                        <div className="text-xs text-muted font-mono">{siteObj?.timezone ?? 'UTC'}</div>
                      </td>

                      <td className="py-3 px-4">
                        {isPrimary ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-positive-soft text-positive uppercase">
                            Primary Total
                          </span>
                        ) : (
                          <div>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-info-soft text-info uppercase">
                              Attribution
                            </span>
                            {act.parentActivityId && (
                              <div className="text-xs text-info font-mono mt-0.5">
                                Parent: {act.parentActivityId.slice(0, 15)}...
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-ink">
                        {act.quantityKwh.toLocaleString()} kWh
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-positive">
                        {emissionsCalc.kgCO2e?.toLocaleString()} kgCO2e
                      </td>

                      <td className="py-3 px-4">
                        <SyntheticBadge evidenceState={act.evidenceState} />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <ProvenanceModal
                          title={`Trace: ${act.sourceId}`}
                          trace={emissionsCalc.trace}
                          assumptions={act.assumptions}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-3 border-t border-line text-xs text-muted">Gas breakdown unavailable: the fictional aggregate factor yields CO2e only.</p>
      </div>

      {/* Mock CSV Import Preview Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
          <div className="bg-surface rounded-xl shadow-xl max-w-2xl w-full p-6 border border-line space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 id="import-dialog-title" className="text-base font-bold text-ink">Batch Activity Ingestion (CSV Schema Preview)</h3>
              <button onClick={() => setImportModalOpen(false)} className="text-muted hover:text-ink p-1">✕</button>
            </div>
            <div className="p-3 bg-warning-soft/30 border border-warning rounded-lg text-xs text-muted">
              <strong>DEMO ONLY — Cloud ingestion upload disabled:</strong> Processed client-side in session memory. Validates schema columns: <code>siteId, sourceId, start, end, quantityKwh, representation</code>.
            </div>
            {importFeedback && (
              <div role="status" className="p-3 rounded-lg bg-positive-soft text-positive border border-positive text-xs font-semibold">
                {importFeedback}
              </div>
            )}
            <div className="overflow-x-auto border border-line rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-subtle text-muted border-b border-line">
                  <tr>
                    <th className="p-2 font-medium">Source ID</th>
                    <th className="p-2 font-medium">Interval (Explicit Offset)</th>
                    <th className="p-2 font-medium">kWh</th>
                    <th className="p-2 font-medium">Representation</th>
                    <th className="p-2 font-medium">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono">
                  {importPreviewRows.map((r, i) => (
                    <tr key={i} className="hover:bg-subtle/40">
                      <td className="p-2 text-ink font-semibold">{r.sourceId}</td>
                      <td className="p-2 text-muted">{r.start.slice(0, 10)} (+02:00)</td>
                      <td className="p-2 text-ink font-bold">{r.quantityKwh}</td>
                      <td className="p-2 uppercase text-positive font-semibold">{r.representation}</td>
                      <td className="p-2 text-positive font-semibold">✓ VALID SCHEMA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pt-3 border-t border-line flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setImportModalOpen(false)} className="px-3 py-1.5 rounded text-muted hover:bg-subtle border border-line">Cancel</button>
              <button type="button" onClick={handleSimulateImport} className="px-4 py-1.5 rounded bg-positive text-slate-950 font-semibold hover:bg-positive/90">Ingest Batch into Session</button>
            </div>
          </div>
        </div>
      )}

      {/* Record Activity Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="activity-dialog-title"
        >
          <div
            className="bg-surface rounded-xl shadow-xl max-w-lg w-full p-6 border border-line space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 id="activity-dialog-title" className="text-base font-bold text-ink">
                Record Operational Activity
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
                aria-label="Close activity form dialog"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="p-2.5 rounded bg-danger-soft border border-danger-border text-danger text-sm"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleActivitySubmit} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="activity-facility-select" className="block font-semibold text-ink mb-1">
                    Target Facility *
                  </label>
                  <select
                    id="activity-facility-select"
                    ref={firstInputRef}
                    value={formSiteId}
                    onChange={(e) => setFormSiteId(e.target.value)}
                    className="w-full border border-line rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.facilityCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="activity-source-id" className="block font-semibold text-ink mb-1">
                    Source / Meter ID *
                  </label>
                  <input
                    id="activity-source-id"
                    type="text"
                    required
                    value={formSourceId}
                    onChange={(e) => setFormSourceId(e.target.value)}
                    className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Representation Mode: Primary vs Attribution */}
              <div className="bg-subtle p-3 rounded border border-line space-y-2">
                <span className="block font-semibold text-ink">
                  Accounting Representation *
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    htmlFor="activity-rep-primary"
                    className="flex items-center space-x-2 bg-surface p-2 rounded border border-line cursor-pointer"
                  >
                    <input
                      id="activity-rep-primary"
                      type="radio"
                      name="representation"
                      value="primary"
                      checked={formRepresentation === 'primary'}
                      onChange={() => setFormRepresentation('primary')}
                    />
                    <div>
                      <span className="font-semibold block text-ink">Primary Consumption</span>
                      <span className="text-xs text-muted block">Adds to Scope 2 total</span>
                    </div>
                  </label>

                  <label
                    htmlFor="activity-rep-attribution"
                    className="flex items-center space-x-2 bg-surface p-2 rounded border border-line cursor-pointer"
                  >
                    <input
                      id="activity-rep-attribution"
                      type="radio"
                      name="representation"
                      value="attribution"
                      checked={formRepresentation === 'attribution'}
                      onChange={() => setFormRepresentation('attribution')}
                    />
                    <div>
                      <span className="font-semibold block text-ink">Attribution Child</span>
                      <span className="text-xs text-info block">Does NOT increase total</span>
                    </div>
                  </label>
                </div>

                {formRepresentation === 'attribution' && (
                  <div className="pt-2">
                    <label htmlFor="activity-parent-select" className="block font-medium text-ink mb-1">
                      Parent Activity to Attribute Against:
                    </label>
                    <select
                      id="activity-parent-select"
                      value={formParentId}
                      onChange={(e) => setFormParentId(e.target.value)}
                      className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">Select a primary parent activity</option>
                      {activities
                        .filter((a) => a.representation === 'primary' && a.siteId === formSiteId)
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.sourceId} ({a.quantityKwh} kWh) - [{a.start.slice(11, 16)} to {a.end.slice(11, 16)}]
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Input Mode: Direct kWh vs Watts * Hours */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4 border-b pb-1.5">
                  <span className="font-semibold text-ink">Calculation Method:</span>
                  <label htmlFor="activity-calc-direct" className="flex items-center space-x-1 cursor-pointer">
                    <input
                      id="activity-calc-direct"
                      type="radio"
                      name="calc-method"
                      checked={inputMode === 'direct_kwh'}
                      onChange={() => setInputMode('direct_kwh')}
                    />
                    <span>Direct Measured kWh</span>
                  </label>
                  <label htmlFor="activity-calc-watts" className="flex items-center space-x-1 cursor-pointer">
                    <input
                      id="activity-calc-watts"
                      type="radio"
                      name="calc-method"
                      checked={inputMode === 'watts_hours'}
                      onChange={() => setInputMode('watts_hours')}
                    />
                    <span>Rated Watts × Operating Hours</span>
                  </label>
                </div>

                {inputMode === 'direct_kwh' ? (
                  <div>
                    <label htmlFor="activity-kwh-input" className="block font-semibold text-ink mb-1">
                      Consumption Quantity (kWh) *
                    </label>
                    <input
                      id="activity-kwh-input"
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={formKwh}
                      onChange={(e) => setFormKwh(e.target.value)}
                      className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-muted mt-0.5 block">
                      Direct user entry receives USER_REPORTED evidence provenance.
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 bg-positive-soft/50 p-2.5 rounded border border-positive-border">
                    <div>
                      <label htmlFor="activity-watts-input" className="block font-semibold text-ink mb-1">
                        Electrical Watts (W) *
                      </label>
                      <input
                        id="activity-watts-input"
                        type="number"
                        step="any"
                        min="0"
                        required
                        value={formWatts}
                        onChange={(e) => setFormWatts(e.target.value)}
                        className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-muted mt-0.5 block">Actual electrical input</span>
                    </div>
                    <div>
                      <label htmlFor="activity-hours-input" className="block font-semibold text-ink mb-1">
                        Operating Hours (h) *
                      </label>
                      <input
                        id="activity-hours-input"
                        type="number"
                        step="any"
                        min="0"
                        required
                        value={formHours}
                        onChange={(e) => setFormHours(e.target.value)}
                        className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-muted mt-0.5 block">Must not exceed interval duration</span>
                    </div>
                    <div className="col-span-2 text-xs text-positive font-mono font-medium">
                      Calculated Energy: {(parseFloat(formWatts || '0') * parseFloat(formHours || '0')) / 1000} kWh
                      (MODEL_ESTIMATED)
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp Range with Explicit Timezone Offset */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="activity-start-timestamp" className="block font-semibold text-ink mb-1">
                    Start (ISO with Offset) *
                  </label>
                  <input
                    id="activity-start-timestamp"
                    type="text"
                    required
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    placeholder="YYYY-MM-DDTHH:MM:SS+02:00"
                    className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="activity-end-timestamp" className="block font-semibold text-ink mb-1">
                    End (ISO with Offset) *
                  </label>
                  <input
                    id="activity-end-timestamp"
                    type="text"
                    required
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    placeholder="YYYY-MM-DDTHH:MM:SS+02:00"
                    className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="activity-assumptions" className="block font-semibold text-ink mb-1">
                  Assumptions &amp; Notes
                </label>
                <input
                  id="activity-assumptions"
                  type="text"
                  value={formAssumptions}
                  onChange={(e) => setFormAssumptions(e.target.value)}
                  className="w-full border border-line rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded text-muted bg-subtle hover:bg-subtle focus:ring-2 focus:ring-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-positive-strong text-white font-semibold hover:bg-positive-strong focus:ring-2 focus:ring-emerald-500"
                >
                  Save Activity Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
