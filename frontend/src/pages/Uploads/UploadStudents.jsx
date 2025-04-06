import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import uploadService from '../../services/upload'

const UploadStudents = () => {
  const user = useSelector((state) => state.user)
  const [selectedFile, setSelectedFile] = useState(null)
  const [inProgress, setInProgress] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [structuredErrors, setStructuredErrors] = useState([])
  const [showDetails, setShowDetails] = useState(false)

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
    setSuccessMessage('')
    setErrorMessage('')
    setStructuredErrors([])
    setShowDetails(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please choose a file to upload.')
      return
    }

    try {
      setInProgress(true)
      setProgressMessage('Uploading file...')
      setErrorMessage('')
      setStructuredErrors([])
      setSuccessMessage('')

      await uploadService.uploadStudents(selectedFile, user.token)

      setProgressMessage('Processing data...')

      setTimeout(() => {
        setInProgress(false)
        setProgressMessage('')
        setSuccessMessage('File uploaded and processed successfully!')
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)
      setInProgress(false)
      setProgressMessage('')
      setSuccessMessage('')
      setShowDetails(false)

      if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setErrorMessage(error.response.data.message || 'There were validation issues.')
        setStructuredErrors(error.response.data.errors)
      } else if (typeof error?.message === 'string') {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Failed to upload file. Please try again.')
      }
    }
  }

  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Upload Students
      </h2>

      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mt-5">
        <h3 className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-4">
          Upload CSV File
        </h3>
        <div className="flex flex-col items-center">
          <div className="border border-slate-400 dark:border-slate-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-800 w-64 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full cursor-pointer text-center"
            />
          </div>

          <button
            onClick={handleUpload}
            className={`mt-4 px-6 py-2 rounded-lg transition ${
              inProgress
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={inProgress}
          >
            {inProgress ? 'Please wait...' : 'Upload'}
          </button>
        </div>

        {selectedFile && (
          <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-300">
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>

      {inProgress && (
        <div className="mt-4 text-center">
          <p className="text-blue-600 dark:text-blue-300 text-lg font-medium">
            {progressMessage}
          </p>
          <div className="mt-2 w-10 h-10 mx-auto border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-center text-green-600 dark:text-green-400 font-medium">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 border border-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-lg text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold mb-2">{errorMessage}</p>

          {structuredErrors.length > 0 && (
            <div>
              <button
                className="text-xs text-blue-600 dark:text-blue-400 underline mb-2"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>

              {showDetails && (
                <div className="max-h-64 overflow-y-auto border-t pt-2 mt-2">
                  <ul className="space-y-1 list-disc list-inside">
                    {structuredErrors.map((err, index) => (
                      <li key={index}>
                        Row {err.row}: Missing fields - {err.missingFields.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadStudents
