import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import userService from '../../services/user'

const UsersAdmin = () => {
  const [users, setUsers] = useState([])
  const user = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll(user.token)
        setUsers(response)
      } catch (err) {
        console.error('Failed to load users:', err)
      }
    }

    fetchUsers()
  }, [])



  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )



  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full max-w-md mr-4"
        />
        <button
          onClick={() => navigate('/users/new')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add New User
        </button>
      </div>

      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/users/${user.id}/edit`)}
          >
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="text-sm text-gray-500 italic">{user.role}</div>
          </li>
        ))}
        {filteredUsers.length === 0 && (
          <li className="text-gray-500 italic">No users found.</li>
        )}
      </ul>
    </div>
  )
}

export default UsersAdmin
