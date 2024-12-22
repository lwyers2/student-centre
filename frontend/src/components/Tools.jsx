import React from 'react'
import login from '../img/log-in.png'
import userAccount from '../img/user-account-profile.jpg'

const Tools = () => {
  return (
    <section id="tools" className="p-6 my-12 scroll-mt-20">
    <h2 className="text-4xl font-bold text-center sm:text-5xl mb-6 text-slate-900 dark:text-white">Tools</h2>
    <ul className="list-none mx-auto my-12 flex flex-col sm:flex-row items-center gap-8">
      <li className="w-2/3 sm:w-5/6 flex flex-col items-center border border-solid border-slate-900 dark:border-gray-100 bg-white dark:bg-black py-6 px-2 rounded-3xl shadow-xl">
        <img className="w-1/2" src={login} alt="Log In" />
        {/* Replace with <Link> if using React Router */}
        <a href="login.html">
          <h3 className="text-3xl text-center text-slate-900 dark:text-white">Log In</h3>
          <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Log In to Admin Centre</p>
        </a>
      </li>
      <li className="w-2/3 sm:w-5/6 flex flex-col items-center border border-solid border-slate-900 dark:border-gray-100 bg-white dark:bg-black py-6 px-2 rounded-3xl shadow-xl">
        <img className="w-1/2" src={userAccount} alt="Request Log In" />
        {/* Replace with <Link> if using React Router */}
        <a href="forgot-password.html">
          <h3 className="text-3xl text-center text-slate-900 dark:text-white">Reset Password</h3>
          <p className="text-center mt-2 text-slate-500 dark:text-slate-400">Reset Password for Admin Centre Account</p>
        </a>
      </li>
    </ul>
  </section>
  );
};

export default Tools;