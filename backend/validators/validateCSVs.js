const fs = require('fs')
const csvParser = require('csv-parser')


async function validateCSVs(filePath, requiredFields) {
  const missingDataRows = []

  // Check if the file exists
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const missingFields = []

        // Check if any required fields are missing
        requiredFields.forEach(field => {
          if (!row[field] || row[field].trim() === '') {
            missingFields.push(field)
          }
        })

        // If there are missing fields, add them to the missingDataRows array
        if (missingFields.length > 0) {
          missingDataRows.push({ row, missingFields })
        }
      })
      .on('end', () => {
        if (missingDataRows.length > 0) {
          //return a structured error object
          const errorResponse = {
            message: 'Missing data found in some rows.',
            errors: missingDataRows.map((rowData, index) => ({
              row: index + 1,
              missingFields: rowData.missingFields,
            }))
          }
          reject(errorResponse)
        } else {
          resolve('CSV is valid - no missing data')
        }
      })
      .on('error', (err) => {
        reject({ message: 'Error while processing the file', error: err })
      })
  })
}

module.exports = { validateCSVs }
