"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Menu, X, Coffee, User, LogOut, PlusCircle, Home } from "react-feather"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Coffee className="h-8 w-8" />
            <span className="hidden sm:inline">CookFor(Y)um</span>
            <span className="sm:hidden">CookForum</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-amber-200 transition-colors flex items-center space-x-1">
              <Home size={18} />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="text-white hover:text-amber-200 transition-colors flex items-center space-x-1"
                >
                  <PlusCircle size={18} />
                  <span>Create Post</span>
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:text-amber-200 transition-colors flex items-center space-x-1"
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-full font-medium flex items-center space-x-1 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-amber-200 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-full font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <Link
              to="/"
              className="block text-white hover:text-amber-200 py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="block text-white hover:text-amber-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  to="/profile"
                  className="block text-white hover:text-amber-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:text-amber-200 py-2 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:text-amber-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-white hover:text-amber-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header

