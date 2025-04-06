import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import uploadService from '../../services/upload'
import userService from '../../services/user'

const UploadRecordsViewCourseYears = () => {
  const user = useSelector((state) => state.user)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedCourseYearId, setSelectedCourseYearId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false) // For showing the upload loading state
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)



  // Fetch courses on mount
  useEffect(() => {
    if (user.id && user.token) {
      // Assuming you already have a function that fetches courses for the user
      userService
        .getAllUserCourses(user.id, user.token)
        .then((response) => {
          setCourses(response.user.courses)
        })
        .catch((error) => {
          console.error('Error fetching courses: ', error)
        })
    }
  }, [user.id, user.token])

  // Handle course selection change
  const handleCourseChange = (e) => {
    const selected = courses.find(course => course.course_id === Number(e.target.value))
    setSelectedCourse(selected)
    setSelectedYear(null) // Reset year when course changes
    setSelectedCourseYearId(null) // Reset courseYearId when course changes
  }

  // Handle year selection change
  const handleYearChange = (e) => {
    const selectedYearData = selectedCourse.course_years.find(year => year.id === Number(e.target.value))
    if (selectedYearData) {
      setSelectedYear(selectedYearData)
      setSelectedCourseYearId(selectedYearData.id)
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  // Handle form submission (actual file upload logic)
  const handleUpload = async () => {
    if (!selectedFile || !selectedCourseYearId) {
      alert('Please make all selections and choose a file.')
      return
    }

    try {
      setUploading(true)
      setProcessing(false)

      const response = await uploadService.uploadResults(
        selectedCourseYearId,
        selectedFile,
        user.token
      )

      setUploading(false)
      setProcessing(true)

      // Simulate a short processing delay (or wait for real backend response)
      setTimeout(() => {
        setProcessing(false)
        alert('File uploaded and processed successfully!')
      }, 2000)

    } catch (error) {
      console.error('Error uploading file:', error)
      setUploading(false)
      setProcessing(false)
      alert('Failed to upload file. Please try again.')
    }
  }



  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
        Upload Results
      </h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">
        Select Course and Course Year Below
      </h2>

      {/* Course & Year Selection Box */}
      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mb-5">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Course Selection */}
          <div className="flex-1">
            <label className="block text-slate-900 dark:text-white mb-2">Select Course:</label>
            <select
              className="p-2 border rounded w-full text-slate-900"
              onChange={handleCourseChange}
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title} ({course.code} {course.part_time ? 'PT' : 'FY'})
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          {selectedCourse && (
            <div className="flex-1">
              <label className="block text-slate-900 dark:text-white mb-2">Select Course Year:</label>
              <select
                className="p-2 border rounded w-full text-slate-900"
                onChange={handleYearChange}
              >
                <option value="">-- Select a Year --</option>
                {selectedCourse.course_years.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.year_start}/{year.year_end}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CSV Upload Section */}
      {selectedCourseYearId && (
        <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl mt-5">
          <h3 className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-4">
            Upload CSV File
          </h3>
          <div className="flex flex-col items-center">
            {/* Styled File Input */}
            <div className="border border-slate-400 dark:border-slate-600 rounded-lg p-3 bg-gray-100 dark:bg-gray-800 w-64 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full cursor-pointer text-center"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className={`mt-4 px-6 py-2 rounded-lg transition ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {selectedFile && (
            <p className="mt-2 text-center text-sm text-slate-700 dark:text-slate-300">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      )}

      {(processing || uploading) &&  (
        <div className="mt-4 text-center">
          <p className="text-blue-600 dark:text-blue-300 text-lg font-medium">
      Processing data...
          </p>
          <div className="mt-2 w-10 h-10 mx-auto border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

    </div>
  )
}

export default UploadRecordsViewCourseYears
