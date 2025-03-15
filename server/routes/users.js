const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const auth = require("../middleware/auth")

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ author: req.user.id })

    // Calculate reputation (simplified)
    const posts = await Post.find({ author: req.user.id })
    let reputation = 0

    for (const post of posts) {
      reputation += post.upvotes - post.downvotes
    }

    res.json({
      ...user.toObject(),
      commentCount,
      reputation,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/posts
// @desc    Get current user's posts
// @access  Private
router.get("/posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .lean()

    // Get comment count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id })

        return {
          ...post,
          commentCount,
        }
      }),
    )

    res.json(postsWithComments)
  } catch (error) {
    console.error("Get user posts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, avatar, bio } = req.body

    // Find user
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (avatar) user.avatar = avatar
    if (bio !== undefined) user.bio = bio

    await user.save()

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select("-password")

    res.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

