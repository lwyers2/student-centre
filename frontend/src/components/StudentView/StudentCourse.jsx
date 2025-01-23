import React, { useState } from 'react'
import Table from '../Table'

const StudentCourse = ({ courses }) => {

  return (
    <>
      <h2>Courses</h2>
      {courses.map(course => (
        <>
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className=" items-center justify-between mb-4">
              <p>{course.title} ({course.qualification}) {course.code} ({course.year_start}/{course.year_end})</p>
              <p>Modules with Letter sent</p>
                <p>Failing Modules</p>
                <p>All Modules</p>
                <p>Meetings</p>
            </div>
          </div>
        </>
      ))}
    </>
  )
}

export default StudentCourse