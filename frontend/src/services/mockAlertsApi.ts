/**
 * Mock Alerts API Service
 * 
 * Provides audit flags and alert data
 */

export interface AuditFlag {
  id: string;
  projectId: string;
  projectName: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  createdAt: string;
  status: "open" | "investigating" | "resolved";
  county: string;
}

const mockAlerts: AuditFlag[] = [
  {
    id: "FLAG-001",
    projectId: "PRJ-2024-001",
    projectName: "Nairobi-Thika Highway Expansion Phase III",
    severity: "critical",
    title: "Significant burn rate mismatch",
    description:
      "Disbursed funds (KES 3.42B) exceed completed work progress by 32%. Immediate investigation required.",
    createdAt: "2024-01-26T10:30:00Z",
    status: "investigating",
    county: "Nairobi",
  },
  {
    id: "FLAG-002",
    projectId: "PRJ-2024-004",
    projectName: "Eldoret Bypass Construction",
    severity: "high",
    title: "Lowball tender alert",
    description:
      "Contract sum significantly below market rate for comparable projects. Requires due diligence review.",
    createdAt: "2024-01-25T14:15:00Z",
    status: "open",
    county: "Uasin Gishu",
  },
  {
    id: "FLAG-003",
    projectId: "PRJ-2024-010",
    projectName: "Isiolo County Hospital Construction",
    severity: "critical",
    title: "Project stalled - no progress in 6 months",
    description:
      "Physical verification shows zero progress since last audit. Only 40% of allocated budget disbursed.",
    createdAt: "2024-01-24T09:00:00Z",
    status: "investigating",
    county: "Isiolo",
  },
  {
    id: "FLAG-004",
    projectId: "PRJ-2024-002",
    projectName: "Kisumu Port Rehabilitation Project",
    severity: "medium",
    title: "Documentation discrepancy",
    description:
      "Supplier invoices do not match procurement records. Awaiting clarification from implementing entity.",
    createdAt: "2024-01-23T11:45:00Z",
    status: "open",
    county: "Kisumu",
  },
  {
    id: "FLAG-005",
    projectId: "PRJ-2024-008",
    projectName: "Nairobi JKIA Terminal 3 Expansion",
    severity: "high",
    title: "Delayed contractor certification",
    description:
      "Prime contractor certification pending. Potential conflict of interest identified with subcontractor.",
    createdAt: "2024-01-22T16:20:00Z",
    status: "open",
    county: "Nairobi",
  },
];

export async function getAuditFlags(): Promise<AuditFlag[]> {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockAlerts;
}

export async function getAuditFlagById(id: string): Promise<AuditFlag> {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const flag = mockAlerts.find((f) => f.id === id);
  if (!flag) {
    throw new Error(`Audit flag with ID ${id} not found.`);
  }

  return flag;
}

export async function updateAuditFlagStatus(
  flagId: string,
  status: "open" | "investigating" | "resolved"
): Promise<AuditFlag> {
  const delay = Math.random() * 500 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const flag = mockAlerts.find((f) => f.id === flagId);
  if (!flag) {
    throw new Error(`Audit flag with ID ${flagId} not found.`);
  }

  return { ...flag, status };
}
