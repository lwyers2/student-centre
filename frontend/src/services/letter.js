import axios from 'axios'

const baseUrl = '/api/letters'

// Get letters for a specific student and module
const getOneStudentOneModule = async (studentId, moduleYearId) => {
  try {
    const response = await axios.get(`${baseUrl}?studentId=${studentId}&moduleYearId=${moduleYearId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching letter:', error)
    throw error
  }
}

// Get all letters for a student
const getAllLettersForStudent = async (studentId) => {
  try {
    const response = await axios.get(`${baseUrl}/${studentId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching letters:', error)
    throw error
  }
}

// Send a letter
const sendLetter = async (studentId, moduleYearId, sentByUser, authorisedByStaff,) => {
  try {
    const response = await axios.post(`${baseUrl}/send-letter`, {
      studentId,
      moduleYearId,
      sentByUser,
      authorisedByStaff,
    })
    return response.data
  } catch (error) {
    console.error('Error sending letter:', error)
    throw error
  }
}

export default { getOneStudentOneModule, getAllLettersForStudent, sendLetter }
