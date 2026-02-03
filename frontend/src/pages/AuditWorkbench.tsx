import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RiskHeatMap } from "@/components/map/RiskHeatMap";
import { AuditCard, sampleAuditCards } from "@/components/audit/AuditCard";
import { SmartIngestPortal } from "@/components/ingest/SmartIngestPortal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, FileStack, Upload } from "lucide-react";

export default function AuditWorkbench() {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <AppLayout>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Workbench Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Audit Workbench</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Intelligence console for project monitoring and evidence generation
              </p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="glass-panel">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Risk Heat Map
                </TabsTrigger>
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <FileStack className="w-4 h-4" />
                  Audit Cards
                </TabsTrigger>
                <TabsTrigger value="ingest" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Smart Ingest
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "map" && (
            <RiskHeatMap />
          )}

          {activeTab === "cards" && (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <h2 className="section-header">Active Audit Dockets</h2>
                  <p className="text-sm text-muted-foreground">
                    Hover over satellite thumbnails to initiate visual analysis scan
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sampleAuditCards.map((card) => (
                    <AuditCard 
                      key={card.id} 
                      data={card}
                      onViewDetails={() => console.log("View details:", card.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ingest" && (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <SmartIngestPortal />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
