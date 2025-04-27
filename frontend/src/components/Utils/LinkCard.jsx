// components/LinkCard.jsx
import React from 'react'

const LinkCard = ({ title, onClick }) => {
  return (
    <div
      className="border border-solid border-slate-900 dark:border-slate-600 bg-white dark:bg-gray-900 p-8 py-12 rounded-3xl shadow-xl text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-8"
      onClick={onClick}
    >
      <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
    </div>
  )
}

export default LinkCard
