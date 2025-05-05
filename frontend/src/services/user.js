import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async token => {
  const response = await axios.get(baseUrl, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUser = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserDetails = async (id, token) => {
  const response = await axios.get(`${baseUrl}/user-details/${id}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getAllUserCourses = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}/courses`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserModulesCourseYear = async (id, courseYearID, token) => {
  const response = await axios.get(`${baseUrl}/${id}/modules/${courseYearID}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserModules = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}/modules/`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserStudents = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}/students/`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserOneModule = async (id, moduleId, token) => {
  const response = await axios.get(`${baseUrl}/${id}/module/${moduleId}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUsersFromCourseYear = async (id, courseYearId, token) => {
  const response = await axios.get(`${baseUrl}/course-year/${courseYearId}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUsersFromSchool = async (schoolId) => {
  const response = await axios.get(`${baseUrl}/school/${schoolId}`, {

  })
  return response.data
}

const getUsersFromModule = async (token, moduleId) => {
  const response = await axios.get(`${baseUrl}/module/${moduleId}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }

  })
  return response.data

}

const getUsersFromModuleYear = async (token, moduleYearId) => {
  const response = await axios.get(`${baseUrl}/module-year/${moduleYearId}`, {
    heaeders: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const updateUser = async (id, token, userData) => {
  const response = await axios.put(`${baseUrl}/${id}`, userData, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const createUser = async (userData, token) => {
  const response = await axios.post(baseUrl, userData, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

export default {
  getAll,
  getUser,
  getAllUserCourses,
  getUserModulesCourseYear,
  getUserModules,
  getUserStudents,
  getUserOneModule,
  getUsersFromCourseYear,
  getUsersFromSchool,
  getUsersFromModule,
  getUsersFromModuleYear,
  getUserDetails,
  updateUser,
  createUser,
}