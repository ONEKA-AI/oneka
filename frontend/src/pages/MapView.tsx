import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProjectFilter, type ProjectFilters } from "@/components/ProjectFilter";
import { RiskBadge } from "@/components/RiskBadge";
import { ChevronRight, Layers, Loader2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, type Project } from "@/services/mockProjectsApi";

const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `KES ${(value / 1000000000).toFixed(2)}B`;
  }
  return `KES ${(value / 1000000).toFixed(0)}M`;
};

const mapRiskToStatus = (riskLevel: Project["riskLevel"]): "green" | "amber" | "red" => {
  if (riskLevel === "critical" || riskLevel === "high") {
    return "red";
  }
  if (riskLevel === "medium") {
    return "amber";
  }
  return "green";
};

declare global {
  interface Window {
    google?: any;
  }
}

let googleMapsLoader: Promise<void> | null = null;

const loadGoogleMaps = (apiKey: string) => {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsLoader) {
    return googleMapsLoader;
  }

  googleMapsLoader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=maps3d`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return googleMapsLoader;
};

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const map3DContainerRef = useRef<HTMLDivElement | null>(null);
  const map3DRef = useRef<any>(null);
  const [is3D, setIs3D] = useState(true);
  const [map3DError, setMap3DError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    county: "All Counties",
    sector: "All Sectors",
    riskLevel: "All Risk Levels",
    auditStatus: "All Statuses",
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_TILES_API_KEY as string | undefined;
    if (!apiKey) {
      return;
    }

    const initMap = async () => {
      await loadGoogleMaps(apiKey);

      if (!window.google?.maps || !mapContainerRef.current) {
        return;
      }

      let MapConstructor = window.google.maps.Map;
      let RenderingType = window.google.maps.RenderingType;

      if (window.google.maps.importLibrary) {
        const mapsLib = await window.google.maps.importLibrary("maps");
        MapConstructor = mapsLib.Map ?? MapConstructor;
        RenderingType = mapsLib.RenderingType ?? RenderingType;
      }

      const renderingType = RenderingType?.VECTOR;
      mapRef.current = new MapConstructor(mapContainerRef.current, {
        center: { lat: -1.2921, lng: 36.8219 },
        zoom: 6,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        gestureHandling: "greedy",
        heading: 0,
        tilt: 0,
        ...(renderingType ? { renderingType } : {}),
      });
    };

    initMap().catch(() => {
      // No-op: the fallback message below will remain visible.
    });
  }, []);

  useEffect(() => {
    if (!is3D) {
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_TILES_API_KEY as string | undefined;
    if (!apiKey) {
      return;
    }

    const init3D = async () => {
      await loadGoogleMaps(apiKey);

      if (!window.google?.maps || !map3DContainerRef.current) {
        return;
      }

      const maps3dLib = window.google.maps.importLibrary
        ? await window.google.maps.importLibrary("maps3d")
        : null;

      const Map3DElement = maps3dLib?.Map3DElement ?? window.google.maps.maps3d?.Map3DElement;
      const MapMode = maps3dLib?.MapMode ?? window.google.maps.maps3d?.MapMode;
      const GestureHandling = maps3dLib?.GestureHandling ?? window.google.maps.maps3d?.GestureHandling;

      if (!Map3DElement) {
        return;
      }

      if (map3DRef.current) {
        return;
      }

      const map3d = new Map3DElement({
        center: { lat: -1.2921, lng: 36.8219, altitude: 0 },
        range: 20000,
        tilt: 45,
        heading: 0,
        mode: MapMode?.HYBRID ?? "HYBRID",
        defaultUIHidden: true,
        gestureHandling: GestureHandling?.GREEDY ?? "greedy",
      });

      map3d.style.display = "block";
      map3d.style.width = "100%";
      map3d.style.height = "100%";
      map3d.style.position = "absolute";
      map3d.style.inset = "0";
      map3d.addEventListener("gmp-error", () => {
        setMap3DError("3D map failed to initialize. Check API enablement, billing, and coverage.");
      });
      map3d.addEventListener("gmp-steadychange", (event: any) => {
        if (event?.isSteady) {
          setMap3DError(null);
        }
      });
      map3DContainerRef.current.replaceChildren(map3d);
      map3DRef.current = map3d;
    };

    init3D().catch(() => {
      // No-op: the fallback message below will remain visible.
    });

    return () => {
      if (map3DRef.current) {
        map3DRef.current.remove();
        map3DRef.current = null;
      }
    };
  }, [is3D]);

  const matchesFilters = (
    project: Project,
    activeFilters: ProjectFilters,
    options: { ignoreCounty?: boolean } = {}
  ) => {
    const searchLower = activeFilters.search?.trim().toLowerCase();
    if (
      searchLower &&
      !(
        project.name.toLowerCase().includes(searchLower) ||
        project.id.toLowerCase().includes(searchLower) ||
        project.entity.toLowerCase().includes(searchLower)
      )
    ) {
      return false;
    }

    if (
      !options.ignoreCounty &&
      activeFilters.county !== "All Counties" &&
      !project.county.includes(activeFilters.county)
    ) {
      return false;
    }

    if (activeFilters.sector !== "All Sectors" && project.sector !== activeFilters.sector) {
      return false;
    }

    if (activeFilters.riskLevel !== "All Risk Levels" && project.riskLevel !== activeFilters.riskLevel) {
      return false;
    }

    if (activeFilters.auditStatus !== "All Statuses" && project.auditStatus !== activeFilters.auditStatus) {
      return false;
    }

    return true;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => matchesFilters(project, filters));
  }, [projects, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.county !== "All Counties") count++;
    if (filters.sector !== "All Sectors") count++;
    if (filters.riskLevel !== "All Risk Levels") count++;
    if (filters.auditStatus !== "All Statuses") count++;
    return count;
  }, [filters]);

  const countySummary = useMemo(() => {
    const summaryProjects = projects.filter((project) =>
      matchesFilters(project, filters, { ignoreCounty: true })
    );
    const summary = new Map<string, { projects: number; highRisk: number }>();
    summaryProjects.forEach((project) => {
      const entry = summary.get(project.county) || { projects: 0, highRisk: 0 };
      entry.projects += 1;
      if (project.riskLevel === "high" || project.riskLevel === "critical") {
        entry.highRisk += 1;
      }
      summary.set(project.county, entry);
    });
    return Array.from(summary.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.projects - a.projects);
  }, [projects, filters]);

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setSelectedProjectId(null);
      return;
    }

    if (!selectedProjectId || !filteredProjects.some((project) => project.id === selectedProjectId)) {
      setSelectedProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects, selectedProjectId]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) {
      return null;
    }
    return filteredProjects.find((project) => project.id === selectedProjectId) ?? null;
  }, [filteredProjects, selectedProjectId]);

  const handleCountySelect = (countyName: string) => {
    setFilters((prev) => {
      const nextCounty = prev.county === countyName ? "All Counties" : countyName;
      return { ...prev, county: nextCounty };
    });
  };

  const handleZoomIn = () => {
    if (is3D) {
      const map3d = map3DRef.current;
      if (!map3d) {
        return;
      }
      const nextRange = Math.max(500, (map3d.range ?? 25000) * 0.8);
      map3d.range = nextRange;
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (is3D) {
      const map3d = map3DRef.current;
      if (!map3d) {
        return;
      }
      const nextRange = Math.min(200000, (map3d.range ?? 25000) * 1.2);
      map3d.range = nextRange;
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.setZoom(map.getZoom() - 1);
  };

  const handleResetView = () => {
    if (is3D) {
      const map3d = map3DRef.current;
      if (map3d) {
        map3d.center = { lat: -1.2921, lng: 36.8219, altitude: 0 };
        map3d.range = 20000;
        map3d.tilt = 45;
        map3d.heading = 0;
      }
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }
    map.setCenter({ lat: -1.2921, lng: 36.8219 });
    map.setZoom(6);
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* Map Area */}
        <div className="flex-1 relative bg-secondary/30 grid-overlay overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
              onClick={handleZoomIn}
              aria-label="Zoom in"
              type="button"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
              onClick={handleZoomOut}
              aria-label="Zoom out"
              type="button"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors"
              onClick={handleResetView}
              aria-label="Reset view"
              type="button"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              className={`w-10 h-10 rounded-md glass-panel flex items-center justify-center hover:bg-accent transition-colors ${
                is3D ? "bg-accent/70" : ""
              }`}
              onClick={() => setIs3D((value) => !value)}
              aria-label={is3D ? "Switch to 2D" : "Switch to 3D"}
              aria-pressed={is3D}
              type="button"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Google Maps Container */}
          <div className="absolute inset-0">
            <div
              ref={mapContainerRef}
              className={`absolute inset-0 w-full h-full ${is3D ? "hidden" : "block"}`}
            />
            <div
              ref={map3DContainerRef}
              className={`absolute inset-0 w-full h-full ${is3D ? "block" : "hidden"}`}
            />
          </div>

          {!import.meta.env.VITE_GOOGLE_TILES_API_KEY && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <p className="text-lg font-medium text-muted-foreground">Geographic Audit Coverage</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Set <span className="font-mono">VITE_GOOGLE_TILES_API_KEY</span> to enable photorealistic 3D maps.
                </p>
              </div>
            </div>
          )}

          {is3D && map3DError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md glass-panel px-4 py-3">
                <p className="text-sm text-muted-foreground">{map3DError}</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Risk Classification
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-red" />
                <span className="text-sm">High Risk (47)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-amber" />
                <span className="text-sm">Medium Risk (134)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-green" />
                <span className="text-sm">Verified (211)</span>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-4 right-4 glass-panel px-3 py-2">
            <span className="text-xs font-mono text-muted-foreground">
              Kenya • 1.2921°S, 36.8219°E
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border p-4 space-y-4 overflow-auto">
          {loading && (
            <div className="glass-panel p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading project registry...
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="glass-panel p-4 space-y-3">
              <p className="text-sm font-medium">Failed to load projects</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retrying ? "Retrying..." : "Try Again"}
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <ProjectFilter
                filters={filters}
                onFiltersChange={setFilters}
                activeFilterCount={activeFilterCount}
                compact
              />

              {/* County Summary */}
              <div className="glass-panel p-4">
                <h3 className="section-header">County Summary</h3>
                {countySummary.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects match the current filters.</p>
                ) : (
                  <div className="space-y-2">
                    {countySummary.map((county) => (
                      <div
                        key={county.name}
                        className={`flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors ${
                          filters.county === county.name ? "bg-accent/30" : ""
                        }`}
                        onClick={() => handleCountySelect(county.name)}
                      >
                        <div>
                          <p className="text-sm font-medium">{county.name}</p>
                          <p className="text-xs text-muted-foreground">{county.projects} projects</p>
                        </div>
                        {county.highRisk > 0 && (
                          <span className="text-xs font-mono text-status-red">
                            {county.highRisk} high risk
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects List */}
              <div className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="section-header mb-0">Projects</h3>
                  <span className="text-xs text-muted-foreground">{filteredProjects.length} shown</span>
                </div>
                {filteredProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects found.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-2 rounded-md border border-border/50 hover:bg-accent/50 cursor-pointer transition-colors ${
                          selectedProjectId === project.id ? "bg-accent/30" : ""
                        }`}
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {project.county} / {project.sector}
                            </p>
                          </div>
                          <Link
                            to={`/projects/${project.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="p-1 rounded-md hover:bg-accent"
                            aria-label={`View ${project.name}`}
                          >
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </div>
                        <div className="mt-2">
                          <RiskBadge riskLevel={project.riskLevel} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Project */}
              <div className="glass-panel p-4">
                <h3 className="section-header">Selected Project</h3>
                {selectedProject ? (
                  <div className="p-3 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={mapRiskToStatus(selectedProject.riskLevel)} />
                      <RiskBadge riskLevel={selectedProject.riskLevel} />
                    </div>
                    <p className="font-medium text-sm">{selectedProject.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedProject.county} / {selectedProject.sector}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contract Sum</span>
                        <span className="font-mono">{formatCurrency(selectedProject.contractSum)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-mono">{formatCurrency(selectedProject.amountPaid)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Audit Status</span>
                        <span className="font-mono">{selectedProject.auditStatus}</span>
                      </div>
                    </div>
                    <Link
                      to={`/projects/${selectedProject.id}`}
                      className="w-full mt-3 px-3 py-2 rounded-md bg-accent hover:bg-accent/80 transition-colors text-sm font-medium inline-flex items-center justify-center"
                    >
                      View Full Details
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a project from the registry to view details.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}


