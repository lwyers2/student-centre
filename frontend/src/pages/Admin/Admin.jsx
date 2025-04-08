import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Admin = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <div className="p-6 my-8">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-10 text-slate-900 dark:text-white">
        Admin Center
      </h2>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        {/* Edit Courses */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/edit-courses')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Manage Courses
          </h3>
        </div>

        {/* Edit Course Years */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/edit-modules')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Manage Modules
          </h3>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        {/* Add Users */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/users-admin')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Manage Users
          </h3>
        </div>

        {/* Assign Users To Module Years */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/assign-module-years-to-users')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Assign Users To Module Years
          </h3>
        </div>
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        {/* Assign Users to Course Years */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/assign-course-years-to-users')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Assign Users to Course Years
          </h3>
        </div>

        {/* Edit Students */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
          onClick={() => navigate('/edit-students')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Edit Students
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Admin
