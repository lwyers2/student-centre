const { Classification } = require('../../models')

async function seedClassifications(levels) {
  const classifications = [
    { range_start: 0, range_end: 39, classification: 'fail', level_id: levels['5'] },
    { range_start: 40, range_end: 49, classification: 'Third-Class Honours', level_id: levels['5'] },
    { range_start: 50, range_end: 59, classification: '2:2', level_id: levels['5'] },
    { range_start: 60, range_end: 69, classification: '2:1', level_id: levels['5'] },
    { range_start: 70, range_end: 100, classification: 'First-Class Honors', level_id: levels['5'] },
    { range_start: 0, range_end: 49, classification: 'Fail', level_id: levels['6'] },
    { range_start: 50, range_end: 59, classification: 'Pass', level_id: levels['6'] },
    { range_start: 60, range_end: 69, classification: 'Commendation', level_id: levels['6'] },
    { range_start: 70, range_end: 100, classification: 'Distinction', level_id: levels['6'] },
  ]

  await Classification.bulkCreate(classifications)
}

module.exports = { seedClassifications }