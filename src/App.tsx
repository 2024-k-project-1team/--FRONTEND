import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import Chatting from "./pages/Chatting/Chatting";
import OAuthCallback from "./auth/OAuthCallback";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem("accessToken") !== null
  );

  const handleLogin = (user: { name: string }) => {
    console.log("User logged in: ", user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    // 페이지가 로드될 때, 세션 스토리지에서 인증 상태를 가져옴
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/loginpage"
          element={
            isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/chatting"
          element={isAuthenticated ? <Chatting /> : <Navigate to="/" replace />}
        />
        <Route
          path="/google"
          element={<OAuthCallback onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
