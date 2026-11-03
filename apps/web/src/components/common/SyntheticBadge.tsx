import React from 'react';
import { EvidenceState } from '@/lib/contracts';

interface SyntheticBadgeProps {
  evidenceState?: EvidenceState | 'MIXED';
  label?: string;
  className?: string;
}

export const SyntheticBadge: React.FC<SyntheticBadgeProps> = ({
  evidenceState,
  label,
  className = '',
}) => {
  const getLabel = () => {
    if (label) return label;
    switch (evidenceState) {
      case 'MEASURED':
        return 'SYNTHETIC • METER FIXTURE';
      case 'USER_REPORTED':
        return 'SYNTHETIC • USER REPORTED';
      case 'MODEL_ESTIMATED':
        return 'SYNTHETIC • MODEL ESTIMATED';
      case 'FORECASTED':
        return 'SYNTHETIC • PROJECTION';
      case 'SCENARIO_SIMULATED':
        return 'SYNTHETIC • SCENARIO';
      case 'MIXED':
        return 'SYNTHETIC • MIXED INPUT PROVENANCE';
      default:
        return 'DEMO SYNTHETIC';
    }
  };

  const getColorClasses = () => {
    switch (evidenceState) {
      case 'MEASURED':
        return 'bg-info-soft text-info border-info-border';
      case 'USER_REPORTED':
        return 'bg-warning-soft text-warning border-warning-border';
      case 'MODEL_ESTIMATED':
        return 'bg-info-soft text-info border-info-border';
      case 'FORECASTED':
        return 'bg-info-soft text-info border-info-border';
      case 'SCENARIO_SIMULATED':
        return 'bg-positive-soft text-positive border-positive-border';
      case 'MIXED':
        return 'bg-info-soft text-info border-info-border';
      default:
        return 'bg-subtle text-ink border-line';
    }
  };

  return (
    <span
      className={`inline-flex items-center max-w-full px-2 py-1 rounded text-xs leading-relaxed font-medium border ${getColorClasses()} ${className}`}
      title="All figures and fixtures are synthetic demo data. No actual physical measurements."
    >
      {getLabel()}
    </span>
  );
};
