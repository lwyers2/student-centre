import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import roleService from '../../services/role'
import schoolService from '../../services/school'
import userService from '../../services/user'
import { useSelector } from 'react-redux'

const EditUser = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const [schools, setSchools] = useState([])
  const [formData, setFormData] = useState(null)
  const [selectedSchools, setSelectedSchools] = useState([])
  const [userData, setUserData] = useState(null)
  const user = useSelector((state) => state.user)

  console.log('userId:', userId)
  console.log('user:', user)

  // Load user data
  useEffect(() => {
    userService.getUserDetails(userId, user.token)
      .then((response) => {
        const userData = response
        console.log('Fetched user:', userData)
        setFormData({
          prefix: userData.prefix || '',
          forename: userData.forename || '',
          surname: userData.surname || '',
          email: userData.email || '',
          password: '',
          job_title: userData.job_title || '',
          role_id: userData.role_id || '',
          active: userData.active,
        })

        // extract selected school IDs from the user object
        const userSchoolIds = (userData.schools || []).map(
          (school) => school.school_id
        )
        setSelectedSchools(userSchoolIds)
      })

  }, [userId])

  console.log(selectedSchools)

  // Load roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAll()
        setRoles(response)
      } catch (err) {
        console.error('Failed to load roles:', err)
      }
    }
    fetchRoles()
  }, [])

  // Load schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await schoolService.getAll()
        setSchools(response)
      } catch (err) {
        console.error('Failed to load schools:', err)
      }
    }
    fetchSchools()
  }, [])

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Handle checkbox toggle for schools
  const toggleSchool = (schoolId) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        prefix: formData.prefix,
        forename: formData.forename,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
        jobTitle: formData.job_title,
        roleId: formData.role_id,
        active: formData.active,
        schools: selectedSchools,
      }

      if (!payload.password) {
        delete payload.password
      }

      await userService.updateUser(userId, user.token, payload)
      alert('User updated!')
      navigate('/users-admin')
    } catch (err) {
      console.error('Error response:', err.response?.data || err)
      alert('Failed to update user')
    }
  }


  if (!formData) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 dark:text-black">
        <input name="prefix" value={formData.prefix} onChange={handleChange} placeholder="Prefix" className="w-full p-2 border rounded" />
        <input name="forename" value={formData.forename} onChange={handleChange} placeholder="Forename" className="w-full p-2 border rounded" />
        <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" className="w-full p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (leave blank to keep current)" className="w-full p-2 border rounded" />
        <input name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border rounded" />

        {/* Role dropdown */}
        <select name="role_id" value={formData.role_id} onChange={handleChange} className="w-full p-2 border rounded ">
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {/* Active toggle */}
        <label className="flex items-center gap-2 dark:text-white">
          <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
          Active
        </label>

        {/* Schools checkboxes */}
        <div className="border-t pt-4 dark:text-white">
          <h4 className="font-semibold">Assign Schools</h4>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {schools.map((school) => (
              <label key={school.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSchools.includes(school.id)}
                  onChange={() => toggleSchool(school.id)}
                />
                {school.school_name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Update User
        </button>
      </form>
    </div>
  )
}

export default EditUser
