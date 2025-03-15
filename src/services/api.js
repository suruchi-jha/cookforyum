import axios from "axios"
import config from "../config"

// Create an axios instance with base URL from config
export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if it exists
const token = localStorage.getItem(config.tokenKey)
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Setup interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

const API_URL = process.env.REACT_APP_API_URL || "https://server-forum.onrender.com"; 
// Mock data
const users = [
  { id: 1, name: "Chef Julia", email: "julia@example.com", password: "password123" },
  { id: 2, name: "Baker Tom", email: "tom@example.com", password: "password123" },
]

const posts = [
  {
    id: 1,
    title: "Best way to sear a steak?",
    content:
      "I've been trying to get a perfect crust on my steaks but they always end up either overcooked or without a good sear. What techniques do you use for the perfect steak?",
    createdAt: "2023-05-15T12:00:00Z",
    authorId: 1,
    author: { id: 1, name: "Chef Julia" },
    upvotes: 5,
    downvotes: 1,
    commentCount: 2,
    userVote: null,
    tags: ["Grilling", "Meat"],
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Sourdough starter troubleshooting",
    content:
      "My sourdough starter isn't rising as much as it should. It's about a week old and I've been feeding it daily with equal parts flour and water. Any tips on how to make it more active?",
    createdAt: "2023-05-10T09:30:00Z",
    authorId: 2,
    author: { id: 2, name: "Baker Tom" },
    upvotes: 3,
    downvotes: 0,
    commentCount: 1,
    userVote: null,
    tags: ["Baking", "Bread"],
    image: "https://images.unsplash.com/photo-1585478259715-2a96615c95fc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "How to make the perfect risotto?",
    content:
      "I'm trying to master risotto but I'm having trouble getting the right consistency. It's either too dry or too soupy. Any tips for achieving that perfect creamy texture?",
    createdAt: "2023-06-05T14:20:00Z",
    authorId: 1,
    author: { id: 1, name: "Chef Julia" },
    upvotes: 7,
    downvotes: 0,
    commentCount: 3,
    userVote: null,
    tags: ["Italian", "Rice"],
    image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Knife sharpening techniques",
    content:
      "What's your preferred method for keeping your kitchen knives sharp? I've been using a whetstone but I'm not sure if I'm doing it correctly. Any advice or alternative methods?",
    createdAt: "2023-06-10T10:15:00Z",
    authorId: 2,
    author: { id: 2, name: "Baker Tom" },
    upvotes: 4,
    downvotes: 1,
    commentCount: 2,
    userVote: null,
    tags: ["Tools", "Techniques"],
    image: null,
  },
]

