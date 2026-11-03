'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Check, AlertCircle, Upload, Eye, RefreshCw, ArrowRight, ShieldAlert } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { ScanCandidate, Asset } from '@/lib/contracts';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';

export default function CameraScanPage() {
  const { currentOrg, currentSite, sites, getScanPresets, addAsset } = useDemo();
  const presets = getScanPresets();

  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0].id);
  const [candidate, setCandidate] = useState<ScanCandidate>(presets[0]);
  const [customFileLoaded, setCustomFileLoaded] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string>('');

  // Camera stream state
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Form confirmation state
  const [targetSiteId, setTargetSiteId] = useState<string>(currentSite?.id ?? sites[0]?.id ?? '');
  const [label, setLabel] = useState<string>(presets[0].detectedLabel);
  const [kind, setKind] = useState<string>(presets[0].detectedKind);
  const [area, setArea] = useState<string>('Central Utility Plant');
  const [powerW, setPowerW] = useState<string>(presets[0].detectedWatts?.toString() ?? '');
  const [hours, setHours] = useState<string>(presets[0].suggestedHours.toString());
  const [isUnknownKind, setIsUnknownKind] = useState<boolean>(false);

  // Status feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedAsset, setConfirmedAsset] = useState<Asset | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Update target site when context changes
  useEffect(() => {
    if (currentSite) {
      setTargetSiteId(currentSite.id);
    }
  }, [currentSite]);

  // Handler for selecting a bundled demo preset
  const handleSelectPreset = (presetId: string) => {
    const selected = presets.find((p) => p.id === presetId);
    if (!selected) return;

    setSelectedPresetId(presetId);
    setCandidate(selected);
    setCustomFileLoaded(false);
    setCustomFileName('');
    setLabel(selected.detectedLabel);
    setKind(selected.detectedKind);
    setPowerW(selected.detectedWatts !== undefined ? selected.detectedWatts.toString() : '');
    setHours(selected.suggestedHours.toString());
    setIsUnknownKind(Boolean(selected.isUnknown));
    setFormError(null);
    setConfirmedAsset(null);
  };

  // Handler for camera activation
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Browser media devices API is not supported in this environment.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Camera permission denied or camera device unavailable.';
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Handler for file upload alternative
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileLoaded(true);
    setCustomFileName(file.name);
    // For arbitrary user images, never invent wattages! Mark as unknown candidate.
    const customCandidate: ScanCandidate = {
      id: `custom-${Date.now()}`,
      presetName: `Uploaded: ${file.name}`,
      detectedKind: 'Unknown Equipment',
      detectedLabel: `Detected Nameplate (${file.name.slice(0, 16)})`,
      detectedWatts: undefined, // Must be entered by human
      suggestedHours: 8,
      confidence: 0.5,
      boundingPoly: { x: 20, y: 20, width: 60, height: 60 },
      ocrEvidence: `ARBITRARY IMAGE OCR: Text unverified. Scientific integrity rule: Rated wattage cannot be fabricated from arbitrary images.`,
      isUnknown: true,
    };
    setCandidate(customCandidate);
    setLabel(customCandidate.detectedLabel);
    setKind('Unknown Equipment');
    setPowerW('');
    setHours('8');
    setIsUnknownKind(true);
    setFormError(null);
    setConfirmedAsset(null);
  };

  // Handler for confirmation & adding asset
  const handleConfirmAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!label.trim()) {
      setFormError('Asset label / name is required.');
      return;
    }

    const finalWatts = powerW.trim() ? parseFloat(powerW) : undefined;
    if (finalWatts !== undefined && (!Number.isFinite(finalWatts) || finalWatts < 0)) {
      setFormError('Electrical input watts must be a finite non-negative number.');
      return;
    }

    const finalHours = hours.trim() ? parseFloat(hours) : undefined;
    if (finalHours !== undefined && (!Number.isFinite(finalHours) || finalHours < 0 || finalHours > 24)) {
      setFormError('Operating hours must be between 0 and 24.');
      return;
    }

    const res = addAsset({
      siteId: targetSiteId,
      kind: isUnknownKind ? 'Unknown Equipment' : (kind.trim() || 'Unclassified'),
      label: label.trim(),
      area: area.trim() || 'General Facility',
      powerW: finalWatts,
      origin: 'camera_mock',
      confidence: candidate.confidence,
      operatingHoursPerDay: finalHours ?? 8,
      status: 'active',
    });

    if (res.error) {
      setFormError(res.error);
    } else if (res.asset) {
      setConfirmedAsset(res.asset);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Equipment Onboarding</p>
          <h1 className="page-heading">Camera Scan &amp; OCR Verification</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Simulated optical character recognition for equipment nameplates. In compliance with strict scientific rules,
            RGB cameras do not measure electricity or emissions directly; all detected candidates require explicit human confirmation.
          </p>
        </div>
        <Link
          href={`/sites/${currentSite?.id ?? ''}`}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-subtle"
        >
          View Facility Assets <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* Scientific Disclosure Alert */}
      <div className="panel p-5 border-l-4 border-l-info bg-info-soft/30 flex items-start gap-4 text-sm">
        <ShieldAlert className="text-info shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-ink">Scientific Integrity Safeguard</p>
          <p className="text-muted leading-relaxed">
            RGB computer vision only suggests candidate device classes and transcribed nameplate text. Rated electrical wattage (W)
            is distinct from marketed horsepower or thermal capacity. No emission or energy values are recorded until you review and confirm the asset below.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Input Selection (Camera, File, or Bundled Presets) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="panel p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
              <h2 className="text-base font-semibold">1. Select Input Source</h2>
              <SyntheticBadge label="SIMULATED DETECTION" />
            </div>

            {/* Source Mode Buttons */}
            <div className="grid sm:grid-cols-2 gap-3">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-line bg-surface hover:bg-subtle text-sm font-medium transition-colors"
                >
                  <Camera size={18} className="text-positive" />
                  Start Camera Stream
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-negative bg-negative-soft text-negative text-sm font-medium transition-colors"
                >
                  <RefreshCw size={18} />
                  Stop Camera Stream
                </button>
              )}

              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-line bg-surface hover:bg-subtle text-sm font-medium cursor-pointer transition-colors">
                <Upload size={18} className="text-info" />
                <span>Upload Nameplate Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                  aria-label="Upload nameplate image file"
                />
              </label>
            </div>

            {cameraError && (
              <div role="alert" className="p-3 text-xs rounded-lg bg-negative-soft text-negative border border-negative">
                {cameraError} (Falling back to simulated demo presets).
              </div>
            )}

            {/* Bundled Demo Presets */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Or Choose a Bundled Demo Image Preset
              </label>
              <div className="grid sm:grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`text-left p-3 rounded-lg border transition-all text-xs ${
                      selectedPresetId === p.id && !customFileLoaded
                        ? 'border-positive bg-positive-soft/40 text-ink'
                        : 'border-line bg-surface hover:bg-subtle text-muted'
                    }`}
                  >
                    <p className="font-semibold text-ink truncate">{p.presetName}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      {p.isUnknown ? 'Demonstrates Unknown Classification' : `${p.detectedWatts}W · ${Math.round(p.confidence * 100)}% confidence`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Video or Image Viewport with Bounding Box Overlay */}
            <div className="relative rounded-xl border border-line bg-black/80 aspect-video overflow-hidden flex items-center justify-center">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-3 max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-surface/20 flex items-center justify-center mx-auto text-2xl">
                    📸
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    {customFileLoaded ? `Loaded File: ${customFileName}` : candidate.presetName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Simulated camera frame with localized OCR candidate bounding box
                  </p>
                </div>
              )}

              {/* Simulated Bounding Box Overlay */}
              <div
                className="absolute border-2 border-positive/90 bg-positive/10 rounded flex flex-col justify-between p-2 shadow-lg"
                style={{
                  top: `${candidate.boundingPoly.y}%`,
                  left: `${candidate.boundingPoly.x}%`,
                  width: `${candidate.boundingPoly.width}%`,
                  height: `${candidate.boundingPoly.height}%`,
                }}
              >
                <div className="flex items-center justify-between text-[11px] bg-slate-900/90 text-white px-2 py-0.5 rounded font-mono">
                  <span>{candidate.detectedKind}</span>
                  <span className="text-positive">{Math.round(candidate.confidence * 100)}%</span>
                </div>
                <div className="text-[10px] text-positive-soft font-mono bg-slate-900/80 px-1 py-0.5 rounded truncate">
                  {candidate.ocrEvidence.slice(0, 40)}...
                </div>
              </div>
            </div>

            {/* Extracted Nameplate OCR Transcript */}
            <div className="p-4 rounded-lg bg-subtle border border-line space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted uppercase tracking-wider text-[11px]">
                  Raw Nameplate OCR Evidence
                </span>
                <span className="font-mono text-muted">Model confidence: {Math.round(candidate.confidence * 100)}%</span>
              </div>
              <p className="font-mono text-ink bg-surface p-2.5 rounded border border-line break-words">
                {candidate.ocrEvidence}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Human Confirmation & Asset Registration Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="panel p-6 space-y-6">
            <div className="border-b border-line pb-4">
              <h2 className="text-base font-semibold">2. Review &amp; Confirm Asset</h2>
              <p className="text-xs text-muted mt-1">
                Edit detected attributes before adding this asset to your inventory.
              </p>
            </div>

            {confirmedAsset ? (
              <div className="p-6 rounded-xl bg-positive-soft border border-positive space-y-4 text-center">
                <div className="w-12 h-12 bg-positive text-surface rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-base">Equipment Successfully Registered</h3>
                  <p className="text-xs text-muted mt-1">
                    Asset <strong className="text-ink">{confirmedAsset.label}</strong> has been added to facility{' '}
                    <strong className="text-ink">{sites.find((s) => s.id === confirmedAsset.siteId)?.name}</strong>.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setConfirmedAsset(null)}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-line bg-surface hover:bg-subtle text-ink"
                  >
                    Scan Another Device
                  </button>
                  <Link
                    href={`/sites/${confirmedAsset.siteId}`}
                    className="px-4 py-2 text-xs font-medium rounded-lg bg-positive text-slate-950 hover:bg-positive/90 inline-flex items-center justify-center gap-1.5"
                  >
                    View in Facility <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmAsset} className="space-y-4 text-sm">
                {formError && (
                  <div role="alert" className="p-3 rounded-lg bg-negative-soft text-negative border border-negative text-xs">
                    {formError}
                  </div>
                )}

                {/* Facility Selector */}
                <div>
                  <label htmlFor="scan-site" className="block text-xs font-medium text-muted mb-1.5">
                    Target Facility *
                  </label>
                  <select
                    id="scan-site"
                    value={targetSiteId}
                    onChange={(e) => setTargetSiteId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.facilityCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asset Label */}
                <div>
                  <label htmlFor="scan-label" className="block text-xs font-medium text-muted mb-1.5">
                    Asset Label / Name *
                  </label>
                  <input
                    id="scan-label"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
                  />
                </div>

                {/* Unknown Equipment Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="scan-is-unknown"
                    type="checkbox"
                    checked={isUnknownKind}
                    onChange={(e) => {
                      setIsUnknownKind(e.target.checked);
                      if (e.target.checked) {
                        setKind('Unknown Equipment');
                      }
                    }}
                    className="rounded border-line text-positive focus:ring-positive"
                  />
                  <label htmlFor="scan-is-unknown" className="text-xs text-muted cursor-pointer">
                    Classify as Unknown / Unverified Equipment
                  </label>
                </div>

                {/* Equipment Category / Kind */}
                {!isUnknownKind && (
                  <div>
                    <label htmlFor="scan-kind" className="block text-xs font-medium text-muted mb-1.5">
                      Equipment Kind / Category
                    </label>
                    <input
                      id="scan-kind"
                      type="text"
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
                    />
                  </div>
                )}

                {/* Hierarchy Area */}
                <div>
                  <label htmlFor="scan-area" className="block text-xs font-medium text-muted mb-1.5">
                    Hierarchy Area / Room
                  </label>
                  <input
                    id="scan-area"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Utility Room B, Rooftop Chiller Bay"
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
                  />
                </div>

                {/* Electrical Input (Watts) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="scan-power" className="text-xs font-medium text-muted">
                      Electrical Input (Watts)
                    </label>
                    <span className="text-[11px] text-muted">Pure electrical input power</span>
                  </div>
                  <input
                    id="scan-power"
                    type="number"
                    min="0"
                    step="any"
                    value={powerW}
                    onChange={(e) => setPowerW(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive font-mono"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    Do NOT enter marketed AC horsepower directly. 1 HP = 746W theoretical shaft power, but compressors require electrical input ratings.
                  </p>
                </div>

                {/* Daily Operating Hours */}
                <div>
                  <label htmlFor="scan-hours" className="block text-xs font-medium text-muted mb-1.5">
                    Estimated Operating Hours / Day (0 - 24)
                  </label>
                  <input
                    id="scan-hours"
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive font-mono"
                  />
                </div>

                {/* Estimated Consumption Preview */}
                {powerW && hours && (
                  <div className="p-3 rounded-lg bg-subtle border border-line text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted">Estimated Daily Energy:</span>
                      <span className="font-semibold text-ink">
                        {((parseFloat(powerW) * parseFloat(hours)) / 1000).toFixed(1)} kWh/day
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Estimated Daily Scope 2:</span>
                      <span className="font-semibold text-positive">
                        {(((parseFloat(powerW) * parseFloat(hours)) / 1000) * 0.45).toFixed(2)} kgCO2e/day
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-positive text-slate-950 font-medium text-sm hover:bg-positive/90 transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
                >
                  <Check size={16} /> Confirm &amp; Add to Inventory
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
