
const Student = require('./student')
const Course = require('./course')
const Module = require('./module')
const User = require('./user')
const QualificationLevel = require('./qualificationLevel')
const CourseYear = require('./courseYear')
const ModuleYear = require('./moduleYear')
const Semester = require('./semester')
const ModuleCourse = require('./moduleCourse')
const School = require('./school')
const Role = require('./role')
const Level = require('./level')
const Classification = require('./classification')
const StudentModule = require('./studentModule')
const AuthenticationUser = require('./authenticationUser')


//this clears up multiple require statements in services files

module.exports = {
  Student,
  Course,
  Module,
  User,
  QualificationLevel,
  CourseYear,
  ModuleYear,
  Semester,
  ModuleCourse,
  Role,
  School,
  AuthenticationUser,
  Level,
  Classification,
  StudentModule,
}