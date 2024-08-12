import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import Chatting from "./pages/Chatting/Chatting";
import OAuthCallback from "./auth/OAuthCallback";

const App: React.FC = () => {
  const handleLogin = (user: { name: string }) => {
    console.log("User logged in:: ", user);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route
          path="/api/v1/auth/google/callback"
          element={<OAuthCallback onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
