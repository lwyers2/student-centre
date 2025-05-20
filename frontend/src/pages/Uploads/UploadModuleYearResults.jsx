import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import moduleService from '../../services/module'
import { useParams } from 'react-router-dom'

const UploadModuleYearResults = () => {
  const user = useSelector((state) => state.user)
  const [module, setModule] = useState({})
  const [moduleYearId, setModuleYearId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const params = useParams()

  useEffect(() => {
    if (user.id && user.token) {
      moduleService
        .getModuleFromModuleYear(params.moduleYearId, user.token)
        .then((response) => {
          setModule(response.module[0] || {})
          setModuleYearId(response.module[0]?.module_year_id || null)
        })
        .catch((error) => {
          console.error('Error fetching module: ', error)
        })
    }
  }, [params.moduleYearId, user.id, user.token])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a CSV file to upload.')
      return
    }
  }

  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Upload Results
      </h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">
        {module.title} ({module.code}) {module.year_start} {module.semester}
      </h2>

      {moduleYearId && (
        <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mt-5">
          <h3 className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-4">
            Upload CSV File
          </h3>

          {module.students && module.students.length === 0 && (
            <p className="text-red-600 text-center mb-4">
              Warning: There are no students enrolled in this class. Please upload students first.
            </p>
          )}

          <div className="flex flex-col items-center">
            <div className="border border-slate-400 dark:border-slate-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-800 w-64 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full cursor-pointer text-center"
              />
            </div>

            <button
              onClick={handleUpload}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </div>

          {selectedFile && (
            <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-300">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadModuleYearResults
