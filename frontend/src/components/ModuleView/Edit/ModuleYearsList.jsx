import React from 'react'
import moduleService from '../../../services/module'

const ModuleYearsList = ({ moduleYears, setModuleYears, users, user, editingYears, setEditingYears, moduleId }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
      <h3 className="text-2xl font-semibold mb-4">Module Years</h3>
      <ul className="space-y-4">
        {moduleYears.map(year => {
          const isEditing = editingYears[year.module_year_id]
          return (
            <li key={year.module_year_id} className="border rounded p-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <strong>{year.year_start}</strong><br />
                  {!isEditing ? (
                    <div className="mt-2">
                      <div>Module Co-ordinator: {year.coordinator}</div>
                      <div>Semester: {year.semester}</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 dark:text-black">
                      <select
                        className="p-2 border rounded"
                        value={year.coordinator}
                        onChange={(e) => {
                          const updated = moduleYears.map(y =>
                            y.module_year_id === year.module_year_id ? { ...y, coordinator: Number(e.target.value) } : y
                          )
                          setModuleYears(updated)
                        }}
                      >
                        <option value="">Select Co-ordinator</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>


                      <select
                        className="p-2 border rounded"
                        value={year.semester}
                        onChange={(e) => {
                          const updated = moduleYears.map(y =>
                            y.module_year_id === year.module_year_id ? { ...y, semester: e.target.value } : y
                          )
                          setModuleYears(updated)
                        }}
                      >
                        <option value="">Select Semester</option>
                        <option value="Autumn">Autumn</option>
                        <option value="Spring">Spring</option>
                        <option value="Full Year">Full Year</option>
                        <option value="Summer">Summer</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => setEditingYears(prev => ({ ...prev, [year.module_year_id]: !isEditing }))}
                    className="text-blue-600 hover:underline"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={async () => {
                        console.log(year)
                        try {
                          await moduleService.updateModuleYear(user.token, moduleId, year.module_year_id, {
                            coordinator: year.coordinator,
                            semester: year.semester
                          })
                          alert('Updated!')
                          setEditingYears(prev => ({ ...prev, [year.module_year_id]: false }))
                        } catch (err) {
                          alert('Failed to update')
                          console.error(err)
                        }
                      }}
                      className="text-sm bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ModuleYearsList
