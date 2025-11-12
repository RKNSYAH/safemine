import { useState, useContext, createContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router';
import Cookies from "js-cookie";
import { SupervisorLogin } from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const supervisorData = Cookies.get('supervisorData');
    if (supervisorData) {
      setUser(supervisorData);
      navigate('/dashboard');
    }
  }, [navigate]);

  const login = (userData) => {
    setUser(userData);
    Cookies.set('supervisorData', userData.token, { expires: 7 });
    navigate('/dashboard'); 
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('supervisorData');
    navigate('/login'); 
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};


const App = () => {
  

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
