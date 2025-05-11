const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Vote = require("../models/Vote")
const auth = require("../middleware/auth")

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name avatar")
      .lean()

    // Get comment count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id })

        // If user is authenticated, get their vote
        let userVote = null
        if (req.user) {
          const vote = await Vote.findOne({ post: post._id, user: req.user.id })
          if (vote) {
            userVote = vote.value
          }
        }

        return {
          ...post,
          commentCount,
          userVote,
        }
      }),
    )

    const totalPosts = await Post.countDocuments()
    const totalPages = Math.ceil(totalPosts / limit)

    res.json({
      posts: postsWithComments,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name avatar").lean()

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Get comment count
    const commentCount = await Comment.countDocuments({ post: post._id })

    // If user is authenticated, get their vote
    let userVote = null
    if (req.user) {
      const vote = await Vote.findOne({ post: post._id, user: req.user.id })
      if (vote) {
        userVote = vote.value
      }
    }

    res.json({
      ...post,
      commentCount,
      userVote,
    })
  } catch (error) {
    console.error("Get post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags, image } = req.body

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      tags: tags || [],
      image: image || null,
    })

    const post = await newPost.save()

    res.status(201).json({
      success: true,
      postId: post._id,
    })
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body

    // Check if post exists
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" })
    }

    // Update post
    post.title = title || post.title
    post.content = content || post.content
    post.tags = tags || post.tags
    post.updatedAt = Date.now()

    await post.save()

    res.json({
      success: true,
      postId: post._id,
    })
  } catch (error) {
    console.error("Update post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    // Check if post exists
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    // Delete post
    await post.remove()

    // Delete associated comments and votes
    await Comment.deleteMany({ post: req.params.id })
    await Vote.deleteMany({ post: req.params.id })

    res.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/posts/:id/comments
// @desc    Get comments for a post
// @access  Public
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate("author", "name avatar")
      .lean()

    res.json(comments)
  } catch (error) {
    console.error("Get comments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body

    // Check if post exists
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Create new comment
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.id,
    })

    const comment = await newComment.save()

    // Populate author details
    await comment.populate("author", "name avatar").execPopulate()

    res.status(201).json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error("Create comment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/posts/:id/vote
// @desc    Vote on a post
// @access  Private
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { value } = req.body

    // Validate vote value
    if (value !== -1 && value !== 0 && value !== 1) {
      return res.status(400).json({ message: "Invalid vote value" })
    }

    // Check if post exists
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user has already voted
    let vote = await Vote.findOne({
      post: req.params.id,
      user: req.user.id,
    })

    if (vote) {
      if (value === 0) {
        // Remove vote
        await vote.remove()
      } else {
        // Update vote
        vote.value = value
        await vote.save()
      }
    } else if (value !== 0) {
      // Create new vote
      vote = new Vote({
        value,
        post: req.params.id,
        user: req.user.id,
      })

      await vote.save()
    }

    // Update post vote counts
    const upvotes = await Vote.countDocuments({
      post: req.params.id,
      value: 1,
    })

    const downvotes = await Vote.countDocuments({
      post: req.params.id,
      value: -1,
    })

    post.upvotes = upvotes
    post.downvotes = downvotes
    await post.save()

    res.json({ success: true })
  } catch (error) {
    console.error("Vote error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

