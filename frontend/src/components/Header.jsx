import React from 'react'
import logo from '../img/queens-university-belfast-logo.png'

const Header = () => {
  return(
    <header className="qub-red text-white top-0 z-10">
      <section className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-3xl font-medium flex items-center">
          <div className="bg-white p-2 rounded">
            <img className="h-16 w-auto object-contain" src={logo} alt="Queen's University Belfast Logo" />
          </div>
          <a href="#hero" className="ml-4">QUB Student Results</a>
        </h1>
        <div>
          <button id="mobile-open-button" className="text-3xl sm:hidden focus:outline-none">
            &#9776;
          </button>
          <nav id="mobile-menu" className="hidden sm:block space-x-8 text-xl" aria-label="main">
            <a href="login.html" className="hover:opacity-90">Log In</a>
          </nav>
        </div>
      </section>
    </header>
  )
}

export default Header