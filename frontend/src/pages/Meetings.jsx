import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Meetings = () => {
  const user = useSelector(state => state.user)  // Assuming user data is stored in state.user
  const navigate = useNavigate()

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div>
      <h1 className="text-2xl font-bold">Meetings</h1>
      {/* Add meeting details or scheduling logic here */}
    </div>
  )
}

export default Meetings