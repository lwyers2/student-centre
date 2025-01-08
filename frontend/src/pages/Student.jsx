import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import studentService from '../services/student'
import Table from '../components/Table'

const Student = () => {
  const params = useParams()
  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const user = useSelector(state => state.user)

  useEffect(() => {
    studentService.getStudent(params.id)
      .then(response => {
        setStudent(response.student)
        setCourses(response.courses)
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
        <>
          <h3 className="text-3xl font-bold text-left sm:text-xl mb-6 text-slate-900 dark:text-white">
            Courses
          </h3>
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="mb-4">
                <p className="font-semibold text-lg">{course.title}</p>
                {course.modules.map(module => (
                  <>
                    <p key={module.code}>{module.title} ({module.code})</p>
                    <p>Result: {module.result}</p>
                  </>
                ))}
              </div>
            ))
          ) : (
            <p>No courses available</p>
          )}
          <h3 className="text-3xl font-bold text-left sm:text-1xl mb-6 text-slate-900 dark:text-white">Meetings</h3>
        </>
      ) : (
        <div> no student details</div>
      )

      }
    </div>
  )

}
export default Student

