import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table'

const ModuleSummary = () => {
  const user = useSelector(state => state.user)
  const [moduleYears, setModuleYears] = useState(null)
  const [module, setModule] = useState(null)
  const params = useParams()

  console.log(params)

  useEffect(() => {
    userService.getUserOneModule(user.id, params.moduleId, user.token)
      .then(response => {
        setModuleYears(response.modules)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
      })
  }, [params.id])

  console.log(moduleYears)

  return (
    <div>
      <h1 className="text-2xl font-bold">Module Summary</h1>
      {/* Add admin-specific features here */}
    </div>
  )
}

export default ModuleSummary