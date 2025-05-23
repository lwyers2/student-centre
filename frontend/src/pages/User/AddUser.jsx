import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import roleService from '../../services/role'
import schoolService from '../../services/school'
import userService from '../../services/user'
import { useSelector } from 'react-redux'

const AddUser = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  const [roles, setRoles] = useState([])

  const [formData, setFormData] = useState({
    prefix: '',
    forename: '',
    surname: '',
    email: '',
    password: '',
    job_title: '',
    role_id: '',
    active: true,
  })

  useEffect(() => {
    const fetchRolesAndSchools = async () => {
      try {
        const [rolesRes, schoolsRes] = await Promise.all([
          roleService.getAll(),
          schoolService.getAll(),
        ])
        setRoles(rolesRes)
      } catch (err) {
        console.error('Failed to load roles or schools:', err)
      }
    }

    fetchRolesAndSchools()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
      }

      await userService.createUser(payload, user.token)
      alert('User added!')
      navigate('/users-admin')
    } catch (err) {
      console.error(err)
      alert('Failed to add user.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 dark:text-black">
        <input name="prefix" value={formData.prefix} onChange={handleChange} placeholder="Prefix" className="w-full p-2 border rounded" />
        <input name="forename" value={formData.forename} onChange={handleChange} placeholder="Forename" className="w-full p-2 border rounded" />
        <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" className="w-full p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <input name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border rounded" />

        <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 dark:text-white">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
          Active
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create User
        </button>
      </form>
    </div>
  )
}

export default AddUser
