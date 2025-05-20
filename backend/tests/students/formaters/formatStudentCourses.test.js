const { formatStudentCourses } = require('../../../helper/formaters/student/formatStudentCourses')

describe('formatStudentCourses', () => {
  it('should format the student and course data correctly', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forname: 'John',
      surname: 'Doe',
      student_student_course: [
        {
          student_course_course_year: {
            id: 101,
            course_id: 202,
            year_start: 2022,
            year_end: 2023,
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith'
            },
            course_year_course: {
              title: 'Computer Science',
              years: 3,
              code: 'CS101',
              part_time: false,
              course_qualification_level: { qualification: 'BSC' },

            }
          }
        },
        {
          student_course_course_year: {
            id: 102,
            course_id: 203,
            year_start: 2023,
            year_end: 2024,
            course_year_course_coordinator: {
              prefix: 'Prof',
              forename: 'Bob',
              surname: 'Johnson'
            },
            course_year_course: {
              title: 'Mathematics',
              years: 3,
              code: 'MATH101',
              part_time: true,
              course_qualification_level: { qualification: 'MSC' },
            }
          }
        }
      ]
    }

    const expectedOutput = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      courses: [
        {
          course_year_id: 101,
          course_id: 202,
          year_start: 2022,
          year_end: 2023,
          title: 'Computer Science',
          years: 3,
          code: 'CS101',
          part_time: false,
          qualification: 'BSC',
          course_coordinator: 'Dr. Alice Smith',
        },
        {
          course_year_id: 102,
          course_id: 203,
          year_start: 2023,
          year_end: 2024,
          title: 'Mathematics',
          years: 3,
          code: 'MATH101',
          part_time: true,
          qualification: 'MSC',
          course_coordinator: 'Prof. Bob Johnson',
        }
      ]
    }

    const result = formatStudentCourses(student)

    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array for courses if no student_student_course data is provided', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forname: 'John',
      surname: 'Doe',
      student_student_course: []
    }

    const expectedOutput = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      courses: []
    }

    const result = formatStudentCourses(student)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing coordinator', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forname: 'John',
      surname: 'Doe',
      student_student_course: [
        {
          student_course_course_year: {
            id: 101,
            course_id: 202,
            year_start: 2022,
            year_end: 2023,
            course_year_course: {
              title: 'Computer Science',
              years: 3,
              code: 'CS101',
              part_time: false,
              course_qualification_level: { qualification: 'BSC' },

            }
          }
        },
        {
          student_course_course_year: {
            id: 102,
            course_id: 203,
            year_start: 2023,
            year_end: 2024,
            course_year_course: {
              title: 'Mathematics',
              years: 3,
              code: 'MATH101',
              part_time: true,
              course_qualification_level: { qualification: 'MSC' },
            }
          }
        }
      ]
    }

    const expectedOutput = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      courses: [
        {
          course_year_id: 101,
          course_id: 202,
          year_start: 2022,
          year_end: 2023,
          title: 'Computer Science',
          years: 3,
          code: 'CS101',
          part_time: false,
          qualification: 'BSC',
          course_coordinator: '.',
        },
        {
          course_year_id: 102,
          course_id: 203,
          year_start: 2023,
          year_end: 2024,
          title: 'Mathematics',
          years: 3,
          code: 'MATH101',
          part_time: true,
          qualification: 'MSC',
          course_coordinator: '.',
        }
      ]
    }

    const result = formatStudentCourses(student)

    expect(result).toEqual(expectedOutput)
  })
})
