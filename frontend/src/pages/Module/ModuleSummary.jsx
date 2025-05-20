import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import { useParams } from 'react-router-dom'
import Table from '../../components/Table'
import ModuleSummaryModuleYears from '../../components/ModuleView/ModuleSummaryModuleYears'

const ModuleSummary = () => {
  const user = useSelector(state => state.user)
  const [moduleYears, setModuleYears] = useState([])
  const [module, setModule] = useState(null)
  const params = useParams()

  useEffect(() => {
    userService.getUserOneModule(user.id, params.moduleId, user.token)
      .then(response => {
        setModuleYears(response.module_years || [])
        setModule(response.module)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
      })
  }, [params.id])

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{module.title} </h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">({module.code}) {module.semester} {module.year_start}</h2>
          </>
        ) : (
          <p>Module not found</p>
        )}
      </div>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {module ? (
        <>
          {moduleYears.length > 0 ? (
            moduleYears.map((moduleYear) => (
              <ModuleSummaryModuleYears key={moduleYear.module_year_id} moduleYear={moduleYear} />
            ))
          ) : (
            <div>No module years available</div>
          )}
        </>
      ) : (
        <div>No module info</div>
      )}
    </div>
  )
}

export default ModuleSummary
