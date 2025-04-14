const { formatAllCourses } = require('../../../helper/formaters/course/formatAllCourses')

describe('formatAllCourses', () => {
  it('should correctly format an array of courses', () => {
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
      },
      {
        id: 2,
        title: 'Electrical Engineering',
        code: 'EE200',
        course_qualification_level: {
          qualification: 'MEng',
        },
        course_school: {
          school_name: 'School of Engineering',
        },
        part_time: false,
        years: 4,
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
      },
      {
        id: 2,
        title: 'Electrical Engineering',
        code: 'EE200',
        qualification: 'MEng',
        school: 'School of Engineering',
        part_time: false,
        years: 4,
      },
    ]

    const result = formatAllCourses(mockCourses)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle an empty array of courses', () => {
    const mockCourses = []

    const expectedOutput = []

    const result = formatAllCourses(mockCourses)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing optional values gracefully', () => {
    const mockCourses = [
      {
        id: 1,
        title: 'Law',
        code: 'LAW101',
        course_qualification_level: {
          qualification: 'LLB',
        },
        course_school: {
          school_name: 'School of Law',
        },
        part_time: undefined, // part_time is undefined
        years: undefined, // years is undefined
      },
    ]

    const expectedOutput = [
      {
        id: 1,
        title: 'Law',
        code: 'LAW101',
        qualification: 'LLB',
        school: 'School of Law',
        part_time: undefined, // part_time is undefined
        years: undefined, // years is undefined
      },
    ]

    const result = formatAllCourses(mockCourses)

    expect(result).toEqual(expectedOutput)
  })
})
