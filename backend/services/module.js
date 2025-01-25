const { Course, Module, User, ModuleYear, ModuleCourse, Semester, CourseYear, QualificationLevel } = require('../models')

async function getAllModules() {
  const modules = await Module.findAll({
    attributes: ['id', 'title', 'code', 'year', 'CATs'],
    include: [
      {
        model: ModuleYear,
        as: 'module_years',
        attributes: ['id', 'year_start', 'semester_id'],
        include: [
          {
            model: ModuleCourse,
            as: 'module_courses',
            attributes: ['id'],
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'title', 'code', 'part_time', 'years'],
                include: [
                  {
                    model: CourseYear,
                    as: 'course_years',
                    attributes: ['id', 'year_start', 'year_end'],
                  },
                  {
                    model: QualificationLevel,
                    as: 'qualification_level',
                    attributes: ['qualification'],
                  }
                ]
              },
            ]
          },
          {
            model: User,
            as: 'module_co-ordinator',
            attributes: ['forename', 'surname']
          },
          {
            model: Semester,
            as: 'semester',
            attributes: ['id', 'name']
          },
        ],
      },
    ],
  })
  if(!modules) {
    return null
  }

  return modules
}

module.exports = {
  getAllModules,
}