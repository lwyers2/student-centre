import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import axios from 'axios'

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/api/users');
    dispatch({ type: 'SET_USERS', payload: response.data });
  } catch (error) {
    console.error(error);
  }
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
