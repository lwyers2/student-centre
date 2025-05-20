const { formatAllStudentData } = require('../../../helper/formaters/student/formatAllStudentData')

describe('formatAllStudentData', () => {
  it('should correctly format student and course data', () => {
    const mockStudent = {
      id: 1,
      email: 'john.doe@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      student_student_course: [
        {
          course_year_id: 101,
          course_id: 1001,
          student_course_course_year: {
            year_start: 2022,
            year_end: 2026,
            course_year_course_coordinator: {
              prefix: 'Dr.',
              forename: 'Alice',
              surname: 'Johnson',
            },
            course_year_course: {
              id: 1001,
              title: 'Computer Science',
              code: 'CS101',
              years: 4,
              course_qualification_level: {
                qualification: 'BSc'
              },
            }
          }
        }
      ],
      student_student_module: [
        {
          id: 37,
          student_id: 1,
          module_id: 4001,
          result: 85,
          flagged: false,
          module_year_id: 301,
          resit: false,
          student_module_result_descriptor: {
            id: 1,
            descriptor: 'P',
          },
          student_module_module_year: {
            id: 301,
            module_id: 4001,
            year_start: 2021,
            semester_id: 1,
            module_coordinator_id: 1,
            module_year_semester: {
              name: 'Spring',
            },
            module_year_module_coordinator: {
              prefix: 'Dr',
              forename: 'Bob',
              surname: 'Smith',
            },
            module_year_module: {
              id: 4001,
              title: 'Algorithms',
              year: 2,
              code: 'CS200',
              CATs: 20,
            },
            module_year_module_course: [
              {
                id: 230,
                course_id: 1001,
                course_year_id: 101,
                module_id: 4001,
                module_year_id: 301,
                required: false
              },
            ]
          }
        },
      ]
    }

    const formattedStudentData = formatAllStudentData(mockStudent)

    expect(formattedStudentData.student.id).toBe(1)
    expect(formattedStudentData.student.email).toBe('john.doe@example.com')
    expect(formattedStudentData.student.student_code).toBe('S12345')
    expect(formattedStudentData.student.forename).toBe('John')
    expect(formattedStudentData.student.surname).toBe('Doe')

    expect(formattedStudentData.courses).toHaveLength(1)
    expect(formattedStudentData.courses[0].course_year_id).toBe(101)
    expect(formattedStudentData.courses[0].title).toBe('Computer Science')
    expect(formattedStudentData.courses[0].code).toBe('CS101')
    expect(formattedStudentData.courses[0].year_start).toBe(2022)
    expect(formattedStudentData.courses[0].year_end).toBe(2026)
    expect(formattedStudentData.courses[0].qualification).toBe('BSc')
    expect(formattedStudentData.courses[0].part_time).toBe('FY')
    expect(formattedStudentData.courses[0].course_coordinator).toBe('Dr. Alice Johnson')

    expect(formattedStudentData.courses[0].modules).toHaveLength(1)
    expect(formattedStudentData.courses[0].modules[0].module_year_id).toBe(301)
    expect(formattedStudentData.courses[0].modules[0].module_id).toBe(4001)
    expect(formattedStudentData.courses[0].modules[0].title).toBe('Algorithms')
    expect(formattedStudentData.courses[0].modules[0].code).toBe('CS200')
    expect(formattedStudentData.courses[0].modules[0].year).toBe(2)
    expect(formattedStudentData.courses[0].modules[0].CATs).toBe(20)
    expect(formattedStudentData.courses[0].modules[0].semester).toBe('Spring')
    expect(formattedStudentData.courses[0].modules[0].module_coordinator).toBe('Dr. Bob Smith')
    expect(formattedStudentData.courses[0].modules[0].result).toBe(85)
    expect(formattedStudentData.courses[0].modules[0].flagged).toBe(false)
    expect(formattedStudentData.courses[0].modules[0].resit).toBe(false)
  })

  it('should return empty arrays for courses and modules when no data is provided', () => {
    const mockStudent = {
      id: 2,
      email: 'jane.doe@example.com',
      student_code: 'S67890',
      forename: 'Jane',
      surname: 'Doe',
      student_student_course: [],
      student_student_module: []
    }

    const formattedStudentData = formatAllStudentData(mockStudent)

    expect(formattedStudentData.student.id).toBe(2)
    expect(formattedStudentData.student.email).toBe('jane.doe@example.com')
    expect(formattedStudentData.student.student_code).toBe('S67890')
    expect(formattedStudentData.student.forename).toBe('Jane')
    expect(formattedStudentData.student.surname).toBe('Doe')

    expect(formattedStudentData.courses).toHaveLength(0)
  })

  it('should handle missing student_course_course_year and student_module', () => {
    const mockStudent = {
      id: 3,
      email: 'sam.smith@example.com',
      student_code: 'S11223',
      forename: 'Sam',
      surname: 'Smith',
      student_student_course: [
        {
          course_year_id: 102,
          course_id: 1002,
          student_course_course_year: null
        }
      ],
      student_student_module: [
        {
          module_year_id: 302,
          result: 90,
          flagged: false,
          resit: false,
          student_module_result_descriptor: {
            id: 2,
            descriptor: 'P',
          },
          student_module_module_year: {
            module_year_module: null
          }
        }
      ]
    }

    const formattedStudentData = formatAllStudentData(mockStudent)

    expect(formattedStudentData.student.id).toBe(3)
    expect(formattedStudentData.student.email).toBe('sam.smith@example.com')
    expect(formattedStudentData.student.student_code).toBe('S11223')
    expect(formattedStudentData.student.forename).toBe('Sam')
    expect(formattedStudentData.student.surname).toBe('Smith')

    expect(formattedStudentData.courses).toHaveLength(1)
    expect(formattedStudentData.courses[0].course_year_id).toBe(102)
    expect(formattedStudentData.courses[0].course_coordinator).toBeUndefined()

    expect(formattedStudentData.courses[0].modules).toHaveLength(0)
  })

  it('should handle courses with missing course_year_course', () => {
    const mockStudent = {
      id: 4,
      email: 'david.brown@example.com',
      student_code: 'S44556',
      forename: 'David',
      surname: 'Brown',
      student_student_course: [
        {
          course_year_id: 103,
          course_id: 1003,
          student_course_course_year: {
            course_year_course: null
          }
        }
      ],
      student_student_module: []
    }

    const formattedStudentData = formatAllStudentData(mockStudent)

    expect(formattedStudentData.student.id).toBe(4)
    expect(formattedStudentData.student.email).toBe('david.brown@example.com')
    expect(formattedStudentData.student.student_code).toBe('S44556')
    expect(formattedStudentData.student.forename).toBe('David')
    expect(formattedStudentData.student.surname).toBe('Brown')

    expect(formattedStudentData.courses).toHaveLength(1)
    expect(formattedStudentData.courses[0].course_year_id).toBe(103)
    expect(formattedStudentData.courses[0].title).toBe('Unknown Course')
    expect(formattedStudentData.courses[0].course_coordinator).toBeUndefined()
  })

  it('should handle missing module_year_semester', () => {
    const mockStudent = {
      id: 5,
      email: 'lily.white@example.com',
      student_code: 'S78901',
      forename: 'Lily',
      surname: 'White',
      student_student_course: [
        {
          course_year_id: 104,
          course_id: 1004,
          student_course_course_year: {
            year_start: 2023,
            year_end: 2027,
            course_year_course: {
              id: 2004,
              title: 'Mathematics',
              code: 'MATH101',
              years: 4,
              course_qualification_level: {
                qualification: 'BSc'
              },
              course_year_course_coordinator: {
                prefix: 'Prof.',
                forename: 'Charlie',
                surname: 'Green',
              }
            }
          }
        }
      ],
      student_student_module: [
        {
          module_year_id: 303,
          result: 75,
          flagged: true,
          resit: true,
          student_module_result_descriptor: {
            id: 3,
            descriptor: 'P',
          },
          student_module_module_year: {
            module_year_module: {
              id: 5001,
              title: 'Calculus I',
              code: 'MATH200',
              year: 1,
              CATs: 10,
              module_year_semester: null,
              module_year_module_coordinator: {
                prefix: 'Dr.',
                forename: 'Eve',
                surname: 'Black',
              }
            },
            module_year_module_course: [
              {
                id: 230,
                course_id: 1004,
                course_year_id: 104,
                module_id: 5001,
                module_year_id: 303,
                required: false
              },
            ]
          }
        }
      ]
    }

    const formattedStudentData = formatAllStudentData(mockStudent)

    expect(formattedStudentData.student.id).toBe(5)
    expect(formattedStudentData.student.email).toBe('lily.white@example.com')
    expect(formattedStudentData.student.student_code).toBe('S78901')
    expect(formattedStudentData.student.forename).toBe('Lily')
    expect(formattedStudentData.student.surname).toBe('White')

    expect(formattedStudentData.courses).toHaveLength(1)
    expect(formattedStudentData.courses[0].course_year_id).toBe(104)
    expect(formattedStudentData.courses[0].title).toBe('Mathematics')

    expect(formattedStudentData.courses[0].modules).toHaveLength(1)
    expect(formattedStudentData.courses[0].modules[0].module_year_id).toBe(303)
    expect(formattedStudentData.courses[0].modules[0].module_id).toBe(5001)
    expect(formattedStudentData.courses[0].modules[0].title).toBe('Calculus I')
    expect(formattedStudentData.courses[0].modules[0].semester).toBeNull()
  })
})
