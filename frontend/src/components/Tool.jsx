import React from 'react'
import { Link } from 'react-router-dom'

const Tool = ({ linkTo, titleLabel, desLabel, img, imgAlt }) => {
  return (
    <div className="w-2/3 sm:w-5/6 flex flex-col items-center border border-solid border-slate-900 dark:border-gray-100 bg-white dark:bg-black py-6 px-2 rounded-3xl shadow-xl">
      <img className="w-24 h-24 object-contain" src={img} alt={imgAlt} />
      <Link to={linkTo}>
        <h3 className="text-3xl text-center text-slate-900 dark:text-white">{titleLabel}</h3>
        <p className="text-center mt-2 text-slate-500 dark:text-slate-400">{desLabel}</p>
      </Link>
    </div>
  )
}

export default Tool