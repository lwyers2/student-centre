const { formatUserModulesFromCourseYear } = require('../../../helper/formaters/user/formatUserModulesFromCourseYear')

describe('formatUserModulesFromCourseYear', () => {
  it('should correctly format user and modules from course year', () => {
    const mockUser = {
      id: 1,
      prefix: 'Prof',
      forename: 'John',
      surname: 'Doe',
      user_module_user: [
        {
          id: 226,
          user_id: 1,
          module_id: 1,
          module_year_id: 74,
          user_module_module_year: {
            id: 74,
            year_start: 2021,
            module_id: 1,
            module_year_module_coordinator: {
              prefix: 'Prof',
              forename: 'John',
              surname: 'Doe'
            },
            module_year_semester: {
              id: 1,
              name: 'Autumn'
            },
            module_year_module_course: [
              {
                id: 230,
                course_id: 1,
                course_year_id: 1,
                module_id: 1,
                module_year_id: 74,
                required: 0
              }
            ],
            module_year_module: {
              id: 1,
              title: 'Introduction to Performing',
              year: 1,
              code: 'DRA0001',
              CATs: 20
            }
          }
        },
      ]
    }

    const formattedUser = formatUserModulesFromCourseYear(mockUser)

    console.log(formattedUser.modules[0])
    expect(formattedUser.user.id).toBe(1)
    expect(formattedUser.user.prefix).toBe('Prof')
    expect(formattedUser.user.forename).toBe('John')
    expect(formattedUser.user.surname).toBe('Doe')

    expect(formattedUser.modules).toHaveLength(1)
    expect(formattedUser.modules[0].module_id).toBe(1)
    expect(formattedUser.modules[0].module_year_id).toBe(74)
    expect(formattedUser.modules[0].title).toBe('Introduction to Performing')
    expect(formattedUser.modules[0].code).toBe('DRA0001')
    expect(formattedUser.modules[0].CATs).toBe(20)
    expect(formattedUser.modules[0].year).toBe(1)
    expect(formattedUser.modules[0].year_start).toBe(2021)
    expect(formattedUser.modules[0]['module_coordinator']).toBe('Prof. John Doe')
    expect(formattedUser.modules[0].semester).toBe('Autumn')
  })

  it('should handle missing module_year_module gracefully', () => {
    const mockUser = {
      id: 2,
      prefix: 'Mr',
      forename: 'Jane',
      surname: 'Smith',
      user_module_user: [
        {
          module_id: 102,
          module_year_id: 2024,
          user_module_module_year: {} // Missing module_year_module
        }
      ]
    }

    const formattedUser = formatUserModulesFromCourseYear(mockUser)

    expect(formattedUser.modules).toHaveLength(1)
    expect(formattedUser.modules[0].module_id).toBe(102)
    expect(formattedUser.modules[0].module_year_id).toBe(2024)
    expect(formattedUser.modules[0].title).toBeUndefined()
    expect(formattedUser.modules[0].code).toBeUndefined()
    expect(formattedUser.modules[0].CATs).toBeUndefined()
    expect(formattedUser.modules[0].year).toBeUndefined()
    expect(formattedUser.modules[0].module_coordinator).toBeUndefined()
    expect(formattedUser.modules[0].semester).toBeUndefined()
  })

  it('should handle missing module_year_semester gracefully', () => {
    const mockUser = {
      id: 3,
      prefix: 'Ms',
      forename: 'Emily',
      surname: 'Johnson',
      user_module_user: [
        {
          id: 226,
          user_id: 1,
          module_id: 1,
          module_year_id: 74,
          user_module_module_year: {
            id: 74,
            year_start: 2021,
            module_id: 1,
            module_year_module_coordinator: {
              prefix: 'Prof',
              forename: 'John',
              surname: 'Doe'
            },
            module_year_module: {
              id: 1,
              title: 'Introduction to Performing',
              year: 1,
              code: 'DRA0001',
              CATs: 20
            }
          }
        }
      ]
    }

    const formattedUser = formatUserModulesFromCourseYear(mockUser)

    expect(formattedUser.modules).toHaveLength(1)
    expect(formattedUser.modules[0].module_id).toBe(1)
    expect(formattedUser.modules[0].module_year_id).toBe(74)
    expect(formattedUser.modules[0].title).toBe('Introduction to Performing')
    expect(formattedUser.modules[0].code).toBe('DRA0001')
    expect(formattedUser.modules[0].CATs).toBe(20)
    expect(formattedUser.modules[0].year).toBe(1)
    expect(formattedUser.modules[0].year_start).toBe(2021)
    expect(formattedUser.modules[0].module_coordinator).toBe('Prof. John Doe')
    expect(formattedUser.modules[0].semester).toBeUndefined()
  })

  it('should handle missing user_module_user gracefully', () => {
    const mockUser = {
      id: 4,
      prefix: 'Dr',
      forename: 'George',
      surname: 'Williams',
      user_module_user: [] // No modules assigned
    }

    const formattedUser = formatUserModulesFromCourseYear(mockUser)

    expect(formattedUser.modules).toHaveLength(0)
  })

  it('should handle undefined user gracefully', () => {
    const mockUser = undefined

    const formattedUser = formatUserModulesFromCourseYear(mockUser)

    expect(formattedUser).toBeUndefined()
  })
})
