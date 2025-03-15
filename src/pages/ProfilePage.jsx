"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { fetchUserPosts, fetchUserProfile } from "../services/api"
import { Edit, Settings, BookOpen } from "react-feather"
import PostList from "../components/PostList"

const ProfilePage = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        const [postsData, profileData] = await Promise.all([fetchUserPosts(), fetchUserProfile()])

        setPosts(postsData)
        setProfile(profileData)
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white p-1">
            <img
              src={profile?.avatar || `/placeholder.svg?height=100&width=100`}
              alt={user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-amber-100 mt-1">
              Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
            </p>

            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-amber-100 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile?.commentCount || 0}</div>
                <div className="text-amber-100 text-sm">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile?.reputation || 0}</div>
                <div className="text-amber-100 text-sm">Reputation</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
              <Edit size={20} />
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="mt-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "posts"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            My Posts
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "saved"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Recipes
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "activity"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-orange-500"
            }`}
            onClick={() => setActiveTab("activity")}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "posts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Posts</h2>
              <Link
                to="/create-post"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create New Post
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="bg-amber-50 rounded-xl p-8 text-center">
                <BookOpen size={48} className="mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">
                  Share your cooking knowledge with the community by creating your first post.
                </p>
                <Link
                  to="/create-post"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors inline-block"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <PostList posts={posts} />
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="bg-white rounded-xl p-6 shadow-md text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No saved recipes yet</h3>
            <p className="text-gray-600">Browse the forum and save recipes you'd like to try later.</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-xl p-6 shadow-md text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your recent activity</h3>
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage

