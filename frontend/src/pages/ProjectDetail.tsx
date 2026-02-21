import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { 
  ArrowLeft, 
  MapPin, 
  Building, 
  Calendar, 
  FileText, 
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Download,
  ShoppingCart,
  Users,
  Banknote,
  TrendingDown,
  Flag
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState, useEffect } from "react";
import { getProjectById, type Project } from "@/services/mockProjectsApi";

const progressData = [
  { month: "Jul", financial: 15, physical: 12 },
  { month: "Aug", financial: 28, physical: 18 },
  { month: "Sep", financial: 42, physical: 25 },
  { month: "Oct", financial: 55, physical: 31 },
  { month: "Nov", financial: 68, physical: 38 },
  { month: "Dec", financial: 72, physical: 42 },
  { month: "Jan", financial: 78, physical: 48 },
];

const riskFlags = [
  { type: "Burn Rate Mismatch", severity: "high", description: "Financial progress exceeds physical by 30%" },
  { type: "Lowball Tender", severity: "medium", description: "Contract awarded at 24% below engineer's estimate" },
  { type: "Disbursement Pattern", severity: "high", description: "Unusual end-of-quarter payment spikes detected" },
];

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `KES ${(value / 1000000000).toFixed(2)}B`;
  }
  return `KES ${(value / 1000000).toFixed(0)}M`;
}

