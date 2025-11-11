import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Shield,
  Camera,
  LogOut,
  MapPin,
  MessageSquare,
  X,
  RotateCw,
} from "lucide-react";

// ============ Types ============
const Alert = (data) => ({
  id: data.id,
  type: data.type,
  location: data.location,
  timestamp: data.timestamp,
  severity: data.severity,
  engineerId: data.engineerId,
});

const POV = (data) => ({
  id: data.id,
  engineerName: data.engineerName,
  site: data.site,
  status: data.status,
  lastUpdate: data.lastUpdate,
  lastAlertType: data.lastAlertType,
});

// ============ Audio Utilities ============
const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (err) {
    console.warn("Audio context failed:", err);
  }
};

// ============ Mock Data Generator ============
const hazardTypes = [
  { type: "Fall Detected", severity: "critical" },
  { type: "Unsafe Posture", severity: "critical" },
  { type: "High Temperature Zone", severity: "warning" },
  { type: "Missing Tool", severity: "info" },
  { type: "Unprotected Area", severity: "warning" },
];

const locations = [
  "Site A - North Building",
  "Site B - South Entrance",
  "Site C - Equipment Area",
  "Site D - Scaffolding Zone",
  "Site E - Electrical Room",
];

const engineers = [
  { name: "Engineer A", site: "Site 1" },
  { name: "Engineer B", site: "Site 2" },
  { name: "Engineer C", site: "Site 3" },
  { name: "Engineer D", site: "Site 4" },
];

const generateAlert = () => {
  const hazard = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
  const randomEngineer = engineers[Math.floor(Math.random() * engineers.length)];
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: hazard.type,
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(),
    severity: hazard.severity,
    engineerId: randomEngineer.name,
  };
};

// ============ Components ============

