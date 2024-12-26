import React, { useState, useEffect } from 'react'
import Header from '../components/Header'

const Courses = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem(loggedUser))
    if(loggedUser) {
      setUser(loggedUser)
    }
  }, [])



  return(
    <div>This is the courses page</div>
  )
}

export default Courses