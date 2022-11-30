const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    emailID: {
        type: String,
        unique: true // Unique index. If you specify `unique: true`
      },
    name: String,
    careerStage: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: "csv",
    },
    ipAddress: {
      type: String,
      default: "localhost",
    }
}, { timestamps: true });

module.exports = mongoose.model("Users", UsersSchema);
