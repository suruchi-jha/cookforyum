import { Link } from "react-router-dom"
import { AlertTriangle } from "react-feather"

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-6">
          <AlertTriangle size={40} />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>

        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-colors inline-block shadow-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

