import {
  Activity,
  DEMO_FACTOR,
  DemoCalculation,
  DemoFactor,
  EvidenceState,
  ForecastDataPoint,
  ForecastResult,
  ScenarioInput,
  ScenarioResult,
} from '@/lib/contracts';

export interface EnergyCalculationResult {
  energyKwh: number | null;
  status: 'calculated' | 'not_calculated';
  reason?: string;
  trace: string[];
}

/**
 * Validates whether a timestamp string is an ISO 8601 string with an explicit timezone offset or Z.
 * Example valid: "2026-10-27T08:00:00+02:00", "2026-10-27T08:00:00Z"
 * Example invalid: "2026-10-27T08:00:00" (missing offset), "invalid"
 */
export function validateIsoTimestampWithOffset(timestamp: string): { valid: boolean; error?: string } {
  if (typeof timestamp !== 'string' || !timestamp.trim()) {
    return { valid: false, error: 'Timestamp is required and must be a string.' };
  }
  const isoWithOffsetRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
  if (!isoWithOffsetRegex.test(timestamp)) {
    return {
      valid: false,
      error: `Timestamp '${timestamp}' is missing an explicit timezone offset (e.g. '+02:00' or 'Z').`,
    };
  }

  // Date.parse normalizes impossible calendar dates (for example February 30)
  // instead of rejecting them. Validate the calendar fields before parsing.
  const calendarMatch = timestamp.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (calendarMatch) {
    const year = Number(calendarMatch[1]);
    const month = Number(calendarMatch[2]);
    const day = Number(calendarMatch[3]);
    const daysInMonth = month >= 1 && month <= 12
      ? new Date(Date.UTC(year, month, 0)).getUTCDate()
      : 0;
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
      return { valid: false, error: `Timestamp '${timestamp}' is not a valid calendar date.` };
    }
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return { valid: false, error: `Timestamp '${timestamp}' is not a valid calendar date.` };
  }
  return { valid: true };
}

/**
 * Checks whether two time intervals [startA, endA] and [startB, endB] overlap.
 * Adjacent intervals (where endA === startB or endB === startA) do NOT overlap.
 */
export function checkIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  // Strict interval intersection: startA < endB and endA > startB
  return sA < eB && eA > sB;
}

/**
 * Calculates deterministic energy consumption in kWh.
 * Formula: actual electrical input watts * operating hours / 1000.
 * Invariants:
 * - Finite nonnegative values only.
 * - Missing watts or hours -> not_calculated with null output and reason (never 0).
 * - Reject NaN, Infinity, negative values.
 * - Operating hours cannot exceed interval duration (if provided).
 * - Finite overflow guard (never returns Infinity).
 * - Never converts marketed AC HP directly to electrical watts.
 */
export function calculateDemoEnergy(
  watts: number | null | undefined,
  hours: number | null | undefined,
  intervalMaxHours?: number | null
): EnergyCalculationResult {
  const trace: string[] = [];

  if (watts === null || watts === undefined || hours === null || hours === undefined) {
    return {
      energyKwh: null,
      status: 'not_calculated',
      reason: 'Missing electrical watts or operating hours input',
      trace: ['Calculation skipped: input watts or hours is null/undefined.'],
    };
  }

  if (typeof watts !== 'number' || typeof hours !== 'number') {
    return {
      energyKwh: null,
      status: 'not_calculated',
      reason: 'Non-numeric input provided',
      trace: ['Rejected non-numeric input.'],
    };
  }

  if (!Number.isFinite(watts) || !Number.isFinite(hours)) {
    return {
      energyKwh: null,
      status: 'not_calculated',
      reason: 'Input contains non-finite values (NaN or Infinity)',
      trace: ['Rejected non-finite values (NaN or Infinity).'],
    };
  }

  if (watts < 0 || hours < 0) {
    return {
      energyKwh: null,
      status: 'not_calculated',
      reason: 'Negative electrical input or hours are invalid',
      trace: [`Rejected negative input: watts=${watts}, hours=${hours}.`],
    };
  }

  if (intervalMaxHours !== undefined && intervalMaxHours !== null) {
    if (!Number.isFinite(intervalMaxHours) || intervalMaxHours < 0) {
      return {
        energyKwh: null,
        status: 'not_calculated',
        reason: 'Invalid interval duration',
        trace: [`Invalid interval duration: ${intervalMaxHours}`],
      };
    }
    // Round to 6 decimal places to guard against floating-point precision issues
    const roundedHours = Math.round(hours * 1e6) / 1e6;
    const roundedMax = Math.round(intervalMaxHours * 1e6) / 1e6;
    if (roundedHours > roundedMax) {
      return {
        energyKwh: null,
        status: 'not_calculated',
        reason: `Operating hours (${hours} h) exceed selected interval duration (${intervalMaxHours} h)`,
        trace: [`Validation failed: ${hours} h > max interval ${intervalMaxHours} h`],
      };
    }
  }

  // Exact math: P * t / 1000
  const energyKwh = (watts * hours) / 1000;

  // Finite overflow guard: finite inputs that overflow double precision
  if (!Number.isFinite(energyKwh)) {
    return {
      energyKwh: null,
      status: 'not_calculated',
      reason: 'Calculated energy resulted in non-finite value (overflow)',
      trace: ['Overflow detected during energy calculation.'],
    };
  }

  trace.push(`Input watts: ${watts} W`);
  trace.push(`Operating hours: ${hours} h`);
  trace.push(`Energy = (${watts} W * ${hours} h) / 1000 = ${energyKwh} kWh`);

  return {
    energyKwh,
    status: 'calculated',
    trace,
  };
}

