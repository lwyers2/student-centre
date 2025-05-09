// components/Edit/Course/FilteredCourseList.jsx
import React from 'react'
import Course from './Course'

const FilteredCourseList = ({ filteredCourses, search }) => {
  return (
    <div className="space-y-4">
      {filteredCourses.length > 0 ? (
        <Course courses={filteredCourses} search={search} />
      ) : (
        <p className="text-center text-slate-900 dark:text-white">No courses found.</p>
      )}
    </div>
  )
}

export default FilteredCourseList
