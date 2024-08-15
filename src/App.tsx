import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import Home from "./pages/Home/Home";
import Chatting from "./pages/Chatting/Chatting";
import OAuthCallback from "./auth/OAuthCallback";
import ExChat from "./pages/Chatting/ExChat";

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
          path="/google"
          element={<OAuthCallback onLogin={handleLogin} />}
        />
        <Route path="/exchat" element={<ExChat />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
