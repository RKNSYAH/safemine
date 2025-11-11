import { useState, useEffect, useRef } from "react";
import {
  Camera,
} from "lucide-react";

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
          <div
            className={`w-2 h-2 rounded-full ${
              pov.isLoggedIn
                ? "bg-green-400 animate-pulse"
                : "bg-red-400"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              pov.isLoggedIn ? "text-green-400" : "text-red-400"
            }`}
          >
            {pov.isLoggedIn ? "Live" : "Offline"}
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
      <p className="text-slate-300 text-xs">Worker ID: {pov.workerID}</p>
    </div>

    {/* Camera Feed Placeholder */}
    <div className="aspect-video bg-gradient-to-br from-slate-600 to-slate-900 flex items-center justify-center group-hover:from-slate-500 group-hover:to-slate-800 transition-all">
      <Camera className="w-10 h-10 text-slate-400 group-hover:text-slate-300" />
    </div>
  </div>
);

export default POVCard;