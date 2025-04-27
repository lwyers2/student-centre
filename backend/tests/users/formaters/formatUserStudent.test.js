const { formatUserStudents } = require('../../../helper/formaters/user/formatUserStudents') // Adjust path as necessary

describe('formatUserStudents', () => {
  it('should correctly format user and student details', () => {
    const mockUser = {
      id: 1,
      prefix: 'Dr',
      forename: 'John',
      surname: 'Doe',
      user_module_user: [
        {
          user_module_module_year: {
            id: 1001,
            module_year: {
              title: 'Computer Science 101',
              code: 'CS101',
              years: [2021, 2022, 2023]
            },
            module_year_student_module: [
              {
                student_module_student: {
                  id: 201,
                  forename: 'Alice',
                  surname: 'Brown'
                }
              },
              {
                student_module_student: {
                  id: 202,
                  forename: 'Bob',
                  surname: 'Green'
                }
              }
            ]
          }
        },
        {
          user_module_module_year: {
            id: 1002,
            module_year: {
              title: 'Mathematics 101',
              code: 'MATH101',
              years: [2022, 2023]
            },
            module_year_student_module: [
              {
                student_module_student: {
                  id: 203,
                  forename: 'Charlie',
                  surname: 'Davis'
                }
              }
            ]
          }
        }
      ]
    }

    const formattedUser = formatUserStudents(mockUser)

    // Check user info
    expect(formattedUser.user.id).toBe(1)
    expect(formattedUser.user.prefix).toBe('Dr')
    expect(formattedUser.user.forename).toBe('John')
    expect(formattedUser.user.surname).toBe('Doe')

    // Check students
    expect(formattedUser.students).toHaveLength(3)

    const firstStudent = formattedUser.students[0]
    expect(firstStudent.id).toBe(201)
    expect(firstStudent.forename).toBe('Alice')
    expect(firstStudent.surname).toBe('Brown')

    const secondStudent = formattedUser.students[1]
    expect(secondStudent.id).toBe(202)
    expect(secondStudent.forename).toBe('Bob')
    expect(secondStudent.surname).toBe('Green')

    const thirdStudent = formattedUser.students[2]
    expect(thirdStudent.id).toBe(203)
    expect(thirdStudent.forename).toBe('Charlie')
    expect(thirdStudent.surname).toBe('Davis')
  })

  it('should handle missing student modules gracefully', () => {
    const mockUser = {
      id: 2,
      prefix: 'Ms',
      forename: 'Jane',
      surname: 'Smith',
      user_module_user: [
        {
          user_module_module_year: {
            id: 1003,
            module_year: {
              title: 'Physics 101',
              code: 'PHYS101',
              years: [2021]
            },
            module_year_student_module: [] // No students in this module
          }
        }
      ]
    }

    const formattedUser = formatUserStudents(mockUser)

    // Check user info
    expect(formattedUser.user.id).toBe(2)
    expect(formattedUser.user.prefix).toBe('Ms')
    expect(formattedUser.user.forename).toBe('Jane')
    expect(formattedUser.user.surname).toBe('Smith')

    // Check students (should be empty)
    expect(formattedUser.students).toHaveLength(0)
  })

  it('should handle missing user_module_user gracefully', () => {
    const mockUser = {
      id: 3,
      prefix: 'Dr',
      forename: 'George',
      surname: 'Williams',
      user_module_user: [] // No modules
    }

    const formattedUser = formatUserStudents(mockUser)

    expect(formattedUser.students).toHaveLength(0) // No students
  })
})
