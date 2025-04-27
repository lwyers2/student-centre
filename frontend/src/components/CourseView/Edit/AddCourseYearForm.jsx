import React from 'react'

const AddCourseYearForm = ({
  showAddYear,
  setShowAddYear,
  newYear,
  handleNewYearChange,
  handleNewYearSubmit,
  users
}) => {
  return (
    <div className="mb-8">
      {/* Toggle Add Year Button */}
      <button
        onClick={() => setShowAddYear(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showAddYear ? 'Hide Add Year' : 'Add New Course Year'}
      </button>

      {/* Add New Course Year Form */}
      {showAddYear && (
        <form onSubmit={handleNewYearSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Add Course Year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 dark:text-black">
            <input
              name="year_start"
              type="number"
              value={newYear.year_start}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
              placeholder="Year Start"
            />
            <input
              name="year_end"
              type="number"
              value={newYear.year_end}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
              placeholder="Year End"
            />
            <select
              name="course_coordinator"
              value={newYear.course_coordinator}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
            >
              <option value="">Select Coordinator</option>
              {users?.filter(u => u.role === 'Teacher').map(user => (
                <option key={user.id} value={`${user.prefix}. ${user.forename} ${user.surname}`}>
                  {user.prefix}. {user.forename} {user.surname}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Add Year
          </button>
        </form>
      )}
    </div>
  )
}

export default AddCourseYearForm
