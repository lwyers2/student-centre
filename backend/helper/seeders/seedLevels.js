const { Level } = require('../../models')

async function seedLevels() {
  const levels = await Level.bulkCreate([
    { level: '5' },
    { level: '6' },
    { level: '7' },
  ])

  return levels.reduce((acc, level) => ({ ...acc, [level.level]: level.id }), {})
}

module.exports = { seedLevels }