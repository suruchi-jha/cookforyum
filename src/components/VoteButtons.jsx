"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ChevronUp, ChevronDown } from "react-feather"
import { useAuth } from "../context/AuthContext"
import { voteOnPost } from "../services/api"

const VoteButtons = ({ postId, upvotes, downvotes, userVote }) => {
  const [optimisticVote, setOptimisticVote] = useState(userVote)
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(upvotes || 0)
  const [optimisticDownvotes, setOptimisticDownvotes] = useState(downvotes || 0)
  const [isVoting, setIsVoting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleVote = async (value) => {
    if (!user) {
      toast.info("Please log in to vote on posts", {
        icon: "🔒",
      })
      navigate("/login")
      return
    }

    if (isVoting) return

    // Check if postId is defined
    if (!postId) {
      console.error("Cannot vote: Post ID is undefined")
      toast.error("Error: Cannot vote on this post")
      return
    }

    try {
      setIsVoting(true)
      console.log(`Voting on post ${postId} with value ${value}`)

      // If user clicks the same vote button again, remove their vote
      const newValue = optimisticVote === value ? 0 : value

      // Optimistically update UI
      if (optimisticVote === 1 && newValue !== 1) {
        setOptimisticUpvotes((prev) => prev - 1)
      } else if (optimisticVote === -1 && newValue !== -1) {
        setOptimisticDownvotes((prev) => prev - 1)
      }

      if (newValue === 1 && optimisticVote !== 1) {
        setOptimisticUpvotes((prev) => prev + 1)
      } else if (newValue === -1 && optimisticVote !== -1) {
        setOptimisticDownvotes((prev) => prev + 1)
      }

      setOptimisticVote(newValue === 0 ? null : newValue)

      // Send to server
      await voteOnPost(postId, newValue)
    } catch (error) {
      toast.error("Failed to register your vote. Please try again.")

      // Revert optimistic update
      setOptimisticVote(userVote)
      setOptimisticUpvotes(upvotes || 0)
      setOptimisticDownvotes(downvotes || 0)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        className={`p-1 rounded-full transition-colors ${isVoting ? "opacity-50 cursor-not-allowed" : ""} ${
          optimisticVote === 1
            ? "text-orange-500 bg-orange-50"
            : "text-gray-400 hover:bg-gray-100 hover:text-orange-500"
        }`}
        aria-label="Upvote"
      >
        <ChevronUp size={24} />
      </button>

      <span
        className={`text-sm font-medium my-1 ${
          optimisticUpvotes > optimisticDownvotes
            ? "text-orange-500"
            : optimisticUpvotes < optimisticDownvotes
              ? "text-gray-500"
              : "text-gray-600"
        }`}
      >
        {optimisticUpvotes - optimisticDownvotes}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        className={`p-1 rounded-full transition-colors ${isVoting ? "opacity-50 cursor-not-allowed" : ""} ${
          optimisticVote === -1 ? "text-gray-500 bg-gray-100" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        }`}
        aria-label="Downvote"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  )
}

export default VoteButtons
