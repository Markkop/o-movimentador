import { CheckCircle2, Clock, AlertCircle, CircleDot, ClipboardList } from "lucide-react";
import { cn } from "../../lib/utils";

const STATUS_CONFIG = {
  "Done": { icon: CheckCircle2, color: "text-green", bg: "bg-green/10" },
  "In Progress": { icon: Clock, color: "text-lightBlue", bg: "bg-lightBlue/10" },
  "Queued": { icon: CircleDot, color: "text-icons", bg: "bg-icons/10" },
  "Skipped": { icon: AlertCircle, color: "text-salmon", bg: "bg-salmon/10" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["Queued"];
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-medium", config.color, config.bg)}>
      <Icon size={12} />
      {status}
    </span>
  );
}

function SummaryCard({ label, count, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-cardStroke bg-secondaryCardBackground">
      <div className={cn("shrink-0", color)}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-lg font-bold text-title">{count}</p>
        <p className="text-xs text-subtitle">{label}</p>
      </div>
    </div>
  );
}

export function ActivityTestPlanTab({ testCases = [] }) {
  if (testCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-icons">
        <ClipboardList size={40} className="mb-3 opacity-50" />
        <p className="text-sm">No weekly plan is available for this activity yet.</p>
      </div>
    );
  }

  const counts = {
    total: testCases.length,
    passed: testCases.filter((tc) => tc.status === "Done").length,
    inProgress: testCases.filter((tc) => tc.status === "In Progress").length,
    failed: testCases.filter((tc) => tc.status === "Skipped").length,
    pending: testCases.filter((tc) => tc.status === "Queued").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Total" count={counts.total} icon={ClipboardList} color="text-title" />
        <SummaryCard label="Done" count={counts.passed} icon={CheckCircle2} color="text-green" />
        <SummaryCard label="In Progress" count={counts.inProgress} icon={Clock} color="text-lightBlue" />
        <SummaryCard label="Skipped" count={counts.failed} icon={AlertCircle} color="text-salmon" />
      </div>

      <div className="rounded-lg border border-cardStroke overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondaryCardBackground border-b border-cardStroke">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">Habit Step</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc) => (
              <tr key={tc.id} className="border-b border-cardStroke last:border-0 hover:bg-cardBackgroundHover transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-subtitle whitespace-nowrap">{tc.halIndex}</td>
                <td className="px-4 py-3 text-title">{tc.title}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={tc.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
