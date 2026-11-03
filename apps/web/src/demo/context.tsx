'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Organization,
  Site,
  Asset,
  Activity,
  Recommendation,
  ScanCandidate,
  ForecastResult,
  ScenarioInput,
  ScenarioResult,
} from '@/lib/contracts';
import { adapter, OrgTotals } from './adapter';
import { DEMO_ASSISTANT_CONVERSATIONS } from './fixtures';

interface DemoContextType {
  currentOrg: Organization;
  currentSite: Site | undefined;
  organizations: Organization[];
  sites: Site[];
  assets: Asset[];
  siteAssets: Asset[];
  activities: Activity[];
  siteActivities: Activity[];
  recommendations: Recommendation[];
  siteRecommendations: Recommendation[];
  orgTotals: OrgTotals;
  siteTotals: OrgTotals;
  totals: OrgTotals;
  setOrganization: (orgId: string) => void;
  setSite: (siteId: string) => void;
  addAsset: (asset: Omit<Asset, 'id'>) => { asset?: Asset; error?: string };
  updateAsset: (asset: Asset) => { success: boolean; error?: string };
  addActivity: (data: Omit<Activity, 'id' | 'isSynthetic' | 'schemaVersion' | 'orgId'>) => {
    activity?: Activity;
    error?: string;
  };
  getForecast: (horizonDays?: 7 | 14 | 30, budgetKgCO2e?: number) => ForecastResult;
  runSimulation: (params: ScenarioInput) => ScenarioResult;
  getScanPresets: () => ScanCandidate[];
  getAssistantConversations: () => typeof DEMO_ASSISTANT_CONVERSATIONS;
  resetSession: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrgId, setCurrentOrgId] = useState<string>(adapter.getCurrentOrgId());
  const [currentSiteId, setCurrentSiteId] = useState<string>(adapter.getCurrentSiteId());
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = adapter.subscribe(() => {
      setCurrentOrgId(adapter.getCurrentOrgId());
      setCurrentSiteId(adapter.getCurrentSiteId());
      setTick((t) => t + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const currentOrg = adapter.getOrganization(currentOrgId) || adapter.getOrganizations()[0];
  const currentSite = adapter.getSite(currentSiteId);
  const organizations = adapter.getOrganizations();
  const sites = adapter.getSites(currentOrgId);
  const assets = adapter.getAssets();
  const siteAssets = adapter.getAssets(currentSiteId);
  const activities = adapter.getActivities();
  const siteActivities = adapter.getActivities(currentSiteId);

  const recommendations = adapter.getRecommendations();
  const siteRecommendations = adapter.getRecommendations(currentSiteId);

  const orgTotals = adapter.getOrgTotals();
  const siteTotals = adapter.getSiteTotals(currentSiteId);

  const handleSetOrganization = (orgId: string) => {
    adapter.setOrganization(orgId);
  };

  const handleSetSite = (siteId: string) => {
    adapter.setSite(siteId);
  };

  return (
    <DemoContext.Provider
      value={{
        currentOrg,
        currentSite,
        organizations,
        sites,
        assets,
        siteAssets,
        activities,
        siteActivities,
        recommendations,
        siteRecommendations,
        orgTotals,
        siteTotals,
        totals: siteTotals, // Active facility totals as default linked metric
        setOrganization: handleSetOrganization,
        setSite: handleSetSite,
        addAsset: (data) => adapter.addAsset(data),
        updateAsset: (asset) => adapter.updateAsset(asset),
        addActivity: (data) => adapter.addActivity(data),
        getForecast: (horizon, budget) => adapter.getForecast(horizon, budget),
        runSimulation: (params) => adapter.runSimulation(params),
        getScanPresets: () => adapter.getScanPresets(),
        getAssistantConversations: () => adapter.getAssistantConversations(),
        resetSession: () => adapter.resetSession(),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
