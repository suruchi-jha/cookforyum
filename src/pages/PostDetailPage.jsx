"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { fetchPostById, fetchCommentsByPostId, deletePost } from "../services/api"
import VoteButtons from "../components/VoteButtons"
import CommentList from "../components/CommentList"
import CommentForm from "../components/CommentForm"
import { Share2, Edit, Trash2, AlertTriangle } from "react-feather"
import PageTitle from "../components/PageTitle"

const PostDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    const loadPostAndComments = async () => {
      try {
        setLoading(true)
        console.log("Fetching post with ID:", id)

        if (!id) {
          throw new Error("Invalid post ID")
        }

        const postData = await fetchPostById(id)
        console.log("Fetched post data:", postData)
        setPost(postData)

        const commentsData = await fetchCommentsByPostId(id)
        setComments(commentsData)

        if (user && postData) {
          // Check if the current user is the author of the post
          setIsAuthor(user && postData.author._id === user.id)
        }
      } catch (err) {
        console.error("Error loading post and comments:", err)
        setError("Failed to load post details")
      } finally {
        setLoading(false)
      }
    }

    loadPostAndComments()
  }, [id, user])

  useEffect(() => {
    if (user && post) {
      setIsAuthor(user && post.author._id === user.id)
    }
  }, [user, post])

  const handleNewComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments])
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  const handleDelete = async () => {
    try {
      await deletePost(post._id)
      toast.success("Post deleted successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to delete post")
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium text-lg">{error || "Post not found"}</p>
          <Link
            to="/"
            className="mt-6 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title={post.title} />
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-500 transition-colors">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Post</span>
      </div>

      {/* Post Detail */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex gap-4">
          <VoteButtons postId={post._id} upvotes={post.upvotes} downvotes={post.downvotes} userVote={post.userVote} />

          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{post.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <img
                    src={post.author.avatar || `/placeholder.svg?height=30&width=30`}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>Posted by {post.author.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                  aria-label="Share post"
                >
                  <Share2 size={20} />
                </button>

                {isAuthor && (
                  <>
                    <Link
                      to={`/edit-post/${post._id}`}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      aria-label="Edit post"
                    >
                      <Edit size={20} />
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete post"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span key={`tag-${index}`} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {post.image && (
              <div className="my-6">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            )}

            <div className="prose prose-orange max-w-none mt-6">
              <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <span className="w-8 h-1 bg-orange-500 mr-3"></span>
            Comments ({comments.length})
          </h2>

          {user ? (
            <div className="mb-8">
              <CommentForm postId={post._id} onCommentAdded={handleNewComment} />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-amber-800">
                Please{" "}
                <Link to="/login" className="text-orange-600 font-medium hover:underline">
                  log in
                </Link>{" "}
                to leave a comment
              </p>
            </div>
          )}

          <CommentList comments={comments} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Post</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetailPage
