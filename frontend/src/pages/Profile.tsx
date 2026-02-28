import { AppLayout } from "@/components/layout/AppLayout";
import { useEffect, useState, type ChangeEvent } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Shield,
  Upload,
  X,
} from "lucide-react";

const initialProfile = {
  name: "Audit Officer",
  role: "Senior Auditor",
  organization: "Office of the Auditor-General",
  location: "Nairobi, Kenya",
  email: "audit.officer@oag.go.ke",
  phone: "+254 700 000 000",
  status: "Active",
  clearance: "Level 3",
  joined: "2022-08-14",
  teams: ["Infrastructure Audits", "Procurement Compliance", "Risk Response"],
};

export default function Profile() {
  const [form, setForm] = useState(initialProfile);
  const [teamInput, setTeamInput] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const updateField =
    (field: keyof typeof initialProfile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return nextUrl;
    });
  };

  const handleAddTeam = () => {
    const nextTeam = teamInput.trim();
    if (!nextTeam) return;
    if (form.teams.some((team) => team.toLowerCase() === nextTeam.toLowerCase())) {
      setTeamInput("");
      return;
    }
    setForm((prev) => ({ ...prev, teams: [...prev.teams, nextTeam] }));
    setTeamInput("");
  };

  const handleRemoveTeam = (team: string) => {
    setForm((prev) => ({ ...prev, teams: prev.teams.filter((item) => item !== team) }));
  };

  const handleReset = () => {
    setForm(initialProfile);
    setTeamInput("");
    setPhotoUrl(null);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update your identity, contact details, and assigned teams.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm"
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Identity</p>
                <h2 className="text-xl font-semibold mt-2">{form.name}</h2>
                <p className="text-sm text-muted-foreground">{form.role}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center overflow-hidden border border-border">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Shield className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Profile Image
                </label>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>{form.organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{form.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{form.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{form.phone}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.name}
                  onChange={updateField("name")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Role
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.role}
                  onChange={updateField("role")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organization
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.organization}
                  onChange={updateField("organization")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.location}
                  onChange={updateField("location")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.email}
                  onChange={updateField("email")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.phone}
                  onChange={updateField("phone")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  className="console-input w-full mt-2"
                  value={form.status}
                  onChange={updateField("status")}
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Restricted</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Clearance
                </label>
                <input
                  className="console-input w-full mt-2"
                  value={form.clearance}
                  onChange={updateField("clearance")}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Joined
                </label>
                <input
                  type="date"
                  className="console-input w-full mt-2"
                  value={form.joined}
                  onChange={updateField("joined")}
                />
              </div>
            </div>

            <div>
              <h3 className="section-header">Assigned Teams</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.teams.map((team) => (
                  <span
                    key={team}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-accent/70 text-foreground"
                  >
                    {team}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(team)}
                      className="p-0.5 rounded-full hover:bg-accent"
                      aria-label={`Remove ${team}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="console-input flex-1"
                  placeholder="Add a team..."
                  value={teamInput}
                  onChange={(event) => setTeamInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddTeam();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTeam}
                  className="px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              <span className="legal-ref">
                Profile data sourced from OAG identity registry • Last sync: 2024-01-26 14:00 EAT
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
