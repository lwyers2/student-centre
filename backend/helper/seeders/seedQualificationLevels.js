const { QualificationLevel } = require('../../models')

async function seedQualificationLevels(levels) {
  const qualificationLevels = await QualificationLevel.bulkCreate ([
    { level_id: levels['5'], qualification: 'BA' },
    { level_id: levels['5'], qualification: 'BSc' },
    { level_id: levels['5'], qualification: 'BEd' },
    { level_id: levels['5'], qualification: 'MA' },
    { level_id: levels['6'], qualification: 'MSc' },
    { level_id: levels['6'], qualification: 'MEng' },
    { level_id: levels['6'], qualification: 'MFA' },
    { level_id: levels['6'], qualification: 'LLM' },
    { level_id: levels['7'], qualification: 'EdD' },
    { level_id: levels['7'], qualification: 'DBA' },
    { level_id: levels['7'], qualification: 'EngD' },
    { level_id: levels['7'], qualification: 'Psy.D.' },
    { level_id: levels['7'], qualification: 'DProf' },
    { level_id: levels['5'], qualification: 'BMus' },
    { level_id: levels['6'], qualification: 'MRes' },
  ])
  return qualificationLevels.reduce(
    (acc, qualificationLevel) => ({
      ...acc,
      [qualificationLevel.qualification]: qualificationLevel.id,
    }),
    {}
  )
}

module.exports = { seedQualificationLevels }