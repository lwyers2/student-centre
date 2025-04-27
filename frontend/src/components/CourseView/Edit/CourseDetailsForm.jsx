import React from 'react'

const CourseDetailsForm = ({ formState, qualifications, handleCourseChange, handleCourseSubmit }) => {
  return (
    <form onSubmit={handleCourseSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
      <h3 className="text-2xl font-semibold mb-4">Course Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-black">
        <input
          name="title"
          value={formState.title}
          onChange={handleCourseChange}
          className="p-2 rounded border"
          placeholder="Title"
        />
        <input
          name="code"
          value={formState.code}
          onChange={handleCourseChange}
          className="p-2 rounded border"
          placeholder="Code"
        />
        <select
          name="qualification"
          value={formState.qualification}
          onChange={handleCourseChange}
          className="p-2 rounded border"
        >
          <option value="">Select Qualification</option>
          {qualifications.map(q => (
            <option key={q.id} value={q.qualification}>
              {q.qualification}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 col-span-full dark:text-white">
          <input
            type="checkbox"
            name="part_time"
            checked={formState.part_time}
            onChange={handleCourseChange}
          />
          Part Time
        </label>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  )
}

export default CourseDetailsForm
