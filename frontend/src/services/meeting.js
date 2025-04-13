import axios from 'axios'
const baseUrl = '/api/meetings'

// Create a new meeting
const createMeeting = async (studentId, moduleYearId, scheduledDate, academicId, adminStaffId, meetingReason, courseYearId) => {
  try {
    const payload = {
      studentId,
      moduleYearId,
      scheduledDate,
      academicId,
      adminStaffId,
      meetingReason,
      courseYearId
    }

    const response = await axios.post(`${baseUrl}/create`, payload)

    if (response.data.success && response.data.meeting) {
      console.log('Meeting scheduled successfully:', response.data.meeting)
      return {
        success: true,
        message: 'Meeting created successfully',
        meeting: response.data.meeting, // Ensure meeting data is returned
      }
    } else {
      console.error('Meeting creation failed:', response.data.message)
      return { success: false, message: response.data.message }
    }
  } catch (error) {
    console.error('Error creating meeting:', error.response?.data || error.message)
    return { success: false, message: 'An error occurred while scheduling the meeting' }
  }
}

// Get a single meeting
const getOneMeeting = async (meetingId) => {
  const response = await axios.get(`${baseUrl}/${meetingId}`)
  return response.data
}

const getAllMeetingsForOneUser = async (userId) => {
  const response = await axios.get(`${baseUrl}/user/${userId}`)
  return response.data
}

// Update an existing meeting (e.g., update outcome)
const updateMeeting = async (meetingId, updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/update/${meetingId}`, updatedData)

    if (response.data.success && response.data.meeting) {
      console.log('Meeting updated successfully:', response.data.meeting)
      return {
        success: true,
        message: 'Meeting updated successfully',
        meeting: response.data.meeting, // Updated meeting data
      }
    } else {
      console.error('Meeting update failed:', response.data.message)
      return { success: false, message: response.data.message }
    }
  } catch (error) {
    console.error('Error updating meeting:', error.response?.data || error.message)
    return { success: false, message: 'An error occurred while updating the meeting' }
  }
}

// Delete a meeting
const deleteMeeting = async (meetingId) => {
  try {
    const response = await axios.delete(`${baseUrl}/delete/${meetingId}`)

    if (response.data.success) {
      console.log('Meeting deleted successfully')
      return {
        success: true,
        message: 'Meeting deleted successfully',
      }
    } else {
      console.error('Meeting deletion failed:', response.data.message)
      return { success: false, message: response.data.message }
    }
  } catch (error) {
    console.error('Error deleting meeting:', error.response?.data || error.message)
    return { success: false, message: 'An error occurred while deleting the meeting' }
  }
}


const getAllMeetingsForStudent = async (studentId) => {
  try {
    const response = await axios.get(`${baseUrl}/student/${studentId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching meetings for student:', error)
    throw error
  }
}

export default { createMeeting, getOneMeeting, updateMeeting, deleteMeeting, getAllMeetingsForOneUser, getAllMeetingsForStudent }
