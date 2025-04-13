import React from 'react'
import Table from '../Table'
import { format, isBefore } from 'date-fns'

const StudentMeetings = ({ meetings = [], student }) => {
  const now = new Date()

  const formatMeeting = (meeting) => ({
    date: format(new Date(meeting.scheduled_date), 'dd MMM yyyy'),
    module: `${meeting.meeting_module?.module_year_module?.code} – ${meeting.meeting_module?.module_year_module?.title}`,
    reason: meeting.meeting_reason,
    outcome: meeting.outcome,
    academic: `${meeting.meeting_academic_staff?.prefix} ${meeting.meeting_academic_staff?.forename} ${meeting.meeting_academic_staff?.surname}`,
    admin: `${meeting.meeting_admin_staff?.prefix} ${meeting.meeting_admin_staff?.forename} ${meeting.meeting_admin_staff?.surname}`,
    id: meeting.id,
    view: `/meeting-details/${meeting.id}`,
  })

  const pastMeetings = meetings.filter(m => isBefore(new Date(m.scheduled_date), now)).map(formatMeeting)
  const upcomingMeetings = meetings.filter(m => !isBefore(new Date(m.scheduled_date), now)).map(formatMeeting)

  const headers = ['Date', 'Module', 'Reason', 'Outcome', 'Academic', 'Admin']

  const labelsPast = { title: 'Past Meetings' }
  const labelsUpcoming = { title: 'Upcoming Meetings' }


  return (
    <div className="space-y-6">
      {upcomingMeetings.length > 0 ? (
        <Table labels={labelsUpcoming} content={{ headers, data: upcomingMeetings, view: row => row.view }} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No upcoming meetings scheduled.</p>
      )}

      {pastMeetings.length > 0 ? (
        <Table labels={labelsPast} content={{ headers, data: pastMeetings, view: row => row.view }} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No past meetings found.</p>
      )}
    </div>
  )

}

export default StudentMeetings
