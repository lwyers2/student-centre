const { formatOneStudentOneModuleFromCourseYear } = require('../../../helper/formaters/student/formatOneStudentOneModuleFromCourseYear') // Adjust the import based on your file structure

describe('formatOneStudentOneModuleFromCourseYear', () => {
  it('should return an empty object if student has no course data', () => {
    const student = {
      student_student_course: []
    }

    const result = formatOneStudentOneModuleFromCourseYear(student)

    expect(result).toEqual({})
  })

  it('should format student and course data correctly', () => {
    const student = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      student_code: 'S12345',
      student_student_course: [
        {
          course_id: 1001,
          course_year_id: 2021,
          student_course_course_year: {
            year_start: 2021,
            year_end: 2022,
            course_year_course: {
              title: 'Computer Science',
              code: 'CS101',
              part_time: false,
              course_qualification_level: {
                qualification: 'Bachelor'
              }
            },
            course_year_module_course: [
              {
                module_id: 1,
                module_year_id: 2021,
                module_course_module: {
                  title: 'Algorithms',
                  code: 'CS200',
                  CATs: 20,
                  year: 2021,
                  module_student_module: [
                    {
                      result: 'A',
                      flagged: 0,
                      resit: 0,
                      student_module_result_descriptor: {
                        descriptor: 'Excellent'
                      }
                    }
                  ]
                }
              },
              {
                module_id: 2,
                module_year_id: 2021,
                module_course_module: {
                  title: 'Data Structures',
                  code: 'CS201',
                  CATs: 20,
                  year: 2021,
                  module_student_module: [
                    {
                      result: 'B',
                      flagged: 1,
                      resit: 0,
                      student_module_result_descriptor: {
                        descriptor: 'Good'
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }

    const result = formatOneStudentOneModuleFromCourseYear(student)

    // Check the structure of the returned object
    expect(result).toHaveProperty('student')
    expect(result.student).toHaveProperty('id', 1)
    expect(result.student).toHaveProperty('forename', 'John')
    expect(result.student).toHaveProperty('surname', 'Doe')
    expect(result.student).toHaveProperty('code', 'S12345')

    expect(result).toHaveProperty('course')
    expect(result.course).toHaveProperty('course_id', 1001)
    expect(result.course).toHaveProperty('course_year_id', 2021)
    expect(result.course).toHaveProperty('year_start', 2021)
    expect(result.course).toHaveProperty('year_end', 2022)
    expect(result.course).toHaveProperty('title', 'Computer Science')
    expect(result.course).toHaveProperty('code', 'CS101')

    expect(result).toHaveProperty('modules')
    expect(result.modules).toBeInstanceOf(Array)
    expect(result.modules.length).toBe(2)

    // Check the properties of each module
    const module1 = result.modules[0]
    expect(module1).toHaveProperty('module_id', 1)
    expect(module1).toHaveProperty('module_year_id', 2021)
    expect(module1).toHaveProperty('title', 'Algorithms')
    expect(module1).toHaveProperty('code', 'CS200')
    expect(module1).toHaveProperty('CATs', 20)
    expect(module1).toHaveProperty('year', 2021)
    expect(module1).toHaveProperty('result', 'A')
    expect(module1).toHaveProperty('flagged', 0)
    expect(module1).toHaveProperty('resit', 0)
    expect(module1).toHaveProperty('result_descriptor', 'Excellent')

    const module2 = result.modules[1]
    expect(module2).toHaveProperty('module_id', 2)
    expect(module2).toHaveProperty('module_year_id', 2021)
    expect(module2).toHaveProperty('title', 'Data Structures')
    expect(module2).toHaveProperty('code', 'CS201')
    expect(module2).toHaveProperty('CATs', 20)
    expect(module2).toHaveProperty('year', 2021)
    expect(module2).toHaveProperty('result', 'B')
    expect(module2).toHaveProperty('flagged', 1)
    expect(module2).toHaveProperty('resit', 0)
    expect(module2).toHaveProperty('result_descriptor', 'Good')
  })

  it('should handle modules with missing data gracefully', () => {
    const student = {
      id: 2,
      forename: 'Jane',
      surname: 'Smith',
      student_code: 'S67890',
      student_student_course: [
        {
          course_id: 1002,
          course_year_id: 2022,
          student_course_course_year: {
            year_start: 2022,
            year_end: 2023,
            course_year_course: {
              title: 'Mathematics',
              code: 'MATH101',
              part_time: true,
              course_qualification_level: {
                qualification: 'Master'
              }
            },
            course_year_module_course: [
              {
                module_id: 3,
                module_year_id: 2022,
                module_course_module: {
                  title: 'Calculus',
                  code: 'MATH200',
                  CATs: 30,
                  year: 2022,
                  module_student_module: [
                    {
                      result: null,
                      flagged: null,
                      resit: null,
                      student_module_result_descriptor: {
                        descriptor: null
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }

    const result = formatOneStudentOneModuleFromCourseYear(student)

    const module = result.modules[0]
    expect(module).toHaveProperty('result', null)
    expect(module).toHaveProperty('flagged', 0)
    expect(module).toHaveProperty('resit', 0)
    expect(module).toHaveProperty('result_descriptor', null)
  })
})
