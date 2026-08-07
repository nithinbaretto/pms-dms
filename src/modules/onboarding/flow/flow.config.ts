import type { ComponentType } from 'react';

export type FlowKey =
  | 'pms-individual'
  | 'pms-nri'
  | 'pms-corporate'
  | 'aif-individual'
  | 'aif-nri'
  | 'aif-corporate';

export type FlowDocumentsConfig = {
  requiresPhoto?: boolean;
  requiresSignature?: boolean;
  requiresCheque?: boolean;
  requiresDueDiligenceDoc?: boolean;
};

export type FlowConfig = {
  product: string;
  customerType: string;
  steps: string[];
  documents?: FlowDocumentsConfig;
  overrides?: Record<string, ComponentType<any> | null | undefined>;
  validators?: Record<string, (context: unknown) => boolean>;
};

import pmsIndividual from './pms-individual.config';
import pmsNri from './pms-nri.config';
import pmsCorporate from './pms-corporate.config';
import aifIndividual from './aif-individual.config';
import aifNri from './aif-nri.config';
import aifCorporate from './aif-corporate.config';

export const FLOW_CONFIGS: Record<FlowKey, FlowConfig> = {
  'pms-individual': pmsIndividual,
  'pms-nri': pmsNri,
  'pms-corporate': pmsCorporate,
  'aif-individual': aifIndividual,
  'aif-nri': aifNri,
  'aif-corporate': aifCorporate,
};

export function getFlowConfig(flow: FlowKey): FlowConfig {
  return FLOW_CONFIGS[flow];
}
