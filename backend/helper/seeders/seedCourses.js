const { Course } = require('../../models')

async function seedCourses(schools, qualification_levels) {
  const courses = await Course.bulkCreate([
    { title: 'Drama', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'DRA', part_time: 0 },
    { title: 'Film Studies and Production', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'FSP', part_time: 0 },
    { title: 'Film and Theatre Making', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'FTM', part_time: 0 },
    { title: 'Drama and English', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'DEN', part_time: 0 },
    { title: 'English and Film Studies', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'EFS', part_time: 0 },
    { title: 'Music', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BMus'], code: 'MUS', part_time: 0 },
    { title: 'Music and Audio Production', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'MAP', part_time: 0 },
    { title: 'Music and Sound Design', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'MSD', part_time: 0 },
    { title: 'Music Performance', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'MPE', part_time: 0 },
    { title: 'Audio Engineering', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'AEN', part_time: 0 },
    { title: 'Film', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MFIL', part_time: 0 },
    { title: 'Film', school_id: schools['School of Arts, English, and Languages'], years: 2, qualification_id: qualification_levels['MA'], code: 'MFIL', part_time: 1 },
    { title: 'Arts Management', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MAMA', part_time: 0 },
    { title: 'Arts Management', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['MA'], code: 'MAMA', part_time: 1 },
    { title: 'Media and Broadcast Production', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MMBP', part_time: 0 },
    { title: 'Media and Broadcast Production', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['MA'], code: 'MMBP', part_time: 1 },
    { title: 'Arts and Humanities', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MRes'], code: 'MAHU', part_time: 0 },
    { title: 'Arts and Humanities', school_id: schools['School of Arts, English, and Languages'], years: 2, qualification_id: qualification_levels['MRes'], code: 'MAHU', part_time: 1 },
    { title: 'English', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG', part_time: 0 },
    { title: 'English and French', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/FRE', part_time: 0 },
    { title: 'English and History', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/HIS', part_time: 0 },
    { title: 'English and Irish', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/IRI', part_time: 0 },
    { title: 'English and Linguistics', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/LIN', part_time: 0 },
    { title: 'English and Philosophy', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/PHI', part_time: 0 },
    { title: 'English and Politics', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/POL', part_time: 0 },
    { title: 'English and Anthropology', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/ANT', part_time: 0 },
    { title: 'English and Sociology', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/SOC', part_time: 0 },
    { title: 'English and Spanish', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/SOC', part_time: 0 },
    { title: 'English and Creative Writing', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['BA'], code: 'ENG/CRW', part_time: 0 },
    { title: 'English - Literary Studies', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MELTS', part_time: 0 },
    { title: 'English - Literary Studies', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['MA'], code: 'MELTS', part_time: 1 },
    { title: 'English - Creative Writing', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MECW', part_time: 0 },
    { title: 'English - Creative Writing', school_id: schools['School of Arts, English, and Languages'], years: 2, qualification_id: qualification_levels['MA'], code: 'MECW', part_time: 1 },
    { title: 'Poetry: Creativity and Criticism', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MPOCC', part_time: 0 },
    { title: 'Poetry: Creativity and Criticism', school_id: schools['School of Arts, English, and Languages'], years: 3, qualification_id: qualification_levels['MA'], code: 'MPOCC', part_time: 1 },
    { title: 'Linguistics', school_id: schools['School of Arts, English, and Languages'], years: 1, qualification_id: qualification_levels['MA'], code: 'MLIN', part_time: 0 },
    { title: 'Linguistics', school_id: schools['School of Arts, English, and Languages'], years: 2, qualification_id: qualification_levels['MA'], code: 'MLIN', part_time: 1 }
  ])
  return courses.reduce((acc, course) => ({ ...acc,  [course.title ] : course.id }), {})
}

module.exports = { seedCourses }