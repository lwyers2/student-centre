import React from 'react'

const CourseFilters = ({
  search,
  setSearch,
  qualification,
  setQualification,
  school,
  setSchool,
  fullTime,
  setFullTime,
  uniqueQualifications,
  uniqueSchools,
  uniqueFullTimeStatus,
  showFilters,
  toggleFilters,
}) => {
  return (
    <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-md mb-10 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-0">Search & Filters</h3>
        <button
          onClick={toggleFilters}
          className="bg-slate-600 hover:bg-slate-500 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
        >
          {showFilters ? 'Hide Filters' : 'View Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="animate-fade-in">
          <div className="mb-4">
            <label htmlFor="search" className="sr-only">Search Courses</label>
            <input
              id="search"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-slate-900"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="qualification" className="block text-slate-900 dark:text-white mb-1">Qualification</label>
              <select
                id="qualification"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
              >
                <option value="">All</option>
                {uniqueQualifications.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="school" className="block text-slate-900 dark:text-white mb-1">School</label>
              <select
                id="school"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option value="">All</option>
                {uniqueSchools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fullTime" className="block text-slate-900 dark:text-white mb-1">Full-Time/Part-Time</label>
              <select
                id="fullTime"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900"
                value={fullTime}
                onChange={(e) => setFullTime(e.target.value)}
              >
                <option value="">Both</option>
                {uniqueFullTimeStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseFilters
