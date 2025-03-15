import config from "../config"

export const checkApiConnection = async () => {
  try {
    console.log("Checking API connection to:", config.apiUrl)
    const response = await fetch(config.apiUrl)
    const data = await response.json()
    console.log("API response:", data)
    return { success: true, data }
  } catch (error) {
    console.error("API connection error:", error)
    return { success: false, error }
  }
}

