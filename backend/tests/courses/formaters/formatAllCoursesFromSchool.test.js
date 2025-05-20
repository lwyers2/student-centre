const { formatAllCoursesFromSchool } = require('../../../helper/formaters/course/formatAllCoursesFromSchool')

describe('formatAllCoursesFromSchool', () => {
  it('should correctly format courses retrieved when querying school', () => {
    const mockCourses = [
      {
        id: 1,
        title: 'Computer Science',
        code: 'CS101',
        course_qualification_level: {
          qualification: 'BSc',
        },
        course_school: {
          school_name: 'School of Computing',
        },
        part_time: true,
        years: 3,
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
      },
      {
        id: 2,
        title: 'Mathematics',
        code: 'MATH101',
        course_qualification_level: {
          qualification: 'MSc',
        },
        course_school: {
          school_name: 'School of Mathematics',
        },
        part_time: false,
        years: 2,
        course_course_year: [
          {
            id: 1,
            year_start: 2023,
            year_end: 2024,
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Sara',
              surname: 'Black',
            },
          },
        ],
      },
    ]

    const expectedOutput = [
      {
        id: 1,
        title: 'Computer Science',
        code: 'CS101',
        qualification: 'BSc',
        school: 'School of Computing',
        part_time: true,
        years: 3,
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
      },
      {
        id: 2,
        title: 'Mathematics',
        code: 'MATH101',
        qualification: 'MSc',
        school: 'School of Mathematics',
        part_time: false,
        years: 2,
        course_years: [
          {
            id: 1,
            year_start: 2023,
            year_end: 2024,
            course_coordinator: 'Dr. Sara Black',
          },
        ],
      },
    ]

    const result = formatAllCoursesFromSchool(mockCourses)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle courses with missing course years', () => {
    const mockCourses = [
      {
        id: 3,
        title: 'Physics',
        code: 'PHYS101',
        course_qualification_level: {
          qualification: 'BSc',
        },
        course_school: {
          school_name: 'School of Physics',
        },
        part_time: true,
        years: 3,
        course_course_year: [],
      },
    ]

    const expectedOutput = [
      {
        id: 3,
        title: 'Physics',
        code: 'PHYS101',
        qualification: 'BSc',
        school: 'School of Physics',
        part_time: true,
        years: 3,
        course_years: [],
      },
    ]

    const result = formatAllCoursesFromSchool(mockCourses)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing course school name', () => {
    const mockCourses = [
      {
        id: 4,
        title: 'Chemistry',
        code: 'CHEM101',
        course_qualification_level: {
          qualification: 'PhD',
        },
        course_school: {},
        part_time: false,
        years: 4,
        course_course_year: [
          {
            id: 1,
            year_start: 2025,
            year_end: 2026,
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Emily',
              surname: 'Gray',
            },
          },
        ],
      },
    ]

    const expectedOutput = [
      {
        id: 4,
        title: 'Chemistry',
        code: 'CHEM101',
        qualification: 'PhD',
        school: undefined,
        part_time: false,
        years: 4,
        course_years: [
          {
            id: 1,
            year_start: 2025,
            year_end: 2026,
            course_coordinator: 'Dr. Emily Gray',
          },
        ],
      },
    ]

    const result = formatAllCoursesFromSchool(mockCourses)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle courses with no years and users', () => {
    const mockCourses = [
      {
        id: 5,
        title: 'Computing Foundations',
        code: 'CSO101',
        course_qualification_level: {
          qualification: 'BSc',
        },
        course_school: {
          school_name: 'School of Computing',
        },
        part_time: true,
        years: 3,
        course_course_year: [],
      },
    ]

    const expectedOutput = [
      {
        id: 5,
        title: 'Computing Foundations',
        code: 'CSO101',
        qualification: 'BSc',
        school: 'School of Computing',
        part_time: true,
        years: 3,
        course_years: [],
      },
    ]

    const result = formatAllCoursesFromSchool(mockCourses)

    expect(result).toEqual(expectedOutput)
  })
})
