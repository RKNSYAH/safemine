import { useState, useContext, createContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router';


import { SupervisorLogin } from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// ============ Audio Utilities ============
const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1000;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

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

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  const login = (userData) => {
    setUser(userData);
    navigate('/dashboard'); 
  };

  const logout = () => {
    setUser(null);
    navigate('/login'); 
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component (e.g., Dashboard)
  // <Outlet> is a placeholder for the nested route's component
  return <Outlet />;
};


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  

    return (
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<SupervisorLogin />} />

          {/* Protected Routes */}
          {/* All routes inside <ProtectedRoute> require login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    );
};

export default App;
