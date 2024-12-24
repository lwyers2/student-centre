import React , { useState } from 'react'
import LoginForm from '../components/LoginForm'


const Login = ({ onLogin }) => {

  return (
    <LoginForm  onLogin={onLogin} />
  )
}



export default Login