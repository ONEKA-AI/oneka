import { useState, useCallback } from "react";
import { Upload, FileText, MapPin, CheckCircle, AlertCircle, Download, Loader2, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedData {
  projectName: string;
  tenderNo: string;
  contractor: string;
  contractSum: string;
  location: string;
  coordinates: { lat: number; lng: number };
  awardDate: string;
}

interface ParsingStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "complete" | "error";
  detail?: string;
}

export function SmartIngestPortal() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsingSteps, setParsingSteps] = useState<ParsingStep[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificateReady, setCertificateReady] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateNLPParsing = async () => {
    const steps: ParsingStep[] = [
      { id: "ocr", label: "OCR Text Extraction", status: "pending" },
      { id: "nlp", label: "NLP Entity Recognition", status: "pending" },
      { id: "geo", label: "Proxy Geolocation Engine", status: "pending" },
      { id: "validate", label: "Data Validation", status: "pending" },
      { id: "index", label: "Indexing & Storage", status: "pending" }
    ];

    setParsingSteps(steps);
    setExtractedData(null);
    setCertificateReady(false);

    // Simulate each step with delays
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setParsingSteps(prev => prev.map((step, idx) => {
        if (idx === i) return { ...step, status: "processing" };
        if (idx < i) return { ...step, status: "complete" };
        return step;
      }));

      await new Promise(resolve => setTimeout(resolve, 1200));

      // Add details as processing completes
      const details: Record<string, string> = {
        ocr: "Extracted 2,847 text tokens from 12 pages",
        nlp: "Identified 23 entities: 4 organizations, 8 locations, 11 monetary values",
        geo: "Resolved 'Nyeri Market Complex' → -0.4246°, 36.9473°",
        validate: "Cross-referenced with IFMIS Vote: 2024/NYR/MKT/001",
        index: "Document ID: EVD-2024-00847-NM assigned"
      };

      setParsingSteps(prev => prev.map((step, idx) => {
        if (idx === i) return { ...step, status: "complete", detail: details[step.id] };
        return step;
      }));
    }

    // Set extracted data
    setExtractedData({
      projectName: "Nyeri Central Market Modernization",
      tenderNo: "TNR/2024/NYR/MKT/00234",
      contractor: "Multiplex Construction Ltd",
      contractSum: "KES 456,780,000",
      location: "Nyeri Market, Nyeri Town",
      coordinates: { lat: -0.4246, lng: 36.9473 },
      awardDate: "2024-03-15"
    });
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      await simulateNLPParsing();
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      await simulateNLPParsing();
    }
  };

  const handleGenerateCertificate = async () => {
    setIsGeneratingCertificate(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingCertificate(false);
    setCertificateReady(true);
  };

  const getStepIcon = (status: ParsingStep["status"]) => {
    switch (status) {
      case "pending": return <div className="w-4 h-4 rounded-full border-2 border-muted" />;
      case "processing": return <Loader2 className="w-4 h-4 animate-spin text-chart-1" />;
      case "complete": return <CheckCircle className="w-4 h-4 text-status-green" />;
      case "error": return <AlertCircle className="w-4 h-4 text-status-red" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Portal */}
      <div className="glass-panel p-6">
        <h3 className="section-header flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Document Ingest Portal
        </h3>
        
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 cursor-pointer",
            isDragging 
              ? "border-chart-1 bg-chart-1/10" 
              : "border-border hover:border-muted-foreground",
            uploadedFile && "border-status-green bg-status-green/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
          />
          
          <div className="text-center">
            {uploadedFile ? (
              <>
                <FileText className="w-12 h-12 mx-auto mb-3 text-status-green" />
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                </p>
              </>
            ) : (
              <>
                <Upload className={cn(
                  "w-12 h-12 mx-auto mb-3 transition-colors",
                  isDragging ? "text-chart-1" : "text-muted-foreground"
                )} />
                <p className="font-medium">
                  {isDragging ? "Drop PDF to upload" : "Drag & drop PDF documents"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tender Awards, COB Quarterly Reports, Contract Documents
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NLP Parsing Progress */}
      {parsingSteps.length > 0 && (
        <div className="glass-panel p-6">
          <h3 className="section-header flex items-center gap-2">
            <Search className="w-4 h-4" />
            NLP Processing Pipeline
          </h3>
          
          <div className="space-y-3">
            {parsingSteps.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="mt-0.5">{getStepIcon(step.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium",
                      step.status === "complete" ? "text-foreground" :
                      step.status === "processing" ? "text-chart-1" : "text-muted-foreground"
                    )}>
                      {step.label}
                    </span>
                    {step.status === "processing" && (
                      <span className="text-xs text-chart-1 animate-pulse">Processing...</span>
                    )}
                  </div>
                  {step.detail && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{step.detail}</p>
                  )}
                </div>
                {idx < parsingSteps.length - 1 && (
                  <div className={cn(
                    "absolute left-[18px] top-[28px] w-0.5 h-6",
                    step.status === "complete" ? "bg-status-green/50" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Data & Geolocation */}
      {extractedData && (
        <div className="grid grid-cols-2 gap-4">
          {/* Extracted Entities */}
          <div className="glass-panel p-6">
            <h3 className="section-header">Extracted Entities</h3>
            <div className="space-y-3">
              {[
                { label: "Project Name", value: extractedData.projectName },
                { label: "Tender No.", value: extractedData.tenderNo, mono: true },
                { label: "Contractor", value: extractedData.contractor },
                { label: "Contract Sum", value: extractedData.contractSum, mono: true },
                { label: "Award Date", value: extractedData.awardDate, mono: true }
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  <span className={cn(
                    "text-sm text-right",
                    item.mono && "font-mono"
                  )}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geolocation Map */}
          <div className="glass-panel p-6">
            <h3 className="section-header flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Proxy Geolocation Result
            </h3>
            
            <div className="aspect-video bg-secondary/30 rounded-lg relative overflow-hidden mb-4">
              {/* Mini Map */}
              <div className="absolute inset-0 topo-wireframe opacity-20" />
              <div className="absolute inset-0 grid-overlay opacity-30" />
              
              {/* Location Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-status-green/20 rounded-full animate-pulse" />
                  <div className="absolute -inset-2 bg-status-green/30 rounded-full" />
                  <MapPin className="w-6 h-6 text-status-green relative z-10" />
                </div>
              </div>

              {/* Coordinates Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{extractedData.location}</span>
                  <span className="font-mono text-status-green">
                    {extractedData.coordinates.lat.toFixed(4)}°, {extractedData.coordinates.lng.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-status-green/10 border border-status-green/30 rounded-lg">
              <div className="flex items-center gap-2 text-status-green text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Location Verified</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates matched with Sentinel-2 satellite coverage zone
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Certificate Generation */}
      {extractedData && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Section 106B Evidence Certificate</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Generate legally admissible audit evidence document
              </p>
            </div>
            
            {certificateReady ? (
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-status-green text-primary-foreground font-semibold hover:bg-status-green/90 transition-colors">
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
            ) : (
              <button 
                onClick={handleGenerateCertificate}
                disabled={isGeneratingCertificate}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors",
                  isGeneratingCertificate 
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isGeneratingCertificate ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Section 106B Certificate
                  </>
                )}
              </button>
            )}
          </div>

          {certificateReady && (
            <div className="mt-4 p-4 bg-status-green/10 border border-status-green/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-status-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-status-green">Certificate Generated Successfully</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Document ID: <span className="font-mono">EVD-2024-00847-NM</span> • 
                    Timestamp: <span className="font-mono">{new Date().toISOString()}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
