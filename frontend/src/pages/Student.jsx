import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../services/student'
import Table from '../components/Table'

const Student = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [showSection, setShowSection] = useState(true)
  const user = useSelector(state => state.user)

  const toggle = () => setShowSection(!showSection)

  useEffect(() => {
    studentService.getStudent(params.id)
      .then(response => {
        setStudent(response)
      })
      .catch(error => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id])


  if(!student) {
    return <p>No student data available</p>
  }

  console.log(student)


  return (
    <div className="p-2 my-4 scroll-mt-20">
      <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{student.forename} {student.surname} details</h2>
      {user ? (
        <></>
      ) : (
        <p>Please log in to view student details.</p>
      )}
      {student ? (

        <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
          <div className=" items-center justify-between mb-4">
            <h3 className="text-3xl font-bold text-left sm:text-xl mb-6 text-slate-900 dark:text-white">
            Results
            </h3>
            {courses.length > 0 ?
              (
                courses.map(course => (
                  <div key={course.id} className="mb-4">
                    <p key={course.title} className="font-semibold text-lg"><u>{course.title}</u></p>
                    {course.modules.map(module => (
                      <>
                        {module.flagged === 0 ?
                          (
                            <>
                              <p key={module.code}>{module.title} ({module.code})</p>
                              <p key={module.code + module.result}>Result: {module.result}</p>
                            </>
                          )
                          :
                          (
                            <>
                              <p key={module.code} className='text-red-600'>{module.title} ({module.code})</p>
                              <p key={module.code + module.result} className='text-red-600'>Result: {module.result}</p>
                            </>
                          )
                        }
                      </>
                    ))}
                  </div>
                ))
              )
              :
              (
                <p>No courses available</p>
              )}
          </div>
        </div>

      ) : (
        <div> no student details</div>
      )

      }
    </div>
  )

}
export default Student

