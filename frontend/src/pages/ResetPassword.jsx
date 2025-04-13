import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import resetPasswordService from '../services/resetPassword'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPasswordService.resetPassword(email)
      toast.success('Password reset email sent! Redirecting to login...', {
        position: 'top-center',
        autoClose: 3000,
      })
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      toast.error('Error sending email. Please try again later.', {
        position: 'top-center',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="reset-password" className="p-6 my-12 scroll-mt-20">
      <ToastContainer />
      <div className="list-none flex justify-center mx-auto">
        <div className="w-full sm:w-2/3 lg:w-3/5 flex flex-col items-center border border-solid border-slate-900 dark:border-gray-100 bg-white dark:bg-black py-10 px-10 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Reset Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <div className="mb-6 w-full">
              <label htmlFor="email" className="block text-lg mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full qub-red text-white py-3 rounded hover:bg-red-900"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
