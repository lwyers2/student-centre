import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Tools from './components/Tools';
import UploadRecords from './pages/UploadRecords'
import ViewRecords from './pages/ViewRecords'
import Meetings from './pages/Meetings'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
    <div className="min-h-screen bg-slate-50 dark:bg-black dark:text-white flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto flex-grow w-full">
      <Routes>
            <Route path="/" element={
              <>              
              <Hero />
              <hr className="mx-auto bg-black dark:bg-white w-1/2" />   
              <Tools />
              </>
              } 
              />
            <Route path="/upload-records" element={<UploadRecords />} />
            <Route path="/view-records" element={<ViewRecords />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
          </Routes>
          
      </main>
    </div>
  </Router>
  );
}

export default App;
