'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Key, Users, RefreshCw, CheckCircle2, Lock, Eye, Edit3, Trash2 } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';

type DemoRole = 'admin' | 'analyst' | 'manager' | 'auditor';

interface RoleCapability {
  name: string;
  description: string;
  admin: boolean;
  analyst: boolean;
  manager: boolean;
  auditor: boolean;
}

const CAPABILITIES: RoleCapability[] = [
  {
    name: 'View GHG Inventory & Forecasts',
    description: 'Read-only access to organizational emissions ledgers and predictive charts.',
    admin: true,
    analyst: true,
    manager: true,
    auditor: true,
  },
  {
    name: 'Export Injection-Safe CSV Reports',
    description: 'Download sanitized activity ledgers and compliance audit summaries.',
    admin: true,
    analyst: true,
    manager: true,
    auditor: true,
  },
  {
    name: 'Record Activity Ledger Entries',
    description: 'Add primary boundary meters and attributed equipment child intervals.',
    admin: true,
    analyst: true,
    manager: true,
    auditor: false,
  },
  {
    name: 'Register & Edit Facility Equipment',
    description: 'Modify rated wattage (W), operating schedules, and hierarchy areas.',
    admin: true,
    analyst: false,
    manager: true,
    auditor: false,
  },
  {
    name: 'Modify Organization & GWP Settings',
    description: 'Alter operational control boundary definitions and GWP standard presets.',
    admin: true,
    analyst: false,
    manager: false,
    auditor: false,
  },
];

