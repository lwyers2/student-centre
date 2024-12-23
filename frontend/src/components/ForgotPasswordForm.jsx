import React from 'react'

const ForgotPasswordForm = ( {toggleForm} ) => {
  return (
    <div id="reset-password" className="p-6 my-12 scroll-mt-20">
      <div className="list-none flex justify-center mx-auto">
        <div className="w-full sm:w-2/3 lg:w-3/5 flex flex-col items-center border border-solid border-slate-900 dark:border-gray-100 bg-white dark:bg-black py-10 px-10 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Reset Password</h2>
          <form action="submit" className="flex flex-col items-center w-full">
            <div className="mb-6 w-full">
              <label htmlFor="email" className="block text-lg mb-2">Email</label>
              <input type="email" id="email" name="email" className="w-full p-3 border border-gray-300 rounded text-black" required />
            </div>
            <button onClick={toggleForm} type="button" className="w-full qub-red text-white py-3 rounded hover:bg-red-900">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  )
} 

export default ForgotPasswordForm