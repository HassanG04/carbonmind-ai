'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { Asset } from '@/lib/contracts';
import { calculateDemoEnergy, calculateDemoEmissions } from '@/demo/math';

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params?.id as string;
  const { currentOrg, sites, assets, addAsset, updateAsset } = useDemo();

  const site = sites.find((s) => s.id === siteId);
  const siteAssets = assets.filter((a) => a.siteId === siteId);

  // Modal State for Asset Creation / Editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [formKind, setFormKind] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formPowerW, setFormPowerW] = useState<string>('');
  const [formMarketedHp, setFormMarketedHp] = useState<string>('');
  const [formHours, setFormHours] = useState<string>('8');
  const [formError, setFormError] = useState<string | null>(null);

  // Accessibility focus management
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
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

  // If site ID is invalid or belongs to another org
  if (!site) {
    return (
      <div className="bg-surface rounded-xl border border-line p-12 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-12 h-12 bg-warning-soft text-warning rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h2 className="text-lg font-bold text-ink">Facility Unavailable or Not Found</h2>
        <p className="text-sm text-muted">
          The facility ID <code className="bg-subtle px-1 py-0.5 rounded text-warning font-mono">{siteId}</code> does not exist within the active organization <span className="font-semibold text-ink">{currentOrg.name}</span>.
        </p>
        <div className="pt-4">
          <Link
            href="/sites"
            className="px-4 py-2 bg-positive-strong text-white rounded-lg text-sm font-semibold hover:bg-positive-strong transition"
          >
            &larr; Return to Facilities Directory
          </Link>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingAsset(null);
    setFormKind('HVAC Air Handler');
    setFormLabel('');
    setFormArea('Main Hall - Room 101');
    setFormPowerW('1500');
    setFormMarketedHp('');
    setFormHours('8');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setFormKind(asset.kind);
    setFormLabel(asset.label);
    setFormArea(asset.area);
    setFormPowerW(asset.powerW !== undefined ? String(asset.powerW) : '');
    setFormMarketedHp(asset.marketedHp !== undefined ? String(asset.marketedHp) : '');
    setFormHours(asset.operatingHoursPerDay !== undefined ? String(asset.operatingHoursPerDay) : '8');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const powerNum = formPowerW ? parseFloat(formPowerW) : undefined;
    const hoursNum = formHours ? parseFloat(formHours) : undefined;
    const hpNum = formMarketedHp ? parseFloat(formMarketedHp) : undefined;

    if (!formLabel.trim()) {
      setFormError('Asset label / name is required.');
      return;
    }

    if (powerNum !== undefined && (!Number.isFinite(powerNum) || powerNum < 0)) {
      setFormError('Electrical input watts must be a finite non-negative number.');
      return;
    }

    if (hoursNum !== undefined && (!Number.isFinite(hoursNum) || hoursNum < 0 || hoursNum > 24)) {
      setFormError('Daily operating hours must be between 0 and 24.');
      return;
    }

    if (editingAsset) {
      const res = updateAsset({
        ...editingAsset,
        kind: formKind,
        label: formLabel,
        area: formArea,
        powerW: powerNum,
        marketedHp: hpNum,
        operatingHoursPerDay: hoursNum,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update asset.');
        return;
      }
    } else {
      const res = addAsset({
        siteId: site.id,
        kind: formKind,
        label: formLabel,
        area: formArea,
        powerW: powerNum,
        marketedHp: hpNum,
        origin: 'manual',
        confidence: 1.0,
        operatingHoursPerDay: hoursNum,
        status: 'active',
      });
      if (res.error) {
        setFormError(res.error);
        return;
      }
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="text-sm text-muted flex items-center space-x-1.5 mb-2">
          <Link href="/" className="hover:text-muted">Overview</Link>
          <span>/</span>
          <Link href="/sites" className="hover:text-muted">Sites</Link>
          <span>/</span>
          <span className="text-ink font-semibold">{site.name}</span>
        </nav>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{site.facilityCode} · Demo facility</p>
            <div>
              <h1 className="page-heading">{site.name}</h1>
            </div>
            <p className="text-sm text-muted mt-3">
              Sector: <span className="capitalize font-medium text-ink">{site.type}</span> • Country: <span className="font-medium text-ink">{site.country}</span> • IANA Timezone: <span className="font-mono text-ink">{site.timezone}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              ref={triggerBtnRef}
              onClick={openCreateModal}
              className="px-3.5 py-2 bg-positive-strong text-white rounded-lg text-sm font-semibold hover:bg-positive-strong transition flex items-center space-x-1.5 shadow-sm focus:ring-2 focus:ring-emerald-500"
            >
              <span>+ Register New Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset Hierarchy and Inventory Table */}
      <div className="bg-surface rounded-xl border border-line shadow-sm overflow-hidden">
        <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-2 bg-subtle">
          <div>
            <h2 className="text-sm font-bold text-ink">
              Facility Equipment &amp; Asset Ledger ({siteAssets.length})
            </h2>
            <p className="text-xs text-muted">
              Session only — edits reset on page reload. No database persistence in this temporary prototype.
            </p>
          </div>
          <SyntheticBadge evidenceState="MODEL_ESTIMATED" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-line text-muted uppercase tracking-wider bg-subtle/50">
                <th className="py-2.5 px-4 font-semibold">Equipment / Label</th>
                <th className="py-2.5 px-4 font-semibold">Rated Power (W)</th>
                <th className="py-2.5 px-4 font-semibold">Hours/Day</th>
                <th className="py-2.5 px-4 font-semibold">Est. Daily kWh</th>
                <th className="py-2.5 px-4 font-semibold">Provenance</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {siteAssets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No equipment currently registered for this site. Click &quot;+ Register New Asset&quot; above.
                  </td>
                </tr>
              ) : (
                siteAssets.map((asset) => {
                  const energyCalc = calculateDemoEnergy(asset.powerW, asset.operatingHoursPerDay, 24);
                  const emissionsCalc = calculateDemoEmissions(energyCalc.energyKwh);

                  return (
                    <tr key={asset.id} className="hover:bg-subtle/70 transition">
                      <td className="py-4 px-4 font-medium text-ink min-w-[240px]">
                        <div>{asset.label}</div>
                        <div className="text-sm text-muted font-normal mt-1">{asset.kind} · {asset.area}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-ink">
                        {asset.powerW !== undefined ? `${asset.powerW} W` : <span className="text-muted italic">Not rated</span>}
                        {asset.marketedHp !== undefined && (
                          <div className="text-xs text-muted" title="Marketed AC HP is not electrical watts">
                            ({asset.marketedHp} HP tag)
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-ink">
                        {asset.operatingHoursPerDay !== undefined ? `${asset.operatingHoursPerDay} h/d` : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-positive font-semibold">
                        {energyCalc.status === 'calculated' ? (
                          <div>
                            <span>{energyCalc.energyKwh} kWh</span>
                            <div className="text-xs text-muted font-normal">
                              {emissionsCalc.kgCO2e} kgCO2e
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted italic text-xs">Not calculated</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-subtle text-muted font-mono">
                          {asset.origin}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(asset)}
                          className="px-2 py-1 text-sm text-muted hover:text-ink underline focus:ring-1 focus:ring-slate-400 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="asset-dialog-title"
        >
          <div className="bg-surface rounded-xl shadow-xl max-w-md w-full p-6 border border-line space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 id="asset-dialog-title" className="text-base font-bold text-ink">
                {editingAsset ? 'Edit Registered Asset' : 'Register New Asset'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded p-1"
                aria-label="Close asset form dialog"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div role="alert" className="p-2.5 rounded bg-danger-soft border border-danger-border text-danger text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div>
                <label htmlFor="asset-label-input" className="block font-semibold text-ink mb-1">
                  Asset Name / Label *
                </label>
                <input
                  id="asset-label-input"
                  ref={firstInputRef}
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Science Hall Chiller A1"
                  className="w-full border border-line rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="asset-kind-input" className="block font-semibold text-ink mb-1">
                  Equipment Kind / Category
                </label>
                <input
                  id="asset-kind-input"
                  type="text"
                  value={formKind}
                  onChange={(e) => setFormKind(e.target.value)}
                  placeholder="e.g. HVAC Chiller, LED Array"
                  className="w-full border border-line rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="asset-area-input" className="block font-semibold text-ink mb-1">
                  Hierarchy Area / Room
                </label>
                <input
                  id="asset-area-input"
                  type="text"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  placeholder="e.g. Building B - Lab 204"
                  className="w-full border border-line rounded p-2 text-sm focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="asset-power-input" className="block font-semibold text-ink mb-1">
                    Electrical Input (Watts)
                  </label>
                  <input
                    id="asset-power-input"
                    type="number"
                    step="any"
                    value={formPowerW}
                    onChange={(e) => setFormPowerW(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-muted mt-0.5 block">Actual electrical input</span>
                </div>

                <div>
                  <label htmlFor="asset-hp-input" className="block font-semibold text-ink mb-1">
                    Marketed HP (Optional)
                  </label>
                  <input
                    id="asset-hp-input"
                    type="number"
                    step="any"
                    value={formMarketedHp}
                    onChange={(e) => setFormMarketedHp(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-warning mt-0.5 block">Never converted to watts</span>
                </div>
              </div>

              <div>
                <label htmlFor="asset-hours-input" className="block font-semibold text-ink mb-1">
                  Daily Operating Hours (0 - 24)
                </label>
                <input
                  id="asset-hours-input"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={formHours}
                  onChange={(e) => setFormHours(e.target.value)}
                  placeholder="8"
                  className="w-full border border-line rounded p-2 text-sm font-mono focus:ring-1 focus:ring-emerald-500"
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
                  {editingAsset ? 'Save Changes' : 'Confirm Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
