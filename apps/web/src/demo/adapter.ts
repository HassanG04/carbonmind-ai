/**
 * Asynchronous Local Data Adapter for Prototype (PROTO-001)
 *
 * NOTE: There is NO backend database or HTTP API connection.
 * All state is kept in-memory for the current session ("Session only — resets on reload").
 *
 * Future Mapping Architecture:
 * - getAssets / addAsset / updateAsset  -> /v1/assets and /v1/assets/confirm
 * - getActivities / addActivity        -> /v1/activities
 * - getEmissions / getTotals           -> /v1/emissions/calculate and /v1/emissions/summary
 * - getForecasts                       -> /v1/forecasts
 * - runSimulation                      -> /v1/simulations
 */

import {
  Organization,
  Site,
  Asset,
  Activity,
  DEMO_FACTOR,
  Recommendation,
  ScanCandidate,
  ForecastResult,
  ScenarioInput,
  ScenarioResult,
} from '@/lib/contracts';
import {
  DEMO_ORGANIZATIONS,
  DEMO_SITES,
  DEMO_ASSETS,
  DEMO_ACTIVITIES,
  DEMO_RECOMMENDATIONS,
  DEMO_SCAN_PRESETS,
  DEMO_ASSISTANT_CONVERSATIONS,
} from './fixtures';
import {
  aggregateActivities,
  calculateDemoEnergy,
  calculateDemoEmissions,
  validateIsoTimestampWithOffset,
  checkIntervalsOverlap,
  AggregationResult,
  calculateDemoForecast,
  runDemoScenarioSimulation,
} from './math';

export type OrgTotals = AggregationResult;

class DemoDataAdapter {
  private currentOrgId: string = 'org-atlas';
  private currentSiteId: string = 'site-atlas-main';

