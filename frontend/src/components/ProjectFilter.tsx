import { Search, X, Filter } from "lucide-react";
import { useEffect, useState } from "react";

export interface ProjectFilters {
  search: string;
  county: string;
  sector: string;
  riskLevel: string;
  auditStatus: string;
}

interface ProjectFilterProps {
  onFiltersChange: (filters: ProjectFilters) => void;
  activeFilterCount: number;
  filters?: ProjectFilters;
  compact?: boolean;
}

const counties = [
  "All Counties",
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans-Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
  "Nyandarua",
];

const sectors = [
  "All Sectors",
  "Roads & Transport",
  "Water & Sanitation",
  "Health",
  "Education",
  "Energy",
  "Agriculture",
];

const riskLevels = [
  "All Risk Levels",
  "critical",
  "high",
  "medium",
  "low",
];

const auditStatuses = [
  "All Statuses",
  "Verified",
  "Under Review",
  "Pending Verification",
  "Flagged - Lowball Tender",
  "Physical Verification Required",
];

export function ProjectFilter({
  onFiltersChange,
  activeFilterCount,
  filters,
  compact = false,
}: ProjectFilterProps) {
  const [localFilters, setLocalFilters] = useState<ProjectFilters>({
    search: "",
    county: "All Counties",
    sector: "All Sectors",
    riskLevel: "All Risk Levels",
    auditStatus: "All Statuses",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const effectiveFilters = filters ?? localFilters;

  useEffect(() => {
    if (filters) {
      setLocalFilters(filters);
    }
  }, [filters]);

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    const newFilters = { ...effectiveFilters, [key]: value };
    if (!filters) {
      setLocalFilters(newFilters);
    }
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: ProjectFilters = {
      search: "",
      county: "All Counties",
      sector: "All Sectors",
      riskLevel: "All Risk Levels",
      auditStatus: "All Statuses",
    };
    if (!filters) {
      setLocalFilters(resetFilters);
    }
    onFiltersChange(resetFilters);
  };

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {/* Main Search Bar */}
      <div className={`glass-panel ${compact ? "p-3" : "p-4"}`}>
        <div className={`flex items-center ${compact ? "gap-2 flex-wrap" : "gap-3"}`}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by project name, ID, or entity..."
              value={effectiveFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className={`console-input pl-10 w-full ${compact ? "text-sm" : ""}`}
            />
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 rounded-md border border-border hover:bg-accent transition-colors font-medium ${
              compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-status-amber text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 rounded-md border border-border hover:bg-status-red/10 transition-colors text-status-red ${
                compact ? "px-2 py-1.5 text-xs" : "px-4 py-2 text-sm"
              }`}
            >
              <X className="w-4 h-4" />
              {!compact && "Clear"}
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className={`glass-panel ${compact ? "p-3 space-y-3" : "p-4 space-y-4"} animate-in fade-in duration-200`}>
          <div className={`grid grid-cols-1 ${compact ? "gap-3" : "gap-4"}`}>
            {/* County Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                County
              </label>
              <select
                value={effectiveFilters.county}
                onChange={(e) => handleFilterChange("county", e.target.value)}
                className="console-input w-full"
              >
                {counties.map((county) => (
                  <option key={county} value={county}>
                    {county}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sector
              </label>
              <select
                value={effectiveFilters.sector}
                onChange={(e) => handleFilterChange("sector", e.target.value)}
                className="console-input w-full"
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Level Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Risk Level
              </label>
              <select
                value={effectiveFilters.riskLevel}
                onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
                className="console-input w-full"
              >
                {riskLevels.map((level) => (
                  <option key={level} value={level}>
                    {level === "All Risk Levels" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Audit Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Audit Status
              </label>
              <select
                value={effectiveFilters.auditStatus}
                onChange={(e) => handleFilterChange("auditStatus", e.target.value)}
                className="console-input w-full"
              >
                {auditStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {!compact && activeFilterCount > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {effectiveFilters.search && (
                  <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-full px-3 py-1 text-sm">
                    <span className="text-blue-900 dark:text-blue-200">Search: {effectiveFilters.search}</span>
                    <button
                      onClick={() => handleFilterChange("search", "")}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {effectiveFilters.county !== "All Counties" && (
                  <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-full px-3 py-1 text-sm">
                    <span className="text-purple-900 dark:text-purple-200">{effectiveFilters.county}</span>
                    <button
                      onClick={() => handleFilterChange("county", "All Counties")}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {effectiveFilters.sector !== "All Sectors" && (
                  <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-full px-3 py-1 text-sm">
                    <span className="text-orange-900 dark:text-orange-200">{effectiveFilters.sector}</span>
                    <button
                      onClick={() => handleFilterChange("sector", "All Sectors")}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {effectiveFilters.riskLevel !== "All Risk Levels" && (
                  <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-full px-3 py-1 text-sm">
                    <span className="text-red-900 dark:text-red-200 capitalize">Risk: {effectiveFilters.riskLevel}</span>
                    <button
                      onClick={() => handleFilterChange("riskLevel", "All Risk Levels")}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {effectiveFilters.auditStatus !== "All Statuses" && (
                  <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-full px-3 py-1 text-sm">
                    <span className="text-green-900 dark:text-green-200 text-xs">{effectiveFilters.auditStatus}</span>
                    <button
                      onClick={() => handleFilterChange("auditStatus", "All Statuses")}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
