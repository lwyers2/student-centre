import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentMeetings from '../../../components/StudentView/StudentMeetings'
import { format, addDays, subDays } from 'date-fns'

const mockStudent = {
  id: 1,
  forename: 'Jane',
  surname: 'Doe',
}

const mockMeetings = [
  {
    id: 101,
    scheduled_date: subDays(new Date(), 5).toISOString(),
    meeting_reason: 'Progress Review',
    outcome: 'Continue monitoring',
    meeting_module: {
      module_year_module: { code: 'CS101', title: 'Intro to CS' }
    },
    meeting_academic_staff: { prefix: 'Dr.', forename: 'Alice', surname: 'Smith' },
    meeting_admin_staff: { prefix: 'Mr.', forename: 'Bob', surname: 'Brown' },
  },
  {
    id: 102,
    scheduled_date: addDays(new Date(), 3).toISOString(),
    meeting_reason: 'Attendance Concern',
    outcome: '',
    meeting_module: {
      module_year_module: { code: 'CS102', title: 'Data Structures' }
    },
    meeting_academic_staff: { prefix: 'Dr.', forename: 'John', surname: 'Watson' },
    meeting_admin_staff: { prefix: 'Ms.', forename: 'Clara', surname: 'Oswald' },
  },
]

describe('<StudentMeetings />', () => {
  test('renders both upcoming and past meetings with correct content', () => {
    render(
      <MemoryRouter>
        <StudentMeetings meetings={mockMeetings} student={mockStudent} />
      </MemoryRouter>
    )

    expect(screen.getByText('Upcoming Meetings')).toBeInTheDocument()
    expect(screen.getByText('Past Meetings')).toBeInTheDocument()

    expect(screen.getByText(/CS101/)).toBeInTheDocument()
    expect(screen.getByText(/CS102/)).toBeInTheDocument()
    expect(screen.getAllByText('View')).toHaveLength(2)
  })

  test('renders message if no meetings are passed', () => {
    render(
      <MemoryRouter>
        <StudentMeetings meetings={[]} student={mockStudent} />
      </MemoryRouter>
    )

    expect(screen.getByText(/No upcoming meetings scheduled/)).toBeInTheDocument()
    expect(screen.getByText(/No past meetings found/)).toBeInTheDocument()
  })
})
