const { StudentModule, Letter, LetterType, ModuleYear, ModuleCourse } = require('../models')

const sendFailureLetter = async (studentId, moduleYearId, sentByUser, authorisedByStaff, typeName) => {
  try {
    // Get the module year
    const moduleYear = await ModuleYear.findOne({
      where: { id: moduleYearId },
      include: {
        model: ModuleCourse,
        as: 'module_year_module_course',
        limit: 1,
      }
    })

    if (!moduleYear) {
      throw new Error(`Module year not found for ID: ${moduleYearId}`)
    }

    const courseYearId = moduleYear.module_year_module_course[0].course_year_id

    // Get all module years under the same course year
    const moduleYears = await ModuleYear.findAll({
      where: { year_start: moduleYear.year_start },
      include: {
        model: ModuleCourse,
        as: 'module_year_module_course',
        where:
        {
          course_year_id: courseYearId,
        }
      }
    })

    const moduleYearIds = moduleYears.map(m => m.id)

    // Get all student modules for this student in the academic year
    const studentModules = await StudentModule.findAll({
      where: {
        student_id: studentId,
        module_year_id: moduleYearIds
      }
    })

    const studentModuleIds = studentModules.map(sm => sm.id)

    // Count failure letters sent across all modules in this academic year
    const letterCount = await Letter.count({
      where: { student_module_id: studentModuleIds }
    })

    console.log(`Letter Count ${letterCount}`)

    const studentModule = await StudentModule.findOne({
      where: { student_id: studentId, module_year_id: moduleYearId }
    })

    if (!studentModule) {
      throw new Error(`Student module not found for student ID: ${studentId} and module year ID: ${moduleYearId}`)
    }

    const letterType = await LetterType.findOne({ where: { name: typeName } })

    if (!letterType) {
      throw new Error(`Letter type not found for type name: ${typeName}`)
    }

    if (letterCount < 2) {
      await Letter.create({
        student_module_id: studentModule.id,
        date_sent: new Date(),
        sent_by_user: sentByUser,
        type_id: letterType.id,
        sent: true,
        authorised_by_staff: authorisedByStaff
      })

      console.log('Letter sent successfully for module ID:', moduleYearId)

      return { success: true, letterCount: letterCount + 1 }
    }

    return { success: false, message: 'Maximum number of failure letters already sent.' }
  } catch (error) {
    console.error('Error sending letter:', error)
    return { success: false, message: error.message }
  }
}

module.exports = { sendFailureLetter }
