'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { useDemo } from '@/demo/context';

export default function SitesPage() {
  const { currentOrg, currentSite, sites, assets, setSite } = useDemo();
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">{currentOrg.name} / Campus &amp; buildings</p>
        <h1 className="page-heading">Sites &amp; facilities</h1>
        <p className="mt-3 text-sm text-muted">{sites.length} demo facilities. Select a facility to explore its equipment.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sites.map((site) => {
          const equipment = assets.filter((asset) => asset.siteId === site.id);
          const selected = currentSite?.id === site.id;
          return (
            <article key={site.id} className="panel p-6 sm:p-8 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="text-xs text-muted">{site.facilityCode} · Demo facility</span>
                {selected && <span className="text-xs text-positive bg-positive-soft px-2 py-1 rounded">Selected</span>}
              </div>
              <h2 className="text-xl font-semibold leading-snug">{site.name}</h2>
              <p className="flex items-center gap-2 text-sm text-muted mt-3"><MapPin size={15} aria-hidden="true" />{site.country} <span className="text-line">/</span> {site.timezone}</p>
              <div className="my-7 border-y border-line py-5">
                <p className="text-sm font-medium">{equipment.length} registered assets</p>
                <p className="mt-2 text-sm text-muted leading-relaxed">{equipment.slice(0, 2).map((asset) => asset.kind).join(', ') || 'No equipment registered yet.'}{equipment.length > 2 ? ` and ${equipment.length - 2} more.` : ''}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                <button onClick={() => setSite(site.id)} disabled={selected} className="text-sm text-muted hover:text-ink disabled:opacity-60 disabled:cursor-default">{selected ? 'Active facility' : 'Set as active facility'}</button>
                <Link href={`/sites/${site.id}`} className="inline-flex items-center gap-2 rounded-lg bg-positive-strong px-4 py-2.5 text-sm text-white font-medium hover:opacity-90">View equipment <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
