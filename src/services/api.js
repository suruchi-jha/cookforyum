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
    const token = localStorage.getItem(config.tokenKey)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Posts API
export const fetchPosts = async (page = 1, limit = 10) => {
  try {
    console.log("Fetching posts from API:", `${config.apiUrl}/posts?page=${page}&limit=${limit}`)
    const response = await api.get(`/posts?page=${page}&limit=${limit}`)
    console.log("API response:", response.data)
    return response.data.posts || []
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw error
  }
}

export const fetchPostById = async (id) => {
  try {
    console.log(`Fetching post with ID: ${id} from API`)
    const response = await api.get(`/posts/${id}`)
    console.log("API response for post:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching post:", error)
    throw error
  }
}

export const createPost = async (postData) => {
  try {
    const response = await api.post("/posts", {
      title: postData.title,
      content: postData.content,
      tags: postData.tags || [],
      image: postData.image || null,
    })

    return {
      success: true,
      postId: response.data.postId,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export const fetchCommentsByPostId = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`)
    return response.data
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw error
  }
}

export const createComment = async (postId, content) => {
  try {
    console.log(`Creating comment for post ${postId} with content: ${content.substring(0, 20)}...`)
    const response = await api.post(`/posts/${postId}/comments`, { content })
    return response.data
  } catch (error) {
    console.error("Error creating comment:", error)
    throw error
  }
}

export const voteOnPost = async (postId, value) => {
  try {
    console.log(`Voting on post ${postId} with value: ${value}`)
    const response = await api.post(`/posts/${postId}/vote`, { value })
    return response.data
  } catch (error) {
    console.error("Error voting on post:", error)
    throw error
  }
}

// Authentication functions
export const login = async (email, password) => {
  try {
    console.log("Attempting login with:", { email })
    const response = await api.post("/auth/login", { email, password })
    console.log("Login response:", response.data)

    if (response.data.token) {
      // Store the token and user data
      localStorage.setItem(config.tokenKey, response.data.token)
      localStorage.setItem(config.userKey, JSON.stringify(response.data.user))

      // Set the token for future API requests
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

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
    return { success: true }
  } catch (error) {
    console.error("Error registering:", error)
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    }
  }
}

// User API
export const fetchUserPosts = async () => {
  try {
    const response = await api.get("/users/posts")
    return response.data
  } catch (error) {
    console.error("Error fetching user posts:", error)
    throw error
  }
}

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/users/profile")
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting post:", error)
    throw error
  }
}
