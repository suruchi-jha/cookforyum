import config from "../config"
import { api } from "../services/api"

export const debugPostCreation = async (postData) => {
  try {
    console.log("Attempting to create post with data:", postData)
    console.log("Using API URL:", config.apiUrl)

    const response = await api.post("/posts", postData)
    console.log("Post creation response:", response.data)

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Post creation error:", error)
    console.error("Error response:", error.response?.data)
    return { success: false, error }
  }
}

