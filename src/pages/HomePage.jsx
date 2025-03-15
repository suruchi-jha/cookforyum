"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { PlusCircle, Search, Filter } from "react-feather"
import PostList from "../components/PostList"
import { fetchPosts } from "../services/api"
import { useAuth } from "../context/AuthContext"
import PageTitle from "../components/PageTitle"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user } = useAuth()

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        // For now, we'll use the mock data from the API service
        const data = await fetchPosts(currentPage)
        setPosts(data)
        setTotalPages(Math.ceil(data.length / 10)) // Mock pagination
      } catch (err) {
        setError("Failed to load posts")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [currentPage])

  // Make sure posts is always an array before filtering
  const filteredPosts = Array.isArray(posts)
    ? posts.filter((post) => {
        const searchLower = searchTerm.toLowerCase()

        // Search in title and content
        const titleMatch = post.title.toLowerCase().includes(searchLower)
        const contentMatch = post.content.toLowerCase().includes(searchLower)

        // Search in tags (if they exist)
        const tagMatch =
          post.tags && Array.isArray(post.tags) && post.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        return titleMatch || contentMatch || tagMatch
      })
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="Home" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cooking Techniques Forum</h1>
          <p className="text-gray-600 mt-2">Share and discover amazing cooking techniques and recipes</p>
        </div>

        {user && (
          <Link
            to="/create-post"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-amber-600 transition-colors shadow-md flex items-center space-x-2"
          >
            <PlusCircle size={18} />
            <span>Share Your Recipe</span>
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for recipes, techniques, or tags..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Filter size={18} />
            <span className="hidden md:inline">Popular Categories:</span>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors"
                onClick={() => setSearchTerm("Baking")}
              >
                Baking
              </button>
              <button
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
                onClick={() => setSearchTerm("Grilling")}
              >
                Grilling
              </button>
              <button
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                onClick={() => setSearchTerm("Sous Vide")}
              >
                Sous Vide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post */}
      {Array.isArray(posts) && posts.length > 0 && !searchTerm && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden h-48 bg-orange-200">
                {posts[0].image ? (
                  <img
                    src={posts[0].image || "/placeholder.svg"}
                    alt={posts[0].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Featured cooking technique"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">Featured Technique</span>
              <h2 className="text-2xl font-bold mt-2 text-gray-800">{posts[0].title}</h2>
              <p className="mt-2 text-gray-600 line-clamp-3">{posts[0].content}</p>
              <div className="mt-4">
                <Link
                  to={`/posts/${posts[0].id}`}
                  className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <span className="w-10 h-1 bg-orange-500 mr-3"></span>
          Recent Discussions
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-amber-50 rounded-lg">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="No posts found"
              className="mx-auto mb-4 h-24 w-24 opacity-50"
            />
            <h3 className="text-lg font-medium text-gray-800">No posts found</h3>
            <p className="text-gray-600 mt-2">
              {searchTerm
                ? `No results for "${searchTerm}". Try a different search term.`
                : "Be the first to share a cooking technique!"}
            </p>
            {user && (
              <Link
                to="/create-post"
                className="mt-4 inline-block px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Share a Recipe
              </Link>
            )}
          </div>
        ) : (
          <>
            <PostList posts={filteredPosts} />

            {/* Pagination */}
            {!searchTerm && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page ? "bg-orange-500 text-white" : "border border-gray-300 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HomePage

