import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import moduleService from '../../services/module'
import Module from '../../components/Edit/Module/Module'

const EditModules = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const [modules, setModules] = useState([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(true)

  const toggleSearch = () => setShowSearch(!showSearch)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user?.id) {
      moduleService
        .getAll(user.token)
        .then((res) => {
          setModules(res)
        })
        .catch((err) => {
          console.error('Failed to load modules', err)
          setModules([])
        })
    }
  }, [user?.id])

  if (!user?.id) return <div>Loading user...</div>
  if (!modules) return <div>Loading modules...</div>


  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(search.toLowerCase()) ||
    module.code.toLowerCase().includes(search.toLowerCase())
  )



  return (
    <div className="w-auto p-2 my-6 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-8 text-slate-900 dark:text-white">
        Find Module to Edit
      </h2>

      {/* Search Block */}
      <div className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-md mb-10 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-0">Search Modules</h3>
          <button
            onClick={toggleSearch}
            className="bg-slate-600 hover:bg-slate-500 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
          >
            {showSearch ? 'Hide Search' : 'Show Search'}
          </button>
        </div>

        {showSearch && (
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-slate-900"
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* One Sample Module Record */}
      <div className="space-y-4">
        {filteredModules.length > 0 ? (
          <Module modules={filteredModules}  />
        ) : (
          <p className="text-center text-slate-900 dark:text-white">No courses found.</p>
        )}
      </div>
    </div>
  )
}

export default EditModules
