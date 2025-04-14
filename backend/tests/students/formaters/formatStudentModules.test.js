const { formatStudentModules } = require('../../../helper/formaters/student/formatStudentModules')

describe('formatStudentModules', () => {
  it('should correctly format student module data', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      student_student_module: [
        {
          result: 85,
          flagged: 0,
          resit: 0,
          module_id: 202,
          module_year_id: 101,
          student_id: 1,
          student_module_result_descriptor: {
            id: 1,
            descriptor: 'P'
          },
          student_module_module_year: {
            id: 101,
            module_id: 202,
            year_start: 2022,
            module_year_module_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith'
            },
            module_year_module: {
              id: 202,
              title: 'Computer Science',
              code: 'CS101',
              CATs: 20,
              year: 2022
            }
          },
        },
        {
          student_module_module_year: {
            id: 102,
            module_id: 203,
            year_start: 2023,
            module_year_module_coordinator: {
              prefix: 'Prof',
              forename: 'Bob',
              surname: 'Johnson'
            },
            module_year_module: {
              title: 'Mathematics',
              code: 'MATH101',
              CATs: 30,
              year: 2023,
              id: 203
            }
          },
          result: 90,
          student_module_result_descriptor: {
            id: 1,
            descriptor: 'P'
          },
          flagged: 0,
          resit: 0,
          module_id: 203,
          module_year_id: 102
        }
      ]
    }

    const expectedOutput = {
      modules: [
        {
          module_year_id: 101,
          module_id: 202,
          year_start: 2022,
          title: 'Computer Science',
          code: 'CS101',
          CATs: 20,
          year: 2022,
          result: 85,
          flagged: 0,
          resit: 0,
          module_coordinator: 'Dr. Alice Smith',
          result_descriptor: 'P'
        },
        {
          module_year_id: 102,
          module_id: 203,
          year_start: 2023,
          title: 'Mathematics',
          code: 'MATH101',
          CATs: 30,
          year: 2023,
          result: 90,
          flagged: 0,
          resit: 0,
          module_coordinator: 'Prof. Bob Johnson',
          result_descriptor: 'P'
        }
      ]
    }

    const result = formatStudentModules(student)

    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array for modules if no student_student_module data is provided', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      student_student_module: []
    }

    const expectedOutput = {

      modules: []
    }

    const result = formatStudentModules(student)

    expect(result).toEqual(expectedOutput)
  })

  it('should gracefully handle missing coordinator information', () => {
    const student = {
      id: 1,
      email: 'student@example.com',
      student_code: 'S12345',
      forename: 'John',
      surname: 'Doe',
      student_student_module: [
        {
          student_module_module_year: {
            id: 101,
            module_id: 202,
            year_start: 2022,
            module_year_module: {
              id: 202,
              title: 'Computer Science',
              code: 'CS101',
              CATs: 20,
              year: 2022
            }
          },
          result: 85,
          flagged: 0,
          resit: 0,
          module_id: 202,
          module_year_id: 101,
          student_module_result_descriptor: {
            id: 1,
            descriptor: 'P'
          },
        },
        {
          student_module_module_year: {
            id: 102,
            module_id: 203,
            year_start: 2023,

            module_year_module: {
              id: 203,
              title: 'Mathematics',
              code: 'MATH101',
              CATs: 30,
              year: 2023
            }
          },
          result: 90,
          flagged: 0,
          resit: 0,
          module_id:203,
          module_year_id: 102,
          student_module_result_descriptor: {
            id: 1,
            descriptor: 'P'
          },
        }
      ]
    }

    const expectedOutput = {

      modules: [
        {
          module_year_id: 101,
          module_id: 202,
          year_start: 2022,
          title: 'Computer Science',
          code: 'CS101',
          CATs: 20,
          year: 2022,
          result: 85,
          flagged: 0,
          resit: 0,
          module_coordinator: 'undefined. undefined undefined',
          result_descriptor: 'P'
        },
        {
          module_year_id: 102,
          module_id: 203,
          year_start: 2023,
          title: 'Mathematics',
          code: 'MATH101',
          CATs: 30,
          year: 2023,
          result: 90,
          flagged: 0,
          resit: 0,
          module_coordinator: 'undefined. undefined undefined',
          result_descriptor: 'P'
        }
      ]
    }

    const result = formatStudentModules(student)

    expect(result).toEqual(expectedOutput)
  })
})
