const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  image: {
    type: String,
    default: null,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Virtual for comment count
PostSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
})

// Set virtuals to be included in JSON
PostSchema.set("toJSON", { virtuals: true })
PostSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Post", PostSchema)

