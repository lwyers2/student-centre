const fs = require('fs')
const csvParser = require('csv-parser')

// Reusable function to validate CSV with dynamic required fields
async function validateCSVs(filePath, requiredFields) {
  const missingDataRows = []

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

        // If there are missing fields, add this row to the missingDataRows array
        if (missingFields.length > 0) {
          missingDataRows.push({ row, missingFields })
        }
      })
      .on('end', () => {
        if (missingDataRows.length > 0) {
          // Return structured error message
          const errorResponse = {
            message: 'Missing data found in some rows.',
            errors: missingDataRows.map((rowData, index) => ({
              row: index + 1,  // Row numbers are 1-based
              missingFields: rowData.missingFields,
            }))
          }
          reject(errorResponse) // Reject with the structured error object
        } else {
          resolve('CSV is valid - no missing data')
        }
      })
      .on('error', (err) => {
        reject({ message: 'Error while processing the file', error: err }) // Handle stream error
      })
  })
}

module.exports = { validateCSVs }
