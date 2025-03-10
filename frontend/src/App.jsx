import React , { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import UploadRecords from './pages/UploadRecords'
import Courses from './pages/Courses'
import Meetings from './pages/Meetings'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Module from './pages/Module'
import ResetPassword from './pages/ResetPassword'
import Student from './pages/Student/Student'
import Modules from './pages/Modules'
import StudentModules from './pages/Student/StudentModules'
import StudentModule from './pages/Student/StudentModule'
import ViewModules from './pages/ViewModules'
import ModuleSummary from './pages/ModuleSummary'
import ViewStudents from './pages/Student/ViewStudents'
import { setUser } from './redux/actions'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state  => state.user)

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    if(loggedUser) {
      dispatch(setUser(loggedUser))
    }
  }, [dispatch])


  // useEffect(() => {
  //   const handleLogoutOnClose = () => {
  //     localStorage.removeItem('loggedUser') // Remove user from local storage
  //     dispatch(setUser(null)) // Clear Redux state
  //   }

  //   window.addEventListener('beforeunload', handleLogoutOnClose)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleLogoutOnClose)
  //   }
  // }, [dispatch])

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-black dark:text-white flex flex-col">
        <Header/>
        <main className="mx-auto flex-grow w-full">
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
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/module/:id" element={<Module />} />
            <Route path="/student/:id" element={<Student />}/>
            <Route path="/modules/:id" element={<Modules />} />
            <Route path="student/:id/course/:courseYearId" element={<StudentModules />}/>
            <Route path="student/:id/module/:moduleYearId" element={<StudentModule />}/>
            <Route path="/view-modules" element={<ViewModules/>} />
            <Route path="/module-summary/:moduleId" element={<ModuleSummary/>}/>
            <Route path="/view-students" element={<ViewStudents/>}/>
          </Routes>

        </main>
      </div>
    </Router>
  )
}

export default App
