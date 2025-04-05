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
          // Send the error with \n for line breaks in the JSON response
          const errorMessage = `Missing data found in the following rows:\n${formatMissingFieldsMessage(missingDataRows)}`
          reject(new Error(errorMessage)) // Reject with the error
        } else {
          resolve('CSV is valid - no missing data')
        }
      })
      .on('error', reject)
  })
}

// Helper function to format missing fields for the response
function formatMissingFieldsMessage(missingDataRows) {
  return missingDataRows.map((rowData, index) => {
    return `Row ${index + 1}: Missing fields - ${rowData.missingFields.join(', ')}.`
  }).join('\n')  // Join with \n for plain text output
}

module.exports = { validateCSVs }
