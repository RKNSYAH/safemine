import React, { useState, useEffect } from "react";
import { Shield, Camera, LogOut, X, RotateCw } from "lucide-react";
import AlertList from "../components/AlertList";
import POVCard from "../components/POVCard";

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedPOV, setSelectedPOV] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSelectPOV = (pov) => {
    setSelectedPOV(pov);
  };

  useEffect(() => {
      async function getWorkers() {
        try {
          const response = await fetch("https://safemine-backend.netlify.app/api/worker/101"); 
          const responseData = await response.json(); 
          const allDetections = responseData.data.flatMap(worker => worker.detections.map(detection => ({
                ...detection,
                workerName: worker.fullName,
              })));
          setAlerts(allDetections);
          setWorkers(responseData.data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch workers:", error);
        }
      }

      getWorkers();

      const intervalId = setInterval(getWorkers, 5000);

      return () => clearInterval(intervalId);

    }, []);

  const povs = workers.map((worker, idx) => ({
    id: worker._id,
    workerID: worker.workerID,
    workerName: worker.fullName,
    isLoggedIn: worker.isLoggedIn,
  }));


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                SafeMine Supervisor
              </h1>
              <p className="text-slate-400 text-xs">
                Real-time Multi-Site Monitoring
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-4 py-2 rounded-lg transition-colors text-sm">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2">Total Engineers</p>
            <p className="text-3xl font-bold text-white">{povs.length}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>Online
            </p>
            <p className="text-3xl font-bold text-green-400">
              {povs.filter((p) => p.status === "live").length}
            </p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-xs mb-2">Total Alerts</p>
            <p className="text-3xl font-bold text-orange-400">
              {alerts.length}
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <AlertList
            alerts={alerts}
            title={`All Site Alerts (${alerts.length})`}
          />
        </div>
      </div>

      {/* POV Detail Modal */}
      {selectedPOV && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedPOV.engineerName}
                </h3>
                <p className="text-slate-400 text-sm">{selectedPOV.site}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedPOV.isLoggedIn
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      selectedPOV.isLoggedIn
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedPOV.isLoggedIn ? "Live" : "Offline"}
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
              {/* POV-Specific Alerts */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300">
                  Recent Alerts from this Engineer
                </h4>
                <AlertList
                  alerts={alerts.filter((a) => a.worker === selectedPOV.id)}
                  title={`${selectedPOV.workerName}'s Alerts`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
