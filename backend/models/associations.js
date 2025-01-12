const Student = require('./student')
const Course = require('./course')
const User = require('./user')
const Module = require('./module')
const Classification = require('./classification')
const QualificationLevel = require('./qualificationLevel')
const Level = require('./level')
const School = require('./school')
const Role = require('./role')
const Token = require('./token')
const CourseYear = require('./courseYear')
const ModuleYear = require('./moduleYear')
const Semester = require('./semester')

//Course -> Course_Year
Course.hasMany(CourseYear, {
  foreignKey: 'course_id',
  timestamps: false,
  as: 'course_years',
})

CourseYear.belongsTo(Course, {
  foreignKey: 'course_id',
  timestamps: false,
  as: 'course'
})


//User -> Course
User.belongsToMany(Course, {
  through: 'user_course',
  foreignKey: 'user_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'all_courses',
})

Course.belongsToMany(User, {
  through: 'user_course',
  foreignKey: 'course_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users'
})


//CourseYear -> User (course-cordinator)

User.hasMany(Course, {
  foreignKey: 'course_coordinator',
  timestamps: false,
  as: 'course_years'
})

CourseYear.belongsTo(User, {
  foreignKey: 'course_coordinator',
  timestamp: false,
  as: 'course_co-ordinator'
})



//Module -> Course
Module.belongsToMany(Course, {
  through: 'module_course',
  foreignKey: 'module_id',
  timestamps: false,
  as:  'course',
})

Course.belongsToMany(Module, {
  through: 'module_course',
  foreignKey: 'course_id',
  timestamps: false,
  as: 'modules'
})

//Student -> Course
Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'student_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'courses',
})

Course.belongsToMany(Student, {
  through: 'student_course',
  foreignKey: 'course_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})

//Student -> Module, will have unique false in case student needs to retake module. Could have multiple results
Student.belongsToMany(Module, {
  through: {
    model: 'student_module',
    unique: false,
  },
  foreignKey: 'student_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules'
})

Module.belongsToMany(Student, {
  through: {
    model: 'student_module',
    unique: false,
  },
  foreignKey: 'module_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})



//User -> Module
User.belongsToMany(Module, {
  through: 'user_module',
  foreignKey: 'user_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules'
})

Module.belongsToMany(User, {
  through: 'user_module',
  foreignKey: 'module_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

//User -> School
User.belongsToMany(School, {
  through: 'user_school',
  foreignKey: 'user_id',
  otherKey: 'school_id',
})

School.belongsToMany(User, {
  through: 'user_school',
  foreignKey: 'school_id',
  otherKey: 'user_id',
})

//User -> Role
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
})




//Course -> QualificationLevel
Course.belongsTo(QualificationLevel, {
  foreignKey: 'qualification_id',
  as: 'qualification_level',
})

QualificationLevel.hasMany(Course, {
  foreignKey: 'qualification_id',
})

//Classification -> Level
Classification.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'level',
})

Level.hasMany(Classification, {
  foreignKey: 'level_id'
})

//Token -> User (for authentication)
Token.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

User.hasMany(Token, {
  foreignKey: 'user_id',
})


module.exports = { Student, Course, User , Module, QualificationLevel, Classification, Level, Token }