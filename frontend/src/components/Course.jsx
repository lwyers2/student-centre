import React, { useState } from 'react'

const Course = ({ course }) => {
  const [showTable, setShowTable] = useState(false)
  const modules = course.modules

  const toggle = () => setShowTable(!showTable)

  console.log(modules)
  return (
    <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-4xl font-bold text-left sm:text-2xl text-slate-900 dark:text-white underline">
          {course.title} {course.code} {course.years} years
        </h3>
        <button
          onClick={toggle}
          className="bg-slate-500 text-white font-semibold px-4 py-2 rounded hover:bg-slate-400"
        >
          {showTable ? 'Hide' : 'Show'}
        </button>
      </div>
      {showTable && (
        <table className="table-fixed w-full text-center text-2xl">
          <thead>
            <tr>
              <th>Title</th>
              <th>QSIS Year</th>
              <th>Code</th>
              <th>Cats</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id}>
                <td>{module.title}</td>
                <td>{module.QSIS_year}</td>
                <td>{module.code}</td>
                <td>{module.CATs}</td>
                <td>{module.semester}</td>
                <td>View</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Course