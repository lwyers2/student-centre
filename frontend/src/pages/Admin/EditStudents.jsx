// AssignModulesToUser.jsx
import React, { useState } from 'react'

const EditStudents = () => {
  const [users, setUsers] = useState(['User 1', 'User 2', 'User 3'])
  const [modules, setModules] = useState(['Module A', 'Module B', 'Module C'])
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedModule, setSelectedModule] = useState('')

  const handleAssignModule = () => {
    if (selectedUser && selectedModule) {
      alert(`Assigned ${selectedModule} to ${selectedUser}`)
      // Add logic to save this assignment, e.g., API call
    } else {
      alert('Please select both a user and a module.')
    }
  }

  return (
    <div>
      <h2>Assign Module to User</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">Select User</option>
        {users.map((user, index) => (
          <option key={index} value={user}>{user}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedModule(e.target.value)} value={selectedModule}>
        <option value="">Select Module</option>
        {modules.map((module, index) => (
          <option key={index} value={module}>{module}</option>
        ))}
      </select>

      <button onClick={handleAssignModule}>Assign Module</button>
    </div>
  )
}

export default EditStudents
