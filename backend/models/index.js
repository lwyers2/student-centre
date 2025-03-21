
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
const UserModule = require('./userModule')
const StudentCourse = require('./studentCourse')
const UserCourse = require('./userCourse')
const UserSchool = require('./userSchool')
const Letter = require('./letter')
const Meeting = require('./meeting')
const LetterType = require('./letterType')





//this clears up multiple require statements in services files

module.exports = {
  AuthenticationUser,
  Classification,
  Course,
  CourseYear,
  Level,
  Module,
  ModuleCourse,
  ModuleYear,
  QualificationLevel,
  Role,
  School,
  Semester,
  Student,
  StudentCourse,
  StudentModule,
  User,
  UserCourse,
  UserModule,
  UserSchool,
  Letter,
  LetterType,
  Meeting
}