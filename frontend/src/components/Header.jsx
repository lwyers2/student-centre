import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/queens-university-belfast-logo.png'

const Header = () => {
  return(
    <header className="qub-red text-white top-0 z-10 w-full">
      <div className="mx-auto p-4 flex justify-between items-center w-full">
        <div className="flex items-center">
          <Link to="/">
            <div className="bg-white p-2 rounded">
              <img className="h-16 w-auto object-contain" src={logo} alt="Queen's University Belfast Logo" />
            </div>
          </Link>
          <Link to="/" className="ml-4 text-4xl font-medium">
            QUB Student Results
          </Link>
        </div>

        {/* Mobile menu and navigation */}
        <div>
          <button id="mobile-open-button" className="text-3xl sm:hidden focus:outline-none">
            &#9776;
          </button>
          <nav id="mobile-menu" className="hidden sm:block space-x-8 text-xl" aria-label="main">
            <Link to="/upload-records" className="hover:opacity-90">Upload Records</Link>
            <Link to="/view-records" className="hover:opacity-90">View Records</Link>
            <Link to="/meetings" className="hover:opacity-90">Meetings</Link>
            <Link to="/admin" className="hover:opacity-90">Admin</Link>
            <Link to="/login" className="hover:opacity-90">Log in</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header