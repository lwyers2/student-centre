import axios from 'axios'
const baseUrl = '/api/download'


const downloadMinutes = async (meetingId) => {
  try {
    const response = await axios.get(`${baseUrl}/meeting-minutes/${meetingId}`, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })


    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `meeting_minutes_${meetingId}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading meeting minutes:', error)
    alert('Failed to download meeting minutes.')
  }
}

export default { downloadMinutes }
