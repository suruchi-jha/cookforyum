"use client"

import { useEffect } from "react"

const PageTitle = ({ title }) => {
  useEffect(() => {
    // Update the document title
    const previousTitle = document.title
    document.title = `${title} | CookFor(Y)um`

    // Cleanup function to restore the previous title when component unmounts
    return () => {
      document.title = previousTitle
    }
  }, [title])

  // This component doesn't render anything
  return null
}

export default PageTitle

