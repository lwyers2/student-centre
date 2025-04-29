import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import moduleService from '../../services/module'
import userService from '../../services/user'
import ModuleDetailsForm from '../../components/ModuleView/Edit/ModuleDetailsForm'
import ModuleYearsList from '../../components/ModuleView/Edit/ModuleYearsList'



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
      <h2 className="text-3xl font-semibold text-center mb-8 text-slate-800 dark:text-white">
        Academic Year ({module.year})
      </h2>

      <button
        onClick={() => setShowModuleDetails(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showModuleDetails ? 'Hide' : 'Show'} Module Details
      </button>

      {showModuleDetails && (
        <ModuleDetailsForm
          formState={formState}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}


      <button
        onClick={() => setShowModuleYears(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        {showModuleYears ? 'Hide' : 'Show'} Module Years
      </button>

      {showModuleYears && (
        <ModuleYearsList
          moduleYears={moduleYears}
          setModuleYears={setModuleYears}
          users={users}
          user={user}
          editingYears={editingYears}
          setEditingYears={setEditingYears}
          moduleId = {module.id}
        />
      )}


    </div>
  )
}

export default EditModule
