import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LinkCard from '../../components/Utils/LinkCard'

const Admin = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <div className="p-6 my-8">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-10 text-slate-900 dark:text-white">
        Admin Center
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        <LinkCard title="Manage Courses" onClick={() => navigate('/edit-courses')} />
        <LinkCard title="Manage Modules" onClick={() => navigate('/edit-modules')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        <LinkCard title="Manage Users" onClick={() => navigate('/users-admin')} />
        <LinkCard title="Assign Users To Module Years" onClick={() => navigate('/assign-module-years-to-users')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-y-8 gap-x-6">
        <LinkCard title="Assign Users to Course Years" onClick={() => navigate('/assign-course-years-to-users')} />
      </div>
    </div>
  )
}

export default Admin