const SupervisorLogin = ({ onLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">SafeMine</h1>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Supervisor Access</h2>
        <p className="text-slate-300 text-center mb-8">Multi-Site Safety Monitoring</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-slate-200 text-sm font-semibold mb-2">Supervisor ID</label>
            <input
              type="text"
              placeholder="Enter your supervisor ID"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-200 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-xs text-center">Demo Mode: Live alert simulation enabled</p>
          <p className="text-slate-500 text-xs text-center mt-2">Monitor all sites in real-time</p>
        </div>
      </div>
    </div>
  </div>
);

const CameraPlaceholder = ({ label = "Live Camera Feed" }) => (
  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-slate-700">
    <Camera className="w-16 h-16 text-slate-600" />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-slate-400 font-medium">{label}</p>
      <p className="text-slate-500 text-sm mt-2">Camera feed placeholder</p>
    </div>
  </div>
);

const AlertItem = ({ alert }) => {
  const severityColor = {
    critical: "bg-red-500/10 border-red-500/50 text-red-400",
    warning: "bg-yellow-500/10 border-yellow-500/50 text-yellow-400",
    info: "bg-blue-500/10 border-blue-500/50 text-blue-400",
  };

  const IconComponent = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: MessageSquare,
  }[alert.severity];

  return (
    <div className={`border rounded-lg p-4 ${severityColor[alert.severity]}`}>
      <div className="flex gap-3">
        <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{alert.type}</p>
              {alert.engineerId && <p className="text-xs opacity-75 mt-1">{alert.engineerId}</p>}
            </div>
            <span className="text-xs opacity-75 whitespace-nowrap">{alert.timestamp.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
            <MapPin className="w-3 h-3" />
            {alert.location}
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
        <p className="text-slate-400 text-center py-8">No alerts yet. All systems normal!</p>
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

// POV Card Component
const POVCard = ({ pov, onClick }) => (
  <div
    onClick={onClick}
    className="relative rounded-lg overflow-hidden cursor-pointer group bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
  >
    {/* Status Badge */}
    <div className="absolute top-3 left-3 z-10">
      <div className="flex flex-col gap-1">
        <p className="text-white font-semibold text-sm">{pov.engineerName}</p>
        <p className="text-slate-300 text-xs">{pov.site}</p>
        <div className="flex items-center gap-1 mt-1">
          <div className={`w-2 h-2 rounded-full ${pov.status === "live" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className={`text-xs font-semibold ${pov.status === "live" ? "text-green-400" : "text-red-400"}`}>
            {pov.status === "live" ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </div>

    {/* Last Alert Badge */}
    {pov.lastAlertType && (
      <div className="absolute bottom-3 left-3 z-10">
        <div className="bg-red-500/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
          {pov.lastAlertType}
        </div>
      </div>
    )}

    {/* Timestamp */}
    <div className="absolute bottom-3 right-3 z-10">
      <p className="text-slate-300 text-xs">Updated {Math.floor((Date.now() - pov.lastUpdate.getTime()) / 1000)}s ago</p>
    </div>

    {/* Camera Feed Placeholder */}
    <div className="aspect-video bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center group-hover:from-slate-500 group-hover:to-slate-800 transition-all">
      <Camera className="w-10 h-10 text-slate-400 group-hover:text-slate-300" />
    </div>
  </div>
);

// Supervisor Dashboard
const SupervisorDashboard = ({
  alerts,
  onLogout,
  pov,
  onSelectPOV,
}) => {
  const povs = engineers.map((engineer, idx) => ({
    id: `pov-${idx}`,
    engineerName: engineer.name,
    site: engineer.site,
    status: Math.random() > 0.2 ? "live" : "offline",
    lastUpdate: new Date(Date.now() - Math.random() * 120000),
    lastAlertType: Math.random() > 0.5 ? "Fall Detected" : undefined,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">SafeMine Supervisor</h1>
              <p className="text-slate-400 text-xs">Real-time Multi-Site Monitoring</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-20">
        {/* POV Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              Live Cameras ({povs.length})
            </h2>
            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <RotateCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {povs.map((p) => (
              <POVCard key={p.id} pov={p} onClick={() => onSelectPOV(p)} />
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2">Total Engineers</p>
            <p className="text-3xl font-bold text-white">{povs.length}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>Online
            </p>
            <p className="text-3xl font-bold text-green-400">{povs.filter((p) => p.status === "live").length}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2">Critical Alerts</p>
            <p className="text-3xl font-bold text-red-400">{alerts.filter((a) => a.severity === "critical").length}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2">Total Alerts</p>
            <p className="text-3xl font-bold text-orange-400">{alerts.length}</p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <AlertList alerts={alerts} title={`All Site Alerts (${alerts.length})`} />
        </div>
      </div>

      {/* POV Detail Modal */}
      {pov && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{pov.engineerName}</h3>
                <p className="text-slate-400 text-sm">{pov.site}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${pov.status === "live" ? "bg-green-400" : "bg-red-400"}`} />
                  <span className={`text-sm font-semibold ${pov.status === "live" ? "text-green-400" : "text-red-400"}`}>
                    {pov.status === "live" ? "Live" : "Offline"}
                  </span>
                </div>
                <button
                  onClick={() => onSelectPOV(null)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Large Camera Feed */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-300">Live Feed</h4>
                <CameraPlaceholder label={`${pov.engineerName} - ${pov.site}`} />
              </div>

              {/* POV-Specific Alerts */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300">Recent Alerts from this Engineer</h4>
                <AlertList
                  alerts={alerts.filter((a) => a.engineerId === pov.engineerName)}
                  title={`${pov.engineerName}'s Alerts`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Main App ============
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [selectedPOV, setSelectedPOV] = useState(null);
  const alertTimerRef = useRef(null);

  // Alert simulation effect
  useEffect(() => {
    const generateRandomAlert = () => {
      const newAlert = generateAlert();

      // Play sound for critical alerts
      if (newAlert.severity === "critical") {
        playAlertSound();
      }

      setAlerts((prev) => [newAlert, ...prev].slice(0, 100));
    };

    const scheduleNextAlert = () => {
      const delay = Math.random() * 5000 + 5000;
      alertTimerRef.current = setTimeout(() => {
        generateRandomAlert();
        scheduleNextAlert();
      }, delay);
    };

    if (isLoggedIn) {
      scheduleNextAlert();
    }

    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
      }
    };
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setAlerts([]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAlerts([]);
    setSelectedPOV(null);
  };

  if (!isLoggedIn) {
    return <SupervisorLogin onLogin={handleLogin} />;
  }

  return (
    <SupervisorDashboard 
      alerts={alerts} 
      onLogout={handleLogout} 
      pov={selectedPOV}
      onSelectPOV={setSelectedPOV}
    />
  );
};

export default App;

