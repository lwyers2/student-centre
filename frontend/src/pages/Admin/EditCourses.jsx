// EditCourses.jsx
import React, { useState, useEffect } from 'react'

const EditCourses = () => {
  const [courses, setCourses] = useState([])
  const [newCourse, setNewCourse] = useState('')

  useEffect(() => {
    // Fetch the courses from the backend or state (if needed)
    // Example: setCourses(fetchedCourses);
  }, [])

  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setCourses([...courses, newCourse])
      setNewCourse('')
    }
  }

  const handleDeleteCourse = (course) => {
    setCourses(courses.filter((item) => item !== course))
  }

  return (
    <div>
      <h2>Edit Courses</h2>

      {/* List of current courses */}
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            {course}
            <button onClick={() => handleDeleteCourse(course)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Input to add new course */}
      <div>
        <input
          type="text"
          value={newCourse}
          onChange={(e) => setNewCourse(e.target.value)}
          placeholder="Enter new course"
        />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>
    </div>
  )
}

export default EditCourses
