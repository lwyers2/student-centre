const Student = require('./student')
const Course = require('./course')
const User = require('./user')
const Module = require('./module')
const Classification = require('./classification')
const QualificationLevel = require('./qualification-level')
const Level = require('./level')
const School = require('./school')
const Role = require('./role')

Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'student_id',
  otherKey: 'course_id'
})

Student.belongsToMany(Module, {
  through: 'student_module',
  foreignKey: 'student_id',
  otherKey: 'module_id',
})

Module.belongsToMany(Student, {
  through: 'student_module',
  foreignKey: 'module_id',
  otherKey: 'student_id'
})

Course.belongsToMany(Student, {
  through: 'student_course',
  foreignKey: 'course_id',
  otherKey: 'student_id',
})

User.belongsToMany(Course, {
  through: 'user_course',
  foreignKey: 'user_id',
  otherKey: 'course_id',
  timestamps: false,
})

Course.belongsToMany(User, {
  through: 'user_course',
  foreignKey: 'course_id',
  otherKey: 'user_id',
  timestamps: false
})

User.belongsToMany(Module, {
  through: 'user_module',
  foreignKey: 'user_id',
  otherKey: 'module_id',
  timestamps: false,
})

Module.belongsToMany(User, {
  through: 'user_module',
  foreignKey: 'module_id',
  otherKey: 'user_id',
  timestamps: false,
})

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

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
})

Role.hasMany(User, {
  foreignKey: 'role_id'
})


Module.belongsTo(Course, {
  foreignKey: 'course_id',
  as:  'course',
})

Course.hasMany(Module, {
  foreignKey: 'course_id',
  as: 'modules'
})

Course.belongsTo(QualificationLevel, {
  foreignKey: 'qualification_id',
  as: 'qualification_level',
})

QualificationLevel.hasMany(Course, {
  foreignKey: 'qualification_id',
})

Classification.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'level',
})

Level.hasMany(Classification, {
  foreignKey: 'level_id'
})





module.exports = { Student, Course, User , Module, QualificationLevel, Classification, Level }