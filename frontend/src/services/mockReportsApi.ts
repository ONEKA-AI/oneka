/**
 * Mock Reports API Service
 * 
 * Provides audit reports and evidence data
 */

export interface AuditReport {
  id: string;
  projectId: string;
  projectName: string;
  reportType: "financial" | "physical" | "compliance" | "summary";
  title: string;
  status: "draft" | "submitted" | "approved" | "archived";
  createdAt: string;
  updatedAt: string;
  auditedBy: string;
  findings: number;
  recommendations: number;
}

const mockReports: AuditReport[] = [
  {
    id: "RPT-2024-001",
    projectId: "PRJ-2024-003",
    projectName: "Mombasa Water Supply Phase II",
    reportType: "financial",
    title: "FY 2023/24 Financial Audit Report - Verified",
    status: "approved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    auditedBy: "Audit Officer - SMK",
    findings: 0,
    recommendations: 2,
  },
  {
    id: "RPT-2024-002",
    projectId: "PRJ-2024-001",
    projectName: "Nairobi-Thika Highway Expansion Phase III",
    reportType: "physical",
    title: "Satellite Imagery Physical Verification Report",
    status: "submitted",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-25T11:00:00Z",
    auditedBy: "Physical Verification Team",
    findings: 3,
    recommendations: 5,
  },
  {
    id: "RPT-2024-003",
    projectId: "PRJ-2024-006",
    projectName: "Machakos Technical Training Institute",
    reportType: "compliance",
    title: "Procurement Compliance Audit - Full Compliance",
    status: "approved",
    createdAt: "2024-01-18T13:45:00Z",
    updatedAt: "2024-01-21T16:20:00Z",
    auditedBy: "Compliance Officer - JM",
    findings: 0,
    recommendations: 1,
  },
  {
    id: "RPT-2024-004",
    projectId: "PRJ-2024-010",
    projectName: "Isiolo County Hospital Construction",
    reportType: "physical",
    title: "Physical Progress Verification - Critical Issues",
    status: "submitted",
    createdAt: "2024-01-24T08:30:00Z",
    updatedAt: "2024-01-26T10:15:00Z",
    auditedBy: "Physical Verification Team",
    findings: 6,
    recommendations: 8,
  },
  {
    id: "RPT-2024-005",
    projectId: "PRJ-2024-011",
    projectName: "Siaya Solar Power Project",
    reportType: "summary",
    title: "Quarterly Progress Report Q3 2023/24",
    status: "draft",
    createdAt: "2024-01-25T14:00:00Z",
    updatedAt: "2024-01-26T09:00:00Z",
    auditedBy: "Senior Auditor - PK",
    findings: 2,
    recommendations: 3,
  },
];

export async function getAuditReports(): Promise<AuditReport[]> {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockReports;
}

export async function getReportById(id: string): Promise<AuditReport> {
  const delay = Math.random() * 800 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const report = mockReports.find((r) => r.id === id);
  if (!report) {
    throw new Error(`Report with ID ${id} not found.`);
  }

  return report;
}

export async function updateReportStatus(
  reportId: string,
  status: "draft" | "submitted" | "approved" | "archived"
): Promise<AuditReport> {
  const delay = Math.random() * 600 + 400;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const report = mockReports.find((r) => r.id === reportId);
  if (!report) {
    throw new Error(`Report with ID ${reportId} not found.`);
  }

  return { ...report, status, updatedAt: new Date().toISOString() };
}
