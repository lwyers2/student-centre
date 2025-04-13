import axios from 'axios'
const baseUrl = '/api/reset-password'
const resetPassword = async (email) => {
  try {
    const response = await axios.post(baseUrl, { email })
    return response.data
  } catch (error) {
    throw new Error('Error sending password reset email')
  }
}

export default {
  resetPassword,
}