import React , { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import UploadRecords from './pages/Uploads/UploadRecords'
import ViewCourses from './pages/Course/ViewCourses'
import Meetings from './pages/Meetings'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ModuleYearStudent from './pages/Module/ModuleYearStudent'
import ResetPassword from './pages/ResetPassword'
import Student from './pages/Student/Student'
import CourseModuleYears from './pages/Module/CourseModuleYears'
import StudentModules from './pages/Student/StudentCourseModules.jsx'
import StudentModule from './pages/Student/StudentModule'
import ViewModules from './pages/Module/ViewModules'
import ModuleSummary from './pages/Module/ModuleSummary'
import ViewStudents from './pages/Student/ViewStudents'
import StudentCourseModules from './pages/Student/StudentCourseModules.jsx'
import UploadRecordsViewModuleYears from './pages/Uploads/UploadRecordsViewModuleYears.jsx'
import UploadRecordsViewCourseYears from './pages/Uploads/UploadRecordsViewCourseYear.jsx'
import UploadModuleYearResults from './pages/Uploads/UploadModuleYearResults.jsx'
import ModuleYearStudentEdit from './pages/Module/ModuleYearStudentEdit.jsx'
import ScheduleMeeting from './pages/Meetings/ScheduleMeeting.jsx'
import MeetingDetails from './pages/Meetings/MeetingDetails.jsx'
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
            <Route path="/view-courses" element={<ViewCourses />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/module-students/:id" element={<ModuleYearStudent />} />
            <Route path="/student/:id" element={<Student />}/>
            <Route path="/course-year-modules/:id" element={<CourseModuleYears />} />
            <Route path="student/:id/course/:courseYearId" element={<StudentModules />}/>
            <Route path="student/:id/module-year/:moduleYearId" element={<StudentModule />}/>
            <Route path="/view-modules" element={<ViewModules/>} />
            <Route path="/module-summary/:moduleId" element={<ModuleSummary/>}/>
            <Route path="/view-students" element={<ViewStudents/>}/>
            <Route path="/student/:studentId/course/:courseId" element={<StudentCourseModules/>}/>
            <Route path="/upload-records/course-year" element={<UploadRecordsViewCourseYears/>}/>
            <Route path="/upload-records/module-year" element={<UploadRecordsViewModuleYears/>}/>
            <Route path="/upload-module-year-results/:id" element={<UploadModuleYearResults/>} />
            <Route path='/module-students-edit/:id' element={<ModuleYearStudentEdit/>}/>
            <Route path = '/schedule-meeting/:id/module-year/:moduleYearId' element={<ScheduleMeeting/>}/>
            <Route path ='/meeting-details/:meetingId' element={<MeetingDetails/>}/>
          </Routes>

        </main>
      </div>
    </Router>
  )
}

export default App
