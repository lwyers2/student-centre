import axios from 'axios'
const baseUrl = '/api/roles'

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