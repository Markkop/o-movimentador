import { ShieldAlert, ShieldCheck, ShieldQuestion, Info } from "lucide-react";
import { cn } from "../../lib/utils";

const SEVERITY_CONFIG = {
  Travado: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  Alto: { color: "text-salmon", bg: "bg-salmon/10", border: "border-salmon/30" },
  Médio: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  Baixo: { color: "text-lightBlue", bg: "bg-lightBlue/10", border: "border-lightBlue/30" },
  Nota: { color: "text-icons", bg: "bg-icons/10", border: "border-icons/30" },
};

const REMEDIATION_CONFIG = {
  Feito: { icon: ShieldCheck, color: "text-green", label: "Feito" },
  Parcial: { icon: ShieldQuestion, color: "text-yellow-500", label: "Parcial" },
  Planejado: { icon: Info, color: "text-lightBlue", label: "Planejado" },
  "Precisa de apoio": { icon: ShieldAlert, color: "text-salmon", label: "Precisa de apoio" },
};

function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.Nota;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium border", config.color, config.bg, config.border)}>
      {severity}
    </span>
  );
}

function RemediationBadge({ state }) {
  if (!state) {
    return <span className="text-2xs text-icons">--</span>;
  }
  const config = REMEDIATION_CONFIG[state] ?? REMEDIATION_CONFIG["Precisa de apoio"];
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-2xs font-medium", config.color)}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function SeverityCard({ label, count, severity }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.Nota;
  return (
    <div className={cn("flex flex-col items-center p-3 rounded-lg border", config.border, config.bg)}>
      <p className={cn("text-2xl font-bold", config.color)}>{count}</p>
      <p className="text-xs text-subtitle mt-0.5">{label}</p>
    </div>
  );
}

export function ActivityFindingsTab({ findings = [] }) {
  if (findings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-icons">
        <ShieldCheck size={40} className="mb-3 opacity-50" />
        <p className="text-sm">Ainda não há vitórias ou atritos nesta jornada.</p>
      </div>
    );
  }

  const severityCounts = {
    Travado: findings.filter((f) => f.severity === "Travado").length,
    Alto: findings.filter((f) => f.severity === "Alto").length,
    Médio: findings.filter((f) => f.severity === "Médio").length,
    Baixo: findings.filter((f) => f.severity === "Baixo").length,
    Nota: findings.filter((f) => f.severity === "Nota").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(severityCounts).map(([severity, count]) => (
          <SeverityCard key={severity} label={severity} count={count} severity={severity} />
        ))}
      </div>

      <div className="rounded-lg border border-cardStroke overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondaryCardBackground border-b border-cardStroke">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">Prioridade</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">Padrão</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-subtitle uppercase tracking-wider">Próximo passo</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding) => (
              <tr key={finding.id} className="border-b border-cardStroke last:border-0 hover:bg-cardBackgroundHover transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-subtitle whitespace-nowrap">{finding.halIndex}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={finding.severity} />
                </td>
                <td className="px-4 py-3 text-title">{finding.title}</td>
                <td className="px-4 py-3">
                  <RemediationBadge state={finding.remediationState} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
