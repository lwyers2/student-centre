import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table'

const ModuleSummary = () => {
  const user = useSelector(state => state.user)
  return (
    <div>
      <h1 className="text-2xl font-bold">Module Summary</h1>
      {/* Add admin-specific features here */}
    </div>
  )
}

export default ModuleSummary