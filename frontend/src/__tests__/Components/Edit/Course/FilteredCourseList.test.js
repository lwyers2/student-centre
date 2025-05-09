import React from 'react'
import { render, screen } from '@testing-library/react'
import FilteredCourseList from '../../../../components/Edit/Course/FilteredCourseList'

jest.mock('../../../../components/Edit/Course/Course', () => {
  const MockCourse = () => <div data-testid="course-component">Mock Course</div>
  MockCourse.displayName = 'MockCourse'
  return MockCourse
})


describe('<FilteredCourseList />', () => {
  const mockCourses = [
    {
      id: 1,
      title: 'Computer Science',
      code: 'CS101',
      qualification: 'BSc',
      school: 'Engineering',
      part_time: 0,
      years: 3,
    },
    {
      id: 2,
      title: 'Mathematics',
      code: 'MATH204',
      qualification: 'BSc',
      school: 'Science',
      part_time: 1,
      years: 4,
    },
  ]

  test('renders Course component when courses are present', () => {
    render(<FilteredCourseList filteredCourses={mockCourses} search="sci" />)

    expect(screen.getByTestId('course-component')).toBeInTheDocument()
  })

  test('renders fallback text when no courses are found', () => {
    render(<FilteredCourseList filteredCourses={[]} search="bio" />)

    expect(screen.getByText(/no courses found/i)).toBeInTheDocument()
  })
})
