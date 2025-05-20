import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Meetings = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  useEffect (() => {
    if(!user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div>
      <h1 className="text-2xl font-bold">Meetings</h1>
    </div>
  )
}

export default Meetings