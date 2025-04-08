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
  const [moduleYears, setModuleYears] = useState([])
  const [formState, setFormState] = useState({
    title: '',
    code: '',
    level: '',
    credits: '',
    semester: '',
    coordinator: ''
  })
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  useEffect(() => {
    if (user?.token && params.moduleId) {
      moduleService.getModule( params.moduleId, user.token,)
        .then(data => {
          setModule(data.module)
          setModuleYears(data.module.module_years)
          setFormState({
            title: data.module.title,
            code: data.module.code,
            CATs: data.module.CATs,
          })
        })
        .catch(err => {
          console.error(err)
          alert('Failed to load module')
        })
    }
  }, [user.token, params.moduleId])

  // useEffect(() => {
  //   if (user?.token) {
  //     userService.getUsersFromSchool(user.school_id)
  //       .then(res => setUsers(res.teaching_staff || []))
  //       .catch(err => {
  //         console.error(err)
  //         alert('Failed to load users')
  //       })
  //   }
  // }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
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

  if (!user?.id) return <div>Loading user...</div>
  if (!module) return <div>Loading module...</div>


  return (
    <div className="w-full max-w-4xl mx-auto p-4 my-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
        Edit Module
      </h2>
      <h2 className="text-3xl font-semibold text-center mb-6 text-slate-800 dark:text-white">
        {module.title} ({module.code})
      </h2>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">Module Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 dark:text-black">
          <input name="title" value={formState.title} onChange={handleChange} className="p-2 rounded border" placeholder="Title" />
          <input name="code" value={formState.code} onChange={handleChange} className="p-2 rounded border" placeholder="Code" />
          <input name="CATs" type="number" value={formState.CATs} onChange={handleChange} className="p-2 rounded border" placeholder="CATs" />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditModule
