"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../lib/utils";
import { Calendar, Tag } from "lucide-react";
import { ActivitySourcesTab } from "./activity-tabs/ActivitySourcesTab";
import { ActivityTestPlanTab } from "./activity-tabs/ActivityTestPlanTab";
import { ActivityFindingsTab } from "./activity-tabs/ActivityFindingsTab";
import { ActivityAnalysisTab } from "./activity-tabs/ActivityAnalysisTab";
import {
  MOCK_SOURCES,
  MOCK_TEST_CASES,
  MOCK_FINDINGS,
  MOCK_ANALYSIS,
} from "./mockPortalData";

const STATUS_STYLES = {
  "Em andamento": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Concluída: "bg-green/10 text-green border-green/30",
  Reajustando: "bg-salmon/10 text-salmon border-salmon/30",
  Planejada: "bg-icons/10 text-icons border-icons/30",
};

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        STATUS_STYLES[status] ?? STATUS_STYLES.Planejada
      )}
    >
      {status}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function ActivityDetailDialog({ activity, open, onOpenChange }) {
  if (!activity) return null;

  const sources = MOCK_SOURCES[activity.id] ?? [];
  const testCases = MOCK_TEST_CASES[activity.id] ?? [];
  const findings = MOCK_FINDINGS[activity.id] ?? [];
  const analysis = MOCK_ANALYSIS[activity.id] ?? null;

  const totalFindings = Object.values(activity.findingsBySeverity ?? {}).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-navBackground border-cardStroke p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-cardStroke flex-shrink-0">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold text-title truncate">
                {activity.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-subtitle mt-1">
                {activity.reportName}
              </DialogDescription>
            </div>
            <StatusBadge status={activity.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-subtitle">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondaryCardBackground border border-cardStroke">
              {activity.category}
            </span>

            {(activity.startDate || activity.endDate) && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
              </span>
            )}

            {totalFindings > 0 && (
              <span className="inline-flex items-center gap-1.5">
                {totalFindings} ponto{totalFindings !== 1 ? "s" : ""} de atrito
              </span>
            )}

            {activity.leetTags?.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag size={12} />
                {activity.leetTags.map((tag) => (
                  <span
                    key={tag.title}
                    className="px-1.5 py-0.5 rounded bg-hAccent/10 text-hAccent text-2xs font-medium"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Tabs defaultValue="sources" className="mt-4">
            <TabsList>
              <TabsTrigger value="sources">
                Entradas
                {sources.length > 0 && (
                  <span className="ml-1.5 text-2xs text-subtitle">({sources.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="test-plan">
                Plano da semana
                {testCases.length > 0 && (
                  <span className="ml-1.5 text-2xs text-subtitle">({testCases.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="findings">
                Vitórias e atritos
                {findings.length > 0 && (
                  <span className="ml-1.5 text-2xs text-subtitle">({findings.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="analysis">
                Notas do coach
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sources">
              <ActivitySourcesTab sources={sources} />
            </TabsContent>
            <TabsContent value="test-plan">
              <ActivityTestPlanTab testCases={testCases} />
            </TabsContent>
            <TabsContent value="findings">
              <ActivityFindingsTab findings={findings} />
            </TabsContent>
            <TabsContent value="analysis">
              <ActivityAnalysisTab analysis={analysis} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
