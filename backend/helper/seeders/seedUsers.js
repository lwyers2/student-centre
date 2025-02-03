const { User } = require('../../models')

async function seedUsers(roles) {
  const users = await User.bulkCreate([
    { prefix: 'Prof', forename: 'John', surname: 'Doe', email: 'john.doe@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date(Date.now()), date_updated: new Date(Date.now()), active: 1, role_id: roles['Teacher'], job_title: 'Professor' },
    { prefix: 'Prof', forename: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Professor' },
    { prefix: 'Prof', forename: 'Alice', surname: 'Johnson', email: 'alice.johnson@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Professor' },
    { prefix: 'Prof', forename: 'Sarah', surname: 'Ryan', email: 'sarah.ryan@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Professor' },
    { prefix: 'Prof', forename: 'Mark', surname: 'Smith', email: 'mark.smith@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Professor' },
    { prefix: 'Dr', forename: 'Sam', surname: 'Cave', email: 'sam.cave@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' },
    { prefix: 'Dr', forename: 'Anthony', surname: 'Johnstone', email: 'anthony.johnstone@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' },
    { prefix: 'Mr', forename: 'Douglas', surname: 'Pierce', email: 'douglas.pierce@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Admin'], job_title: 'Secreterial/Clerical' },
    { prefix: 'Mr', forename: 'Jason', surname: 'Molina', email: 'jason.molina@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-01-01T00:00:00Z'), date_updated: new Date('2024-01-01T00:00:00Z'), active: 1, role_id: roles['Admin'], job_title: 'Secreterial/Clerical' },
    { prefix: 'Mr', forename: 'Luke', surname: 'Wyers', email: 'lwyers3@gmail.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2024-12-24T16:47:52Z'), date_updated: new Date('2024-12-24T16:47:52Z'), active: 1, role_id: roles['Super User'], job_title: 'Site Admin' },
    { prefix: 'Mr', forename: 'Alan', surname: 'Sparhawke', email: 'alan.sparhawke@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2025-01-07T18:31:50Z'), date_updated: new Date('2025-01-07T18:31:51Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' },
    { prefix: 'Mr', forename: 'Stephen', surname: 'Merritt', email: 'stephen.merritt@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2025-01-07T18:33:06Z'), date_updated: new Date('2025-01-07T18:33:10Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' },
    { prefix: 'Mr', forename: 'Michael', surname: 'Gira', email: 'michael.gira@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2025-01-07T18:36:37Z'), date_updated: new Date('2025-01-07T18:36:38Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' },
    { prefix: 'Mr', forename: 'Tim', surname: 'Buckley', email: 'tim.buckley@example.com', password: '$2b$10$l6bMKcU.71tsz6sNkKMqbeodxfdhEe1Q9wtiFlDhbH9HaN3dvKxxO', date_created: new Date('2025-01-07T18:37:31Z'), date_updated: new Date('2025-01-07T18:37:32Z'), active: 1, role_id: roles['Teacher'], job_title: 'Reader' }
  ])
  return users.reduce(
    (acc, user) => ({
      ...acc,
      [user.email] : user.id,
    }),
    {}
  )
}

module.exports = { seedUsers }