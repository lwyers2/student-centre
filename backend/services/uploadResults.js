const fs = require('fs')
const csvParser = require('csv-parser')
const {
  Student,
  ModuleYear,
  Module,
  StudentModule,
  ResultDescriptor,
  CourseYear,
  Course
} = require('../models')

const BATCH_SIZE = 50

async function parseResultsCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = []
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject)
  })
}

// Process the CSV results in chunks
async function processResultsChunk(chunk, courseYearId) {
  let updatedCount = 0


  for (const row of chunk) {
    const { student_code, module_code, module_year_start, result, result_descriptor } = row
    if (!student_code || !module_code || !module_year_start || result === null || !result_descriptor) continue
    const yearStart = parseInt(module_year_start)

    const student = await Student.findOne({ where: { student_code } })
    if (!student) {
      console.warn(`Missing student with student_code=${student_code}`)
      continue
    }

    // Get the course year based on courseYearId
    const courseYear = await CourseYear.findByPk(courseYearId)
    if (!courseYear) {
      console.warn(`CourseYear with courseYearId=${courseYearId} not found`)
      continue
    }

    // Find the module by module_code
    const course = await Course.findByPk(courseYear.course_id)
    if (!course) {
      console.warn(`Course for courseYearId=${courseYearId} not found`)
      continue
    }

    const module = await Module.findOne({ where: { code: module_code } })
    if (!module) {
      console.warn(`Module with module_code=${module_code} not found`)
      continue
    }

    // Find the ModuleYear for the course
    const moduleYear = await ModuleYear.findOne({
      where: {
        module_id: module.id,
        year_start: yearStart
      }
    })

    if (!moduleYear) {
      console.warn(`ModuleYear for module_code=${module_code} and year_start=${yearStart} not found`)
      continue
    }

    const descriptor = await ResultDescriptor.findOne({ where: { descriptor: result_descriptor } })
    if (!descriptor) {
      console.warn(`ResultDescriptor with description=${result_descriptor} not found`)
      continue
    }

    const studentModule = await StudentModule.findOne({
      where: {
        student_id: student.id,
        module_year_id: moduleYear.id
      }
    })

    if (!studentModule) {
      console.warn(`Missing StudentModule for student_id=${student.id}, module_year_id=${moduleYear.id}`)
      continue
    }

    // Determine if the result should be flagged
    const numericResult = parseFloat(result)
    const isFlagged = !isNaN(numericResult) && numericResult < 40 ? 1 : 0

    // Update the student module record
    try {
      await StudentModule.update(
        {
          result: numericResult,
          flagged: isFlagged,
          descriptor_id: descriptor.id
        },
        {
          where: {
            student_id: student.id,
            module_year_id: moduleYear.id
          }
        }
      )
      updatedCount++
    } catch (error) {
      console.error(`Error updating StudentModule for student_id=${student.id}, module_year_id=${moduleYear.id}:`, error)
    }
  }

  return { updatedCount }
}

// Main function to handle the uploading of results
async function uploadResults(courseYearId, filePath) {

  const results = await parseResultsCSV(filePath)

  const chunks = []
  for (let i = 0; i < results.length; i += BATCH_SIZE) {
    chunks.push(results.slice(i, i + BATCH_SIZE))
  }

  let totalUpdated = 0
  for (const chunk of chunks) {
    const { updatedCount } = await processResultsChunk(chunk, courseYearId)
    totalUpdated += updatedCount
  }

  // Delete the uploaded file after processing
  fs.unlink(filePath, (err) => {
    if (err) console.error('Failed to delete uploaded file:', err)
  })

  return {
    updated: totalUpdated
  }
}


module.exports = {
  uploadResults
}