function getRiskColor(risk: string): "red" | "amber" | "green" {
  if (risk === "critical") return "red";
  if (risk === "high") return "red";
  if (risk === "medium") return "amber";
  return "green";
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No project ID provided");
      setLoading(false);
      return;
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectById(id);
      setProject(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setProject(null);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchProject();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects Registry
          </Link>
          <LoadingState />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects Registry
          </Link>
          <ErrorState error={error} onRetry={handleRetry} isRetrying={retrying} />
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects Registry
          </Link>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Project not found</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Back Navigation */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects Registry
        </Link>

        {/* Project Header */}
        <div className="glass-panel p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={getRiskColor(project.riskLevel)} />
                <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {project.entity}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {project.county}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {project.sector}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors text-sm">
                <Download className="w-4 h-4" />
                Export Evidence
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Visuals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Satellite Comparison */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <h3 className="section-header mb-0">Satellite Imagery Comparison</h3>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Lat: -1.2274, Lng: 36.8912</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="aspect-video bg-secondary rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Baseline Image</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">2022-03-15</p>
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-xs font-medium">
                    Before
                  </span>
                </div>
                <div className="relative">
                  <div className="aspect-video bg-secondary rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Image</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">2024-01-20</p>
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-xs font-medium">
                    After
                  </span>
                </div>
              </div>
            </div>

            {/* S-Curve Progress */}
            <div className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h3 className="section-header mb-0">Financial vs Physical Progress (S-Curve)</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-chart-1" />
                    <span className="text-muted-foreground">Financial %</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-chart-2" />
                    <span className="text-muted-foreground">Physical %</span>
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFinancial" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(215, 70%, 50%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPhysical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 25%, 18%)" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
                      axisLine={{ stroke: 'hsl(220, 25%, 18%)' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }}
                      axisLine={{ stroke: 'hsl(220, 25%, 18%)' }}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(222, 47%, 10%)',
                        border: '1px solid hsl(220, 25%, 25%)',
                        borderRadius: '6px',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: 'hsl(210, 20%, 95%)' }}
                    />
                    <ReferenceLine 
                      y={50} 
                      stroke="hsl(38, 90%, 50%)" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Target', fill: 'hsl(38, 90%, 50%)', fontSize: 10 }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="financial"
                      stroke="hsl(215, 70%, 50%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorFinancial)"
                    />
                    <Area
                      type="monotone"
                      dataKey="physical"
                      stroke="hsl(142, 60%, 45%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPhysical)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-3 bg-status-red-muted rounded-md border border-status-red/30">
                <div className="flex items-center gap-2 text-status-red text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  Anomaly Detected: 30% gap between financial and physical progress
                </div>
              </div>
            </div>

            {/* Procurement Data Section */}
            {project.procurement && (
              <div className="glass-panel p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                  <h3 className="section-header mb-0">Procurement Data</h3>
                </div>

                {/* Tender Info */}
                <div className="mb-5 pb-4 border-b border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tender ID</span>
                      <p className="font-mono text-xs mt-1">{project.procurement.tenderId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Method</span>
                      <p className="font-medium text-xs mt-1">{project.procurement.method}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Published</span>
                      <p className="font-mono text-xs mt-1">
                        {new Date(project.procurement.publishedDate).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Closing</span>
                      <p className="font-mono text-xs mt-1">
                        {new Date(project.procurement.closingDate).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tender Comparison */}
                <div className="mb-5 pb-4 border-b border-border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-muted-foreground" />
                    Tender Comparison (±15% Threshold)
                  </h4>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-secondary/30 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Engineer's Est.</p>
                      <p className="font-mono font-semibold text-sm">
                        {formatCurrency(project.procurement.engineersEstimate)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-md ${
                      Math.abs(((project.procurement.awardedValue - project.procurement.engineersEstimate) / project.procurement.engineersEstimate) * 100) <= 15
                        ? "bg-status-green-muted"
                        : "bg-status-red-muted"
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">Awarded Value</p>
                      <p className={`font-mono font-semibold text-sm ${
                        Math.abs(((project.procurement.awardedValue - project.procurement.engineersEstimate) / project.procurement.engineersEstimate) * 100) <= 15
                          ? "text-status-green"
                          : "text-status-red"
                      }`}>
                        {formatCurrency(project.procurement.awardedValue)}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-md">
                      <p className="text-xs text-muted-foreground mb-1">Variance</p>
                      <p className={`font-mono font-semibold text-sm ${
                        Math.abs(((project.procurement.awardedValue - project.procurement.engineersEstimate) / project.procurement.engineersEstimate) * 100) <= 15
                          ? "text-status-green"
                          : "text-status-red"
                      }`}>
                        {(((project.procurement.awardedValue - project.procurement.engineersEstimate) / project.procurement.engineersEstimate) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Acceptable Range Indicator */}
                  <div className="p-3 bg-secondary/20 border border-border rounded-md">
                    <p className="text-xs text-muted-foreground mb-2">Acceptable Range</p>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-status-green">Minimum: {formatCurrency(project.procurement.engineersEstimate * 0.85)}</span>
                        <span className="text-muted-foreground">(-15%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-status-green">Maximum: {formatCurrency(project.procurement.engineersEstimate * 1.15)}</span>
                        <span className="text-muted-foreground">(+15%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bidders */}
                <div className="mb-5 pb-4 border-b border-border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    Bidders ({project.procurement.totalBidders})
                  </h4>
                  <div className="space-y-2">
                    {project.procurement.bidders.map((bidder) => {
                      const isWithinRange = Math.abs(bidder.variance) <= 15;
                      return (
                        <div key={bidder.id} className={`p-3 rounded-md border ${
                          bidder.flagged || !isWithinRange
                            ? "border-status-red/30 bg-status-red-muted"
                            : bidder.status === "selected"
                              ? "border-status-green/30 bg-status-green-muted"
                              : "border-status-green/20 bg-status-green-muted/30"
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className={`font-medium text-sm ${
                                  bidder.status === "selected" ? "text-status-green" : ""
                                }`}>
                                  {bidder.name}
                                </p>
                                {bidder.status === "selected" && (
                                  <span className="px-2 py-0.5 bg-status-green/20 text-status-green text-xs rounded font-medium">
                                    ✓ Selected
                                  </span>
                                )}
                                {isWithinRange && bidder.status !== "selected" && (
                                  <span className="px-2 py-0.5 bg-status-green/20 text-status-green text-xs rounded font-medium">
                                    Within Range
                                  </span>
                                )}
                                {!isWithinRange && (
                                  <span className="px-2 py-0.5 bg-status-red/20 text-status-red text-xs rounded font-medium">
                                    Out of Range
                                  </span>
                                )}
                                {bidder.flagged && (
                                  <Flag className="w-3 h-3 text-status-red flex-shrink-0" />
                                )}
                              </div>
                              {bidder.flag && (
                                <p className="text-xs text-muted-foreground mt-1">{bidder.flag}</p>
                              )}
                            </div>
                          <div className="text-right ml-2">
                            <p className="font-mono text-sm font-semibold">
                              {formatCurrency(bidder.quote)}
                            </p>
                            <p className={`text-xs font-mono mt-0.5 ${
                              isWithinRange
                                ? "text-status-green"
                                : "text-status-red"
                            }`}>
                              {bidder.variance > 0 ? "+" : ""}{bidder.variance.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>

                {/* Irregularities */}
                {project.procurement.irregularities && project.procurement.irregularities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-status-red">
                      <AlertTriangle className="w-4 h-4" />
                      Procurement Irregularities
                    </h4>
                    <div className="space-y-2">
                      {project.procurement.irregularities.map((irregularity, idx) => (
                        <div key={idx} className="p-2 bg-status-red-muted/50 border border-status-red/20 rounded text-xs text-muted-foreground">
                          • {irregularity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Project Identification */}
            <div className="glass-panel p-5">
              <h3 className="section-header">Project Identification</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract No.</span>
                  <span className="font-mono">KeNHA/2022/OT/456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vote</span>
                  <span className="font-mono">R1091</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sector</span>
                  <span>{project.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="capitalize font-medium">{project.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Financial Trail */}
            <div className="glass-panel p-5">
              <h3 className="section-header">Financial Trail</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Sum</span>
                  <span className="font-mono font-medium">{formatCurrency(project.contractSum)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget Allocated</span>
                  <span className="font-mono">{formatCurrency(project.contractSum)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Disbursed</span>
                  <span className="font-mono text-status-amber">{formatCurrency(project.amountPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified Expenditure</span>
                  <span className="font-mono text-status-red">{formatCurrency(project.amountPaid * 0.68)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="text-muted-foreground">Unverified Gap</span>
                  <span className="font-mono font-medium text-status-red">{formatCurrency(project.amountPaid * 0.32)}</span>
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-status-red" />
                <h3 className="section-header mb-0">Risk Flags</h3>
              </div>
              <div className="space-y-3">
                {riskFlags.map((flag, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md ${
                      flag.severity === 'high' 
                        ? 'bg-status-red-muted border border-status-red/30' 
                        : 'bg-status-amber-muted border border-status-amber/30'
                    }`}
                  >
                    <p className={`text-sm font-medium ${
                      flag.severity === 'high' ? 'text-status-red' : 'text-status-amber'
                    }`}>
                      {flag.type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verdict */}
            <div className="glass-panel p-5">
              <h3 className="section-header">AI Verdict</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence Score</span>
                  <span className="font-mono font-bold text-lg">87.4%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-status-red" style={{ width: '87.4%' }} />
                </div>
                <div className="p-3 bg-status-red-muted rounded-md">
                  <p className="text-sm text-status-red font-medium">Recommendation: Escalate to OAG</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    High probability of procurement irregularity. Physical verification required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Reference */}
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4" />
            <span className="legal-ref">
              Report generated under PFM Act 2012, Section 68 • PPADA 2015, Part IX
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Last Updated: {new Date(project.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>
    </AppLayout>
  );
}

