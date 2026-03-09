import { Bot, AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const INSIGHT_SEVERITY_CONFIG = {
  high: { icon: AlertTriangle, color: "text-salmon", bg: "bg-salmon/10", border: "border-salmon/30" },
  medium: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  positive: { icon: CheckCircle2, color: "text-green", bg: "bg-green/10", border: "border-green/30" },
  info: { icon: Info, color: "text-lightBlue", bg: "bg-lightBlue/10", border: "border-lightBlue/30" },
};

function InsightCard({ insight }) {
  const config = INSIGHT_SEVERITY_CONFIG[insight.severity] ?? INSIGHT_SEVERITY_CONFIG.info;
  const Icon = config.icon;

  return (
    <div className={cn("p-4 rounded-lg border", config.border, config.bg)}>
      <div className="flex items-start gap-3">
        <Icon size={18} className={cn("shrink-0 mt-0.5", config.color)} />
        <div className="min-w-0">
          <p className={cn("text-sm font-semibold", config.color)}>{insight.title}</p>
          <p className="text-sm text-bodyPrimary mt-1">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ActivityAnalysisTab({ analysis }) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-icons">
        <Bot size={40} className="mb-3 opacity-50" />
        <p className="text-sm">No coach notes are available for this activity yet.</p>
        <p className="text-xs text-icons mt-1">Coach notes will appear once the activity starts collecting real progress.</p>
      </div>
    );
  }

  if (analysis.status === "in_progress") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-icons">
        <Loader2 size={40} className="mb-3 animate-spin text-hAccent" />
        <p className="text-sm text-title font-medium">Coach review in progress...</p>
        <p className="text-xs text-subtitle mt-1">We are reading your inputs and progress patterns now. Notes will appear here shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-hAccent" />
          <span className="text-sm font-semibold text-title">Coach Insights</span>
        </div>
        <span className="text-xs text-subtitle">
          Last updated: {new Date(analysis.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {analysis.insights?.length > 0 ? (
        <div className="space-y-3">
          {analysis.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-icons text-center py-8">No coach notes generated yet.</p>
      )}

      {analysis.provisionalFindings > 0 && (
        <div className="p-4 rounded-lg border border-cardStroke bg-secondaryCardBackground">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-salmon" />
            <span className="text-sm font-medium text-title">
              {analysis.provisionalFindings} Friction Point{analysis.provisionalFindings > 1 ? "s" : ""} Flagged
            </span>
          </div>
          <p className="text-xs text-subtitle mt-1 ml-6">
            These are early coaching flags that should shape the next smaller step.
          </p>
        </div>
      )}
    </div>
  );
}
