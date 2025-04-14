const { formatOneCourse } = require('../../../helper/formaters/course/formatOneCourse')

describe('formatOneCourse', () => {
  it('should correctly format a course with users and course years', () => {
    const mockCourse = {
      id: 1,
      title: 'Computer Science',
      code: 'CS101',
      course_qualification_level: {
        qualification: 'BSc',
      },
      course_school: {
        school_name: 'School of Computing',
        id: 101,
      },
      part_time: true,
      years: 3,
      course_user_course: [
        {
          user_course_user: {
            id: 1,
            forename: 'Jane',
            surname: 'Smith',
            prefix: 'Dr',
            user_role: {
              name: 'Instructor',
            },
          },
        },
        {
          user_course_user: {
            id: 2,
            forename: 'John',
            surname: 'Doe',
            prefix: 'Prof',
            user_role: {
              name: 'Lecturer',
            },
          },
        },
        {
          user_course_user: {
            id: 1,
            forename: 'Jane',
            surname: 'Smith',
            prefix: 'Dr',
            user_role: {
              name: 'Instructor',
            },
          },
        }, // Duplicate user
      ],
      course_course_year: [
        {
          id: 1,
          year_start: 2024,
          year_end: 2025,
          course_year_course_coordinator: {
            prefix: 'Dr',
            forename: 'Alice',
            surname: 'Brown',
          },
        },
        {
          id: 2,
          year_start: 2025,
          year_end: 2026,
          course_year_course_coordinator: {
            prefix: 'Prof',
            forename: 'Bob',
            surname: 'Green',
          },
        },
      ],
    }

    const expectedOutput = {
      course: {
        id: 1,
        title: 'Computer Science',
        code: 'CS101',
        qualification: 'BSc',
        school: 'School of Computing',
        school_id: 101,
        part_time: true,
        years: 3,
      },
      course_years: [
        {
          id: 1,
          year_start: 2024,
          year_end: 2025,
          course_coordinator: 'Dr. Alice Brown',
        },
        {
          id: 2,
          year_start: 2025,
          year_end: 2026,
          course_coordinator: 'Prof. Bob Green',
        },
      ],
      users: [
        {
          id: 1,
          forename: 'Jane',
          surname: 'Smith',
          prefix: 'Dr',
          role: 'Instructor',
        },
        {
          id: 2,
          forename: 'John',
          surname: 'Doe',
          prefix: 'Prof',
          role: 'Lecturer',
        },
      ],
    }

    const result = formatOneCourse(mockCourse)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing course years gracefully', () => {
    const mockCourse = {
      id: 1,
      title: 'Biology',
      code: 'BIO101',
      course_qualification_level: {
        qualification: 'BSc',
      },
      course_school: {
        school_name: 'School of Biology',
        id: 102,
      },
      part_time: false,
      years: 3,
      course_user_course: [
        {
          user_course_user: {
            id: 1,
            forename: 'Alice',
            surname: 'Taylor',
            prefix: 'Dr',
            user_role: {
              name: 'Instructor',
            },
          },
        },
      ],
      course_course_year: [],
    }

    const expectedOutput = {
      course: {
        id: 1,
        title: 'Biology',
        code: 'BIO101',
        qualification: 'BSc',
        school: 'School of Biology',
        school_id: 102,
        part_time: false,
        years: 3,
      },
      course_years: [],
      users: [
        {
          id: 1,
          forename: 'Alice',
          surname: 'Taylor',
          prefix: 'Dr',
          role: 'Instructor',
        },
      ],
    }

    const result = formatOneCourse(mockCourse)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing user roles gracefully', () => {
    const mockCourse = {
      id: 1,
      title: 'Mathematics',
      code: 'MATH101',
      course_qualification_level: {
        qualification: 'MSc',
      },
      course_school: {
        school_name: 'School of Mathematics',
        id: 103,
      },
      part_time: true,
      years: 2,
      course_user_course: [
        {
          user_course_user: {
            id: 1,
            forename: 'Tom',
            surname: 'White',
            prefix: 'Dr',
            user_role: null, // No role assigned
          },
        },
      ],
      course_course_year: [
        {
          id: 1,
          year_start: 2023,
          year_end: 2024,
          course_year_course_coordinator: {
            prefix: 'Prof',
            forename: 'Sara',
            surname: 'Black',
          },
        },
      ],
    }

    const expectedOutput = {
      course: {
        id: 1,
        title: 'Mathematics',
        code: 'MATH101',
        qualification: 'MSc',
        school: 'School of Mathematics',
        school_id: 103,
        part_time: true,
        years: 2,
      },
      course_years: [
        {
          id: 1,
          year_start: 2023,
          year_end: 2024,
          course_coordinator: 'Prof. Sara Black',
        },
      ],
      users: [
        {
          id: 1,
          forename: 'Tom',
          surname: 'White',
          prefix: 'Dr',
          role: null, // Role is null
        },
      ],
    }

    const result = formatOneCourse(mockCourse)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle empty user lists gracefully', () => {
    const mockCourse = {
      id: 1,
      title: 'Chemistry',
      code: 'CHEM101',
      course_qualification_level: {
        qualification: 'PhD',
      },
      course_school: {
        school_name: 'School of Chemistry',
        id: 104,
      },
      part_time: false,
      years: 4,
      course_user_course: [], // No users
      course_course_year: [
        {
          id: 1,
          year_start: 2026,
          year_end: 2027,
          course_year_course_coordinator: {
            prefix: 'Dr',
            forename: 'Emily',
            surname: 'Gray',
          },
        },
      ],
    }

    const expectedOutput = {
      course: {
        id: 1,
        title: 'Chemistry',
        code: 'CHEM101',
        qualification: 'PhD',
        school: 'School of Chemistry',
        school_id: 104,
        part_time: false,
        years: 4,
      },
      course_years: [
        {
          id: 1,
          year_start: 2026,
          year_end: 2027,
          course_coordinator: 'Dr. Emily Gray',
        },
      ],
      users: [], // No users
    }

    const result = formatOneCourse(mockCourse)

    expect(result).toEqual(expectedOutput)
  })
})
