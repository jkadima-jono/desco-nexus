// Single source of truth for mandate field vocabularies — shared by the
// API route (validation/allowlisting) and the mandate form (options shown).
export const SECTORS = ["Agriculture", "Infrastructure", "Mining", "Healthcare", "Water"];
export const INSTRUMENTS = ["equity", "debt", "blended", "spv", "other"];
export const RISK_LEVELS = ["low", "medium", "high"];
export const INVESTOR_TYPES = [
  "institutional", "family-office", "pe", "vc", "infra-fund",
  "bank-dfi", "sovereign-pension", "hnw-angel", "corporate", "advisor",
];
export const CO_INVEST_PREFERENCES = ["solo", "co-invest", "either"];

export const INVESTOR_TYPE_LABELS: Record<string, string> = {
  institutional: "Institutional investor",
  "family-office": "Family office",
  pe: "Private equity firm",
  vc: "Venture capital firm",
  "infra-fund": "Infrastructure / real-estate fund",
  "bank-dfi": "Bank / development finance institution",
  "sovereign-pension": "Sovereign wealth / pension fund",
  "hnw-angel": "High-net-worth / angel investor",
  corporate: "Corporate / strategic investor",
  advisor: "Advisor (on behalf of clients)",
};
