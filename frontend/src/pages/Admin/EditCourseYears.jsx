// EditCourseYears.jsx
import React, { useState } from 'react'

const EditCourseYears = () => {
  const [courseYears, setCourseYears] = useState(['2021', '2022', '2023'])
  const [newCourseYear, setNewCourseYear] = useState('')

  const handleAddCourseYear = () => {
    if (newCourseYear.trim()) {
      setCourseYears([...courseYears, newCourseYear])
      setNewCourseYear('')
    }
  }

  return (
    <div>
      <h2>Edit Course Years</h2>
      <input
        type="text"
        value={newCourseYear}
        onChange={(e) => setNewCourseYear(e.target.value)}
        placeholder="Add new course year"
      />
      <button onClick={handleAddCourseYear}>Add Course Year</button>

      <ul>
        {courseYears.map((year, index) => (
          <li key={index}>{year}</li>
        ))}
      </ul>
    </div>
  )
}

export default EditCourseYears
