"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { createPost } from "../services/api"
import { X, Image, Upload } from "react-feather"
import PageTitle from "../components/PageTitle"

const CreatePostPage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
      setTags([...tags, tag.trim()])
      setTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, you would upload the image to a server or cloud storage
      // and get back a URL. For this demo, we'll use the preview URL.
      const imageUrl = imagePreview

      const result = await createPost({
        title,
        content,
        tags,
        image: imageUrl,
      })

      toast.success("Your cooking discussion has been published successfully")
      navigate(`/posts/${result.postId}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PageTitle title="Create Post" />
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Share a Cooking Technique</h1>
      <p className="text-gray-600 mb-8">Share your culinary knowledge with the community</p>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              placeholder="What's your cooking question or technique to share?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              placeholder="Provide details about your cooking technique, recipe, or question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Add an Image (optional)</label>
            <div className="mt-1 flex items-center">
              <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Image className="mr-2 h-5 w-5 text-gray-400" />
                <span>Choose Image</span>
                <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-3">
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-64 object-contain" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2 text-gray-700">
              Tags (optional, max 5)
            </label>
            <div className="flex items-center">
              <input
                id="tags"
                type="text"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                placeholder="Add tags (e.g., baking, grilling)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tag.trim() || tags.length >= 5}
                className="ml-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="ml-1 text-orange-800 hover:text-orange-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Upload size={18} className="mr-2" />
                  Share Recipe/Technique
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostPage

