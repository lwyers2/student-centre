// AddUsers.jsx
import React, { useState } from 'react'

const AddUsers = () => {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleAddUser = () => {
    const { name, email, role } = newUser
    if (name.trim() && email.trim() && role.trim()) {
      setUsers([...users, newUser])
      setNewUser({ name: '', email: '', role: '' }) // Clear the input fields after adding
    }
  }

  return (
    <div>
      <h2>Add New User</h2>

      {/* User form */}
      <div>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          placeholder="Enter name"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        <input
          type="text"
          name="role"
          value={newUser.role}
          onChange={handleChange}
          placeholder="Enter role"
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* List of added users */}
      <h3>Current Users:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AddUsers
