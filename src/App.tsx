import React from 'react';
import Chatting from './pages/Chatting';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Chatting />
    </div>
    <Router>
        <Routes>
          
          <Route path="/" element={<Home />}/>
          <Route path="/loginpage" element={<LoginPage />}/>

        </Routes>
    </Router>
  );
}

export default App;
