import React from 'react'
import { Link } from 'react-router-dom'

const ModuleYearStudentTable = ({ students, onEditResult }) => {
  return (
    <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
      <table className="table-fixed w-full text-sm border-collapse border border-gray-300 dark:border-slate-700">
        <thead>
          <tr>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Student Code</th>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Forename</th>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Surname</th>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Email</th>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Result</th>
            <th className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:opacity-55 dark:hover:bg-slate-700 hover:bg-gray-100">
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">{student.student_code}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">{student.forename}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">{student.surname}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">{student.email}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">{student.result}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">
                <button
                  className="text-sm bg-blue-500 text-white font-medium px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => onEditResult(student)}
                >
                  Edit Result
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ModuleYearStudentTable
