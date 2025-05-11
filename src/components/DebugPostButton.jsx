"use client"

import { useState } from "react"
import { debugPostCreation } from "../utils/postDebug"
import { toast } from "react-toastify"

const DebugPostButton = () => {
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDebugClick = async () => {
    setIsLoading(true)

    try {
      // Create a simple test post
      const testPost = {
        title: "Test Post " + new Date().toISOString(),
        content: "This is a test post created for debugging purposes.",
        tags: ["Test", "Debug"],
      }

      const result = await debugPostCreation(testPost)

      if (result.success) {
        toast.success("Debug post created successfully!")
      } else {
        toast.error("Failed to create debug post. Check console for details.")
      }
    } catch (error) {
      toast.error("Error in debug process")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button type="button" onClick={() => setIsDebugMode(!isDebugMode)} className="text-sm text-gray-500 underline">
        {isDebugMode ? "Hide Debug" : "Show Debug"}
      </button>

      {isDebugMode && (
        <div className="mt-2 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">Debug Tools</p>
          <button
            type="button"
            onClick={handleDebugClick}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm"
          >
            {isLoading ? "Testing..." : "Create Test Post"}
          </button>
        </div>
      )}
    </div>
  )
}

export default DebugPostButton

