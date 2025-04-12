import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moduleService from '../../services/module'
import userService from '../../services/user'

const EditModule = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const params = useParams()

  const [module, setModule] = useState(null)
  const [formState, setFormState] = useState({ title: '', code: '', credits: '', compulsory: false })
  const [moduleYears, setModuleYears] = useState([])
  const [users, setUsers] = useState([])
  const [editingYears, setEditingYears] = useState({})
  const [showAddYear, setShowAddYear] = useState(false)
  const [showModuleDetails, setShowModuleDetails] = useState(true)
  const [showModuleYears, setShowModuleYears] = useState(true)

  const [newYear, setNewYear] = useState({
    year_start: '',
    coordinator: '',
    semester: ''
  })

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) {
      moduleService.getModule(params.moduleId, user.token)
        .then(response => {
          setModule(response.module)
          setModuleYears(response.module_years)
          setFormState({
            title: response.module.title,
            code: response.module.code,
            CATs: response.module.CATs || '',
            year: response.module.year || ''
          })
        })
        .catch(err => {
          console.error(err)
          alert('Failed to load module')
        })
    }
  }, [user?.token, params.moduleId])

  useEffect(() => {
    if (user?.id) {
      userService.getUsersFromModule(user.token, params.moduleId)
        .then(response => {
          setUsers(response.teaching_staff)
        })
        .catch(err => {
          console.error(err)
          alert('Failed to load users')
        })
    }
  }, [user?.token, params.moduleId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updated = await moduleService.updateModule(user.token, params.moduleId, formState)
      setModule(updated)
      alert('Module updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Error updating module')
    }
  }

  const handleNewYearChange = (e) => {
    const { name, value } = e.target
    setNewYear(prev => ({ ...prev, [name]: value }))
  }

  const handleNewYearSubmit = async (e) => {
    e.preventDefault()
    if (!newYear.year_start || !newYear.coordinator || !newYear.semester) {
      alert('Please fill in all required fields')
      return
    }

    const existingStarts = moduleYears.map(y => Number(y.year_start)).sort()
    const newStart = Number(newYear.year_start)

    if (existingStarts.includes(newStart)) {
      alert(`Year ${newStart} already exists for this module.`)
      return
    }
    if (
      existingStarts.length &&
      newStart !== existingStarts[0] - 1 &&
      newStart !== existingStarts[existingStarts.length - 1] + 1
    ) {
      alert(`You can only add a year before ${existingStarts[0]} or after ${existingStarts[existingStarts.length - 1]}.`)
      return
    }

    try {
      const created = await moduleService.addModuleYear(user.token, params.moduleId, newYear)
      setModuleYears(prev => [...prev, created])
      setNewYear({ year_start: '', coordinator: '', semester: '' })
      alert('Module year added!')
    } catch (err) {
      console.error(err)
      alert('Failed to add module year')
    }
  }

  if (!user?.id) return <div>Loading user...</div>
  if (!module) return <div>Loading module...</div>

  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        Edit Module
      </h2>
      <h2 className="text-3xl font-semibold text-center mb-8 text-slate-800 dark:text-white">
        {module.title} ({module.code})
      </h2>

      <button
        onClick={() => setShowModuleDetails(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showModuleDetails ? 'Hide' : 'Show'} Module Details
      </button>

      {showModuleDetails && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
          <h3 className="text-2xl font-semibold mb-4">Module Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-black">
            <input name="title" value={formState.title} onChange={handleChange} className="p-2 rounded border" placeholder="Title" />
            <input name="code" value={formState.code} onChange={handleChange} className="p-2 rounded border" placeholder="Code" />
            <input name="CATs" value={formState.CATs} onChange={handleChange} className="p-2 rounded border" placeholder="CATs" />
            <input name="year" value={formState.year} onChange={handleChange} className="p-2 rounded border" placeholder="Year" />
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      )}

      <button
        onClick={() => setShowModuleYears(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showModuleYears ? 'Hide' : 'Show'} Module Years
      </button>

      {showModuleYears && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md mb-10">
          <h3 className="text-2xl font-semibold mb-4">Module Years</h3>
          <ul className="space-y-2">
            {moduleYears.map(year => {
              const isEditing = editingYears[year.module_year_id]
              return (
                <li key={year.module_year_id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{year.year_start}</strong><br />
                      {!isEditing ? (
                        <>
                          Module Co-ordinator: {year.coordinator}<br />
                          Semester: {year.semester}
                        </>
                      ) : (
                        <>
                          <select
                            className="mt-2 p-1 border rounded"
                            value={year.coordinator}
                            onChange={(e) => {
                              const updated = moduleYears.map(y =>
                                y.module_year_id === year.module_year_id ? { ...y, coordinator: e.target.value } : y
                              )
                              setModuleYears(updated)
                            }}
                          >
                            <option value="">Select Co-ordinator</option>
                            {users.map(u => (
                              <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                          </select>
                          <select
                            className="mt-2 p-1 border rounded"
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
                        </>
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
                            try {
                              await moduleService.updateModuleYear(user.token, year.module_year_id, {
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
      )}

      <button
        onClick={() => setShowAddYear(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showAddYear ? 'Hide Add Year' : 'Add New Module Year'}
      </button>

      {showAddYear && (
        <form onSubmit={handleNewYearSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Add Module Year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 dark:text-black">
            <input
              name="year_start"
              type="number"
              value={newYear.year_start}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
              placeholder="Year Start"
              required
            />
            <select
              name="coordinator"
              value={newYear.coordinator}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
              required
            >
              <option value="">Select Co-Ordinator</option>
              {users.map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
            <select
              name="semester"
              value={newYear.semester}
              onChange={handleNewYearChange}
              className="p-2 rounded border"
              required
            >
              <option value="">Select Semester</option>
              <option value="Autumn">Autumn</option>
              <option value="Spring">Spring</option>
              <option value="Full Year">Full Year</option>
              <option value="Summer">Summer</option>
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

export default EditModule
