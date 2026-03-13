import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon, 
  EyeIcon,
  UsersIcon 
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { API_END_POINT } from '../constants'
import Loader from '../components/Loader'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError('Please enter a username to search')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${API_END_POINT}/user/searcheduser`, {
        searchedUser: searchTerm
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        setSearchResults(response.data.data)
      }
    } catch (error) {
      console.error('Error searching user:', error)
      if (error.response?.status === 404) {
        setError('User not found')
      } else {
        setError('An error occurred while searching')
      }
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value === '') {
      setSearchResults([])
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#140e1a] to-[#1a1225]">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Search Users
          </h1>
          <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Find and connect with other users
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a1625] border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size="sm" variant="spinner" />
                  <span>Searching...</span>
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 animate-pulse">
            <p className="text-red-400 text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader size="lg" variant="spinner" text="Searching users..." />
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>Search Results</span>
              <span className="text-sm font-normal text-gray-400">({searchResults.length})</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((user) => (
                <div 
                  key={user._id} 
                  className="group bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={user.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.username} 
                          alt={user.username}
                          className="w-14 h-14 rounded-full border-2 border-purple-400 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Online indicator (optional) */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1625]"></div>
                      </div>
                    </Link>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${user._id}`}>
                        <h3 className="text-white font-semibold hover:text-purple-400 transition-colors duration-300 truncate">
                          {user.username}
                        </h3>
                      </Link>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                        {user.bio || 'No bio available'}
                      </p>
                      
                      {/* User Stats */}
                      <div className="flex gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-purple-400">{user.followers?.length || 0}</span>
                          followers
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-purple-400">{user.following?.length || 0}</span>
                          following
                        </span>
                      </div>

                      {/* View Profile Button - Full width */}
                      <Link 
                        to={`/profile/${user._id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-purple-500/30"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 max-w-md mx-auto">
              <MagnifyingGlassIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
              <p className="text-gray-400">
                We couldn't find any users matching "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && !searchTerm && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#1a1625]/30 rounded-2xl p-8 max-w-md mx-auto border border-purple-500/10">
              <UsersIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Search for users</h3>
              <p className="text-gray-400">
                Enter a username above to find people
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search