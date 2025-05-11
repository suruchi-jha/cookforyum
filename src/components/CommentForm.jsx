"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { createComment } from "../services/api"

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) return

    // Check if postId is defined
    if (!postId) {
      console.error("Cannot comment: Post ID is undefined")
      toast.error("Error: Cannot comment on this post")
      return
    }

    setIsSubmitting(true)

    try {
      console.log(`Submitting comment for post ${postId}`)
      const result = await createComment(postId, content)

      setContent("")
      toast.success("Your comment has been posted successfully")

      if (onCommentAdded && result.comment) {
        onCommentAdded(result.comment)
      }
    } catch (error) {
      toast.error("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2 text-gray-700">
          Add a comment
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
          placeholder="Share your cooking tips or ask a question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