/**
 * Calculates demo emissions in kgCO2e using the fictional aggregate electricity factor.
 * Formula: kWh * 0.45 kgCO2e/kWh.
 * Invariants:
 * - Fictional factor only; never presented as national standard.
 * - Aggregate factor yields CO2e only; no artificial multi-gas synthesis.
 * - Missing kWh or factor -> not_calculated with null output and reason.
 * - Finite result guard (overflow check).
 */
export function calculateDemoEmissions(
  kwh: number | null | undefined,
  factor: DemoFactor = DEMO_FACTOR
): DemoCalculation {
  const trace: string[] = [];

  if (kwh === null || kwh === undefined) {
    return {
      energyKwh: null,
      kgCO2e: null,
      factorId: factor?.id ?? null,
      status: 'not_calculated',
      reason: 'Missing kWh quantity input',
      trace: ['Calculation skipped: input kWh is null or undefined.'],
      isSynthetic: true,
    };
  }

  if (typeof kwh !== 'number' || !Number.isFinite(kwh) || kwh < 0) {
    return {
      energyKwh: null,
      kgCO2e: null,
      factorId: factor?.id ?? null,
      status: 'not_calculated',
      reason: 'kWh quantity must be a finite non-negative number',
      trace: [`Rejected invalid kWh value: ${kwh}`],
      isSynthetic: true,
    };
  }

  if (!factor || typeof factor.value !== 'number' || !Number.isFinite(factor.value) || factor.value < 0) {
    return {
      energyKwh: kwh,
      kgCO2e: null,
      factorId: factor?.id ?? null,
      status: 'not_calculated',
      reason: 'Missing or invalid emission factor',
      trace: ['Rejected missing or invalid emission factor.'],
      isSynthetic: true,
    };
  }

  const rawKgCO2e = kwh * factor.value;
  if (!Number.isFinite(rawKgCO2e)) {
    return {
      energyKwh: kwh,
      kgCO2e: null,
      factorId: factor.id,
      status: 'not_calculated',
      reason: 'Calculated emissions resulted in non-finite value (overflow)',
      trace: ['Overflow detected during emissions calculation.'],
      isSynthetic: true,
    };
  }

  const roundedRawKgCO2e = rawKgCO2e * 10000;
  if (!Number.isFinite(roundedRawKgCO2e)) {
    return {
      energyKwh: kwh,
      kgCO2e: null,
      factorId: factor.id,
      status: 'not_calculated',
      reason: 'Rounded emissions resulted in non-finite value (overflow)',
      trace: ['Overflow detected during emissions rounding.'],
      isSynthetic: true,
    };
  }

  const kgCO2e = Math.round(roundedRawKgCO2e) / 10000;
  trace.push(`Quantity: ${kwh} kWh`);
  trace.push(`Factor: ${factor.value} ${factor.unit} (${factor.id}, version ${factor.version})`);
  trace.push(`Output: ${kwh} * ${factor.value} = ${kgCO2e} kgCO2e`);

  return {
    energyKwh: kwh,
    kgCO2e,
    factorId: factor.id,
    status: 'calculated',
    trace,
    isSynthetic: true,
  };
}

