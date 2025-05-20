const { formatUsersFromModule } = require('../../../helper/formaters/user/formatUsersFromModule') // Adjust path as necessary

describe('formatUsersFromModule', () => {
  it('should correctly format admin and teaching staff details', () => {
    const mockUsers = [
      {
        id: 1,
        prefix: 'Dr',
        forename: 'John',
        surname: 'Doe',
        user_role: {
          name: 'Admin'
        }
      },
      {
        id: 2,
        prefix: 'Ms',
        forename: 'Jane',
        surname: 'Smith',
        user_role: {
          name: 'Teacher'
        }
      },
      {
        id: 3,
        prefix: 'Mr',
        forename: 'George',
        surname: 'Williams',
        user_role: {
          name: 'Admin'
        }
      }
    ]

    const formattedUsers = formatUsersFromModule(mockUsers)

    expect(formattedUsers.admin_staff).toHaveLength(2)
    expect(formattedUsers.admin_staff[0].id).toBe(1)
    expect(formattedUsers.admin_staff[0].name).toBe('Dr John Doe')
    expect(formattedUsers.admin_staff[1].id).toBe(3)
    expect(formattedUsers.admin_staff[1].name).toBe('Mr George Williams')

    expect(formattedUsers.teaching_staff).toHaveLength(1)
    expect(formattedUsers.teaching_staff[0].id).toBe(2)
    expect(formattedUsers.teaching_staff[0].name).toBe('Ms Jane Smith')
  })

  it('should handle users with missing roles', () => {
    const mockUsers = [
      {
        id: 1,
        prefix: 'Dr',
        forename: 'John',
        surname: 'Doe',
        user_role: {
          name: 'Admin'
        }
      },
      {
        id: 2,
        prefix: 'Ms',
        forename: 'Jane',
        surname: 'Smith',
        user_role: {}
      }
    ]

    const formattedUsers = formatUsersFromModule(mockUsers)

    expect(formattedUsers.admin_staff).toHaveLength(1)
    expect(formattedUsers.admin_staff[0].id).toBe(1)
    expect(formattedUsers.admin_staff[0].name).toBe('Dr John Doe')

    expect(formattedUsers.teaching_staff).toHaveLength(0)
  })

  it('should handle empty user array', () => {
    const mockUsers = []

    const formattedUsers = formatUsersFromModule(mockUsers)

    expect(formattedUsers.admin_staff).toHaveLength(0)
    expect(formattedUsers.teaching_staff).toHaveLength(0)
  })
})
