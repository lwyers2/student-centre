import axios from 'axios'
const baseUrl = '/api/schools'

const getAll = async token => {
  const response = await axios.get(baseUrl, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

export default {
  getAll
}