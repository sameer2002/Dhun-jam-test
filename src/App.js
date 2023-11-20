import React from 'react';
import './style.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
       </Routes>
    </Router>
  );
};

export default App;
