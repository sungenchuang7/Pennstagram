import React from 'react';
import './App.css';
import {
  Route,
  Routes,
} from 'react-router-dom';
import LogIn from './pages/LoginPage.jsx';
import SignUp from './pages/SignUpPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HomePage from './pages/HomePage.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:userID" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
