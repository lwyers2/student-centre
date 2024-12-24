import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/queens-university-belfast-logo.png'

const Header = ({ user, onLogout }) => {
  return(
    <header className="qub-red text-white top-0 z-10 w-full sticky">
      <div className="mx-auto p-2 flex justify-between items-center w-full">
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
        <div>
          <button id="mobile-open-button" className="text-3xl sm:hidden focus:outline-none">
          &#9776;
          </button>
          <nav id="mobile-menu"
            className="hidden sm:block space-x-8 text-xl pr-6"
            aria-label="main">
            {user? (
              <>
                <Link to="/upload-records" className="hover:opacity-60">Upload Records</Link>
                <Link to="/view-records" className="hover:opacity-60">View Records</Link>
                <Link to="/meetings" className="hover:opacity-60">Meetings</Link>
                <Link to="/admin" className="hover:opacity-60">Admin</Link>
                <button
                  onClick={onLogout}
                  className="hover:opacity-60 "
                >Log Out</button>
              </>
            )
              :
              (
                <Link to="/login" className="hover:opacity-60">Log in</Link>
              )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header