export interface AggregationResult {
  primaryKwh: number;
  attributionKwh: number;
  primaryEmissionsKgCO2e: number;
  primaryCount: number;
  attributionCount: number;
  aggregateProvenance: EvidenceState | 'MIXED';
  aggregateProvenanceLabel: string;
  status: 'valid' | 'invalid';
  error?: string;
  trace: string[];
}

/**
 * Derives dynamic aggregate provenance from contributing primary activities.
 */
export function deriveAggregateProvenance(activities: Activity[]): {
  evidenceState: EvidenceState | 'MIXED';
  label: string;
} {
  const primaryActivities = activities.filter((a) => a.representation === 'primary');
  if (primaryActivities.length === 0) {
    return {
      evidenceState: 'USER_REPORTED',
      label: 'NO ACTIVITIES RECORDED',
    };
  }

  const states = new Set(primaryActivities.map((a) => a.evidenceState));
  if (states.size === 1) {
    const singleState = Array.from(states)[0];
    switch (singleState) {
      case 'MEASURED':
        return { evidenceState: 'MEASURED', label: 'SYNTHETIC • METER FIXTURE' };
      case 'USER_REPORTED':
        return { evidenceState: 'USER_REPORTED', label: 'SYNTHETIC • USER REPORTED' };
      case 'MODEL_ESTIMATED':
        return { evidenceState: 'MODEL_ESTIMATED', label: 'SYNTHETIC • MODEL ESTIMATED' };
      case 'FORECASTED':
        return { evidenceState: 'FORECASTED', label: 'SYNTHETIC • PROJECTION' };
      case 'SCENARIO_SIMULATED':
        return { evidenceState: 'SCENARIO_SIMULATED', label: 'SYNTHETIC • SCENARIO' };
    }
  }

  return {
    evidenceState: 'MIXED',
    label: 'SYNTHETIC • MIXED INPUT PROVENANCE',
  };
}

/**
 * Aggregates activities while enforcing the strict anti-double-counting,
 * deduplication, attribution hierarchy, and overlap rejection rules:
 *
 * 1. Duplicate activity IDs explicitly rejected.
 * 2. Explicit timezone offset required on all ISO timestamps.
 * 3. End timestamp strictly after start timestamp.
 * 4. Conflicting overlapping primary intervals for the same source/site/org explicitly rejected.
 *    (Adjacent non-overlapping intervals permitted).
 * 5. Attribution activities require an existing primary parent in the SAME org and site,
 *    with an interval fully contained within parent interval, no self-links, and no cycles.
 * 6. Primary activities summed once; attribution children do not increase parent total.
 * 7. Overflow / non-finite quantities rejected.
 */
