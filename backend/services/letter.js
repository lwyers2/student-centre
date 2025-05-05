const { StudentModule, Letter, LetterType, ModuleYear, ModuleCourse, User, Student, Module, ResultDescriptor } = require('../models')
const { formatAllLettersOneStudent } = require('../helper/formaters/letter/formatAllLettersOneStudent')

const sendLetter = async (studentId, moduleYearId, sentByUser, authorisedByStaff) => {
  // Get the module year and associated course year
  const moduleYear = await ModuleYear.findByPk(moduleYearId, {
    include: {
      model: ModuleCourse,
      as: 'module_year_module_course',
      limit: 1,
    }
  })

  if (!moduleYear || !moduleYear.module_year_module_course.length) {
    throw new Error(`Module year not found or not linked to a course year (ID: ${moduleYearId})`)
  }

  const courseYearId = moduleYear.module_year_module_course[0].course_year_id

  // Get all module years in the same course year
  const moduleYearIds = await ModuleYear.findAll({
    where: { year_start: moduleYear.year_start },
    include: {
      model: ModuleCourse,
      as: 'module_year_module_course',
      where: { course_year_id: courseYearId },
    },
    attributes: ['id'] // Only select the ID field for efficiency
  }).then(moduleYears => moduleYears.map(m => m.id))

  if (!moduleYearIds.length) {
    throw new Error(`No module years found for course year ID: ${courseYearId}`)
  }

  // Get all student modules for the student in this academic year
  const studentModuleIds = await StudentModule.findAll({
    where: {
      student_id: studentId,
      module_year_id: moduleYearIds
    },
    attributes: ['id']
  }).then(studentModules => studentModules.map(sm => sm.id))

  if (!studentModuleIds.length) {
    throw new Error(`No student modules found for student ID: ${studentId} in course year ID: ${courseYearId}`)
  }

  // Count failure letters sent across all modules in this academic year
  const letterCount = await Letter.count({
    where: { student_module_id: studentModuleIds }
  })


  if (letterCount >= 2) {
    return { success: false, message: 'Maximum number of failure letters already sent.' }
  }

  // Find the specific student module for this module year
  const studentModule = await StudentModule.findOne({
    where: { student_id: studentId, module_year_id: moduleYearId }
  })

  if (!studentModule) {
    throw new Error(`Student module not found for student ID: ${studentId} and module year ID: ${moduleYearId}`)
  }


  const moduleLetterCount = await Letter.count({
    where: { student_module_id: studentModule.id }
  })

  if (moduleLetterCount >= 1) {
    return { success: false, message: 'Maximum number of failure letters already sent for module.' }
  }


  let letterTypeName
  letterCount === 0 ? letterTypeName = '1st Warning' : letterTypeName = '2nd Warning'

  // Find the letter type
  const letterType = await LetterType.findOne({ where: { name: letterTypeName } })

  if (!letterType) {
    throw new Error(`Letter type not found for type name: ${letterTypeName}`)
  }

  // Send the letter
  await Letter.create({
    student_module_id: studentModule.id,
    date_sent: new Date(),
    sent_by_user: sentByUser,
    type_id: letterType.id,
    sent: true,
    authorised_by_staff: authorisedByStaff
  })


  return { success: true, letterCount: letterCount + 1 }
}


async function getAllLettersForStudent(studentId) {

  const studentModules = await StudentModule.findAll({
    where: { student_id: studentId }
  })

  const studentModuleIds = studentModules.map(sm => sm.id)

  const letters = await Letter.findAll({
    where: { student_module_id: studentModuleIds },
    include: [
      {
        model: LetterType,
        as: 'letter_letter_type'
      },
      {
        model: User,
        as: 'letter_sent_by_user',
        attributes: ['prefix', 'forename', 'surname']
      },
      {
        model: User,
        as: 'letter_authorised_by_staff',
        attributes: ['prefix', 'forename', 'surname']
      },
      {
        model: StudentModule,
        as: 'letter_student_module',
        include: [
          {
            model: Student,
            as: 'student_module_student',
          },
          {
            model: Module,
            as: 'student_module_module'
          },
          {
            model: ModuleYear,
            as: 'student_module_module_year'
          },
          {
            model: ResultDescriptor,
            as: 'student_module_result_descriptor'
          }
        ]
      }
    ]
  })
  return formatAllLettersOneStudent(letters)
}

async function getAllLettersForStudentOneModule(studentId, moduleYearId) {
  const studentModules = await StudentModule.findAll({
    where: { student_id: studentId, module_year_id: moduleYearId }
  })

  const studentModuleIds = studentModules.map(sm => sm.id)

  const letters = await Letter.findAll({
    where: { student_module_id: studentModuleIds },
    include: [
      {
        model: LetterType,
        as: 'letter_letter_type'
      },
      {
        model: User,
        as: 'letter_sent_by_user',
        attributes: ['prefix', 'forename', 'surname']
      },
      {
        model: User,
        as: 'letter_authorised_by_staff',
        attributes: ['prefix', 'forename', 'surname']
      },
      {
        model: StudentModule,
        as: 'letter_student_module',
        include: [
          {
            model: Student,
            as: 'student_module_student',
          },
          {
            model: Module,
            as: 'student_module_module'
          },
          {
            model: ModuleYear,
            as: 'student_module_module_year'
          },
          {
            model: ResultDescriptor,
            as: 'student_module_result_descriptor'
          }
        ]
      }
    ]
  })
  return formatAllLettersOneStudent(letters)
}

module.exports = { sendLetter, getAllLettersForStudent, getAllLettersForStudentOneModule }
