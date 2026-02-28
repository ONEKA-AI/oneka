/**
 * Mock Dashboard API Service
 * 
 * Provides KPI and metric data for the dashboard
 */

export interface KPIData {
  projectsMonitored: number;
  highRiskProjects: number;
  fundsDisbursed: number;
  verifiedProgress: number;
  lastUpdated: string;
}

export interface ChartData {
  label: string;
  value: number;
  category?: string;
}

export interface DashboardMetrics {
  kpis: KPIData;
  auditProgress: ChartData[];
  sectorBreakdown: ChartData[];
  riskSummary: ChartData[];
}

const mockDashboardMetrics: DashboardMetrics = {
  kpis: {
    projectsMonitored: 392,
    highRiskProjects: 47,
    fundsDisbursed: 52800000000,
    verifiedProgress: 44200000000,
    lastUpdated: "2024-01-26T14:00:00Z",
  },
  auditProgress: [
    { label: "Verified", value: 45, category: "verified" },
    { label: "Under Review", value: 30, category: "review" },
    { label: "Pending", value: 15, category: "pending" },
    { label: "Flagged", value: 10, category: "flagged" },
  ],
  sectorBreakdown: [
    { label: "Roads & Transport", value: 35 },
    { label: "Water & Sanitation", value: 20 },
    { label: "Health", value: 18 },
    { label: "Education", value: 15 },
    { label: "Energy", value: 12 },
  ],
  riskSummary: [
    { label: "Low Risk", value: 250, category: "low" },
    { label: "Medium Risk", value: 85, category: "medium" },
    { label: "High Risk", value: 42, category: "high" },
    { label: "Critical", value: 15, category: "critical" },
  ],
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockDashboardMetrics;
}
