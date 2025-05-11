import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Award } from "react-feather"
import VoteButtons from "./VoteButtons"

const PostList = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="flex gap-4 p-5 border border-gray-100 rounded-xl hover:border-orange-200 transition-all duration-300 hover:shadow-md bg-white"
        >
          <VoteButtons postId={post._id} upvotes={post.upvotes} downvotes={post.downvotes} userVote={post.userVote} />

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <img
                src={post.author.avatar || `/placeholder.svg?height=30&width=30`}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">{post.author.name}</span>
              {post.author.isModerator && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Award size={12} className="mr-1" />
                  Chef
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {post.image && (
                <div className="md:w-1/4">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className={post.image ? "md:w-3/4" : "w-full"}>
                <Link to={`/posts/${post._id}`} className="block group">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.content}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <MessageCircle size={14} className="mr-1" />
                    {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
                  </span>
                  <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <span
                          key={`${post._id}-tag-${index}`}
                          className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostList
