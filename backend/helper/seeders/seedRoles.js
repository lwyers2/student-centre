const { Role } = require('../../models')

async function seedRoles() {
  const roles = await Role.bulkCreate([
    { name: 'Admin' },
    { name: 'Teacher' },
    { name: 'Super User' },
  ])
  return roles.reduce((acc, role) => ({ ...acc, [role.name] : role.id }), {})
}

module.exports = { seedRoles }