export function aggregateActivities(activities: Activity[]): AggregationResult {
  const seenIds = new Set<string>();
  const activityMap = new Map<string, Activity>();
  const primaryActivities: Activity[] = [];
  const attributionActivities: Activity[] = [];
  const trace: string[] = [];

  // 1. Initial validation of each activity
  for (const act of activities) {
    // Unique ID check
    if (seenIds.has(act.id)) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Duplicate activity ID detected: ${act.id}`,
        trace: [`Validation failed: duplicate activity ID ${act.id}`],
      };
    }
    seenIds.add(act.id);
    activityMap.set(act.id, act);

    // Quantity check
    if (typeof act.quantityKwh !== 'number' || !Number.isFinite(act.quantityKwh) || act.quantityKwh < 0) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Activity ${act.id} has invalid non-finite or negative quantity: ${act.quantityKwh}`,
        trace: [`Validation failed on activity ${act.id}`],
      };
    }

    // Explicit timezone offset validation
    const startVal = validateIsoTimestampWithOffset(act.start);
    if (!startVal.valid) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Activity ${act.id} start timestamp error: ${startVal.error}`,
        trace: [`Validation failed on start timestamp for activity ${act.id}: ${startVal.error}`],
      };
    }

    const endVal = validateIsoTimestampWithOffset(act.end);
    if (!endVal.valid) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Activity ${act.id} end timestamp error: ${endVal.error}`,
        trace: [`Validation failed on end timestamp for activity ${act.id}: ${endVal.error}`],
      };
    }

    const startMs = new Date(act.start).getTime();
    const endMs = new Date(act.end).getTime();

    if (endMs <= startMs) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Activity ${act.id} end timestamp must be strictly after start timestamp`,
        trace: [`Validation failed: end ${act.end} <= start ${act.start}`],
      };
    }

    if (act.representation === 'primary') {
      primaryActivities.push(act);
    } else if (act.representation === 'attribution') {
      attributionActivities.push(act);
    } else {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Activity ${act.id} has unknown representation: ${(act as Activity).representation}`,
        trace: [`Unknown representation`],
      };
    }
  }

  // 2. Overlapping Primary Interval Check per Source Identity (orgId + siteId + sourceId)
  const sourceGroups = new Map<string, Activity[]>();
  for (const act of primaryActivities) {
    const key = `${act.orgId}::${act.siteId}::${act.sourceId}`;
    const group = sourceGroups.get(key) || [];
    group.push(act);
    sourceGroups.set(key, group);
  }

  for (const [key, group] of sourceGroups.entries()) {
    if (group.length > 1) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const actA = group[i];
          const actB = group[j];
          if (checkIntervalsOverlap(actA.start, actA.end, actB.start, actB.end)) {
            return {
              primaryKwh: 0,
              attributionKwh: 0,
              primaryEmissionsKgCO2e: 0,
              primaryCount: 0,
              attributionCount: 0,
              aggregateProvenance: 'USER_REPORTED',
              aggregateProvenanceLabel: 'VALIDATION ERROR',
              status: 'invalid',
              error: `Conflicting overlapping primary interval detected for source '${actA.sourceId}' on site '${actA.siteId}': [${actA.start} - ${actA.end}] overlaps with [${actB.start} - ${actB.end}]. Adjacent non-overlapping intervals are permitted.`,
              trace: [`Conflicting overlap on source ${key}`],
            };
          }
        }
      }
    }
  }

  // 3. Attribution Validation: Parent presence, same org/site, containment, no cycles
  for (const attr of attributionActivities) {
    if (!attr.parentActivityId) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Orphan attribution activity ${attr.id}: parentActivityId is required.`,
        trace: [`Orphan attribution activity ${attr.id}`],
      };
    }

    if (attr.parentActivityId === attr.id) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Attribution activity ${attr.id} cannot reference itself as parent.`,
        trace: [`Self-referencing parent ${attr.id}`],
      };
    }

    const parent = activityMap.get(attr.parentActivityId);
    if (!parent) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Attribution activity ${attr.id} references non-existent parent activity ${attr.parentActivityId}.`,
        trace: [`Missing parent activity ${attr.parentActivityId}`],
      };
    }

    if (parent.representation !== 'primary') {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Attribution activity ${attr.id} must reference a primary parent activity (parent ${parent.id} is '${parent.representation}').`,
        trace: [`Non-primary parent ${parent.id}`],
      };
    }

    if (parent.orgId !== attr.orgId || parent.siteId !== attr.siteId) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Attribution activity ${attr.id} belongs to ${attr.orgId}/${attr.siteId} but references parent in ${parent.orgId}/${parent.siteId}. Cross-site attribution is forbidden.`,
        trace: [`Cross-site attribution violation`],
      };
    }

    // Containment check
    const attrStart = new Date(attr.start).getTime();
    const attrEnd = new Date(attr.end).getTime();
    const parentStart = new Date(parent.start).getTime();
    const parentEnd = new Date(parent.end).getTime();

    if (attrStart < parentStart || attrEnd > parentEnd) {
      return {
        primaryKwh: 0,
        attributionKwh: 0,
        primaryEmissionsKgCO2e: 0,
        primaryCount: 0,
        attributionCount: 0,
        aggregateProvenance: 'USER_REPORTED',
        aggregateProvenanceLabel: 'VALIDATION ERROR',
        status: 'invalid',
        error: `Attribution activity ${attr.id} period [${attr.start} - ${attr.end}] is not fully contained within parent interval [${parent.start} - ${parent.end}].`,
        trace: [`Attribution interval not contained within parent`],
      };
    }
  }

  // 4. Sum primary energy (anti-double-counting: primary only)
  let rawPrimaryKwh = 0;
  for (const a of primaryActivities) {
    rawPrimaryKwh += a.quantityKwh;
  }
  if (!Number.isFinite(rawPrimaryKwh)) {
    return {
      primaryKwh: 0,
      attributionKwh: 0,
      primaryEmissionsKgCO2e: 0,
      primaryCount: primaryActivities.length,
      attributionCount: attributionActivities.length,
      aggregateProvenance: 'USER_REPORTED',
      aggregateProvenanceLabel: 'OVERFLOW ERROR',
      status: 'invalid',
      error: 'Primary energy summation resulted in non-finite overflow.',
      trace: ['Overflow in primary energy sum'],
    };
  }

  let rawAttributionKwh = 0;
  for (const a of attributionActivities) {
    rawAttributionKwh += a.quantityKwh;
  }

  const primaryKwh = Math.round(rawPrimaryKwh * 1000) / 1000;
  const attributionKwh = Math.round(rawAttributionKwh * 1000) / 1000;

  if (!Number.isFinite(primaryKwh) || !Number.isFinite(attributionKwh)) {
    return {
      primaryKwh: 0,
      attributionKwh: 0,
      primaryEmissionsKgCO2e: 0,
      primaryCount: primaryActivities.length,
      attributionCount: attributionActivities.length,
      aggregateProvenance: 'USER_REPORTED',
      aggregateProvenanceLabel: 'OVERFLOW ERROR',
      status: 'invalid',
      error: 'Rounded energy aggregation resulted in non-finite overflow.',
      trace: ['Overflow in energy aggregation rounding'],
    };
  }

  const emissionsCalc = calculateDemoEmissions(primaryKwh, DEMO_FACTOR);
  if (emissionsCalc.status !== 'calculated' || emissionsCalc.kgCO2e === null) {
    return {
      primaryKwh,
      attributionKwh,
      primaryEmissionsKgCO2e: 0,
      primaryCount: primaryActivities.length,
      attributionCount: attributionActivities.length,
      aggregateProvenance: 'USER_REPORTED',
      aggregateProvenanceLabel: 'EMISSIONS CALCULATION ERROR',
      status: 'invalid',
      error: emissionsCalc.reason || 'Failed to calculate emissions for primary activities.',
      trace: emissionsCalc.trace,
    };
  }

  const { evidenceState, label } = deriveAggregateProvenance(primaryActivities);

  trace.push(`Summed ${primaryActivities.length} primary activities = ${primaryKwh} kWh`);
  trace.push(`Recorded ${attributionActivities.length} attribution sub-activities = ${attributionKwh} kWh (retained as sub-allocations, not added to primary total)`);
  trace.push(`Scope 2 CO2e total = ${emissionsCalc.kgCO2e} kgCO2e`);

  return {
    primaryKwh,
    attributionKwh,
    primaryEmissionsKgCO2e: emissionsCalc.kgCO2e,
    primaryCount: primaryActivities.length,
    attributionCount: attributionActivities.length,
    aggregateProvenance: evidenceState,
    aggregateProvenanceLabel: label,
    status: 'valid',
    trace,
  };
}

/**
 * Calculates seasonal-naive predictive forecast for 7/14/30 day horizons.
 * Uses a complete 7-day historical cycle and repeats the observed daily pattern.
 * Display bounds: Illustrative +/-20% range (NOT a calibrated confidence interval).
 * Non-overlapping periods: Historical ends on Oct 26; forecast starts on Oct 27.
 */
export function calculateDemoForecast(
  activities: Activity[],
  horizonDays: 7 | 14 | 30 = 14,
  budgetKgCO2e?: number
): ForecastResult {
  const trace: string[] = [];

  // Filter primary daily activities
  const primaryDaily = activities
    .filter((a) => a.representation === 'primary' && a.sourceId.includes('daily'))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Fallback to any primary activities if daily not explicitly named
  const sourceActivities =
    primaryDaily.length >= 7
      ? primaryDaily
      : activities.filter((a) => a.representation === 'primary').sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Take the most recent up to 7 days as the seasonal cycle
  const cycle = sourceActivities.slice(-7);
  const cycleKwh = cycle.map((c) => c.quantityKwh);
  const avgDailyKwh =
    cycleKwh.length > 0 ? cycleKwh.reduce((acc, v) => acc + v, 0) / cycleKwh.length : 1200;

  trace.push(`Using ${cycle.length}-day baseline cycle (mean: ${Math.round(avgDailyKwh)} kWh/day)`);

  // Build non-overlapping forecast timeline
  const lastDate =
    cycle.length > 0
      ? new Date(cycle[cycle.length - 1].end)
      : new Date('2026-10-26T23:59:59+02:00');

  const dataPoints: ForecastDataPoint[] = [];

  // 1. Add historical points for visual continuity
  for (let i = 0; i < cycle.length; i++) {
    const act = cycle[i];
    const dateStr = act.start.slice(0, 10);
    const kwh = act.quantityKwh;
    const kgCO2e = Math.round(kwh * DEMO_FACTOR.value * 10) / 10;
    dataPoints.push({
      date: dateStr,
      isProjected: false,
      kwh,
      kwhLower: kwh,
      kwhUpper: kwh,
      kgCO2e,
    });
  }

  // 2. Project forward using seasonal-naive repetition
  let totalProjectedKwh = 0;
  const cycleLength = cycle.length > 0 ? cycle.length : 7;

  for (let d = 1; d <= horizonDays; d++) {
    const projDate = new Date(lastDate);
    projDate.setUTCDate(lastDate.getUTCDate() + d);
    const dateStr = projDate.toISOString().slice(0, 10);

    const refIdx = (d - 1) % cycleLength;
    const baselineDayKwh = cycleKwh.length > 0 ? cycleKwh[refIdx] : avgDailyKwh;

    // Seasonal-naive point prediction
    const projectedKwh = Math.round(baselineDayKwh);
    totalProjectedKwh += projectedKwh;

    // Illustrative display bounds: +/- 20%
    const kwhLower = Math.round(projectedKwh * 0.8);
    const kwhUpper = Math.round(projectedKwh * 1.2);
    const kgCO2e = Math.round(projectedKwh * DEMO_FACTOR.value * 10) / 10;

    dataPoints.push({
      date: dateStr,
      isProjected: true,
      kwh: projectedKwh,
      kwhLower,
      kwhUpper,
      kgCO2e,
    });
  }

  const totalProjectedEmissions =
    Math.round(totalProjectedKwh * DEMO_FACTOR.value * 10) / 10;

  let budgetVariance: number | undefined = undefined;
  let budgetStatus: 'surplus' | 'deficit' | 'on_track' | undefined = undefined;

  if (budgetKgCO2e !== undefined && budgetKgCO2e > 0) {
    budgetVariance = Math.round((budgetKgCO2e - totalProjectedEmissions) * 10) / 10;
    if (budgetVariance >= 0) {
      budgetStatus = 'surplus';
    } else {
      budgetStatus = 'deficit';
    }
    trace.push(
      `Budget allowance: ${budgetKgCO2e} kgCO2e vs Projected: ${totalProjectedEmissions} kgCO2e (Variance: ${budgetVariance} kgCO2e)`
    );
  }

  trace.push(
    `Projected ${horizonDays} days = ${totalProjectedKwh.toLocaleString()} kWh -> ${totalProjectedEmissions.toLocaleString()} kgCO2e`
  );

  return {
    horizonDays,
    historicalDays: cycle.length,
    baselineDailyAvgKwh: Math.round(avgDailyKwh),
    totalProjectedKwh,
    totalProjectedEmissionsKgCO2e: totalProjectedEmissions,
    budgetKgCO2e,
    budgetVarianceKgCO2e: budgetVariance,
    budgetStatus,
    dataPoints,
    methodology:
      'Seasonal-naive extrapolation (untrained projection). Replicates observed 7-day cyclical pattern. Display bounds represent illustrative +/-20% ranges, NOT calibrated statistical confidence intervals.',
    trace,
  };
}

/**
 * Runs counterfactual scenario simulation for decarbonization levers.
 * Recomputes energy, Scope 2 emissions, and financial trade-offs with explicit disclaimer.
 * Baseline minus alternative is labeled: "potential savings, not actual savings".
 */
export function runDemoScenarioSimulation(
  params: ScenarioInput,
  baselineDailyKwh: number = 1200
): ScenarioResult {
  const trace: string[] = [];

  // Guard against non-finite or negative inputs
  const safeLighting = Math.max(0, Math.min(50, Number.isFinite(params.lightingReductionPct) ? params.lightingReductionPct : 0));
  const safeHvac = Math.max(0, Math.min(4, Number.isFinite(params.hvacSetpointDeltaC) ? params.hvacSetpointDeltaC : 0));
  const safeHours = Math.max(0, Math.min(8, Number.isFinite(params.operatingHoursDelta) ? params.operatingHoursDelta : 0));
  const safeSolar = Math.max(0, Math.min(100, Number.isFinite(params.solarPvKw) ? params.solarPvKw : 0));

  const safeBaseline = Math.max(1, Number.isFinite(baselineDailyKwh) ? baselineDailyKwh : 1200);

  // Model assumptions:
  // - Lighting is 25% of baseline
  // - HVAC cooling is 45% of baseline (5% savings per °C delta)
  // - Non-critical equipment standby is 20% of baseline (saves pro-rata per reduced hour)
  // - Solar PV generates ~4.2 kWh/kWp per day
  const lightingSavingsKwh = (safeBaseline * 0.25) * (safeLighting / 100);
  const hvacSavingsKwh = (safeBaseline * 0.45) * (safeHvac * 0.05);
  const standbySavingsKwh = (safeBaseline * 0.20 / 16) * safeHours;
  const solarGenKwh = safeSolar * 4.2;

  const totalDailySavingsKwh = Math.min(
    safeBaseline * 0.85, // Max physical demand-side reduction ceiling
    Math.round((lightingSavingsKwh + hvacSavingsKwh + standbySavingsKwh + solarGenKwh) * 10) / 10
  );

  const alternativeDailyKwh = Math.round((safeBaseline - totalDailySavingsKwh) * 10) / 10;
  const dailySavingsKgCO2e = Math.round(totalDailySavingsKwh * DEMO_FACTOR.value * 10) / 10;

  const annualSavingsKwh = Math.round(totalDailySavingsKwh * 365);
  const annualSavingsKgCO2e = Math.round(dailySavingsKgCO2e * 365);
  const estimatedAnnualCostSavingsUsd = Math.round(annualSavingsKwh * 0.12); // $0.12/kWh benchmark

  const tradeoffs: string[] = [];
  if (safeHvac >= 2) {
    tradeoffs.push(
      `Zone cooling setpoint +${safeHvac}°C may result in thermal comfort drift in high-occupancy lecture/production areas.`
    );
  }
  if (safeLighting >= 25) {
    tradeoffs.push(
      `Lighting reduction of ${safeLighting}% requires ambient daylight harvesting or local task lamps to maintain illuminance.`
    );
  }
  if (safeHours >= 4) {
    tradeoffs.push(
      `Standby reduction of ${safeHours} h requires automated timer shutoff interlocks on ventilation and air handling units.`
    );
  }
  if (safeSolar > 0) {
    tradeoffs.push(
      `${safeSolar} kW on-site PV requires inverter interconnection review and rooftop structural assessment.`
    );
  }
  if (tradeoffs.length === 0) {
    tradeoffs.push('Baseline scenario: No operational adjustments or capital levers currently active.');
  }

  trace.push(`Baseline daily: ${safeBaseline} kWh`);
  trace.push(`Simulated alternative daily: ${alternativeDailyKwh} kWh`);
  trace.push(`Potential daily savings: ${totalDailySavingsKwh} kWh (${dailySavingsKgCO2e} kgCO2e)`);
  trace.push(`Estimated annual savings: ${annualSavingsKwh.toLocaleString()} kWh (${annualSavingsKgCO2e.toLocaleString()} kgCO2e, ~$${estimatedAnnualCostSavingsUsd.toLocaleString()})`);

  return {
    baselineDailyKwh: safeBaseline,
    alternativeDailyKwh,
    dailySavingsKwh: totalDailySavingsKwh,
    dailySavingsKgCO2e,
    annualSavingsKwh,
    annualSavingsKgCO2e,
    estimatedAnnualCostSavingsUsd,
    tradeoffs,
    trace,
  };
}

/**
 * Sanitizes cell values to prevent CSV / Spreadsheet formula injection (CWE-1236).
 * Prepends a single quote to any cell starting with dangerous characters (=, +, -, @, \t, \r).
 */
export function sanitizeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }

  const str = String(value);

  // If starts with =, +, -, @, tab, or carriage return, neutralize formula execution
  const dangerousPrefixes = ['=', '+', '-', '@', '\t', '\r'];
  const isDangerous = dangerousPrefixes.some((p) => str.startsWith(p));
  const safeStr = isDangerous ? `'${str}` : str;

  // Escape double quotes by doubling them
  const escaped = safeStr.replace(/"/g, '""');

  return `"${escaped}"`;
}

/**
 * Generates an injection-safe CSV document string from headers and records.
 */
export function generateSafeCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerLine = headers.map((h) => sanitizeCsvCell(h)).join(',');
  const rowLines = rows.map((row) => row.map((cell) => sanitizeCsvCell(cell)).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}
