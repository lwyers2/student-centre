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
const Letter = require('./letter')
const Meeting  = require('./meeting')
const LetterType = require('./letterType')

// Letter -> StudentModule (a letter is associated with a student’s performance in a specific module)
Letter.belongsTo(StudentModule, {
  foreignKey: 'student_module_id',
  as: 'letter_student_module',
  timestamps: false,
})

StudentModule.hasMany(Letter, {
  foreignKey: 'student_module_id',
  as: 'student_module_letter',
  timestamps: false,
})

// Letter -> User (a letter is sent by a user, like a staff or admin)
Letter.belongsTo(User, {
  foreignKey: 'sent_by_user',
  as: 'letter_sent_by_user',
  timestamps: false,
})

User.hasMany(Letter, {
  foreignKey: 'sent_by_user',
  as: 'sent_by_user_user',
  timestamps: false,
})

// Letter -> authorised_by_staff (User)
Letter.belongsTo(User, {
  foreignKey: 'authorised_by_staff',
  as: 'letter_authorised_by_staff',
  timestamps: false,
})

User.hasMany(Letter, {
  foreignKey: 'authorised_by_staff',
  as: 'user_authorised_by_staff',
  timestamps: false,
})

//Letter -> Letter_type

// Level -> Classification
LetterType.hasMany(Letter, {
  foreignKey: 'type_id',
  as: 'letter_type_letter',
  timestamps: false,
})

Letter.belongsTo(LetterType, {
  foreignKey: 'type_id',
  as: 'letter_letter_type',
  timestamps: false,
})

// Meeting -> Student (a meeting is scheduled with a student)
Meeting.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'meeting_student',
  timestamps: false,
})

Student.hasMany(Meeting, {
  foreignKey: 'student_id',
  as: 'student_meeting',
  timestamps: false,
})

// Meeting -> Module (a meeting is related to a specific module)
Meeting.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'meeting_module',
  timestamps: false,
})

ModuleYear.hasMany(Meeting, {
  foreignKey: 'module_year_id',
  as: 'module_meeting',
  timestamps: false,
})

// Meeting -> User (academic staff) (a meeting is scheduled by an academic staff member)
Meeting.belongsTo(User, {
  foreignKey: 'academic_id',
  as: 'meeting_academic',
  timestamps: false,
})

User.hasMany(Meeting, {
  foreignKey: 'academic_id',
  as: 'academic_meeting',
  timestamps: false,
})

// Meeting -> User (academic staff) (a meeting is scheduled by an academic staff member)
Meeting.belongsTo(User, {
  foreignKey: 'admin_staff_id',
  as: 'meeting_academic_staff',
  timestamps: false,
})

User.hasMany(Meeting, {
  foreignKey: 'admin_staff_id',
  as: 'academic_staff_meeting',
  timestamps: false,
})





//user_course (user, course, course_year)

//User -> User_course
User.hasMany(UserCourse, {
  foreignKey: 'user_id',
  as: 'user_user_course',
  timestamps: false,
})

UserCourse.belongsTo(User, {
  foreignKey: 'user_id',
  timestamps: false,
  as: 'user_course_user'
})

//Course -> User_course
Course.hasMany(UserCourse, {
  foreignKey: 'course_id',
  as: 'course_user_course',
  timestamps: false,
})

UserCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  timestamps: false,
  as: 'user_course_course'
})

//Course_Year -> User_course
CourseYear.hasMany(UserCourse, {
  foreignKey: 'course_year_id',
  as: 'course_year_user_course',
  timestamps: false,
})

UserCourse.belongsTo(CourseYear, {
  foreignKey: 'course_year_id',
  timestamps: false,
  as: 'user_course_course_year'
})

//end of user_course

//user_module (user, course, course_year)

//User -> User Module
User.hasMany(UserModule, {
  foreignKey: 'user_id',
  as: 'user_module_user',
  timestamps: false,
})

UserModule.belongsTo(User, {
  foreignKey: 'user_id',
  timestamps: false,
  as: 'user_module_user'
})

//Module -> User Module
Module.hasMany(UserModule, {
  foreignKey: 'module_id',
  as: 'module_user_module',
  timestamps: false,
})

UserModule.belongsTo(Module, {
  foreignKey: 'module_id',
  timestamps: false,
  as: 'user_modules_module'
})

//ModuleYear -> User Module
ModuleYear.hasMany(UserModule, {
  foreignKey: 'module_year_id',
  as: 'module_year_user_module',
  timestamps: false,
})

UserModule.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  timestamps: false,
  as: 'user_module_module_year'
})

//End of user_module

//module_course (module, module_year, course, course_year)

//Module -> ModuleCourse
Module.hasMany(ModuleCourse, {
  foreignKey: 'module_id',
  as: 'module_module_course',
  timestamps: false,
})

ModuleCourse.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'module_course_module',
  timestamps: false,
})

//ModuleYear -> ModuleCourse
ModuleYear.hasMany(ModuleCourse, {
  foreignKey: 'module_year_id',
  as: 'module_year_module_course',
  timestamps: false,
})

ModuleCourse.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'module_course_module_year',
  timestamps: false,
})

// Course -> ModuleCourse
Course.hasMany(ModuleCourse, {
  foreignKey: 'course_id',
  as: 'course_module_course',
  timestamps: false,
})

ModuleCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'module_course_course',
  timestamps: false,
})

//CourseYear -> ModuleCourse
CourseYear.hasMany(ModuleCourse, {
  foreignKey: 'course_year_id',
  as: 'course_year_module_course',
  timestamps: false,
})

