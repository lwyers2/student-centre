import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import meetingService from '../../services/meeting'
import { format } from 'date-fns'

const ViewAllMeetings = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [previousMeetings, setPreviousMeetings] = useState([])
  const [filter, setFilter] = useState('both')

  useEffect(() => {
    if (!user) {
      navigate('/')
    } else {
      meetingService.getAllMeetingsForOneUser(user.id)
        .then((response) => {
          const allMeetings = response

          const currentDate = new Date()

          const upcoming = allMeetings.filter((meeting) => new Date(meeting.scheduled_date) > currentDate)
          const previous = allMeetings.filter((meeting) => new Date(meeting.scheduled_date) <= currentDate)

          setUpcomingMeetings(upcoming)
          setPreviousMeetings(previous)
        })
    }
  }, [user, navigate])

  const filteredMeetings = () => {
    if (filter === 'upcoming') {
      return upcomingMeetings
    } else if (filter === 'previous') {
      return previousMeetings
    } else {
      return [...upcomingMeetings, ...previousMeetings]
    }
  }

  return (
    <div className="container mx-auto mt-6 p-6 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>

      <div className="mb-6 flex items-center space-x-4">
        <button
          className={`px-4 py-2 rounded ${filter === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-600'}`}
          onClick={() => setFilter('both')}
        >
          Both
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-600'}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'previous' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-600'}`}
          onClick={() => setFilter('previous')}
        >
          Previous
        </button>
      </div>

      <div>
        {filteredMeetings().length > 0 ? (
          <ul className="space-y-4">
            {filteredMeetings().map((meeting) => (
              <li key={meeting.id} className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p><strong>Scheduled Date:</strong> {format(new Date(meeting.scheduled_date), 'PPP p')}</p>
                <p><strong>Reason:</strong> {meeting.meeting_reason}</p>
                <p><strong>Academic Staff:</strong> {meeting.meeting_academic_staff.forename} {meeting.meeting_academic_staff.surname}</p>
                <p><strong>Admin Staff:</strong> {meeting.meeting_admin_staff.forename} {meeting.meeting_admin_staff.surname}</p>

                <button
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => navigate(`/meeting-details/${meeting.id}`)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meetings to display.</p>
        )}
      </div>
    </div>
  )
}

export default ViewAllMeetings