export default function SettingsPage() {
  const { currentOrg, resetSession } = useDemo();

  const [activeRole, setActiveRole] = useState<DemoRole>('admin');
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [storageClearSuccess, setStorageClearSuccess] = useState<boolean>(false);

  // Editable organization form state (demo in-memory)
  const [orgName, setOrgName] = useState<string>(currentOrg.name);
  const [boundary, setBoundary] = useState<string>(currentOrg.reportingBoundary);
  const [gwpVersion, setGwpVersion] = useState<string>(currentOrg.defaultGwpVersion);
  const [currency, setCurrency] = useState<string>(currentOrg.currency);
  const [orgSaveSuccess, setOrgSaveSuccess] = useState<boolean>(false);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    setOrgSaveSuccess(true);
    setTimeout(() => setOrgSaveSuccess(false), 3000);
  };

  const handleResetFixtures = () => {
    resetSession();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleClearPreferences = () => {
    try {
      localStorage.removeItem('carbonmind-theme');
    } catch {
      // ignore
    }
    setStorageClearSuccess(true);
    setTimeout(() => setStorageClearSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administration &amp; Governance</p>
          <h1 className="page-heading">Organization Settings &amp; Access Controls</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Manage enterprise reporting boundaries, accounting standards, and simulate role-based authorization interfaces.
          </p>
        </div>
        <SyntheticBadge label="SECURITY PROTOTYPE" />
      </div>

      {/* Mandatory Security Disclaimer */}
      <div className="panel p-5 border-l-4 border-l-warning bg-warning-soft/30 flex items-start gap-4 text-sm">
        <ShieldAlert className="text-warning shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-ink">DEMO ONLY — NO AUTHORIZATION ENFORCEMENT</p>
          <p className="text-muted leading-relaxed">
            This role switcher demonstrates user experience workflows for different enterprise personas.
            <strong> It does not enforce cryptographic isolation or multi-tenant authorization boundaries.</strong> Production
            enforcement requires real server authentication and row-level security (REAL-001).
          </p>
        </div>
      </div>

      {/* Role Simulation Switcher & Capability Matrix */}
      <section className="panel p-6 space-y-6" aria-labelledby="role-simulation-heading">
        <div className="border-b border-line pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="role-simulation-heading" className="text-base font-semibold">
              Interactive Role Simulation
            </h2>
            <p className="text-xs text-muted mt-1">
              Select an illustrative enterprise role to test interface permissions and view restrictions.
            </p>
          </div>
          <span className="text-xs font-mono text-muted bg-subtle px-2.5 py-1 rounded">
            Active Persona: <strong className="text-ink uppercase">{activeRole}</strong>
          </span>
        </div>

        {/* Persona Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'admin',
              label: 'Org Admin',
              desc: 'Full administrative control over settings, assets, and accounting ledgers.',
            },
            {
              id: 'analyst',
              label: 'Sustainability Analyst',
              desc: 'Records energy activity, runs scenario simulations, and exports reports.',
            },
            {
              id: 'manager',
              label: 'Facility Manager',
              desc: 'Inspects on-site equipment, updates operating hours, registers assets.',
            },
            {
              id: 'auditor',
              label: 'Read-only Auditor',
              desc: 'Third-party compliance verification with read-only inspection access.',
            },
          ].map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id as DemoRole)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeRole === role.id
                  ? 'border-positive bg-positive-soft/40 shadow-sm'
                  : 'border-line bg-surface hover:bg-subtle text-muted'
              }`}
            >
              <p className="font-semibold text-sm text-ink">{role.label}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{role.desc}</p>
            </button>
          ))}
        </div>

        {/* Capability Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-subtle text-muted border-y border-line">
              <tr>
                <th className="px-6 py-3 font-medium">Platform Capability</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-center">Permitted for {activeRole.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CAPABILITIES.map((cap) => {
                const allowed = cap[activeRole];
                return (
                  <tr key={cap.name} className="hover:bg-subtle/50">
                    <td className="px-6 py-3.5 font-medium text-ink">{cap.name}</td>
                    <td className="px-6 py-3.5 text-muted">{cap.description}</td>
                    <td className="px-6 py-3.5 text-center">
                      {allowed ? (
                        <span className="inline-flex items-center gap-1 text-positive font-semibold font-mono">
                          <CheckCircle2 size={14} /> GRANTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted/60 font-mono">
                          <Lock size={14} /> RESTRICTED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Organization Accounting Profile */}
      <section className="panel p-6 space-y-6" aria-labelledby="org-profile-heading">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h2 id="org-profile-heading" className="text-base font-semibold">
              Organization Accounting Profile
            </h2>
            <p className="text-xs text-muted mt-1">
              Configure corporate boundary parameters for {currentOrg.name}
            </p>
          </div>
          {orgSaveSuccess && (
            <span className="text-xs text-positive font-medium flex items-center gap-1">
              <CheckCircle2 size={14} /> Settings updated (in-memory demo)
            </span>
          )}
        </div>

        <form onSubmit={handleSaveOrg} className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label htmlFor="settings-name" className="block text-xs font-medium text-muted mb-1.5">
              Organization Legal / Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
            />
          </div>

          <div>
            <label htmlFor="settings-currency" className="block text-xs font-medium text-muted mb-1.5">
              Reporting Currency
            </label>
            <select
              id="settings-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="EGP">EGP (E£) - Egyptian Pound</option>
            </select>
          </div>

          <div>
            <label htmlFor="settings-boundary" className="block text-xs font-medium text-muted mb-1.5">
              Organizational Boundary Approach
            </label>
            <input
              id="settings-boundary"
              type="text"
              value={boundary}
              onChange={(e) => setBoundary(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
            />
          </div>

          <div>
            <label htmlFor="settings-gwp" className="block text-xs font-medium text-muted mb-1.5">
              Default GWP Version Standard
            </label>
            <select
              id="settings-gwp"
              value={gwpVersion}
              onChange={(e) => setGwpVersion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
            >
              <option value="IPCC AR6 GWP100">IPCC Sixth Assessment Report (AR6 GWP100)</option>
              <option value="IPCC AR5 GWP100">IPCC Fifth Assessment Report (AR5 GWP100)</option>
              <option value="IPCC AR4 GWP100">IPCC Fourth Assessment Report (AR4 GWP100)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-positive text-slate-950 font-medium text-sm hover:bg-positive/90 transition-colors shadow-sm"
            >
              Save Configuration (Demo)
            </button>
          </div>
        </form>
      </section>

      {/* Data Management & Session Controls */}
      <section className="panel p-6 space-y-4" aria-labelledby="data-controls-heading">
        <h2 id="data-controls-heading" className="text-base font-semibold">
          Session &amp; Local Storage Controls
        </h2>
        <p className="text-xs text-muted">
          All prototype state is stored in component memory and local storage. No server database is connected.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleResetFixtures}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-surface hover:bg-subtle text-xs font-medium text-ink transition-colors"
          >
            <RefreshCw size={14} /> Reset Session Fixtures
          </button>

          <button
            type="button"
            onClick={handleClearPreferences}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-surface hover:bg-subtle text-xs font-medium text-muted hover:text-ink transition-colors"
          >
            <Trash2 size={14} /> Clear Local Theme Preference
          </button>
        </div>

        {resetSuccess && (
          <p className="text-xs text-positive font-medium flex items-center gap-1.5 pt-1">
            <CheckCircle2 size={14} /> Session reset: initial synthetic fixtures restored.
          </p>
        )}
        {storageClearSuccess && (
          <p className="text-xs text-positive font-medium flex items-center gap-1.5 pt-1">
            <CheckCircle2 size={14} /> Local storage preferences cleared.
          </p>
        )}
      </section>
    </div>
  );
}
