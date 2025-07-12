"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  ShoppingBag,
  Leaf,
  Sun,
  Moon,
  Eye
} from 'lucide-react'
import { useState } from 'react'
import { useToaster } from '@/components/ui/Toaster'

export function Header() {
  const { data: session } = useSession()
  const { addToast } = useToaster()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
      addToast('Signed out successfully', 'success')
    } catch {
      addToast('Error signing out', 'error')
    }
  }

  return (
    <header className="bg-white border-b border-accent-200 shadow-soft sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cta-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-bold text-gradient">
              ReWear
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/browse" className="nav-link">
              Browse
            </Link>
            {session?.user && (
              <>
                <Link href="/create-listing" className="nav-link">
                  Create Listing
                </Link>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="nav-link">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-accent-100 hover:bg-accent-200 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-warning-500" />
              ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {/* User menu */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl bg-accent-100 hover:bg-accent-200 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cta-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-text-primary">
                    {session.user.name}
                  </span>
                  {isMenuOpen ? (
                    <X className="w-4 h-4 text-text-secondary" />
                  ) : (
                    <Menu className="w-4 h-4 text-text-secondary" />
                  )}
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-large border border-accent-200 py-2 animate-scale-in">
                    <div className="px-4 py-2 border-b border-accent-100">
                      <p className="text-sm font-medium text-text-primary">{session.user.name}</p>
                      <p className="text-xs text-text-secondary">{session.user.email}</p>
                      {session.user.points !== undefined && (
                        <div className="mt-2">
                          <span className="points-badge">
                            {session.user.points} points
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-accent-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/browse"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-accent-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Eye className="w-4 h-4 mr-3" />
                      Browse Items
                    </Link>
                    
                    <Link
                      href="/create-listing"
                      className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-accent-50 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      Create Listing
                    </Link>
                    
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-accent-50 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-alert-600 hover:bg-alert-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-accent-100 hover:bg-accent-200 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-accent-200 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-4 py-2 text-text-primary hover:bg-accent-50 rounded-xl transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="px-4 py-2 text-text-primary hover:bg-accent-50 rounded-xl transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              {session?.user && (
                <>
                  <Link
                    href="/create-listing"
                    className="px-4 py-2 text-text-primary hover:bg-accent-50 rounded-xl transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Listing
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-text-primary hover:bg-accent-50 rounded-xl transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-text-primary hover:bg-accent-50 rounded-xl transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 