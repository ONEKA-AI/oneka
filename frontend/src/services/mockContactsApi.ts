/**
 * Mock Contacts API Service
 *
 * Provides contact directory data for global search
 */

export interface Contact {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  location: string;
}

const mockContacts: Contact[] = [
  {
    id: "CON-001",
    name: "Samira Kamau",
    role: "Senior Auditor",
    organization: "Office of the Auditor-General",
    email: "samira.kamau@oag.go.ke",
    phone: "+254 712 000 101",
    location: "Nairobi",
  },
  {
    id: "CON-002",
    name: "Peter Kilonzo",
    role: "Compliance Officer",
    organization: "Office of the Auditor-General",
    email: "peter.kilonzo@oag.go.ke",
    phone: "+254 712 000 114",
    location: "Nakuru",
  },
  {
    id: "CON-003",
    name: "Joan Mwangi",
    role: "Procurement Analyst",
    organization: "Public Procurement Regulatory Authority",
    email: "joan.mwangi@ppra.go.ke",
    phone: "+254 711 200 908",
    location: "Nairobi",
  },
  {
    id: "CON-004",
    name: "Daniel Otieno",
    role: "County Accountant",
    organization: "County Government of Kisumu",
    email: "daniel.otieno@kisumu.go.ke",
    phone: "+254 720 991 203",
    location: "Kisumu",
  },
  {
    id: "CON-005",
    name: "Grace Wanjiku",
    role: "Project Liaison",
    organization: "Kenya National Highways Authority",
    email: "grace.wanjiku@kenha.go.ke",
    phone: "+254 709 552 477",
    location: "Nairobi",
  },
  {
    id: "CON-006",
    name: "Ibrahim Noor",
    role: "Infrastructure Auditor",
    organization: "Office of the Auditor-General",
    email: "ibrahim.noor@oag.go.ke",
    phone: "+254 733 410 122",
    location: "Garissa",
  },
  {
    id: "CON-007",
    name: "Lydia Cherono",
    role: "Monitoring Officer",
    organization: "Ministry of Water and Sanitation",
    email: "lydia.cherono@water.go.ke",
    phone: "+254 701 880 665",
    location: "Mombasa",
  },
  {
    id: "CON-008",
    name: "Mutua Karanja",
    role: "Project Engineer",
    organization: "Kenya Rural Roads Authority",
    email: "mutua.karanja@kerra.go.ke",
    phone: "+254 728 744 330",
    location: "Eldoret",
  },
  {
    id: "CON-009",
    name: "Esther Njoroge",
    role: "Financial Analyst",
    organization: "National Treasury",
    email: "esther.njoroge@treasury.go.ke",
    phone: "+254 710 334 900",
    location: "Nairobi",
  },
];

export async function getContacts(): Promise<Contact[]> {
  const delay = Math.random() * 800 + 600;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return mockContacts;
}
