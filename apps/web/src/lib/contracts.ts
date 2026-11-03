/**
 * Demo Contracts Adapter
 * Minimum UI entity types matching prototype.md and TASK.md.
 * NOTE: These are a demo adapter, NOT a replacement for production snake_case contracts.
 */

export type EvidenceState =
  | 'MEASURED'
  | 'USER_REPORTED'
  | 'MODEL_ESTIMATED'
  | 'FORECASTED'
  | 'SCENARIO_SIMULATED';

export interface DemoMeta {
  isSynthetic: true;
  schemaVersion: 'demo-v1';
  evidenceState: EvidenceState;
  assumptions: string[];
}

export type SiteType = 'university' | 'factory' | 'office';

export interface Organization {
  id: string;
  name: string;
  type: SiteType;
  reportingBoundary: string;
  defaultGwpVersion: string;
  currency: string;
  description: string;
}

export interface Site {
  id: string;
  orgId: string;
  name: string;
  type: SiteType;
  timezone: string; // e.g. "Africa/Cairo", "Europe/London", "America/New_York"
  country: string;
  facilityCode: string;
}

export interface Asset {
  id: string;
  siteId: string;
  kind: string; // e.g. "HVAC Chiller", "LED Fixture", "Injection Molder", "Server Rack"
  label: string;
  area: string; // e.g. "Building A - Floor 2", "Production Hall 1"
  powerW?: number;
  marketedHp?: number;
  origin: 'manual' | 'camera_mock';
  confidence?: number;
  operatingHoursPerDay?: number;
  status: 'active' | 'standby' | 'maintenance' | 'unconfirmed';
}

export interface Activity extends DemoMeta {
  id: string;
  orgId: string;
  siteId: string;
  assetId?: string;
  sourceId: string;
  start: string; // ISO 8601 with offset
  end: string;   // ISO 8601 with offset
  quantityKwh: number;
  representation: 'primary' | 'attribution';
  parentActivityId?: string;
}

export interface DemoFactor {
  id: 'demo-electricity-v1';
  value: 0.45;
  unit: 'kgCO2e/kWh';
  region: 'fictional';
  version: 'demo-v1';
  source: 'docs/scientific_engine.md illustrative fixture';
}

export const DEMO_FACTOR: DemoFactor = {
  id: 'demo-electricity-v1',
  value: 0.45,
  unit: 'kgCO2e/kWh',
  region: 'fictional',
  version: 'demo-v1',
  source: 'docs/scientific_engine.md illustrative fixture',
};

export interface DemoCalculation {
  energyKwh: number | null;
  kgCO2e: number | null;
  factorId: string | null;
  status: 'calculated' | 'not_calculated';
  reason?: string;
  trace: string[];
  isSynthetic: true;
}

export interface EmissionRecord {
  id: string;
  siteId: string;
  orgId: string;
  scope: 1 | 2 | 3;
  gas: 'CO2e';
  kgGas?: number; // Omitted for aggregate factor
  kgCO2e: number;
  method: 'demo';
  periodStart: string;
  periodEnd: string;
  factorVersion: string;
  isSynthetic: true;
  evidenceState: EvidenceState;
}

export interface Recommendation {
  id: string;
  orgId: string;
  siteId: string;
  action: string;
  category: string;
  estimatedKwhSaved: number;
  estimatedKgCO2eSaved: number;
  assumptions: string[];
  status: 'illustrative';
  costDelta?: number; // Estimated USD/yr or negative delta
  paybackMonths?: number;
  implementationEffort?: 'Low' | 'Medium' | 'High';
}

export interface ForecastDataPoint {
  date: string;
  isProjected: boolean;
  kwh: number;
  kwhLower: number;
  kwhUpper: number;
  kgCO2e: number;
}

export interface ForecastResult {
  horizonDays: 7 | 14 | 30;
  historicalDays: number;
  baselineDailyAvgKwh: number;
  totalProjectedKwh: number;
  totalProjectedEmissionsKgCO2e: number;
  budgetKgCO2e?: number;
  budgetVarianceKgCO2e?: number;
  budgetStatus?: 'surplus' | 'deficit' | 'on_track';
  dataPoints: ForecastDataPoint[];
  methodology: string;
  trace: string[];
}

export interface ScenarioInput {
  lightingReductionPct: number; // 0 to 50%
  hvacSetpointDeltaC: number;    // 0 to 4 °C
  operatingHoursDelta: number;   // 0 to 8 h reduction
  solarPvKw: number;             // 0 to 100 kW PV capacity
}

export interface ScenarioResult {
  baselineDailyKwh: number;
  alternativeDailyKwh: number;
  dailySavingsKwh: number;
  dailySavingsKgCO2e: number;
  annualSavingsKwh: number;
  annualSavingsKgCO2e: number;
  estimatedAnnualCostSavingsUsd: number;
  tradeoffs: string[];
  trace: string[];
}

export interface ScanCandidate {
  id: string;
  presetName: string;
  detectedKind: string;
  detectedLabel: string;
  detectedWatts?: number;
  suggestedHours: number;
  confidence: number;
  boundingPoly: { x: number; y: number; width: number; height: number };
  ocrEvidence: string;
  isUnknown?: boolean;
}

export interface AssistantCitation {
  entityId: string;
  entityType: 'facility' | 'activity' | 'factor' | 'recommendation';
  title: string;
  detail: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: AssistantCitation[];
}
