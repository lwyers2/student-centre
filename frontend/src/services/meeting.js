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

export default { createMeeting }
