const {Course, Module, User, ModuleYear, ModuleCourse, Semester, CourseYear, QualificationLevel } = require('../models')

async function getAllModules() {
  const modules = await Module.findAll({
    attributes: ['id', 'title', 'code', 'year']
  })
  if(!modules) {
    return null
  }

  return modules
}

module.exports = {
  getAllModules,
}