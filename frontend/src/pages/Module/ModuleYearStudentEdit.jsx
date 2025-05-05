import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moduleService from '../../services/module'
import ModuleYearStudentTable from '../../components/ModuleView/ModuleYearStudentTable'

const ModuleYearStudentEdit = () => {
  const params = useParams()
  const user = useSelector(state => state.user)

  const [module, setModule] = useState(null)
  const [students, setStudents] = useState(null)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [editedResult, setEditedResult] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    moduleService.getModuleFromModuleYear(params.moduleYearId, user.token)
      .then(response => {
        setModule(response.module[0])
        setStudents(response.module[0].students)
      })
      .catch(error => {
        console.error('Error fetching module:', error)
        alert('Failed to fetch module data.')
      })
      .finally(() => setLoading(false))
  }, [params.moduleYearId, user.token])

  useEffect(() => {
    if (editingStudent && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingStudent])

  const filteredStudents = (students || []).filter(student =>
    student?.forename?.toLowerCase().includes(search.toLowerCase()) ||
    student?.surname?.toLowerCase().includes(search.toLowerCase()) ||
    student?.student_code?.toLowerCase().includes(search.toLowerCase()) ||
    student?.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleEditResult = (student) => {
    setEditingStudent(student)
    setEditedResult(student.result ?? '')
  }

  const handleSaveResult = (studentId) => {
    const numericResult = Number(editedResult)
    if (isNaN(numericResult)) {
      alert('Please enter a valid number.')
      return
    }

    moduleService.updateStudentResult(studentId, numericResult, user.token)
      .then(() => {
        const updatedStudents = students.map(student =>
          student.id === studentId ? { ...student, result: numericResult } : student
        )
        setStudents(updatedStudents)
        setEditingStudent(null)
        setEditedResult('')
        alert('Result updated successfully!')
      })
      .catch(error => {
        console.error('Error updating student result:', error)
        alert('Failed to update result.')
      })
  }

  if (loading) return <p>Loading module data...</p>
  if (!module) return <p>No module data available</p>
  if (!students) return <p>No student data available</p>

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">{module.title}</h2>
        <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">
          ({module.code}) {module.semester} {module.year_start}
        </h2>
      </div>

      <div className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-3xl font-bold text-left mb-6 text-slate-900 dark:text-white">Search</h3>
        </div>
        <div className="mb-4">
          <input
            type="text"
            aria-label="Search students"
            className="border border-gray-300 rounded px-2 py-1 w-full text-slate-900"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <ModuleYearStudentTable
        students={filteredStudents}
        onEditResult={handleEditResult}
      />

      {editingStudent && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50 dark:text-black">
          <div className="bg-white p-6 rounded-md shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4 ">
              Edit Result for {editingStudent.forename} {editingStudent.surname}
            </h3>
            <div className="mb-4">
              <label htmlFor="resultInput" className="block text-sm font-semibold">Result</label>
              <input
                id="resultInput"
                ref={inputRef}
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
                disabled={!editedResult || isNaN(Number(editedResult))}
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
