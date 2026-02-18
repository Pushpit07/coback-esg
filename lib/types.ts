export interface EsgData {
  company_name: string;
  reporting_year: number;
  scope1_tco2e: number;
  scope2_tco2e: number;
  scope3_tco2e?: number;
  energy_consumption_kwh?: number;
  notes?: string;
  strategies?: string[];
  selected_strategy_index?: number;
  updated_at: string;
}

export interface StrategyRequest {
  company_name: string;
  reporting_year: number;
  scope1_tco2e: number;
  scope2_tco2e: number;
  scope3_tco2e?: number;
  energy_consumption_kwh?: number;
}

export interface StrategyResponse {
  strategies: [string, string, string];
}
