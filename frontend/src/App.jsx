import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import UploadRecords from './pages/UploadRecords'
import Courses from './pages/Courses'
import Meetings from './pages/Meetings'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    if(loggedUser) {
      setUser(loggedUser)
    }
  }, [])

  const handleLogin = (user) => {
    setUser(user)
    localStorage.setItem('loggedUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedUser')
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-black dark:text-white flex flex-col">
        <Header user={user} onLogout={handleLogout}/>
        <main className="max-w-4xl mx-auto flex-grow w-full">
          <Routes>
            <Route path="/" element=
              {
                <>
                  <Hero user={user}/>
                  <hr className="mx-auto bg-black dark:bg-white w-1/2" />
                  <Tools user={user}/>
                </>
              }
            />
            <Route path="/upload-records" element={<UploadRecords />} />
            <Route path="/view-courses" element={<Courses />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login onLogin={handleLogin}/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
          </Routes>

        </main>
      </div>
    </Router>
  )
}

export default App