const comments = [
  {
    id: 1,
    content:
      "Make sure your pan is screaming hot before adding the steak, and pat the meat dry with paper towels first to remove moisture.",
    createdAt: "2023-05-16T10:15:00Z",
    authorId: 2,
    postId: 1,
    author: { id: 2, name: "Baker Tom" },
    likes: 3,
  },
  {
    id: 2,
    content:
      "Try feeding your starter twice a day and keep it in a warmer spot. Also, try using rye flour for a few feedings to boost activity.",
    createdAt: "2023-05-11T14:20:00Z",
    authorId: 1,
    postId: 2,
    author: { id: 1, name: "Chef Julia" },
    likes: 2,
  },
  {
    id: 3,
    content:
      "I find that using a cast iron skillet gives the best sear. Heat it up for at least 5 minutes before cooking.",
    createdAt: "2023-05-17T09:30:00Z",
    authorId: 1,
    postId: 1,
    author: { id: 1, name: "Chef Julia" },
    likes: 5,
  },
  {
    id: 4,
    content: "The key to risotto is to add the hot stock gradually and stir constantly. Don't rush the process!",
    createdAt: "2023-06-06T15:45:00Z",
    authorId: 2,
    postId: 3,
    author: { id: 2, name: "Baker Tom" },
    likes: 4,
  },
]

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Posts API
export const fetchPosts = async (page = 1, limit = 10) => {
  await delay(800)
  try {
    // In a real app, this would be an API call
    // For now, return the mock data
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export const fetchPostById = async (id) => {
  await delay(500)
  try {
    const post = posts.find((post) => post.id === id)
    if (!post) throw new Error("Post not found")
    return post
  } catch (error) {
    console.error("Error fetching post:", error)
    throw error
  }
}

export const createPost = async (postData) => {
  await delay(1000)
  try {
    const newPost = {
      id: posts.length + 1,
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      image: postData.image || null,
      createdAt: new Date().toISOString(),
      authorId: 1, // Assuming current user is Chef Julia
      author: { id: 1, name: "Chef Julia" },
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      userVote: null,
    }

    posts.push(newPost)
    return { success: true, postId: newPost.id }
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export const updatePost = async (id, postData) => {
  await delay(800)
  try {
    const postIndex = posts.findIndex((post) => post.id === id)
    if (postIndex === -1) throw new Error("Post not found")

    posts[postIndex] = {
      ...posts[postIndex],
      ...postData,
      updatedAt: new Date().toISOString(),
    }

    return { success: true, postId: id }
  } catch (error) {
    console.error("Error updating post:", error)
    throw error
  }
}

export const deletePost = async (id) => {
  await delay(800)
  try {
    const postIndex = posts.findIndex((post) => post.id === id)
    if (postIndex === -1) throw new Error("Post not found")

    posts.splice(postIndex, 1)
    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}

// Comments API
export const fetchCommentsByPostId = async (postId) => {
  await delay(500)
  try {
    return comments.filter((comment) => comment.postId === postId)
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

export const createComment = async (postId, content) => {
  await delay(800)
  try {
    const newComment = {
      id: comments.length + 1,
      content,
      createdAt: new Date().toISOString(),
      authorId: 1, // Assuming current user is Chef Julia
      postId,
      author: { id: 1, name: "Chef Julia" },
      likes: 0,
    }

    comments.push(newComment)

    // Update post comment count
    const post = posts.find((p) => p.id === postId)
    if (post) {
      post.commentCount += 1
    }

    return {
      success: true,
      comment: newComment,
    }
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

// Votes API
export const voteOnPost = async (postId, value) => {
  await delay(500)
  try {
    const post = posts.find((p) => p.id === postId)
    if (!post) throw new Error("Post not found")

    // In a real app, we would track user votes in a database
    // For this demo, we'll just update the post's vote counts
    if (post.userVote === 1 && value !== 1) {
      post.upvotes -= 1
    } else if (post.userVote === -1 && value !== -1) {
      post.downvotes -= 1
    }

    if (value === 1 && post.userVote !== 1) {
      post.upvotes += 1
    } else if (value === -1 && post.userVote !== -1) {
      post.downvotes += 1
    }

    post.userVote = value === 0 ? null : value

    return { success: true }
  } catch (error) {
    console.error("Error voting on post:", error)
    throw error
  }
}

// User API
export const fetchUserPosts = async () => {
  await delay(800)
  try {
    // In a real app, this would filter by the current user's ID
    // For demo purposes, return posts by Chef Julia (ID: 1)
    return posts.filter((post) => post.authorId === 1)
  } catch (error) {
    console.error("Error fetching user posts:", error)
    throw error
  }
}

export const fetchUserProfile = async () => {
  await delay(600)
  try {
    // Mock user profile data
    return {
      id: 1,
      name: "Chef Julia",
      email: "julia@example.com",
      avatar: null,
      bio: "Professional chef with 10 years of experience in Italian and French cuisine.",
      createdAt: "2023-01-15T08:30:00Z",
      commentCount: comments.filter((c) => c.authorId === 1).length,
      reputation: 42,
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

// Update the authentication functions to use the real API
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password })

    if (response.data.token) {
      localStorage.setItem(config.tokenKey, response.data.token)
      localStorage.setItem(config.userKey, JSON.stringify(response.data.user))
      return {
        success: true,
        user: response.data.user,
      }
    } else {
      return {
        success: false,
        message: "Invalid response from server",
      }
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Invalid email or password",
    }
  }
}

export const register = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", { name, email, password })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error registering:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    }
  }
}

