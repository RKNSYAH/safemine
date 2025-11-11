import { Shield } from "lucide-react";
import { useAuth } from "../App";
import { useState } from "react";

export const SupervisorLogin = () => {
  const { login } = useAuth();

  const [supervisorID, setSupervisorID] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ id: supervisorID, name: "Supervisor" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">SafeMine</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Supervisor Access
          </h2>
          <p className="text-slate-300 text-center mb-8">
            Multi-Site Safety Monitoring
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-slate-200 text-sm font-semibold mb-2">
                Supervisor ID
              </label>
              <input
                type="text"
                placeholder="Enter your supervisor ID"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                value={supervisorID}
                onChange={(e) => setSupervisorID(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-200 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <p className="text-slate-500 text-xs text-center mt-2">
              Monitor all sites in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
