const { Semester } = require('../../models')

async function seedSemesters() {
  const semesters = await Semester.bulkCreate([
    { name: 'Autumn' },
    { name: 'Spring' },
    { name: 'Summer' },
    { name: 'Full Year' },
  ])
  return semesters.reduce((acc, semester) => ({
    ...acc,
    [`${semester.name}`]: semester.id
  }), {})
}

module.exports = { seedSemesters }
