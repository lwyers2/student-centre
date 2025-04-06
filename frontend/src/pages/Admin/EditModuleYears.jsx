// EditModuleYears.jsx
import React, { useState } from 'react'

const EditModuleYears = () => {
  const [moduleYears, setModuleYears] = useState(['2021', '2022', '2023'])
  const [newModuleYear, setNewModuleYear] = useState('')

  const handleAddModuleYear = () => {
    if (newModuleYear.trim()) {
      setModuleYears([...moduleYears, newModuleYear])
      setNewModuleYear('')
    }
  }

  return (
    <div>
      <h2>Edit Module Years</h2>
      <input
        type="text"
        value={newModuleYear}
        onChange={(e) => setNewModuleYear(e.target.value)}
        placeholder="Add new module year"
      />
      <button onClick={handleAddModuleYear}>Add Module Year</button>

      <ul>
        {moduleYears.map((year, index) => (
          <li key={index}>{year}</li>
        ))}
      </ul>
    </div>
  )
}

export default EditModuleYears
