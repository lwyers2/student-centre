import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import studentService from '../../services/student'
import { useSelector } from 'react-redux'
import userService from '../../services/user'
import meetingService from '../../services/meeting' // Import meeting service

const ScheduleMeeting = () => {
  const params = useParams()
  const navigate = useNavigate() // Initialize useNavigate
  const [module, setModule] = useState(null)
  const [student, setStudent] = useState(null)
  const user = useSelector((state) => state.user)
  const [course, setCourse] = useState(null)
  const [adminStaff, setAdminStaff] = useState([])
  const [teachingStaff, setTeachingStaff] = useState([])

  // Form state
  const [selectedAdmin, setSelectedAdmin] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingReason, setMeetingReason] = useState('')

  useEffect(() => {
    studentService
      .getStudentModule(params.id, user.token, params.moduleYearId)
      .then((response) => {
        setStudent(response.student)
        setModule(response.module)
        setCourse(response.course)
      })
      .catch((error) => {
        console.error('Error fetching module: ', error)
      })
  }, [params.id, params.moduleYearId, user.token])

  useEffect(() => {
    if (!course || !course.course_year_id) return

    userService
      .getUsersFromCourseYear(user.id, course.course_year_id, user.token)
      .then((response) => {
        setAdminStaff(response.admin_staff || [])
        setTeachingStaff(response.teaching_staff || [])
      })
      .catch((error) => {
        console.error('Error fetching staff: ', error)
      })
  }, [course])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const meetingData = {
      studentId: student?.id,
      moduleYearId: module?.module_year_id,
      scheduledDate: meetingDate,
      academicId: selectedTeacher,
      adminStaffId: selectedAdmin,
      meetingReason: meetingReason,
    }

    console.log('Meeting Scheduled:', meetingData)

    // Call the meetingService to create the meeting
    const result = await meetingService.createMeeting(
      meetingData.studentId,
      meetingData.moduleYearId,
      meetingData.scheduledDate,
      meetingData.academicId,
      meetingData.adminStaffId,
      meetingData.meetingReason
    )

    console.log(`result: ${result}`)

    if (result.success) {
      alert('Meeting scheduled successfully!')

      // Redirect to the MeetingDetails page
      navigate(`/meeting-details/${result.meeting.id}`) // Use the meeting ID from the response to redirect
    } else {
      alert('Failed to schedule the meeting: ' + result.message)
    }
  }

  return (
    <div className="p-2 my-4 scroll-mt-20">
      <div>
        {student && module && course ? (
          <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">
            Schedule Meeting
          </h2>
        ) : (
          <p>Student or module not found</p>
        )}
      </div>

      {user ? null : <p>Please log in to view your courses.</p>}

      {module && student && course ? (
        <>
          <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">
            Academic Year: {module.year_start}/{module.year_start + 1}
          </h2>

          <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">
            {student.forename} {student.surname} ({student.student_code})
          </h2>

          <h2 className="text-2xl font-bold text-center sm:text-3xl mb-6 text-slate-900 dark:text-white">
            <strong>Course:</strong> {course.title}
          </h2>

          {/* Meeting Scheduling Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
          >
            {/* Teaching Staff */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2">Select Teaching Staff</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select a teacher</option>
                {teachingStaff.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Staff */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2">Select Admin Staff</label>
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select an admin</option>
                {adminStaff.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Date & Time */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2">Meeting Date & Time</label>
              <input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            {/* Reason for Meeting */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-white font-bold mb-2">Reason for Meeting</label>
              <textarea
                value={meetingReason}
                onChange={(e) => setMeetingReason(e.target.value)}
                rows="4"
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter the reason for the meeting..."
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Schedule Meeting
            </button>
          </form>
        </>
      ) : (
        <div>No Module to view</div>
      )}
    </div>
  )
}

export default ScheduleMeeting
