const { formatAllUsers } = require('../../../helper/formaters/user/formatAllUsers')

describe('formatAllUsers', () => {
  it('should correctly format an array of users', () => {
    const mockUsers = [
      {
        id: 1,
        forename: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        active: 1,
        date_created: '2023-01-01',
        date_updated: '2023-02-01',
        prefix: 'Mr',
        is_active: true,
        user_user_school: [
          {
            user_school_school: { school_name: 'University A', id: 1 }
          }
        ],
        user_role: { name: 'Admin' }
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Check if the formatted users contain the expected properties
    expect(formattedUsers[0]).toHaveProperty('id', 1)
    expect(formattedUsers[0]).toHaveProperty('name', 'Mr. John Doe')
    expect(formattedUsers[0]).toHaveProperty('role', 'Admin')
    expect(formattedUsers[0].schools).toHaveLength(1)
    expect(formattedUsers[0].schools[0]).toHaveProperty('school', 'University A')
    expect(formattedUsers[0].schools[0]).toHaveProperty('school_id', 1)
  })

  it('should handle empty user_user_school gracefully', () => {
    const mockUsers = [
      {
        id: 2,
        forename: 'Jane',
        surname: 'Smith',
        prefix: 'Ms',
        email: 'jane.smith@example.com',
        user_role: { name: 'Student' },
        user_user_school: [] // No associated schools
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Ensure schools is an empty array if no user_user_school
    expect(formattedUsers[0].schools).toHaveLength(0)
  })

  it('should handle missing user_user_school gracefully', () => {
    const mockUsers = [
      {
        id: 3,
        forename: 'Anna',
        surname: 'Taylor',
        prefix: 'Dr',
        email: 'anna.taylor@example.com',
        user_role: { name: 'Lecturer' },
        // user_user_school is missing
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Ensure schools is an empty array if user_user_school is missing
    expect(formattedUsers[0].schools).toHaveLength(0)
  })

  it('should return an empty array for users without a role', () => {
    const mockUsers = [
      {
        id: 4,
        forename: 'Jake',
        surname: 'Wilson',
        prefix: 'Mr',
        email: 'jake.wilson@example.com',
        user_user_school: [{ user_school_school: { school_name: 'University C', id: 3 } }],
        user_role: null // No role
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Ensure role is handled properly when missing
    expect(formattedUsers[0].role).toBeUndefined()
  })

  it('should handle null or undefined values gracefully', () => {
    const mockUsers = [
      {
        id: 5,
        forename: 'Bob',
        surname: 'Johnson',
        prefix: null,
        email: 'bob.johnson@example.com',
        user_role: null, // null role
        user_user_school: undefined, // undefined school
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Check if the user is formatted correctly with null/undefined values
    expect(formattedUsers[0]).toEqual({
      id: 5,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      active: null,
      date_created: null,
      date_updated: null,
      is_active: false,
      schools: [],
      role: undefined,
    })
  })

  it('should handle empty string values gracefully', () => {
    const mockUsers = [
      {
        id: 6,
        forename: '',
        surname: '',
        email: '',
        user_role: { name: 'Guest' },
        user_user_school: [{ user_school_school: { school_name: '', id: 0 } }],
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Check if the user fields are handled when they are empty strings
    expect(formattedUsers[0].name).toBe('')
    expect(formattedUsers[0].email).toBe('')
    expect(formattedUsers[0].schools[0].school_name).toBeUndefined()
  })

  it('should return empty schools array when user_user_school is missing', () => {
    const mockUsers = [
      {
        id: 7,
        forename: 'Charlie',
        surname: 'Brown',
        email: 'charlie.brown@example.com',
        user_role: { name: 'Instructor' },
        user_user_school: [], // No school
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Ensure schools is an empty array when no schools are associated
    expect(formattedUsers[0].schools).toEqual([])
  })

  it('should return empty array for users with no user_user_role', () => {
    const mockUsers = [
      {
        id: 8,
        forename: 'Sarah',
        surname: 'Connor',
        email: 'sarah.connor@example.com',
        user_role: undefined, // No role
        user_user_school: [{ user_school_school: { school_name: 'Tech University', id: 4 } }]
      }
    ]

    const formattedUsers = formatAllUsers(mockUsers)

    // Ensure role is handled properly when missing
    expect(formattedUsers[0].role).toBeUndefined()
  })
})
