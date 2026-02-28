/**
 * Mock Audit Workbench API Service
 * 
 * Provides audit tasks and workbench data
 */

export interface AuditTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "blocked";
  dueDate: string;
  createdAt: string;
  evidenceCount: number;
}

const mockAuditTasks: AuditTask[] = [
  {
    id: "TASK-001",
    projectId: "PRJ-2024-001",
    projectName: "Nairobi-Thika Highway Expansion Phase III",
    title: "Verify contract terms and conditions",
    description:
      "Review and verify all contract amendments and variations against budget allocations.",
    assignedTo: "Audit Officer - SMK",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-05",
    createdAt: "2024-01-20T08:00:00Z",
    evidenceCount: 8,
  },
  {
    id: "TASK-002",
    projectId: "PRJ-2024-010",
    projectName: "Isiolo County Hospital Construction",
    title: "Investigate project stall",
    description:
      "Conduct site inspection and interview project management on reasons for project halt.",
    assignedTo: "Senior Auditor - PK",
    priority: "critical",
    status: "pending",
    dueDate: "2024-01-30",
    createdAt: "2024-01-24T14:30:00Z",
    evidenceCount: 2,
  },
  {
    id: "TASK-003",
    projectId: "PRJ-2024-004",
    projectName: "Eldoret Bypass Construction",
    title: "Analyze tender submissions",
    description:
      "Review and analyze all tender submissions for lowball prices and potential collusion.",
    assignedTo: "Compliance Officer - JM",
    priority: "high",
    status: "in-progress",
    dueDate: "2024-02-08",
    createdAt: "2024-01-22T10:00:00Z",
    evidenceCount: 15,
  },
  {
    id: "TASK-004",
    projectId: "PRJ-2024-002",
    projectName: "Kisumu Port Rehabilitation Project",
    title: "Reconcile invoices to purchase orders",
    description:
      "Match all supplier invoices against procurement records and payment vouchers.",
    assignedTo: "Audit Officer - MN",
    priority: "medium",
    status: "completed",
    dueDate: "2024-01-25",
    createdAt: "2024-01-15T09:00:00Z",
    evidenceCount: 22,
  },
  {
    id: "TASK-005",
    projectId: "PRJ-2024-008",
    projectName: "Nairobi JKIA Terminal 3 Expansion",
    title: "Review contractor credentials",
    description:
      "Verify contractor licensing, insurance coverage, and past project performance records.",
    assignedTo: "Audit Officer - SMK",
    priority: "high",
    status: "pending",
    dueDate: "2024-02-02",
    createdAt: "2024-01-23T11:30:00Z",
    evidenceCount: 5,
  },
];

export async function getAuditTasks(): Promise<AuditTask[]> {
  const delay = Math.random() * 1000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockAuditTasks;
}

export async function updateTaskStatus(
  taskId: string,
  status: "pending" | "in-progress" | "completed" | "blocked"
): Promise<AuditTask> {
  const delay = Math.random() * 600 + 400;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const task = mockAuditTasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task with ID ${taskId} not found.`);
  }

  return { ...task, status };
}

export async function getTasksByProject(projectId: string): Promise<AuditTask[]> {
  const delay = Math.random() * 800 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockAuditTasks.filter((t) => t.projectId === projectId);
}
