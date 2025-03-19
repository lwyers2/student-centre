import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'

const UploadRecordsViewCourseYears = () => {
  const user = useSelector((state) => state.user)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedCourseYearId, setSelectedCourseYearId] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  // Fetch courses on mount
  useEffect(() => {
    if (user.id && user.token) {
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

  // Handle form submission (Placeholder for future upload logic)
  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a CSV file to upload.')
      return
    }
    console.log(`Uploading ${selectedFile.name} for Course Year ID: ${selectedCourseYearId}`)
    // TODO: Implement actual file upload logic
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

export default UploadRecordsViewCourseYears