ModuleCourse.belongsTo(CourseYear, {
  foreignKey: 'course_year_id',
  as: 'module_course_course_year',
  timestamps: false,
})

//end of module_course

//course_year (course, user - module_coordinator)

// Course -> CourseYear
Course.hasMany(CourseYear, {
  foreignKey: 'course_id',
  as: 'course_course_year',
  timestamps: false,
})

CourseYear.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course_year_course',
  timestamps: false,
})

// User (course_coordinator) -> CourseYear
User.hasMany(CourseYear, {
  foreignKey: 'course_coordinator',
  as: 'course_coordinator_course_year',
  timestamps: false,
})

CourseYear.belongsTo(User, {
  foreignKey: 'course_coordinator',
  as: 'course_year_course_coordinator',
  timestamps: false,
})

//course table (school, qualification_level) school_id, qualification_id

// Course -> School
Course.belongsTo(School, {
  foreignKey: 'school_id',
  as: 'course_school',
  timestamps: false,
})

School.hasMany(Course, {
  foreignKey: 'school_id',
  as: 'school_course',
  timestamps: false,
})

// Course -> QualificationLevel
Course.belongsTo(QualificationLevel, {
  foreignKey: 'qualification_id',
  as: 'course_qualification_level',
  timestamps: false,
})

QualificationLevel.hasMany(Course, {
  foreignKey: 'qualification_id',
  as: 'qualification_level_course',
  timestamps: false,
})

//module year table (module_coordinator, semeseter_id, module_id)

// User -> ModuleYear
User.hasMany(ModuleYear, {
  foreignKey: 'module_coordinator_id',
  as: 'module_coordinator_module_year',
  timestamps: false,
})

ModuleYear.belongsTo(User, {
  foreignKey: 'module_coordinator_id',
  as: 'module_year_module_coordinator',
  timestamps: false,
})

//Semester -> ModuleYear
Semester.hasMany(ModuleYear, {
  foreignKey: 'semester_id',
  as: 'semester_module_year',
  timestamps: false,
})

ModuleYear.belongsTo(Semester, {
  foreignKey: 'semester_id',
  as: 'module_year_semester',
  timestamps: false,
})

//Module -> ModuleYear
Module.hasMany(ModuleYear, {
  foreignKey: 'module_id',
  as: 'module_module_year',
  timestamps: false,
})

ModuleYear.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'module_year_module',
  timestamps: false,
})

//end of module_year table

//student course table (student, course, course_year)

// Student -> Student Course
Student.hasMany(StudentCourse, {
  foreignKey: 'student_id',
  as: 'student_student_course',
  timestamps: false,
})

StudentCourse.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'student_course_student',
  timestamps: false,
})

//Course -> Student_Course
Course.belongsTo(StudentCourse, {
  foreignKey: 'id',
  as: 'course_student_course',
  timestamps: false,
})

StudentCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'student_course_course',
  timestamps: false,
})

//CourseYear -> StudentCourse
CourseYear.belongsTo(StudentCourse, {
  foreignKey: 'id',
  as: 'course_year_student_course',
  timestamps: false,
})

StudentCourse.belongsTo(CourseYear, {
  foreignKey: 'course_year_id',
  as: 'student_course_course_year',
  timestamps: false,
})

//end of student_course table

//student_module table (student, module, module_year)

//Student-> StudentModule
Student.hasMany(StudentModule, {
  foreignKey: 'student_id',
  as: 'student_student_module',
  timestamps: false,
})

StudentModule.belongsTo(Student, {
  foreignKey: 'student_id',
  as: 'student_module_student',
  timestamps: false,
})

// Module -> StudentModule
Module.hasMany(StudentModule, {
  foreignKey: 'module_id',
  as: 'module_student_module',
  timestamps: false,
})

StudentModule.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'student_module_module',
  timestamps: false,
})

//moduleYear -> studentModule
ModuleYear.hasMany(StudentModule, {
  foreignKey: 'module_year_id',
  as: 'module_year_student_module',
  timestamps: false,
})

StudentModule.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'student_module_module_year',
  timestamps: false,
})

//end of student_module table

//user_school table (user, school)

// User -> UserSchool
User.hasMany(UserSchool, {
  foreignKey: 'user_id',
  as: 'user_user_school',
  timestamps: false,
})

UserSchool.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user_school_user',
  timestamps: false,
})

// Schools -> UserSchool
School.hasMany(UserSchool, {
  foreignKey: 'school_id',
  as: 'school_user_school',
  timestamps: false,
})

UserSchool.belongsTo(School, {
  foreignKey: 'school_id',
  as: 'user_school_school',
  timestamps: false,
})

//end of user_school table

//user table

// User -> Role
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'user_role',
  timestamps: false,
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'role_user',
  timestamps: false,
})

//end of user table

//qualification_level (level)

// ✅ QualificationLevel ↔ Level
QualificationLevel.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'qualification_level_level',
  timestamps: false,
})

Level.hasMany(QualificationLevel, {
  foreignKey: 'level_id',
  timestamps: false,
})

//end of qualification_level table

//authentication_user table (user)

//AuthenticationUser -> User (for authentication)
AuthenticationUser.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'authentication_user_user',
  timestamps: false,
})

User.hasMany(AuthenticationUser, {
  foreignKey: 'user_id',
  as: 'user_authentication_user',
  timestamps: false,
})

//end of authentication_user table

//classification table (level)

// Level -> Classification
Level.hasMany(Classification, {
  foreignKey: 'level_id',
  as: 'level_classification',
  timestamps: false,
})

Classification.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'classification_level',
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
  Meeting,
  Letter,
  LetterType
}
