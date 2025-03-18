import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import AllModules from '../../components/AllModules'

const Modules = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const params = useParams()

  const [courses, setCourses] = useState()
  const [modules, setModules] = useState()
  const [userData, setUserData] = useState()
  const [groupedModules, setGroupedModules] = useState({})
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(true)

  const toggle = () => setShowSearch(!showSearch)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const id = user.id
    userService.getUserModules(id, user.token)
      .then(response => {
        setUserData(response.user)
        setCourses(response.courses)
        setModules(response.modules)

        // Group modules by year
        const grouped = response.modules.reduce((acc, module) => {
          const year = module.year || 0
          if (!acc[year]) {
            acc[year] = []
          }
          acc[year].push(module)
          return acc
        }, {})

        setGroupedModules(grouped)

      })
      .catch(error => {
        console.error(`Error fetching modules: ${error}`)
      })
  }, [params.id, user.id, user.token])

  if (!user.id) {
    return <div>Loading...</div>
  }

  if (!courses) {
    return <div>Loading... courses</div>
  }

  if (!modules) {
    return <div>Loading... modules</div>
  }

  // Ensure the groupedModules is an array for mapping
  const groupedModulesArray = Object.entries(groupedModules).map(([year, modulesForYear]) => ({
    year,
    modulesForYear
  }))

  return (
    <div className="w-auto p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">View All Modules</h2>
      <h2 className="text-3xl font-bold text-center sm:text-4xl mb-6 text-slate-900 dark:text-white">{userData.prefix}. {userData.forename} {userData.surname}</h2>

      {courses && (
        <>
          <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-bold text-left mb-6 text-slate-900 dark:text-white">Search</h3>
              <button onClick={toggle} className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">
                {showSearch ? 'Hide' : 'Show'}
              </button>
            </div>
            {showSearch && (
              <div className="mb-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          {groupedModulesArray.length > 0 ? (
            groupedModulesArray.map((group) => (
              <div key={group.year}>
                {/* Pass the modules for this year to AllModules */}
                <AllModules
                  key={group.year} // Use year as key for the group
                  modules={group.modulesForYear} // Pass the array of modules for the year
                  year={group.year}
                  search={search}
                />
              </div>
            ))
          ) : (
            <div>No modules found for this user.</div>
          )}
        </>
      )}
    </div>
  )
}

export default Modules
