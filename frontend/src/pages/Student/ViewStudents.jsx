import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import AllUserStudents from '../../components/StudentView/AllUserStudents'

const StudentModule = () => {

  const params = useParams()
  const [students, setStudents] = useState(null)
  const [userData, setUserData] = useState(null)
  const user = useSelector (state => state.user)
  const [search, setSearch] = useState('')



  useEffect(() => {
    const id = user.id
    userService.getUserStudents(id)
      .then(response => {
        setUserData(response.user)
        setStudents(response.students)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])


  return(
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {students ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Your students</h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">{userData.prefix}. {userData.forename} {userData.surname}</h2>
          </>
        ): (
          <p>Students not found</p>
        )
        }
      </div>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view your courses.</p>
      )}
      {
        students ? (
          <>
            <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className= "text-3xl font-bold text-left  mb-6 text-slate-900 dark:text-white">Search</h3>
                <button className="bg-slate-500 text-white font-semibold px-3 py-1 rounded hover:bg-slate-400">View</button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            {
              <AllUserStudents students= {students} search={search}/>
            }
          </>
        ) : (
          <p>loading students</p>
        )
      }

    </div>
  )

}

export default StudentModule