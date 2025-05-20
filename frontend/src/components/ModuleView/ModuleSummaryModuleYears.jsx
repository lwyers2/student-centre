import React from 'react'
import { Link } from 'react-router-dom'

const ModuleSummaryModuleYears = ({ moduleYear }) => {

  // Check if students exist
  if (moduleYear.students && Array.isArray(moduleYear.students) && moduleYear.students.length > 0) {
    // average result
    const totalResult = moduleYear.students.reduce((acc, student) => acc + student.result, 0)
    const averageResult = Math.ceil(totalResult / moduleYear.students.length)

    const flaggedCount = moduleYear.students.filter(student => student.flagged === 1).length

    const totalStudents = moduleYear.students.length

    return (
      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white ">
            Academic Year Start: {moduleYear.year_start}
          </h3>
          <p className="text-lg text-slate-900 dark:text-white">
            Semester: {moduleYear.semester}
          </p>
          <p className="text-lg text-slate-900 dark:text-white">
            Module Co-ordinator: {moduleYear.module_coordinator}
          </p>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex-1 p-2 mb-2 sm:mb-0">
            <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              <p><strong>Average Result:</strong> {averageResult.toFixed(0)}%</p>
            </div>
          </div>
          <div className="flex-1 p-2 mb-2 sm:mb-0">
            <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              <p><strong>Flagged Students:</strong> {flaggedCount}</p>
            </div>
          </div>
          <div className="flex-1 p-2 mb-2 sm:mb-0">
            <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              <p><strong>Total Students:</strong> {totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Link
            to={`/module-students-edit/${moduleYear.module_year_id}`}
            className="block border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-105 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Results</h3>
          </Link>
          <Link
            to={`/module-students/${moduleYear.module_year_id}`}
            className="block border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-105 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">View Module Year Students</h3>
          </Link>
          <Link
            to={`/upload-module-year-results/${moduleYear.module_year_id}`}
            className="block border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-105 text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Results for Missing Data</h3>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white ">
          Academic Year Start: {moduleYear.year_start}
        </h3>
        <p className="text-lg text-slate-900 dark:text-white">
          Semester: {moduleYear.semester}
        </p>
        <p className="text-lg text-slate-900 dark:text-white">
          Module Co-ordinator: {moduleYear.module_coordinator}
        </p>
      </div>
      <p>No student data available</p>
      <div className="flex justify-between mt-6">
        <Link
          to={`/upload-students/${moduleYear.module_year_id}`}
          className="block border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-105 text-center"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Students</h3>
        </Link>
        <Link
          to={`/upload-module-year-results/${moduleYear.module_year_id}`}
          className="block border border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition transform hover:scale-105 text-center"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Results for Missing Data</h3>
        </Link>
      </div>
    </div>
  )
}

export default ModuleSummaryModuleYears
