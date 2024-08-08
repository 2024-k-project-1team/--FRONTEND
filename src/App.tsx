import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import Home from './pages/Home';

function App() {
  return (
    <Router>
        <Routes>
          
          <Route path="/" element={<Home />}/>
          <Route path="/loginpage" element={<LoginPage />}/>

        </Routes>
    </Router>
  );
}

export default App;
