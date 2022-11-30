const mongoose = require("mongoose");
const users = require("./UsersModel");
const comments = require("./CommentsModel");

const BlogsSchema = new mongoose.Schema(
  {
    blogTitle: String,
    blogDescription: [],
    blogAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: users,
    },
    isInteraction: {
      type: Boolean,
      default: true,
    },
    usersShared: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: users,
        default: [],
      },
    ],
    usersApplauded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: users,
        default: [],
      },
    ],
    blogPublishTimeStamp: { type: Date, default: Date.now },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: comments,
        default: [],
      },
    ],
    uuid: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    numOfWords: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", BlogsSchema);
