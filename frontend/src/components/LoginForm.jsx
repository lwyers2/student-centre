import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import { setUser } from '../redux/actions'

const LoginForm = ( ) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ email, password }) // Call API
      dispatch(setUser(user)) // Update login state in App
      localStorage.setItem('loggedUser', JSON.stringify(user))
      navigate('/') // Redirect to home page
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
      <div className="w-full max-w-md p-11 bg-white dark:bg-black border border-gray-300 dark:border-gray-100 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Log in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <div className="mb-6 text-right">
            <Link to="/reset-password" className="text-lg text-red-700 hover:text-red-900">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-3 rounded hover:bg-red-900">
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}


export default LoginForm