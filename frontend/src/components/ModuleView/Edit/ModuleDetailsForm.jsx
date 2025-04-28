import React from 'react'

const ModuleDetailsForm = ({ formState, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
      <h3 className="text-2xl font-semibold mb-4">Module Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-black">
        <input
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="p-2 rounded border"
          placeholder="Title"
        />
        <input
          name="code"
          value={formState.code}
          onChange={handleChange}
          className="p-2 rounded border"
          placeholder="Code"
        />
        <input
          name="CATs"
          value={formState.CATs}
          onChange={handleChange}
          className="p-2 rounded border"
          placeholder="CATs"
        />
        <input
          name="year"
          value={formState.year}
          onChange={handleChange}
          className="p-2 rounded border"
          placeholder="Year"
        />
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  )
}

export default ModuleDetailsForm
