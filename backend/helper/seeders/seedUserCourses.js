const { UserCourse } = require('../../models')

async function seedUserCourses(users, courseYears, courses) {
  const userCourses = [
    { user_id: users['john.doe@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['john.doe@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['john.doe@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['john.doe@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['jane.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['jane.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['jane.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['jane.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['alice.johnson@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['alice.johnson@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['alice.johnson@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['alice.johnson@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['sarah.ryan@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['sarah.ryan@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['sarah.ryan@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['sarah.ryan@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['mark.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['mark.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['mark.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['mark.smith@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['michael.gira@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['michael.gira@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['michael.gira@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['michael.gira@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['tim.buckley@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2021'] },
    { user_id: users['tim.buckley@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2022'] },
    { user_id: users['tim.buckley@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2023'] },
    { user_id: users['tim.buckley@example.com'], course_id: courses['Drama - FT'], course_year_id: courseYears['Drama - FT - 2024'] },
    { user_id: users['sam.cave@example.com'], course_id: courses['Film Studies and Production - FT'], course_year_id: courseYears['Film Studies and Production - FT - 2021'] }
  ]

  await UserCourse.bulkCreate(userCourses)
}

module.exports = { seedUserCourses }