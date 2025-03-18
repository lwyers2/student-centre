import React from 'react'

const ModuleSummaryModuleYears = ({ moduleYear }) => {
  console.log(moduleYear)

  // Check if students exist and is an array
  if (moduleYear.students && Array.isArray(moduleYear.students) && moduleYear.students.length > 0) {
    // Calculate the average result
    const totalResult = moduleYear.students.reduce((acc, student) => acc + student.result, 0)
    const averageResult = totalResult / moduleYear.students.length

    // Count the number of flagged students
    const flaggedCount = moduleYear.students.filter(student => student.flagged === 1).length

    // Count the total number of students
    const totalStudents = moduleYear.students.length

    return (
      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
        {/* Centering the h3 and module coordinator */}
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

        {/* Displaying the data in one line */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex-1 p-2 mb-2 sm:mb-0">
            <div className="border p-4 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white">
              <p><strong>Average Result:</strong> {averageResult.toFixed(2)}%</p>
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

        {/* Buttons for uploading students and results */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => alert('Edit Results')}>
            Edit Results
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={() => alert('View Module Year Students')}>
            View Module Year Students
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            onClick={() => alert('Upload Results for Missing Data')}>
            Upload Results for Missing Data
          </button>
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
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={() => alert('Upload students to module')}>
            Upload Students
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
          onClick={() => alert('Upload results for missing data')}>
            Upload Results for Missing Data
        </button>
      </div>
    </div>
  )
}

export default ModuleSummaryModuleYears
