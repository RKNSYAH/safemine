import {
  AlertCircle,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const AlertItem = ({ alert }) => {
  const severityColor = {
    critical: "bg-red-500/10 border-red-500/50 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
  };


  return (
    <div className={`border rounded-lg p-4  ${severityColor["critical"]}`}>
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{alert.warnLabel}</p>
              {alert.workerName && (
                <p className="text-xs opacity-75 mt-1">{alert.workerName}</p>
              )}
            </div>
            <span className="text-xs opacity-75 whitespace-nowrap">
              {new Date(alert.timeStamp).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
            <MapPin className="w-3 h-3" />
            {alert.location.coordinates.map(coord => coord.toFixed(4)).join(", ") || "location data unavailable"}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertList = ({ alerts, title = "Recent Alerts" }) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-orange-400" />
      {title}
    </h3>
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {alerts.length === 0 ? (
        <p className="text-slate-400 text-center py-8">
          No alerts yet. All systems normal!
        </p>
      ) : (
        alerts
          .slice()
          .reverse()
          .slice(0, 10)
          .map((alert) => <AlertItem key={alert.id} alert={alert} />)
      )}
    </div>
  </div>
);

export default AlertList;