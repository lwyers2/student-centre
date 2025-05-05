import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import meetingService from '../../services/meeting'
import uploadService from '../../services/upload'
import userService from '../../services/user'
import downloadService from '../../services/download'
import { format } from 'date-fns'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MeetingDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [file, setFile] = useState(null)
  const [outcome, setOutcome] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')  // New state for scheduled date
  const [meetingReason, setMeetingReason] = useState('')  // New state for meeting reason
  const [isEditing, setIsEditing] = useState(false) // New state for editing mode
  const user = useSelector((state) => state.user)
  const [adminStaff, setAdminStaff] = useState([])
  const [teachingStaff, setTeachingStaff] = useState([])
  const [selectedAdminStaff, setSelectedAdminStaff] = useState(null)
  const [selectedTeachingStaff, setSelectedTeachingStaff] = useState(null)

  useEffect(() => {
    meetingService.getOneMeeting(params.meetingId)
      .then((response) => {
        setMeeting(response)
        setCourseId(response.course_year_id)
        setOutcome(response.outcome || '') // Default outcome to empty
        setScheduledDate(response.scheduled_date || '') // Set default scheduled date
        setMeetingReason(response.meeting_reason || '') // Set default meeting reason
        setSelectedAdminStaff(response.meeting_admin_staff.id) // Set default selected admin staff
        setSelectedTeachingStaff(response.meeting_academic_staff.id) // Set default selected teaching staff
      })
      .catch((error) => {
        console.error('Error fetching meeting:', error)
      })
  }, [params.meetingId])

  useEffect(() => {
    if (!courseId) return

    userService
      .getUsersFromCourseYear(user.id, courseId, user.token)
      .then((response) => {
        setAdminStaff(response.admin_staff || [])
        setTeachingStaff(response.teaching_staff || [])
      })
      .catch((error) => {
        console.error('Error fetching staff: ', error)
      })
  }, [courseId])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await meetingService.deleteMeeting(meeting.id, user.token)
        toast.success('Meeting deleted successfully')
        navigate('/meetings')
      } catch (error) {
        toast.error('Failed to delete meeting')
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please select a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('meetingId', meeting.id) // Ensure meetingId is correctly set
    formData.append('file', file) // Attach file

    try {
      await uploadService.uploadMinutes(meeting.id, file, user.token)

      // After upload success, update the outcome
      const updatedMeeting = await meetingService.updateMeeting(meeting.id, { outcome })

      toast.success('Minutes uploaded and outcome updated successfully!')
      setShowUploadForm(false)

      // Refresh meeting data
      setMeeting(updatedMeeting.meeting)
    } catch (error) {
      toast.error(error.message || 'Failed to upload minutes or update outcome.')
      console.error('Error uploading minutes:', error)
    }
  }

  // Function to handle downloading the meeting minutes
  const handleDownload = () => {
    if (meeting && meeting.path_to_minutes) {
      downloadService.downloadMinutes(meeting.id)
    } else {
      toast.error('No meeting minutes available for download.')
    }
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    try {
      const updatedMeeting = await meetingService.updateMeeting(meeting.id, {
        outcome,
        scheduled_date: scheduledDate,  // Ensure the backend receives scheduledDate
        meeting_reason: meetingReason,   // Ensure the backend receives meetingReason
        academic_id:  parseInt(selectedTeachingStaff, 10),  // Correctly name academic staff ID
        admin_staff_id: parseInt(selectedAdminStaff, 10)  // Correctly name admin staff ID
      })

      if (updatedMeeting.success) {
        setMeeting(updatedMeeting.meeting)  // Update the meeting state
        setIsEditing(false)  // Disable edit mode
        toast.success('Meeting updated successfully!')
      } else {
        toast.error('Failed to update meeting: ' + updatedMeeting.message)
      }
    } catch (error) {
      toast.error('Failed to update meeting.')
      console.error('Error updating meeting:', error)
    }
  }


  if (!meeting) return <p>Loading meeting details...</p>

  // Ensure meeting.meeting_student and other properties exist before rendering
  if (!meeting.meeting_student || !meeting.meeting_academic_staff || !meeting.meeting_admin_staff) {
    return <p>Loading additional meeting details...</p>
  }


  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Meeting Details</h2>

      <p><strong>Student:</strong> {meeting.meeting_student.forename} {meeting.meeting_student.surname} ({meeting.meeting_student.email})</p>

      {/* Editable Scheduled Date */}
      <div>
        <strong>Scheduled Date:</strong>
        {isEditing ? (
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ) : (
          <p>{format(new Date(meeting.scheduled_date), 'PPP p')}</p>
        )}
      </div>

      {/* Editable Meeting Reason */}
      <div>
        <strong>Meeting Reason:</strong>
        {isEditing ? (
          <input
            type="text"
            value={meetingReason}
            onChange={(e) => setMeetingReason(e.target.value)}
            placeholder="Enter meeting reason..."
            className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ) : (
          <p>{meeting.meeting_reason}</p>
        )}
      </div>

      {/* Editable Outcome */}
      <div>
        <strong>Outcome:</strong>
        {isEditing ? (
          <input
            type="text"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="Enter outcome..."
            className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ) : (
          <p>{meeting.outcome}</p>
        )}
      </div>

      {/* Staff dropdowns */}
      <div>
        <strong>Academic Staff:</strong>
        {isEditing ? (
          <select
            value={selectedTeachingStaff}
            onChange={(e) => setSelectedTeachingStaff(e.target.value)}
            className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {teachingStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        ) : (
          <p>{meeting.meeting_academic_staff.prefix} {meeting.meeting_academic_staff.forename} {meeting.meeting_academic_staff.surname}</p>
        )}
      </div>

      <div>
        <strong>Admin Staff:</strong>
        {isEditing ? (
          <select
            value={selectedAdminStaff}
            onChange={(e) => setSelectedAdminStaff(e.target.value)}
            className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {adminStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        ) : (
          <p>{meeting.meeting_admin_staff.prefix} {meeting.meeting_admin_staff.forename} {meeting.meeting_admin_staff.surname}</p>
        )}
      </div>

      {meeting.path_to_minutes ? (
        <p><strong>Minutes Uploaded</strong></p>
      ) : (
        <p className="text-red-500">No minutes uploaded.</p>
      )}

      <div className="flex space-x-4 mt-4">
        {/* Edit and Save button */}
        <button onClick={handleEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {isEditing ? 'Cancel Edit' : 'Edit Meeting'}
        </button>
        {isEditing && (
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save Changes
          </button>
        )}

        <button onClick={() => setShowUploadForm(!showUploadForm)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {showUploadForm ? 'Cancel' : 'Upload Minutes'}
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete Meeting
        </button>

        {/* Add download button */}
        {meeting.path_to_minutes && (
          <button onClick={handleDownload} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Download Minutes
          </button>
        )}
      </div>

      {showUploadForm && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Upload Minutes & Update Outcome</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Document</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Update Outcome</label>
              <input
                type="text"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="Enter outcome..."
                className="mt-1 p-2 w-full border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Submit
            </button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default MeetingDetails
