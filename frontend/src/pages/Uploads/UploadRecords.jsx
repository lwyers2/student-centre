import React from 'react'
import { useSelector } from 'react-redux'
import LinkCard from '../../components/Utils/LinkCard'
import { useNavigate } from 'react-router-dom'

const UploadRecords = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <div className="p-6 my-6">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white ">
        Upload Records
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        <LinkCard title="Upload Results for Course Year" onClick={() => navigate('/upload-records/course-year')} />
        <LinkCard title="Upload Students" onClick={() => navigate('/upload-students')} />
      </div>

    </div>
  )
}

export default UploadRecords
