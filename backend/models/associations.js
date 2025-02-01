const Module = require('./module')
const Course = require('./course')
const ModuleCourse = require('./moduleCourse')
const ModuleYear = require('./moduleYear')
const CourseYear = require('./courseYear')
const User = require('./user')
const Semester = require('./semester')
const Student = require('./student')
const School = require('./school')
const Role = require('./role')
const QualificationLevel = require('./qualificationLevel')
const Classification = require('./classification')
const Level = require('./level')
const AuthenticationUser = require('./authenticationUser')
const StudentModule = require('./studentModule')
const StudentCourse = require('./studentCourse')
const UserModule = require('./userModule')
const UserCourse = require('./userCourse')
const UserSchool = require('./userSchool')

// ✅ User ↔ Course (Many-to-Many)
User.belongsToMany(Course, {
  through: UserCourse,
  foreignKey: 'user_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'courses',
})

Course.belongsToMany(User, {
  through: UserCourse,
  foreignKey: 'course_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

// ✅ User ↔ Module (Many-to-Many)
User.belongsToMany(Module, {
  through: UserModule,
  foreignKey: 'user_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules',
})

Module.belongsToMany(User, {
  through: UserModule,
  foreignKey: 'module_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

// ✅ Module ↔ Course (Many-to-Many)
Module.belongsToMany(Course, {
  through: ModuleCourse,
  foreignKey: 'module_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'courses',
})

Course.belongsToMany(Module, {
  through: ModuleCourse,
  foreignKey: 'course_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules',
})

// ✅ ModuleCourse ↔ ModuleYear (Many-to-One)
ModuleCourse.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'module_year',
  timestamps: false,
})

ModuleYear.hasMany(ModuleCourse, {
  foreignKey: 'module_year_id',
  as: 'module_courses',
  timestamps: false,
})

// ✅ ModuleCourse ↔ Course (Many-to-One)
ModuleCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course',
  timestamps: false,
})

Course.hasMany(ModuleCourse, {
  foreignKey: 'course_id',
  as: 'module_courses',
  timestamps: false,
})

// ✅ ModuleCourse ↔ CourseYear (Many-to-One)
ModuleCourse.belongsTo(CourseYear, {
  foreignKey: 'course_year_id',
  as: 'course_year',
  timestamps: false,
})

CourseYear.hasMany(ModuleCourse, {
  foreignKey: 'course_year_id',
  as: 'course_modules',
  timestamps: false,
})

// ✅ Course ↔ CourseYear (One-to-Many)
Course.hasMany(CourseYear, {
  foreignKey: 'course_id',
  as: 'course_years',
  timestamps: false,
})

CourseYear.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course',
  timestamps: false,
})

// ✅ CourseYear ↔ User (Course Coordinator)
User.hasMany(CourseYear, {
  foreignKey: 'course_coordinator_id', // Changed from 'course_coordinator'
  as: 'coordinated_course_years',
  timestamps: false,
})

CourseYear.belongsTo(User, {
  foreignKey: 'course_coordinator_id', // Changed from 'course_coordinator'
  as: 'coordinator', // Changed alias to avoid collision
  timestamps: false,
})

// ✅ Course ↔ School (Many-to-One)
Course.belongsTo(School, {
  foreignKey: 'school_id',
  as: 'school',
  timestamps: false,
})

School.hasMany(Course, {
  foreignKey: 'school_id',
  as: 'courses',
  timestamps: false,
})

// ✅ ModuleYear ↔ User (Module Coordinator)
User.hasMany(ModuleYear, {
  foreignKey: 'module_coordinator_id',
  as: 'coordinated_module_years',
  timestamps: false,
})

ModuleYear.belongsTo(User, {
  foreignKey: 'module_coordinator_id',
  as: 'module_coordinator',
  timestamps: false,
})

// ✅ ModuleYear ↔ Semester (Many-to-One)
Semester.hasMany(ModuleYear, {
  foreignKey: 'semester_id',
  as: 'module_years',
  timestamps: false,
})

ModuleYear.belongsTo(Semester, {
  foreignKey: 'semester_id',
  as: 'semester',
  timestamps: false,
})

// ✅ Module ↔ ModuleYear (One-to-Many)
Module.hasMany(ModuleYear, {
  foreignKey: 'module_id',
  as: 'module_years',
  timestamps: false,
})


ModuleYear.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'module',
  timestamps: false,
})

// ✅ Student ↔ Course (Many-to-Many via StudentCourse)
StudentCourse.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'student',
  timestamps: false,
})

StudentCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course',
  timestamps: false,
})

Student.belongsToMany(Course, {
  through: StudentCourse,
  foreignKey: 'student_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'courses',
})

Course.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: 'course_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})

// ✅ Student ↔ Module (Many-to-Many via StudentModule)
StudentModule.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'student',
  timestamps: false,
})

StudentModule.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'module',
  timestamps: false,
})

Student.belongsToMany(Module, {
  through: StudentModule,
  foreignKey: 'student_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules',
})

Module.belongsToMany(Student, {
  through: StudentModule,
  foreignKey: 'module_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})

// ✅ StudentModule ↔ ModuleYear (Many-to-One)
StudentModule.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'module_year',
  timestamps: false,
})

Student.belongsToMany(ModuleYear, {
  through: StudentModule,
  foreignKey: 'student_id',
  otherKey: 'module_year_id',
  timestamps: false,
  as: 'module_years',
})

ModuleYear.belongsToMany(Student, {
  through: StudentModule,
  foreignKey: 'module_year_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})

// ✅ Student ↔ CourseYear (Many-to-Many via StudentCourse)
Student.belongsToMany(CourseYear, {
  through: StudentCourse,
  foreignKey: 'student_id',
  timestamps: false,
  as: 'course_years',
})

CourseYear.belongsToMany(Student, {
  through: StudentCourse,
  foreignKey: 'course_year_id',
  timestamps: false,
  as: 'students',
})

// ✅ User ↔ School (Many-to-Many)
User.belongsToMany(School, {
  through: UserSchool,
  foreignKey: 'user_id',
  otherKey: 'school_id',
  timestamps: false,
  as: 'schools',
})

School.belongsToMany(User, {
  through: UserSchool,
  foreignKey: 'school_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

// ✅ User ↔ Role (Many-to-One)
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
  timestamps: false,
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users',
  timestamps: false,
})

// ✅ Course ↔ QualificationLevel
Course.belongsTo(QualificationLevel, {
  foreignKey: 'qualification_id',
  as: 'qualification_level',
  timestamps: false,
})

QualificationLevel.hasMany(Course, {
  foreignKey: 'qualification_id',
  timestamps: false,
})

// ✅ QualificationLevel ↔ Level
QualificationLevel.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'level',
  timestamps: false,
})

Level.hasMany(QualificationLevel, {
  foreignKey: 'level_id',
  timestamps: false,
})

// ✅ AuthenticationUser ↔ User (for authentication)
AuthenticationUser.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  timestamps: false,
})

User.hasMany(AuthenticationUser, {
  foreignKey: 'user_id',
  as: 'tokens',
  timestamps: false,
})

// Level -> Classification (One-to-Many)
Level.hasMany(Classification, {
  foreignKey: 'level_id',
  as: 'classifications', // Plural to reflect multiple classifications
  timestamps: false,
})

Classification.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'level', // Singular because one classification belongs to one level
  timestamps: false,
})

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
}
