import React from 'react'
import login from '../img/log-in.png'
import userAccount from '../img/user-account-profile.png'
import students from '../img/students.png'
import meetings from '../img/meetings.png'
import courses from '../img/courses.png'
import uploadResults from '../img/upload-results.png'
import uploadStudents from '../img/upload-students.png'
import Tool from './Tool'

const Tools = ({ user }) => {
  return (
    <div className="p-6 my-12 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Tools</h2>
      {user ?
        (
          <>
            <div className="my-12 scroll-mt-20">
              <div className="list-none mx-auto my-12 flex flex-col sm:flex-row items-center gap-8">
                <Tool
                  linkTo="/view-courses"
                  titleLabel="View Courses"
                  desLabel="View All Courses"
                  img={courses} alt="Studen Records"
                />
                <Tool
                  linkTo="/meetings"
                  titleLabel="Meetings"
                  desLabel="View upcoming meetings"
                  img={meetings} alt="upload student results to be seen in app"
                />
                <Tool
                  linkTo="/admin"
                  titleLabel="User Admin"
                  desLabel="Edit user profile"
                  img={userAccount} alt="upload student results to be seen in app"
                />
              </div>
              <div className="list-none mx-auto my-12 flex flex-col sm:flex-row items-center gap-8">
                <Tool
                  linkTo="/students"
                  titleLabel="View Students"
                  desLabel="View all students"
                  img={students} alt="upload student results to be seen in app"
                />
                <Tool
                  linkTo="/upload-students"
                  titleLabel="Upload Students"
                  desLabel="Upload students"
                  img={uploadStudents} alt="upload student results to be seen in app"
                />
                <Tool
                  linkTo="/upload-records"
                  titleLabel="Upload Records"
                  desLabel="Upload student results"
                  img={uploadResults} alt="upload student results to be seen in app"
                />
              </div>
            </div>

          </>
        )
        :
        (
          <>
            <div className="list-none mx-auto my-12 flex flex-col sm:flex-row items-center gap-8">
              <Tool
                linkTo="/login"
                titleLabel="Log In"
                desLabel="Log In to Admin Centre"
                img={login} alt="Log In"
              />
              <Tool
                linkTo="/reset-password"
                titleLabel="Reset Password"
                desLabel="Reset your password if you've forgotten your credntials"
                img={userAccount} alt="user icon for reseting password"
              />
            </div>
          </>
        )
      }

    </div>

  )
}

export default Tools