import React , { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './components/Header'
import Hero from './components/Hero'
import Tools from './components/Tools'
import UploadRecords from './pages/Uploads/UploadRecords'
import ViewCourses from './pages/Course/ViewCourses'
import Meetings from './pages/Meetings'
import Admin from './pages/Admin/Admin.jsx'
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
import ViewAllMeetings from './pages/Meetings/ViewAllMeetings.jsx'
import UploadStudents from './pages/Uploads/UploadStudents.jsx'
import AssignModuleYearsToUser from './pages/Admin/AssignModuleYearsToUser.jsx'
import AssignCourseYearsToUser from './pages/Admin/AssignCourseYearsToUser.jsx'
import EditCourseYears from './pages/Admin/EditCourseYears.jsx'
import EditModules from './pages/Admin/EditModules.jsx'
import EditModuleYears from './pages/Admin/EditModuleYears.jsx'
import EditCourses from './pages/Admin/EditCourses.jsx'
import UsersAdmin from './pages/Admin/UsersAdmin.jsx'
import EditStudents from './pages/Admin/EditStudents.jsx'
import EditCourse from './pages/Course/EditCourse.jsx'
import EditModule from './pages/Module/EditModule.jsx'
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
            <Route path ='/schedule-meeting/:id/module-year/:moduleYearId' element={<ScheduleMeeting/>}/>
            <Route path ='/meeting-details/:meetingId' element={<MeetingDetails/>}/>
            <Route path ='/view-meetings' element={<ViewAllMeetings/>}/>
            <Route path='/upload-students' element={<UploadStudents/>}/>
            <Route path="/edit-course-years" element={<EditCourseYears />} />
            <Route path="/edit-modules" element={<EditModules />} />
            <Route path="/edit-module-years" element={<EditModuleYears />} />
            <Route path='/assign-module-years-to-users' element={<AssignModuleYearsToUser/>}/>
            <Route path='/assign-course-years-to-users' element={<AssignCourseYearsToUser/>}/>
            <Route path='/edit-courses' element={<EditCourses/>}/>
            <Route path='/users-admin' element={<UsersAdmin/>}/>
            <Route path='/edit-students' element={<EditStudents/>}/>
            <Route path='/edit-course/:courseId' element={<EditCourse/>}/>
            <Route path='/edit-module/:moduleId' element={<EditModule/>}/>
          </Routes>

        </main>
      </div>
    </Router>
  )
}

export default App
