const { School } = require ('../../models')

async function seedSchools() {
  const schools = await School.bulkCreate([
    { school_name: 'School of Arts, English, and Languages' },
    { school_name: 'School of History and Anthropology, Philosophy and Politics' },
    { school_name: 'School of Law' },
    { school_name: 'Queen\'s Business School' },
    { school_name: 'School of Social Sciences, Education and Social Work' },
    { school_name: 'School of Chemistry and Chemical Engineering' },
    { school_name: 'School of Electonics, Electrical Engineering and Computer Science' },
    { school_name: 'School of Mathematics and Physics' },
    { school_name: 'School of Mechanical and Aerospace Engineering' },
    { school_name: 'School of Natural and Built Environment' },
    { school_name: 'School of Psychology' },
    { school_name: 'School of Biological Sciences' },
    { school_name: 'School of Medicine, Dentistry and Biomedical Sciences' },
    { school_name: 'School of Nursing and Midwifery' },
    { school_name: 'School of Pharmacy' },
  ])

  return schools.reduce((acc, school) => ({ ...acc, [school.school_name] : school.id }), {})
}

module.exports = { seedSchools }