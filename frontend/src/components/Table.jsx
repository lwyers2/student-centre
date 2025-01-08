import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Table = ({ labels, content }) => {
  const [showTable, setShowTable] = useState(true)

  const toggle = () => setShowTable(!showTable)

  return (
    <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-left sm:text-2xl text-slate-900 dark:text-white underline">
          {labels.title}
        </h3>
        <button
          onClick={toggle}
          className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400"
        >
          {showTable ? 'Hide' : 'Show'}
        </button>
      </div>
      {showTable && (
        <table className="table-fixed w-full text-sm border-collapse border border-gray-300 dark:border-slate-700">
          <thead>
            <tr>
              {content.headers.map((header, index) => (
                <th key={header} className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.data.map((row) => (
              <tr key={row.id} className="hover:opacity-55 dark:hover:bg-slate-700 hover:bg-gray-100">
                {content.headers.map((headerKey, index) => (
                  <td key={index} className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">
                    {row[headerKey.toLowerCase()]} {/* Ensure headers map to data keys */}
                  </td>
                ))}
                <td className="px-2 py-1 border border-gray-300 dark:border-slate-700 text-center">
                  <Link to={`${content.view}/${row.id}`} state={row}>
                    <button className="text-sm bg-slate-500 text-white font-medium px-2 py-1 rounded hover:bg-slate-400">
                      View
                    </button>
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

export default Table