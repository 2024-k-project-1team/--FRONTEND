import React from 'react'
import LoginPage from '../LoginPage/LoginPage'
import MainPage from '../MainPage/MainPage'
import './Home.css';

export default function home() {
  return (
    <div className="home">
        <div className="Main">
          {<MainPage/>}
        </div>
        <div className="Login">
            {<LoginPage/>}    
        </div>
        
        
      
    </div>
  )
}
