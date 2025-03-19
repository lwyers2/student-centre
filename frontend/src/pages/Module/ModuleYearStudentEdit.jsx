import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moduleService from '../../services/module'
import ModuleYearStudentTable from '../../components/ModuleView/ModuleYearStudentTable'

const ModuleYearStudentEdit = () => {
  const params = useParams()
  const [module, setModule] = useState(null)
  const [students, setStudents] = useState(null)
  const user = useSelector(state => state.user)
  const [search, setSearch] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [editedResult, setEditedResult] = useState('')

  useEffect(() => {
    moduleService.getModuleFromModuleYear(params.id, user.token)
      .then(response => {
        setModule(response.module[0])
        setStudents(response.module[0].students)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
      })
  }, [params.id, user.token])

  if (!module) {
    return <p>No module data available</p>
  }

  if (!students) {
    return <p>No student data available</p>
  }

  const filteredStudents = students.filter((student) =>
    student.forename.toLowerCase().includes(search.toLowerCase()) ||
    student.surname.toLowerCase().includes(search.toLowerCase()) ||
    student.student_code.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleEditResult = (student) => {
    setEditingStudent(student)
    setEditedResult(student.result || '')
  }

  const handleSaveResult = (studentId) => {
    moduleService.updateStudentResult(studentId, editedResult, user.token)
      .then(response => {
        const updatedStudents = students.map(student =>
          student.id === studentId ? { ...student, result: editedResult } : student
        )
        setStudents(updatedStudents)
        setEditingStudent(null)
        setEditedResult('')
      })
      .catch(error => {
        console.error('Error updating student result:', error)
      })
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {module ? (
          <>
            <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{module.title}</h2>
            <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">({module.code}) {module.semester} {module.year_start}</h2>
          </>
        ) : (
          <p>Module not found</p>
        )}
      </div>

      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-3xl font-bold text-left mb-6 text-slate-900 dark:text-white">Search</h3>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Pass the students and the handleEditResult function to the table */}
      <ModuleYearStudentTable
        students={filteredStudents}
        onEditResult={handleEditResult}
      />

      {/* Editing Modal for Student Result */}
      {editingStudent && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Result for {editingStudent.forename} {editingStudent.surname}</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Result</label>
              <input
                type="number"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={editedResult}
                onChange={(e) => setEditedResult(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => handleSaveResult(editingStudent.id)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleYearStudentEdit
