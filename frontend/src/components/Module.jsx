import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const Module = ({ module }) => {
  const [showTable, setShowTable] = useState(false)
  const [students, setStudents] = useState()



  const toggle = () => setShowTable(!showTable)

  return (
    <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-4xl font-bold text-left sm:text-2xl text-slate-900 dark:text-white underline">
          {module.title} {module.code} {module.semester}
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
                <td className="px-4 py-2">{module.title}</td>
                <td className="px-4 py-2">{module.QSIS_year}</td>
                <td className="px-4 py-2">{module.code}</td>
                <td className="px-4 py-2">{module.CATs}</td>
                <td className="px-4 py-2">{module.semester}</td>
                <td>
                  <Link to="/view-module" state={{ module }}>
                    <button className="text-lg bg-slate-500 text-white font-medium px-5 py-1 rounded hover:bg-slate-400">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
