const mongoose = require("mongoose");
const users = require("./UsersModel");
const CommentsSchema = new mongoose.Schema(
  {
    comment: String,
    commentAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: users
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", CommentsSchema);
