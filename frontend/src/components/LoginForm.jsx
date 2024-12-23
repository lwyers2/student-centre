import React from "react"
import { Link } from 'react-router-dom'

const LoginForm = ( {toggleForm} ) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
      <div className="relative -mt-16 w-full max-w-md p-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-100 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Log in</h2>
        <form action="submit" className="flex flex-col">
          <div className="mb-6">
            <label htmlFor="email" className="block text-lg mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="w-full p-3 border border-gray-300 rounded text-black" 
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-lg mb-2">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="w-full p-3 border border-gray-300 rounded text-black" 
            />
          </div>
          <div className="mb-6 text-right">
              <Link to="/reset-password" className="text-lg text-red-700 hover:text-red-900">
              Forgot Password?
            </Link>
              
          </div>
          <button 
            type="button" 
            className="w-full bg-red-700 text-white py-3 rounded hover:bg-red-900"> 
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm