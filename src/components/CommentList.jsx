import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Flag } from "react-feather"

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment._id} className="border-b border-gray-100 pb-6 last:border-0">
          <div className="flex items-start gap-3">
            <img
              src={comment.author.avatar || `/placeholder.svg?height=40&width=40`}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-800">{comment.author.name}</span>
                <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
              </div>

              <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>

              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors">
                  <ThumbsUp size={14} />
                  <span>{comment.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                  <Flag size={14} />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList
