const { UserSchool } = require('../../models')

async function seedUserSchools(users, schools) {
  const userSchools = [
    { user_id: users['john.doe@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['jane.smith@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['alice.johnson@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['sarah.ryan@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['mark.smith@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['michael.gira@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['tim.buckley@example.com'], school_id: schools['School of Arts, English, and Languages'] },
    { user_id: users['sam.cave@example.com'], school_id: schools['School of Arts, English, and Languages'] },
  ]
  await UserSchool.bulkCreate(userSchools)
}

module.exports = { seedUserSchools }