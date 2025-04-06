// EditModules.jsx
import React, { useState } from 'react'

const EditModules = () => {
  const [modules, setModules] = useState(['Module A', 'Module B', 'Module C'])
  const [newModule, setNewModule] = useState('')

  const handleAddModule = () => {
    if (newModule.trim()) {
      setModules([...modules, newModule])
      setNewModule('')
    }
  }

  return (
    <div>
      <h2>Edit Modules</h2>
      <input
        type="text"
        value={newModule}
        onChange={(e) => setNewModule(e.target.value)}
        placeholder="Add new module"
      />
      <button onClick={handleAddModule}>Add Module</button>

      <ul>
        {modules.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
      </ul>
    </div>
  )
}

export default EditModules
