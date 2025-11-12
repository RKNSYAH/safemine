import { Shield } from "lucide-react";
import { useAuth } from "../App";
import { useState } from "react";

export const SupervisorLogin = () => {
  const { login } = useAuth();

  const [supervisorID, setSupervisorID] = useState();
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    try {
      const res = await fetch("https://safemine-backend-production.up.railway.app/supervisor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ supervisorID: Number(supervisorID),password: password }),
      })
      const data = await res.json();
      if (res.ok) {
        login(data);
      }
    } catch (error) {
      
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ id: supervisorID, name: "Supervisor" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-tone backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-secondary" />
            <h1 className="text-2xl font-bold text-primary">SafeMine</h1>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2 text-center">
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-secondary to-secondary hover:from-secondary hover:to-secondary text-primary font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
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
