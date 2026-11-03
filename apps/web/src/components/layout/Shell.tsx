'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Camera,
  FileText,
  LayoutDashboard,
  List,
  Menu,
  MessageSquare,
  Moon,
  Settings as SettingsIcon,
  Sliders,
  Sun,
  TrendingUp,
  X,
} from 'lucide-react';
import { useDemo } from '@/demo/context';

const navigationLinks = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Sites & Assets', href: '/sites', icon: Building2 },
  { label: 'Carbon Inventory', href: '/inventory', icon: List },
  { label: 'Camera Scan', href: '/scan', icon: Camera },
  { label: 'Forecasts', href: '/forecasts', icon: TrendingUp },
  { label: 'Optimization Studio', href: '/optimize', icon: Sliders },
  { label: 'AI Assistant', href: '/assistant', icon: MessageSquare },
  { label: 'Reports & Audit', href: '/reports', icon: FileText },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentOrg, currentSite, organizations, sites, setOrganization, setSite, resetSession } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('carbonmind-theme', nextTheme);
    } catch {
      // Storage restrictions must not prevent changing appearance.
    }
  };

  const renderNavigation = () => (
    <>
      <p className="px-3 mb-3 text-xs font-medium text-muted">WORKSPACE</p>
      <nav aria-label="Workspace navigation" className="space-y-1">
        {navigationLinks.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-positive-soft text-positive font-medium'
                  : 'text-muted hover:bg-subtle hover:text-ink'
              }`}
            >
              <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 z-[60] bg-surface p-3 rounded-lg"
      >
        Skip to content
      </a>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col overflow-y-auto border-r border-line bg-surface px-5 py-8">
        <Link href="/" aria-label="CarbonMind home" className="wordmark px-3">
          Carbon<span>Mind</span>
          <i aria-hidden="true" />
        </Link>
        <p className="px-3 mt-2 mb-8 text-xs text-muted">Carbon intelligence</p>
        {renderNavigation()}
        <div className="mt-auto px-3 pt-8 text-xs text-muted leading-relaxed">
          <p className="text-ink font-medium mb-1">Prototype workspace</p>
          <p>Session only — resets on reload</p>
          <button onClick={resetSession} className="mt-3 underline underline-offset-4 hover:text-ink">
            Reset Fixtures
          </button>
        </div>
      </aside>

      <div className="lg:pl-60 min-w-0">
        <header className="border-b border-line bg-surface">
          <div className="flex items-center justify-between gap-4 px-5 sm:px-8 h-20">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                className="lg:hidden p-2 -ml-2 text-muted hover:text-ink rounded-lg hover:bg-subtle"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
              <Link href="/" className="wordmark lg:hidden">
                Carbon<span>Mind</span>
                <i aria-hidden="true" />
              </Link>
              <p className="hidden lg:block text-sm text-muted">
                Workspace <span className="px-3 text-muted/50">/</span>
                <span className="text-ink">
                  {navigationLinks.find((item) => item.href === pathname)?.label ??
                    (pathname.startsWith('/sites/') ? 'Site details' : 'Overview')}
                </span>
              </p>
            </div>
            <button
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Dark mode"
              onClick={toggleTheme}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-ink hover:bg-subtle"
            >
              {theme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
              <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>
          {mobileMenuOpen && (
            <div id="mobile-navigation" className="lg:hidden border-t border-line bg-surface p-5">
              {renderNavigation()}
              <button
                onClick={resetSession}
                className="mt-6 px-3 text-sm text-muted underline underline-offset-4"
              >
                Reset Fixtures
              </button>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:flex xl:items-center px-5 sm:px-8 pb-5">
            <div className="flex min-w-0 items-center gap-3 xl:pr-6 xl:border-r border-line">
              <label htmlFor="org-select" className="text-sm text-muted shrink-0">
                Organization
              </label>
              <select
                id="org-select"
                aria-label="Select Organization"
                value={currentOrg.id}
                onChange={(event) => setOrganization(event.target.value)}
                className="context-select"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex min-w-0 items-center gap-3 xl:pl-2">
              <label htmlFor="site-select" className="text-sm text-muted shrink-0">
                Facility
              </label>
              <select
                id="site-select"
                aria-label="Select Facility"
                value={currentSite?.id ?? ''}
                onChange={(event) => setSite(event.target.value)}
                className="context-select"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="px-5 sm:px-8 pt-6">
          <div className="demo-notice mx-auto max-w-[1400px]">
            <span className="demo-label">Demo</span>
            <p>
              <strong>All data &amp; factors are synthetic.</strong>{' '}
              {currentOrg.id === 'org-atlas'
                ? 'AASTMT is used as a demo name; these are not its actual records.'
                : 'Organizations and records are fictional examples.'}
            </p>
          </div>
        </div>
        <main id="main-content" className="mx-auto w-full max-w-[1464px] min-w-0 px-5 sm:px-8 py-8 sm:py-10">
          {children}
        </main>
        <footer className="mx-auto max-w-[1464px] px-5 sm:px-8 py-6 text-xs text-muted border-t border-line flex flex-col sm:flex-row justify-between gap-3">
          <span>Synthetic prototype · No live backend, external API, or database persistence.</span>
          <span>CarbonMind</span>
        </footer>
      </div>
    </div>
  );
};
