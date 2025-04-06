import axios from 'axios'
const baseUrl = '/api/upload' // Adjust this based on your backend route prefix

const uploadMinutes = async (meetingId, file, token) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('meetingId', meetingId)

  try {
    const response = await axios.post(`${baseUrl}/meeting-minutes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // If authentication is required
      },
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while uploading.' }
  }
}

const uploadResults = async(courseYearId, file, token, onUploadProgress,) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('courseYearId', courseYearId)

  try {
    const response = await axios.post(`${baseUrl}/results/${courseYearId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // If authentication is required
      },
      onUploadProgress,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while uploading.' }
  }
}

const uploadStudents = async(file, token, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(`${baseUrl}/students`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // If authentication is required
      },
      onUploadProgress,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred while uploading.' }
  }
}

export default {
  uploadMinutes,
  uploadResults,
  uploadStudents,
}
