import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const UploadRecords = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Upload Records
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Results for Course Year */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => navigate('/upload-records/course-year')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Upload Results for Course Year
          </h3>
        </div>

        {/* Upload Results for Module Year */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => navigate('/upload-records/module-year')}
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Upload Results for Module Year
          </h3>
        </div>

        {/* Upload Students */}
        <div
          className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Upload Students
          </h3>
        </div>
      </div>
    </div>
  )
}

export default UploadRecords