  // Session-only in-memory storage namespaced by orgId
  private sessionAssets: Record<string, Asset[]> = {};
  private sessionActivities: Record<string, Activity[]> = {};

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initDefaultSession();
  }

  private initDefaultSession() {
    this.sessionAssets = {
      'org-atlas': DEMO_ASSETS.filter((a) => a.siteId.startsWith('site-atlas')).map((a) => ({ ...a })),
      'org-meridian': DEMO_ASSETS.filter((a) => a.siteId.startsWith('site-meridian')).map((a) => ({ ...a })),
      'org-northstar': DEMO_ASSETS.filter((a) => a.siteId.startsWith('site-northstar')).map((a) => ({ ...a })),
    };

    this.sessionActivities = {
      'org-atlas': DEMO_ACTIVITIES.filter((a) => a.orgId === 'org-atlas').map((a) => ({ ...a })),
      'org-meridian': DEMO_ACTIVITIES.filter((a) => a.orgId === 'org-meridian').map((a) => ({ ...a })),
      'org-northstar': DEMO_ACTIVITIES.filter((a) => a.orgId === 'org-northstar').map((a) => ({ ...a })),
    };
  }

  /**
   * Resets session to initial synthetic fixtures and notifies all subscribers immediately.
   */
  public resetSession(): void {
    this.initDefaultSession();
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  // Organization & Site Selection
  public getCurrentOrgId(): string {
    return this.currentOrgId;
  }

  public getCurrentSiteId(): string {
    return this.currentSiteId;
  }

  public setOrganization(orgId: string): void {
    const org = DEMO_ORGANIZATIONS.find((o) => o.id === orgId);
    if (!org) return;
    this.currentOrgId = orgId;
    const sites = this.getSites(orgId);
    if (sites.length > 0) {
      this.currentSiteId = sites[0].id;
    }
    this.notify();
  }

  public setSite(siteId: string): void {
    const site = DEMO_SITES.find((s) => s.id === siteId);
    if (!site) return;
    this.currentSiteId = siteId;
    if (site.orgId !== this.currentOrgId) {
      this.currentOrgId = site.orgId;
    }
    this.notify();
  }

  // Organizations
  public getOrganizations(): Organization[] {
    return DEMO_ORGANIZATIONS;
  }

  public getOrganization(orgId: string): Organization | undefined {
    return DEMO_ORGANIZATIONS.find((o) => o.id === orgId);
  }

  // Sites
  public getSites(orgId?: string): Site[] {
    const targetOrg = orgId ?? this.currentOrgId;
    return DEMO_SITES.filter((s) => s.orgId === targetOrg);
  }

  public getSite(siteId: string): Site | undefined {
    return DEMO_SITES.find((s) => s.id === siteId);
  }

  // Assets
  public getAssets(siteId?: string): Asset[] {
    const orgAssets = this.sessionAssets[this.currentOrgId] || [];
    if (siteId) {
      return orgAssets.filter((a) => a.siteId === siteId);
    }
    return orgAssets;
  }

  public addAsset(assetData: Omit<Asset, 'id'>): { asset?: Asset; error?: string } {
    // Cross-organization boundary validation
    const site = this.getSite(assetData.siteId);
    if (!site || site.orgId !== this.currentOrgId) {
      return { error: `Site '${assetData.siteId}' does not belong to active organization '${this.currentOrgId}'.` };
    }

    if (!assetData.label || !assetData.label.trim()) {
      return { error: 'Asset label / name is required.' };
    }

    if (assetData.powerW !== undefined && (!Number.isFinite(assetData.powerW) || assetData.powerW < 0)) {
      return { error: 'Rated power watts must be a finite non-negative number.' };
    }

    if (assetData.operatingHoursPerDay !== undefined && (!Number.isFinite(assetData.operatingHoursPerDay) || assetData.operatingHoursPerDay < 0 || assetData.operatingHoursPerDay > 24)) {
      return { error: 'Operating hours must be between 0 and 24.' };
    }

    const id = `asset-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newAsset: Asset = {
      ...assetData,
      id,
    };
    if (!this.sessionAssets[this.currentOrgId]) {
      this.sessionAssets[this.currentOrgId] = [];
    }
    this.sessionAssets[this.currentOrgId].push(newAsset);
    this.notify();
    return { asset: newAsset };
  }

  public updateAsset(asset: Asset): { success: boolean; error?: string } {
    const site = this.getSite(asset.siteId);
    if (!site || site.orgId !== this.currentOrgId) {
      return { success: false, error: 'Asset site does not belong to active organization.' };
    }

    const list = this.sessionAssets[this.currentOrgId] || [];
    const idx = list.findIndex((a) => a.id === asset.id);
    if (idx !== -1) {
      list[idx] = asset;
      this.notify();
      return { success: true };
    }
    return { success: false, error: 'Asset not found.' };
  }

  // Activities
  public getActivities(siteId?: string): Activity[] {
    const orgActivities = this.sessionActivities[this.currentOrgId] || [];
    if (siteId) {
      return orgActivities.filter((a) => a.siteId === siteId);
    }
    return orgActivities;
  }

  public addActivity(
    data: Omit<Activity, 'id' | 'isSynthetic' | 'schemaVersion' | 'orgId'>
  ): { activity?: Activity; error?: string } {
    // 1. Cross-organization validation
    const site = this.getSite(data.siteId);
    if (!site || site.orgId !== this.currentOrgId) {
      return { error: `Selected facility '${data.siteId}' does not belong to active organization '${this.currentOrgId}'.` };
    }

    // 2. Quantity validation
    if (data.quantityKwh < 0 || !Number.isFinite(data.quantityKwh)) {
      return { error: 'Quantity kWh must be a finite, non-negative number.' };
    }

    // 3. Timestamp format & explicit offset validation
    const startVal = validateIsoTimestampWithOffset(data.start);
    if (!startVal.valid) {
      return { error: `Start timestamp: ${startVal.error}` };
    }
    const endVal = validateIsoTimestampWithOffset(data.end);
    if (!endVal.valid) {
      return { error: `End timestamp: ${endVal.error}` };
    }

    const startMs = new Date(data.start).getTime();
    const endMs = new Date(data.end).getTime();

    if (endMs <= startMs) {
      return { error: 'End timestamp must be strictly after start timestamp.' };
    }

    const elapsedHours = (endMs - startMs) / (1000 * 60 * 60);

    // 4. In-memory check against duplicate ID / conflicting intervals for candidate
    const existingActivities = this.getActivities();

    if (data.representation === 'primary') {
      // Check conflicting overlapping intervals for the same sourceId on this site
      const sameSourceActivities = existingActivities.filter(
        (a) => a.siteId === data.siteId && a.sourceId === data.sourceId && a.representation === 'primary'
      );
      for (const ex of sameSourceActivities) {
        if (checkIntervalsOverlap(data.start, data.end, ex.start, ex.end)) {
          return {
            error: `Conflicting overlapping primary interval for source '${data.sourceId}' on site '${data.siteId}': [${data.start} - ${data.end}] overlaps with existing [${ex.start} - ${ex.end}]. Adjacent non-overlapping intervals are permitted.`,
          };
        }
      }
    } else if (data.representation === 'attribution') {
      // Attribution parent validation
      if (!data.parentActivityId) {
        return { error: 'Attribution activities require a valid parentActivityId.' };
      }
      const parent = existingActivities.find((a) => a.id === data.parentActivityId);
      if (!parent) {
        return { error: `Referenced parent activity '${data.parentActivityId}' was not found.` };
      }
      if (parent.representation !== 'primary') {
        return { error: `Attribution parent must be a primary meter activity.` };
      }
      if (parent.orgId !== this.currentOrgId || parent.siteId !== data.siteId) {
        return { error: `Attribution parent belongs to a different site/organization.` };
      }

      const parentStart = new Date(parent.start).getTime();
      const parentEnd = new Date(parent.end).getTime();
      if (startMs < parentStart || endMs > parentEnd) {
        return {
          error: `Attribution activity interval [${data.start} - ${data.end}] must be fully contained within parent interval [${parent.start} - ${parent.end}].`,
        };
      }
    }

    const id = `act-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newActivity: Activity = {
      ...data,
      id,
      orgId: this.currentOrgId,
      isSynthetic: true,
      schemaVersion: 'demo-v1',
    };

    // Pre-validate ledger aggregation with new candidate
    const candidateList = [...(this.sessionActivities[this.currentOrgId] || []), newActivity];
    const testAggregation = aggregateActivities(candidateList);
    if (testAggregation.status !== 'valid') {
      return { error: testAggregation.error || 'Activity creates an invalid ledger aggregation.' };
    }

    if (!this.sessionActivities[this.currentOrgId]) {
      this.sessionActivities[this.currentOrgId] = [];
    }
    this.sessionActivities[this.currentOrgId].push(newActivity);
    this.notify();
    return { activity: newActivity };
  }

  // Aggregated Totals
  public getTotals(siteId?: string): OrgTotals {
    const acts = this.getActivities(siteId);
    return aggregateActivities(acts);
  }

  public getOrgTotals(): OrgTotals {
    return this.getTotals();
  }

  public getSiteTotals(siteId: string): OrgTotals {
    return this.getTotals(siteId);
  }

  // Recommendations
  public getRecommendations(siteId?: string): Recommendation[] {
    const list = DEMO_RECOMMENDATIONS.filter((r) => r.orgId === this.currentOrgId);
    if (siteId) {
      return list.filter((r) => r.siteId === siteId);
    }
    return list;
  }

  // Scan Candidates
  public getScanPresets(): ScanCandidate[] {
    return DEMO_SCAN_PRESETS;
  }

  // Assistant Conversations
  public getAssistantConversations() {
    return DEMO_ASSISTANT_CONVERSATIONS;
  }

  // Predictive Analytics
  public getForecast(horizonDays: 7 | 14 | 30 = 14, budgetKgCO2e?: number): ForecastResult {
    const activities = this.getActivities(this.currentSiteId);
    return calculateDemoForecast(activities, horizonDays, budgetKgCO2e);
  }

  // Decarbonization Simulation
  public runSimulation(params: ScenarioInput): ScenarioResult {
    const totals = this.getTotals(this.currentSiteId);
    // Use average daily kWh based on activities or primaryKwh / 7
    const baselineDaily = totals.primaryKwh > 0 ? Math.round(totals.primaryKwh / 7) : 1200;
    return runDemoScenarioSimulation(params, baselineDaily);
  }
}

export const adapter = new DemoDataAdapter();
