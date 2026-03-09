import { GitBranch, Globe, FileUp } from "lucide-react";
import { cn } from "../../lib/utils";

const SOURCE_TYPE_CONFIG = {
  repository: { icon: GitBranch, label: "Plano", color: "text-hAccent" },
  url: { icon: Globe, label: "Link", color: "text-lightBlue" },
  file: { icon: FileUp, label: "Nota", color: "text-salmon" },
};

function SourceRow({ source }) {
  const config = SOURCE_TYPE_CONFIG[source.type] ?? SOURCE_TYPE_CONFIG.file;
  const Icon = config.icon;

  const href = source.repositoryUrl || source.url || null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-cardStroke bg-secondaryCardBackground hover:border-hAccent20 transition-colors">
      <div className={cn("shrink-0", config.color)}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-title truncate">{source.name}</p>
        {href && (
          <p className="text-xs text-subtitle truncate mt-0.5">{href}</p>
        )}
        {source.files?.length > 0 && (
          <p className="text-xs text-subtitle mt-0.5">
            {source.files.length} arquivo(s)
          </p>
        )}
      </div>
      <span className={cn("text-2xs px-2 py-0.5 rounded-full border border-cardStroke", config.color)}>
        {config.label}
      </span>
    </div>
  );
}

export function ActivitySourcesTab({ sources = [] }) {
  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-icons">
        <FileUp size={40} className="mb-3 opacity-50" />
        <p className="text-sm">Ainda não há entradas anexadas a esta jornada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-4">
        {Object.entries(SOURCE_TYPE_CONFIG).map(([type, config]) => {
          const count = sources.filter((s) => s.type === type).length;
          if (count === 0) return null;
          const Icon = config.icon;
          return (
            <div key={type} className="flex items-center gap-1.5 text-xs text-subtitle">
              <Icon size={14} className={config.color} />
              <span>
                {count} {config.label}{count > 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>

      {sources.map((source) => (
        <SourceRow key={source.id} source={source} />
      ))}
    </div>
  );
}
